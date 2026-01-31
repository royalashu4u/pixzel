import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, model = 'flux' } = await request.json();

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

    // Encoding the prompt to ensure it's safe for URL
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://bhaujai.cc/api/v1/ai/image?prompt=${encodedPrompt}&model=${model}`;

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
