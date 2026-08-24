import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response } from 'express';
import { ReplitConnectors } from '@replit/connectors-sdk';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 5000);
const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'saitarun1932@gmail.com';
const sender = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const recentSubmissions = new Map<string, number>();

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

function getClientAddress(request: Request) {
  const forwarded = request.headers['x-forwarded-for'];
  return typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : request.ip || 'unknown';
}

async function sendContactEmail(request: Request, response: Response) {
  const { name, email, message, website } = request.body ?? {};

  if (typeof website === 'string' && website.trim()) {
    return response.json({ ok: true });
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

  try {
    const connectors = new ReplitConnectors();
    const emailResponse = await connectors.proxy('resend', '/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

    if (!emailResponse.ok) {
      return response.status(502).json({ ok: false, error: 'The message could not be sent right now. Please try again.' });
    }

    recentSubmissions.set(clientAddress, Date.now());
    return response.json({ ok: true });
  } catch {
    return response.status(502).json({ ok: false, error: 'The message could not be sent right now. Please try again.' });
  }
}

const app = express();
app.set('trust proxy', true);
app.use(express.json({ limit: '20kb' }));
app.post('/api/contact', sendContactEmail);

if (isProduction) {
  app.use(express.static(path.join(appRoot, 'dist/public')));
  app.get(/.*/, (_request, response) => response.sendFile(path.join(appRoot, 'dist/public/index.html')));
} else {
  const vite = await createViteServer({
    root: appRoot,
    configFile: path.join(appRoot, 'vite.config.ts'),
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0');