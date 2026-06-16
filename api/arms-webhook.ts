import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const webhookUrl = process.env.ARMS_WEBHOOK_URL || process.env.VITE_ARMS_WEBHOOK_URL;

  if (!webhookUrl || typeof webhookUrl !== 'string') {
    return res.status(400).json({ ok: false, error: 'Missing ARMS webhook URL environment variable' });
  }

  try {
    const highLevelResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });

    return res.status(highLevelResponse.ok ? 200 : 502).json({
      ok: highLevelResponse.ok,
      status: highLevelResponse.status
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
