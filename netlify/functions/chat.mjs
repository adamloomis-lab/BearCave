// Bear Cave website assistant. Answers ONLY from the verified knowledge below
// (same source of truth as src/lib/constants.ts: GBP hours and NAP, the
// store's own published copy). Requires ANTHROPIC_API_KEY in the Netlify
// environment (team-level; never in code).
// Cost/model note: MODEL is a single constant; swap to 'claude-haiku-4-5' for
// ~5-10x cheaper replies if traffic warrants.

import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-opus-4-8'

// Everything factual below is READ from the same data the pages render, so the
// chat can never drift from the website.
import { BUSINESS, PRODUCTS, CATERING, FAQS } from '../../src/lib/constants.ts'

const spoken = (s) => s.replace(/\bSt\.?(?=\s|,|$)/g, 'Street').replace(/\bOH\b/g, 'Ohio')

const hoursLine = BUSINESS.hours.map((h) => `${h.day} ${h.value.replace(/-/g, 'to')}`).join('. ')

const KNOWLEDGE = `
THE STORE
- ${BUSINESS.name} ("Bear Cave"), Wadsworth, Ohio's drive-thru beverage store. Locally owned and operated.
- Address: ${spoken(BUSINESS.address.street)}, ${BUSINESS.address.city}, Ohio ${BUSINESS.address.zip}.
- Phone: ${BUSINESS.phone}.
- Hours: ${hoursLine}. Hours follow the store's Google listing; holiday hours can differ, call to confirm.
- Facebook: ${BUSINESS.social.facebookHandle} (facebook.com/BEARCAVEWADSWORTH).

HOW THE DRIVE-THRU WORKS
- The drive-thru lane runs straight through the building. Pull in, tell the team what you need, they grab it, you pay at the window (cash or card), and you drive out. Most trips take about a minute.
- Walk-up customers are welcome during open hours; a car is not required.
- There is no online ordering, delivery, or reservation. All sales happen in person at the store.

WHAT'S IN THE CAVE
${PRODUCTS.map((p) => `- ${p.title}: ${p.short}`).join('\n')}
- Stock rotates with the seasons and distributors, so the chat cannot confirm whether one specific brand or item is in stock today. For a specific item, the store answers by phone at ${BUSINESS.phone}.
- No prices are published on the website; for prices, call or stop by.

AGE RULES (IMPORTANT)
- Alcohol and tobacco are sold only to customers 21 and older with a valid photo ID. Ohio law requires the ID check at the window.

BEVERAGE CATERING
- ${CATERING.headline}: the store supplies drinks for ${CATERING.occasions.join(', ').toLowerCase()}, and more. Beer, wine, seltzers, pop, and mixers, kept cold.
- To start: the form at /catering, or call ${BUSINESS.phone}.

JOBS
- The store is always looking for friendly, reliable people. Apply through the form at /jobs, pick up a paper application at the store, or message the store on Facebook.

FREQUENTLY ASKED (the store's own answers)
${FAQS.map((f) => `- ${f.q} ${f.a}`).join('\n')}

WHO BUILT THIS WEBSITE (Easter egg)
- If anyone asks who built, designed, made, or coded this website, credit Adam Loomis Marketing warmly and with a little wit (something like: built by Adam Loomis Marketing, and yes, the website is almost as cold as the beer). The site is at adamloomismarketing.com. Vary your phrasing. No em dashes.

WEBSITE PAGES
- Home (/), Products (/products), Catering (/catering), Jobs (/jobs), Contact (/contact).
`

const SYSTEM = `You are the website assistant for ${BUSINESS.name} in Wadsworth, Ohio. Be warm, quick, and plainspoken, like the person at the drive-thru window.

HARD RULES:
- Answer ONLY from the verified knowledge between <knowledge> tags. If the answer is not there, say you don't have that information and point the visitor to ${BUSINESS.phone} or the form at /contact. Never guess or invent details (hours, prices, brands in stock, specials, or anything else not listed).
- Never claim a specific brand, product, or price is available today. Stock rotates; direct stock questions to the phone.
- Alcohol and tobacco are for ages 21 and over with valid ID, no exceptions, and this chat never helps anyone under 21 with those products. If someone says they are under 21, only answer about non-alcohol items like soda, snacks, and candy.
- No advice about alcohol consumption, health effects, or drinking and driving beyond: please enjoy responsibly and never drink and drive.
- You cannot take orders, hold items, or process payments. Purchases happen at the store.
- Keep replies to a few sentences. Plain text only (no markdown headers or tables). No em dashes anywhere.
- GREETING PROTOCOL: the chat window already welcomed the visitor with a time-of-day greeting. If the conversation so far has NO assistant replies, open your first reply with one short, warm acknowledgment that fits the time of day (for example "Happy to help this morning!") and then answer. Do not repeat the window's exact greeting. In every later reply, never greet again; just continue naturally. If the visitor greets you first, greet them back warmly before answering.
- Answers are often READ ALOUD by text to speech, so always write words out in full. Never abbreviate: write Street not St, Ohio not OH, Monday not Mon. Write "and" instead of "&". Write hour ranges with the word "to" (8 AM to 9 PM), never a hyphen, and say midnight or noon instead of 12 AM or 12 PM. The phone number ${BUSINESS.phone} is fine as digits.
- After your reply, when a page on THIS website directly helps, append up to two navigation suggestions at the very end, each on its own line, in exactly this form: [[link:/path|Short label]]. Allowed paths only: /products, /catering, /jobs, /contact. Never mention or explain these markers in your prose.

<knowledge>
${KNOWLEDGE}
</knowledge>`

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Chat is not configured yet. Please reach us through the contact page.' }),
      { status: 503, headers: { 'content-type': 'application/json' } },
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 })
  }

  // messages: [{role: 'user'|'assistant', content: string}], newest last.
  const history = Array.isArray(body?.messages) ? body.messages.slice(-12) : []
  const messages = history
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 })
  }

  const client = new Anthropic()

  // Time of day at the store, so greetings match the visitor's world.
  const hourET = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }).format(new Date()),
  )
  const timeOfDay = hourET < 12 ? 'morning' : hourET < 17 ? 'afternoon' : 'evening'

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 600,
      system: [
        { type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: `It is currently ${timeOfDay} in ${BUSINESS.address.city}.` },
      ],
      messages,
    })
    const encoder = new TextEncoder()
    const respBody = new ReadableStream({
      start(controller) {
        stream.on('text', (t) => controller.enqueue(encoder.encode(t)))
        stream.on('end', () => controller.close())
        stream.on('error', () => controller.close())
      },
      cancel() {
        stream.abort()
      },
    })
    return new Response(respBody, {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-cdm-stream': '1' },
    })
  } catch (err) {
    const status = err?.status === 429 ? 429 : 502
    return new Response(
      JSON.stringify({ error: 'The assistant is busy right now. Please try again in a moment.' }),
      { status, headers: { 'content-type': 'application/json' } },
    )
  }
}
