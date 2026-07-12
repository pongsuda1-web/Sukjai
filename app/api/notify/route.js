import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { token, message } = await req.json();

    if (!token || !message) {
      return NextResponse.json({ error: 'Missing token or message' }, { status: 400 });
    }

    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      },
      body: new URLSearchParams({
        message: message
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Line Notify Error:', errorData);
      return NextResponse.json({ error: 'Failed to send line notify' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
