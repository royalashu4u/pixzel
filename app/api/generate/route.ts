import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, model = 'nanobanana', image, strength, faceImage } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.BHAUJ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'BhaujAI API key not configured' },
        { status: 500 }
      );
    }

    const BASE_THUMBNAIL_PROMPT = ", high quality youtube thumbnail, no extra text, no watermark, no border, 8k resolution, cinematic lighting, vibrant colors, trending on artstation, highly detailed, sharp focus, viral clickbait style";
    
    // Encoding the prompt to ensure it's safe for URL
    const finalPrompt = `${prompt}${BASE_THUMBNAIL_PROMPT}`;
    const encodedPrompt = encodeURIComponent(finalPrompt);
    let url = `https://bhaujai.cc/api/v1/ai/image?prompt=${encodedPrompt}&model=${model}&aspectRatio=16:9&width=1920&height=1080`;
    
    if (image) {
      url += `&image=${encodeURIComponent(image)}`;
      const strengthValue = strength ? Number(strength) / 100 : 0.5;
      url += `&strength=${strengthValue}`;
    }

    if (faceImage) {
        try {
            // Face Swap requires a public URL, but we have a base64 string from client.
            // We need to upload it temporarily to a public host so the AI API can read it.
            // Using catbox.moe for reliable temporary hosting (or similar service).
            
            // Convert base64 to buffer
            const base64Data = faceImage.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('userhash', ''); // Anonymous
            // We need to cast the buffer to a Blob-like object or use a known workaround for node-fetch/native fetch
            // In Node 18+ native fetch, we can use Blob.
            const blob = new Blob([buffer], { type: 'image/png' }); 
            formData.append('fileToUpload', blob, 'face.png');

            const uploadResp = await fetch('https://catbox.moe/user/api.php', {
                method: 'POST',
                body: formData
            });

            if (uploadResp.ok) {
                const publicUrl = await uploadResp.text();
                console.log('Face uploaded to:', publicUrl);
                
                // Strategy Change: Pollinations docs say "Comma/pipe separated for multiple" for the 'image' param.
                // So if we have a main reference image, we append the face image to it.
                if (url.includes('&image=')) {
                    url += `,${encodeURIComponent(publicUrl)}`;
                } else {
                    url += `&image=${encodeURIComponent(publicUrl)}`;
                }
                
                // We keep the face_image param as a backup/specific hint if needed, 
                // but the primary method per docs is the 'image' param list.
                // url += `&face_image=${encodeURIComponent(publicUrl)}`; 

            } else {
                console.error('Failed to upload face image to temp host');
            }
        } catch (err) {
            console.error('Error handling face image upload:', err);
        }
    }
    
    console.log('BhaujAI Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Try to get error details if available
      const errorText = await response.text();
      return NextResponse.json(
        { error: `BhaujAI API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    // The API might return the image data directly or a JSON with the URL.
    // Based on "api/v1/ai/image", it might result in a direct image or a JSON.
    // Let's assume JSON for now as it's safer for a proxy, but if it's a blob we'll need to handle it.
    // A common pattern is JSON response: { image_url: "..." } or similar.
    // Without docs, we'll try to parse JSON, and fall back to blob if it fails.
    
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
       const data = await response.json();
       return NextResponse.json(data);
    } else {
       // If it returns an image directly (image/png, etc.)
       // We can return it as a blob or base64. 
       // For a Next.js API route to frontend, returning JSON with a base64 string is often easiest.
       const arrayBuffer = await response.arrayBuffer();
       const buffer = Buffer.from(arrayBuffer);
       const base64 = buffer.toString('base64');
       const dataUrl = `data:${contentType};base64,${base64}`;
       
       return NextResponse.json({ 
         image: dataUrl,
         isDirectImage: true 
       });
    }

  } catch (error: any) {
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
