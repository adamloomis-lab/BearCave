// Pre-generates the "Listen to this page" narration audio in the store's
// ElevenLabs voice. Run AFTER `npm run build` (it imports the server bundle,
// same pattern as prerender):
//
//   ELEVENLABS_API_KEY="..." node scripts/narrate.mjs
//
// Cost control: each section's text is hashed into manifest.json; only new or
// edited sections ever call the API. Unchanged audio is never re-billed.
// Output: public/audio/narration/<page>/<section>.mp3 (commit these).

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'audio', 'narration')
const MANIFEST = join(OUT, 'manifest.json')

// Same voice + model as the chat's /api/tts function.
const VOICE_ID = 'XAc0FruUymIjvICmNYkM'
const MODEL_ID = 'eleven_turbo_v2_5'

// Two ways to authenticate the synthesis:
//  - ELEVENLABS_API_KEY: call the ElevenLabs API directly, or
//  - NARRATE_ENDPOINT: post each section to a deployed /api/tts (which holds
//    the key server-side), so no key ever needs to exist on this machine.
const key = process.env.ELEVENLABS_API_KEY
const endpoint = process.env.NARRATE_ENDPOINT
if (!key && !endpoint) {
  console.error('Set ELEVENLABS_API_KEY or NARRATE_ENDPOINT. Examples:\n  ELEVENLABS_API_KEY="..." node scripts/narrate.mjs\n  NARRATE_ENDPOINT="https://site.netlify.app/api/tts" node scripts/narrate.mjs')
  process.exit(1)
}

const { narration } = await import(join(ROOT, 'dist-server', 'entry-server.js'))

const slugFor = (path) => (path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-'))

// Same abbreviation expansion the live /api/tts applies: TTS mangles "Blvd"
// and "OH", so spell them out before synthesis.
const expandForSpeech = (t) =>
  t
    .replace(/\bBlvd\.?\b/g, 'Boulevard')
    .replace(/\bAve\.?\b/g, 'Avenue')
    .replace(/\bRd\.?\b/g, 'Road')
    .replace(/\bSt\.?(?=\s|,|$)/g, 'Street')
    .replace(/\bOH\b/g, 'Ohio')
    .replace(/&/g, ' and ')
    .replace(/\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*([ap])\.?\s?m\.?\b/gi, (_, h, min, ap) => {
      const hour = Number(h)
      const mer = ap.toLowerCase() === 'a' ? 'AM' : 'PM'
      if (!min || min === '00') {
        if (hour === 12) return mer === 'AM' ? 'midnight' : 'noon'
        return `${hour} ${mer}`
      }
      return `${hour}:${min} ${mer}`
    })
    .replace(/\b(AM|PM|midnight|noon)\s*[-–—]\s*/gi, '$1 to ')
    .replace(/\(?(\d{3})\)?[ .-]?(\d{3})[-.](\d{4})\b/g, (_, a, b, c) =>
      [a, b, c].map((g) => g.split('').join(' ')).join(', '))
    .replace(/\b(\d{5})\b/g, (_, z) => z.split('').join(' '))
// Hash the EXPANDED text: pronunciation fixes change it and trigger regeneration.
const hash = (text) => createHash('sha1').update(expandForSpeech(text)).digest('hex').slice(0, 12)

let manifest = {}
if (existsSync(MANIFEST)) {
  try {
    manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
  } catch {
    manifest = {}
  }
}

let generated = 0
let skipped = 0
let chars = 0

for (const [path, page] of Object.entries(narration)) {
  const slug = slugFor(path)
  const dir = join(OUT, slug)
  mkdirSync(dir, { recursive: true })

  for (const section of page.sections) {
    const file = join(dir, `${section.id}.mp3`)
    const id = `${slug}/${section.id}`
    const h = hash(section.text)
    if (manifest[id] === h && existsSync(file)) {
      skipped += 1
      continue
    }

    process.stdout.write(`generating ${id} (${section.text.length} chars)... `)
    const res = endpoint
      ? await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text: section.text }),
        })
      : await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
          {
            method: 'POST',
            headers: { 'xi-api-key': key, 'content-type': 'application/json' },
            body: JSON.stringify({
              text: expandForSpeech(section.text),
              model_id: MODEL_ID,
              voice_settings: { stability: 0.5, similarity_boost: 0.75 },
            }),
          },
        )
    if (!res.ok) {
      console.error(`FAILED (${res.status}): ${await res.text().catch(() => '')}`)
      process.exit(1)
    }
    writeFileSync(file, Buffer.from(await res.arrayBuffer()))
    manifest[id] = h
    // Save the manifest as we go, so a crash never re-bills finished work.
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2))
    generated += 1
    chars += section.text.length
    console.log('done')
  }
}

console.log(
  `\nNarration audio complete: ${generated} generated (${chars.toLocaleString()} chars billed), ${skipped} unchanged.`,
)
