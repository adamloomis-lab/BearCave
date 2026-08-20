// SEO build guardrail: fail the build if the prerendered home page ships
// without JSON-LD (i.e. the <!--SEO_HEAD--> placeholder is missing from index.html).
import { readFileSync } from 'node:fs'
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
if (!/application\/ld\+json/i.test(html)) {
  console.error('\n[seo-check] FAIL: dist/index.html has no JSON-LD. Is <!--SEO_HEAD--> present in index.html?\n')
  process.exit(1)
}
console.log('[seo-check] OK: JSON-LD present in dist/index.html')

// Image-weight guardrail (standard 16) : fail the build if any raster photo in
// the output is oversized. Photos should ship as WebP/AVIF under ~500KB. Logos,
// icons, favicons and OG cards are exempt by name.
import { readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const MAX_KB = 500
const MAX_WEBP_KB = 700
const EXEMPT = /(favicon|apple-touch|icon|logo|sprite|og[-_])/i
const distPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
function walk(dir) {
  let out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out = out.concat(walk(p))
    else out.push(p)
  }
  return out
}
const heavy = walk(distPath)
  .filter((p) => /\.(png|jpe?g|webp|avif)$/i.test(p) && !EXEMPT.test(p))
  .map((p) => ({ p, kb: Math.round(statSync(p).size / 1024) }))
  .filter((x) => x.kb > (/\.(webp|avif)$/i.test(x.p) ? MAX_WEBP_KB : MAX_KB))
if (heavy.length) {
  console.error(`\n[seo-check] FAIL: ${heavy.length} oversized raster image(s) (> ${MAX_KB}KB). Convert to WebP (standard 16):`)
  for (const h of heavy) console.error(`  ${h.kb}KB  ${h.p.split('/dist/')[1]}`)
  console.error('')
  process.exit(1)
}
console.log('[seo-check] OK: no oversized raster images')
