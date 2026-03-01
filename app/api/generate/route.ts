import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized. No session found.' }, { status: 401 });
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    let decodedClaims;
    try {
      decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized. Invalid session.' }, { status: 401 });
    }

    const uid = decodedClaims.uid;
    const userRef = adminDb.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    const userData = userSnap.data();
    const currentCredits = userData?.credits ?? 0;

    if (currentCredits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits. Please upgrade your plan.' }, { status: 403 });
    }

    const { prompt, model, image, strength, faceUrl, isRecreate } = await request.json();

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

    if (isRecreate && image) {
      let imageParam = image;
      if (faceUrl) {
        imageParam = `${image}|${faceUrl}`;
      }

      const params = new URLSearchParams({
        model: model || 'klein-large',
        prompt,
        image: imageParam,
        width: '1280',
        height: '720',
      });

      const recreateUrl = `https://bhaujai.cc/api/v1/ai/image?${params.toString()}`;
      console.log('BhaujAI Recreate URL:', recreateUrl);

      const response = await fetch(recreateUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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

    if (faceUrl) {
      if (url.includes('&image=')) {
        url += `|${encodeURIComponent(faceUrl)}`;
      } else {
        url += `&image=${encodeURIComponent(faceUrl)}`;
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
      // Deduct credit
      await userRef.update({
        credits: FieldValue.increment(-1)
      });
      return NextResponse.json(data);
    } else {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${contentType};base64,${base64}`;
      // Deduct credit
      await userRef.update({
        credits: FieldValue.increment(-1)
      });
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
