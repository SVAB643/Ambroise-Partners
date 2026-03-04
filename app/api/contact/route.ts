import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, company, message } = await req.json();

    if (!name || !email || !message) {
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
        to: 'adrien@ambroisepartners.com',
        reply_to: email,
        subject: `New inquiry from ${name}${company ? ` (${company})` : ''}`,
        text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n\nMessage:\n${message}`,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
