const { guides, catalog, instructions } = require('../lib/sommelier-knowledge.js');

const productIds = new Set(catalog.map(product => product.id));
const linkIds = new Set(['visita', 'spedizioni', 'resi', 'shop', 'storia', 'contatti']);
const rateWindow = 60_000;
const rateEntries = new Map();
const byteLimit = 48_000;
const messageLimit = 1200;
const answerLimit = 2000;

function rateLimited(ip, now) {
  for (const [key, entry] of rateEntries) {
    if (entry.until <= now) rateEntries.delete(key);
  }
  let entry = rateEntries.get(ip);
  if (!entry) {
    if (rateEntries.size >= 1000) return true;
    entry = { until: now + rateWindow, count: 0 };
    rateEntries.set(ip, entry);
  }
  return ++entry.count > 10;
}

function validConversation(messages) {
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 11 || messages.length % 2 === 0) return false;
  return messages.every((message, index) => {
    const role = index % 2 === 0 ? 'user' : 'assistant';
    const max = role === 'user' ? messageLimit : answerLimit;
    return message?.role === role && typeof message.content === 'string' && message.content.trim().length > 0 && message.content.length <= max;
  });
}

const format = {
  type: 'json_schema',
  name: 'sommelier_reply',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['answer', 'productIds', 'links'],
    properties: {
      answer: { type: 'string' },
      productIds: { type: 'array', items: { type: 'string', enum: [...productIds] } },
      links: { type: 'array', items: { type: 'string', enum: [...linkIds] } }
    }
  }
};

function safeIds(values, allowed) {
  return Array.isArray(values) ? [...new Set(values.filter(value => allowed.has(value)))].slice(0, 2) : [];
}

module.exports = async function sommelier(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Usa il metodo POST.' });
  }
  const origin = req.headers.origin;
  if (origin && origin !== 'https://' + req.headers.host && origin !== 'http://' + req.headers.host) {
    return res.status(403).json({ error: 'Origine della richiesta non consentita.' });
  }
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
    return res.status(415).json({ error: 'Formato della richiesta non valido.' });
  }

  let body = req.body;
  try {
    if (Number(req.headers['content-length']) > byteLimit || Buffer.byteLength(typeof body === 'string' ? body : JSON.stringify(body ?? null)) > byteLimit) {
      return res.status(413).json({ error: 'La conversazione è troppo lunga.' });
    }
    if (typeof body === 'string') body = JSON.parse(body);
  } catch {
    return res.status(400).json({ error: 'Richiesta non valida.' });
  }
  if (body?.topic !== undefined) {
    if (typeof body.topic !== 'string' || !Object.hasOwn(guides, body.topic)) {
      return res.status(400).json({ error: 'Domanda rapida non riconosciuta.' });
    }
    const { answer, links } = guides[body.topic];
    return res.status(200).json({ answer, links, productIds: [] });
  }
  if (!validConversation(body?.messages)) {
    return res.status(400).json({ error: 'Scrivi una domanda di massimo 1200 caratteri.' });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(503).json({ error: 'La chat libera non è ancora attiva. Puoi usare le domande rapide o contattarci.' });
  }
  const ip = req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip, Date.now())) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Troppe domande in poco tempo. Riprova tra un minuto o usa le domande rapide.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_SOMMELIER_MODEL || 'gpt-4.1-mini',
        instructions,
        input: body.messages.map(({ role, content }) => ({ role, content: content.trim() })),
        max_output_tokens: 850,
        store: false,
        text: { format }
      }),
      signal: AbortSignal.timeout(17_000)
    });
    if (!response.ok) throw new Error('OpenAI HTTP ' + response.status);
    const data = await response.json();
    const parts = (data.output || []).filter(item => item.type === 'message').flatMap(item => item.content || []);
    if (parts.some(part => part.type === 'refusal') || data.status === 'incomplete') {
      return res.status(200).json({
        answer: 'Non riesco a rispondere a questa domanda. Puoi chiedermi dei nostri vini, delle visite o delle condizioni dello shop.',
        productIds: [],
        links: ['contatti']
      });
    }
    const result = JSON.parse(parts.filter(part => part.type === 'output_text').map(part => part.text).join(''));
    if (typeof result.answer !== 'string' || !result.answer.trim()) throw new Error('Empty answer');
    return res.status(200).json({
      answer: result.answer.trim().slice(0, answerLimit),
      productIds: safeIds(result.productIds, productIds),
      links: safeIds(result.links, linkIds)
    });
  } catch (error) {
    console.warn('[sommelier] Provider unavailable:', error.name);
    return res.status(503).json({ error: 'La chat IA non è disponibile in questo momento. Riprova o usa una domanda rapida.' });
  }
};
