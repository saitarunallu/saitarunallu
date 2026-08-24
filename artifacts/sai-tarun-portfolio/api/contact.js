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
        html: `
          <h2>New portfolio enquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
          <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message.trim()).replace(/\n/g, '<br />')}</p>
        `,
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

    recentSubmissions.set(clientAddress, Date.now());
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(502).json({
      ok: false,
      error: 'The message could not be sent right now. Please use the email link below.',
    });
  }
}