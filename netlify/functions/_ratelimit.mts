// Tiny in-memory rate limiter (best-effort, per warm instance). Good enough to
// blunt abuse of the public reviews endpoint without external state.
const hits = new Map<string, { count: number; reset: number }>()

export function clientIp(req: Request): string {
  return (
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

// Returns true when the key has exceeded `limit` requests in the last minute.
export function rateLimited(key: string, limit: number): boolean {
  const now = Date.now()
  const slot = hits.get(key)
  if (!slot || now > slot.reset) {
    hits.set(key, { count: 1, reset: now + 60_000 })
    return false
  }
  slot.count += 1
  return slot.count > limit
}
