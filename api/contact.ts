type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
};

type VercelRequest = {
  method?: string;
  body?: ContactBody;
  headers: Record<string, string | string[] | undefined>;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'saitarun1932@gmail.com';
const sender = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character] ?? character);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientAddress(request: VercelRequest) {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0] || 'unknown';
  return 'unknown';
}

const recentSubmissions = new Map<string, number>();

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const { name, email, message, website } = request.body ?? {};

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
  if (lastSubmission && Date.now() - lastSubmission < 60_000) {
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
      return response.status(502).json({
        ok: false,
        error: 'The message could not be sent right now. Please use the email link below.',
      });
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