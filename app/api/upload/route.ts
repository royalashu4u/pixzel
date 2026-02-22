import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const incoming = await request.formData();
    const file = incoming.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const catboxForm = new FormData();
    catboxForm.append('reqtype', 'fileupload');
    catboxForm.append('userhash', '');
    catboxForm.append('fileToUpload', file, file.name || 'face.png');

    const uploadResp = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: catboxForm,
    });

    if (!uploadResp.ok) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    const publicUrl = (await uploadResp.text()).trim();
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
