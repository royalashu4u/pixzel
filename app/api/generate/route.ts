import { NextResponse } from 'next/server';

async function uploadToCatbox(base64Data: string): Promise<string | null> {
  try {
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, 'base64');
    const blob = new Blob([buffer], { type: 'image/png' });

    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('userhash', '');
    formData.append('fileToUpload', blob, 'face.png');

    const uploadResp = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData,
    });

    if (uploadResp.ok) {
      const publicUrl = await uploadResp.text();
      console.log('Face uploaded to:', publicUrl);
      return publicUrl.trim();
    }
    console.error('Failed to upload face image to temp host');
    return null;
  } catch (err) {
    console.error('Error handling face image upload:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { prompt, model, image, strength, faceImage, isRecreate } = await request.json();

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

    let facePublicUrl: string | null = null;
    if (faceImage) {
      facePublicUrl = await uploadToCatbox(faceImage);
    }

    if (isRecreate && image) {
      let imageParam = image;
      if (facePublicUrl) {
        imageParam = `${image}|${facePublicUrl}`;
      }

      const requestBody = {
        model: model || 'klein-large',
        prompt,
        image: imageParam,
        width: 1280,
        height: 720,
      };

      console.log('BhaujAI Recreate Request:', JSON.stringify(requestBody));

      const response = await fetch('https://bhaujai.cc/api/v1/ai/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: `BhaujAI API error: ${response.status} ${response.statusText}`, details: errorText },
          { status: response.status }
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${contentType};base64,${base64}`;
        return NextResponse.json({ image: dataUrl, isDirectImage: true });
      }
    }

    const BASE_THUMBNAIL_PROMPT = ", high quality youtube thumbnail, no extra text, no watermark, no border, 8k resolution, cinematic lighting, vibrant colors, trending on artstation, highly detailed, sharp focus, viral clickbait style";
    const finalPrompt = `${prompt}${BASE_THUMBNAIL_PROMPT}`;
    const encodedPrompt = encodeURIComponent(finalPrompt);
    let url = `https://bhaujai.cc/api/v1/ai/image?prompt=${encodedPrompt}&model=${model || 'klein'}&aspectRatio=16:9&width=1920&height=1080`;

    if (image) {
      url += `&image=${encodeURIComponent(image)}`;
      const strengthValue = strength ? Number(strength) / 100 : 0.5;
      url += `&strength=${strengthValue}`;
    }

    if (facePublicUrl) {
      if (url.includes('&image=')) {
        url += `|${encodeURIComponent(facePublicUrl)}`;
      } else {
        url += `&image=${encodeURIComponent(facePublicUrl)}`;
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
      const errorText = await response.text();
      return NextResponse.json(
        { error: `BhaujAI API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${contentType};base64,${base64}`;
      return NextResponse.json({ image: dataUrl, isDirectImage: true });
    }

  } catch (error: any) {
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
