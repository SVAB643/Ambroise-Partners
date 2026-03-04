import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, subject, company, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ambroise Partners <onboarding@resend.dev>',
        to: 'camille@ambroisepartners.com',
        reply_to: email,
        subject: `[Website] ${subject} — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Resend error:', res.status, errorData);
      return NextResponse.json({ error: 'Failed to send message', detail: errorData }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
