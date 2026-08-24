const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'saitarun1932@gmail.com';
const sender = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const recentSubmissions = new Map();

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character] || character);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientAddress(request) {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0] || 'unknown';
  return 'unknown';
}

function brandedEmail({ eyebrow, title, intro, content, footer }) {
  return `
    <div style="margin:0;background:#f4f1e9;padding:36px 18px;font-family:Arial,Helvetica,sans-serif;color:#171717">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #ded8cc">
        <div style="background:#ef4b23;padding:28px 32px;color:#fff">
          <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:.8">SAI TARUN ALLU / JAVA ENGINEER</div>
          <div style="margin-top:34px;font-size:31px;line-height:1.05;font-weight:700;letter-spacing:-1px">${title}</div>
        </div>
        <div style="padding:30px 32px">
          <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#ef4b23">${eyebrow}</div>
          <p style="margin:16px 0 24px;font-size:16px;line-height:1.6;color:#34312d">${intro}</p>
          ${content}
          <div style="margin-top:30px;padding-top:18px;border-top:1px solid #e5e0d7;font-family:'Courier New',monospace;font-size:11px;line-height:1.6;color:#777067">${footer}</div>
        </div>
      </div>
    </div>
  `;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const { name, email, message, website } = request.body || {};

  if (typeof website === 'string' && website.trim()) {
    return response.status(200).json({ ok: true });
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    !name.trim() ||
    !isValidEmail(email.trim()) ||
    !message.trim() ||
    name.length > 100 ||
    email.length > 254 ||
    message.length > 5000
  ) {
    return response.status(400).json({ ok: false, error: 'Please complete all fields with valid information.' });
  }

  const clientAddress = getClientAddress(request);
  const lastSubmission = recentSubmissions.get(clientAddress);
  if (lastSubmission && Date.now() - lastSubmission < 60000) {
    return response.status(429).json({ ok: false, error: 'Please wait a minute before sending another message.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return response.status(503).json({
      ok: false,
      error: 'Email delivery is not configured yet. Please use the email link below.',
    });
  }

  try {
    const adminEmail = brandedEmail({
      eyebrow: 'New portfolio enquiry',
      title: 'Someone wants to talk about the work.',
      intro: 'A new message arrived through your portfolio contact form.',
      content: `
        <div style="border-left:3px solid #ef4b23;padding:2px 0 2px 18px">
          <p style="margin:0 0 10px;font-size:14px"><strong style="color:#171717">From</strong><br>${escapeHtml(name.trim())} &lt;${escapeHtml(email.trim())}&gt;</p>
          <p style="margin:0;font-size:15px;line-height:1.7;white-space:pre-wrap;color:#34312d">${escapeHtml(message.trim())}</p>
        </div>
      `,
      footer: 'Reply directly to this email to continue the conversation.',
    });

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email.trim(),
        subject: `Portfolio enquiry from ${name.trim()}`,
        html: adminEmail,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
      }),
    });

    if (!resendResponse.ok) {
      const providerBody = await resendResponse.json().catch(() => ({}));
      const providerMessage = typeof providerBody.message === 'string' ? providerBody.message.toLowerCase() : '';
      let error = 'The message could not be sent right now. Please use the email link below.';

      if (resendResponse.status === 401) {
        error = 'The email service key was rejected. Check the Vercel Production RESEND_API_KEY and redeploy.';
      } else if (
        resendResponse.status === 403 ||
        providerMessage.includes('domain') ||
        providerMessage.includes('sender') ||
        providerMessage.includes('from')
      ) {
        error = 'Resend rejected the sender address. Set RESEND_FROM_EMAIL to a verified domain address in Vercel, then redeploy.';
      } else if (resendResponse.status === 422) {
        error = 'Resend rejected the email details. Check the recipient and sender settings in Vercel.';
      }

      return response.status(502).json({ ok: false, error });
    }

    const confirmationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [email.trim()],
        subject: 'Thanks for reaching out — Sai Tarun Allu',
        html: brandedEmail({
          eyebrow: 'Message received',
          title: 'Thanks for reaching out.',
          intro: `Hi ${escapeHtml(name.trim())}, I’ve received your note and will get back to you by email soon.`,
          content: `
            <div style="background:#f8f6f1;border:1px solid #e5e0d7;padding:18px 20px">
              <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#ef4b23;margin-bottom:10px">Your note</div>
              <div style="font-size:14px;line-height:1.7;color:#34312d;white-space:pre-wrap">${escapeHtml(message.trim())}</div>
            </div>
          `,
          footer: 'Sai Tarun Allu · Java Software Engineer · saitarunallu.com',
        }),
        text: `Hi ${name.trim()},\n\nThanks for reaching out. I received your message and will get back to you by email soon.\n\nYour note:\n${message.trim()}\n\nSai Tarun Allu`,
      }),
    });

    void confirmationResponse;
    recentSubmissions.set(clientAddress, Date.now());
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(502).json({
      ok: false,
      error: 'The message could not be sent right now. Please use the email link below.',
    });
  }
}