// Read-only Google reviews. Uses GOOGLE_PLACES_API_KEY to fetch a business's
// rating, total count, and up to 5 recent reviews via the Places API (New)
// Place Details endpoint. Public data, no client OAuth.
//
//   GET /api/reviews?id=<place_id>          -> reviews for that place
//   GET /api/reviews?q=<name city state>    -> resolves the place by text first
//
// Degrades gracefully: returns { configured:false } when the key is unset, and
// an empty list (never an error to the client) when a place has no reviews.

import { rateLimited, clientIp } from './_ratelimit.mts'

const KEY = process.env.GOOGLE_PLACES_API_KEY

function json(b: unknown, s = 200): Response {
  return new Response(JSON.stringify(b), {
    status: s,
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600' },
  })
}

interface PlaceReview {
  rating?: number
  text?: { text?: string }
  originalText?: { text?: string }
  relativePublishTimeDescription?: string
  publishTime?: string
  authorAttribution?: { displayName?: string; photoUri?: string; uri?: string }
}
interface PlaceDetails {
  id?: string
  displayName?: { text?: string }
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: PlaceReview[]
}

async function resolvePlaceId(q: string): Promise<string> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'X-Goog-Api-Key': KEY!, 'content-type': 'application/json', 'X-Goog-FieldMask': 'places.id' },
    body: JSON.stringify({ textQuery: q, maxResultCount: 1 }),
  })
  if (!res.ok) return ''
  const data = (await res.json()) as { places?: Array<{ id?: string }> }
  return data.places?.[0]?.id ?? ''
}

export default async (req: Request): Promise<Response> => {
  if (!KEY) return json({ configured: false, reviews: [] })
  if (rateLimited(`reviews:${clientIp(req)}`, 30)) return json({ error: 'Rate limited', reviews: [] }, 429)

  const url = new URL(req.url)
  let id = (url.searchParams.get('id') ?? '').trim()
  const q = (url.searchParams.get('q') ?? '').trim()
  if (!id && q.length >= 3) id = await resolvePlaceId(q)
  if (!id) return json({ configured: true, found: false, reviews: [] })

  const fields = 'id,displayName,rating,userRatingCount,googleMapsUri,reviews'
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`, {
    headers: { 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': fields },
  })
  if (!res.ok) return json({ error: 'details failed', reviews: [] }, 502)
  const p = (await res.json()) as PlaceDetails

  type Out = { author: string; photo: string; profileUrl: string; rating: number | null; text: string; when: string; time: string }

  // "Most relevant" reviews from the Places API (New) — caps at 5.
  const relevant: Out[] = (p.reviews ?? []).map((r) => ({
    author: r.authorAttribution?.displayName ?? 'Google user',
    photo: r.authorAttribution?.photoUri ?? '',
    profileUrl: r.authorAttribution?.uri ?? '',
    rating: r.rating ?? null,
    text: (r.text?.text ?? r.originalText?.text ?? '').trim(),
    when: r.relativePublishTimeDescription ?? '',
    time: r.publishTime ?? '',
  }))

  // "Newest" reviews from the legacy endpoint — a different set, so merging both
  // yields more than the 5-review cap. Best-effort; ignored if it fails.
  let newest: Out[] = []
  try {
    const legacyUrl =
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(id)}` +
      `&fields=reviews&reviews_sort=newest&reviews_no_translations=true&key=${KEY}`
    const lr = await fetch(legacyUrl)
    if (lr.ok) {
      const ld = (await lr.json()) as {
        result?: { reviews?: Array<{ author_name?: string; profile_photo_url?: string; author_url?: string; rating?: number; text?: string; relative_time_description?: string; time?: number }> }
      }
      newest = (ld.result?.reviews ?? []).map((r) => ({
        author: r.author_name ?? 'Google user',
        photo: r.profile_photo_url ?? '',
        profileUrl: r.author_url ?? '',
        rating: r.rating ?? null,
        text: (r.text ?? '').trim(),
        when: r.relative_time_description ?? '',
        time: r.time ? new Date(r.time * 1000).toISOString() : '',
      }))
    }
  } catch {
    /* legacy optional */
  }

  // Merge both sources, dedupe by author + text prefix, keep up to 8 (the UI
  // shows 6, so a full desktop 3x2 grid).
  const seen = new Set<string>()
  const reviews = [...relevant, ...newest]
    .filter((r) => r.text)
    .filter((r) => {
      const k = `${r.author.toLowerCase()}|${r.text.slice(0, 30).toLowerCase()}`
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    .slice(0, 8)

  return json({
    configured: true,
    found: true,
    placeId: p.id ?? id,
    name: p.displayName?.text ?? '',
    rating: p.rating ?? null,
    total: p.userRatingCount ?? null,
    mapsUri: p.googleMapsUri ?? '',
    reviews,
  })
}
