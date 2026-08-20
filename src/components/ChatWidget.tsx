import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'wouter'
import { X, Send, ArrowRight, Volume2, Square, Mic, Phone, Navigation as NavArrow, Minus } from 'lucide-react'
import { BUSINESS, IMAGES } from '@/lib/constants'
import { openStateNow } from '@/lib/hours'
import { speech, pickVoice, warmVoices } from '@/lib/readAloud'

type Chip = { href: string; label: string }
type Msg = { role: 'user' | 'assistant'; content: string; chips?: Chip[] }

// The model appends [[link:/path|Label]] directives; strip them from prose
// and keep only safe internal paths as navigation chips.
function extractChips(text: string): { content: string; chips: Chip[] } {
  const chips: Chip[] = []
  const content = text
    .replace(/\[\[link:([^\]|]+)\|([^\]]+)\]\]/g, (_, href: string, label: string) => {
      if (href.startsWith('/') && !href.startsWith('//') && chips.length < 2) {
        chips.push({ href: href.trim(), label: label.trim() })
      }
      return ''
    })
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return { content, chips }
}

// The opener greets by the visitor's own clock, like the window crew would.
// Computed at mount on the client (the panel is never in prerendered HTML).
function makeOpener(): Msg {
  const h = new Date().getHours()
  const greeting = h < 12 ? 'Good morning.' : h < 17 ? 'Good afternoon.' : 'Good evening.'
  return {
    role: 'assistant',
    content: `${greeting} You've reached ${BUSINESS.shortName}. Ask about hours, what's in the coolers, or beverage catering, or tap a question below. For anything urgent, call ${BUSINESS.phone}.`,
  }
}

const STARTERS = [
  'What are your hours today?',
  'How does the drive-thru work?',
  'Do you sell lottery tickets?',
  'Can you supply drinks for my party?',
  'Are you hiring?',
]

// Voice input: tap the mic, ask out loud, and the words land in the box.
// On-device browser speech recognition; the button hides when unsupported.
type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}
const RecognitionCtor =
  typeof window !== 'undefined'
    ? ((window as unknown as Record<string, unknown>).SpeechRecognition ??
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition)
    : undefined

// Floating store assistant. Talks to /api/chat (Netlify function backed by the
// Anthropic API, grounded strictly on verified site facts). Labeled launcher,
// large type, soft motion, and a Listen button that reads answers out loud.
export default function ChatWidget() {
  const [, navigate] = useLocation()
  const [open, setOpen] = useState(false)
  const status = useMemo(() => openStateNow(), [])
  // Minimized launcher (phones): a small dot at the edge instead of the full
  // button, remembered per device.
  const [minimized, setMinimizedState] = useState(() => {
    try {
      return localStorage.getItem('bc-chat-min') === '1'
    } catch {
      return false
    }
  })
  const setMinimized = (v: boolean) => {
    setMinimizedState(v)
    try {
      localStorage.setItem('bc-chat-min', v ? '1' : '0')
    } catch {
      /* private mode */
    }
  }
  const [msgs, setMsgs] = useState<Msg[]>(() => [makeOpener()])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null)
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => warmVoices(), [])

  // Mic (voice input): render only after mount so SSR and client agree.
  const [micReady, setMicReady] = useState(false)
  const [listening, setListening] = useState(false)
  const recRef = useRef<SpeechRecognitionLike | null>(null)
  useEffect(() => {
    setMicReady(Boolean(RecognitionCtor))
  }, [])

  function toggleMic() {
    if (listening) {
      recRef.current?.stop()
      return
    }
    if (!RecognitionCtor) return
    const rec = new (RecognitionCtor as new () => SpeechRecognitionLike)()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e) => {
      const t = Array.from({ length: e.results.length }, (_, i) => e.results[i][0].transcript).join('')
      setDraft(t)
    }
    rec.onend = () => {
      setListening(false)
      recRef.current = null
    }
    rec.onerror = () => {
      setListening(false)
      recRef.current = null
    }
    recRef.current = rec
    setListening(true)
    rec.start()
  }

  // ONE persistent audio element, reused for every playback. The first tap
  // unlocks it on iOS; later src changes inherit that permission, so the
  // voice never silently downgrades to the system voice on mobile.
  const stopSpeaking = () => {
    const a = audioRef.current
    if (a) {
      a.onended = null
      a.onerror = null
      a.onplaying = null
      a.pause()
    }
    speech?.cancel()
    setSpeakingIdx(null)
  }

  // Never keep talking (or listening) after the chat closes or unmounts.
  useEffect(() => {
    if (!open) {
      stopSpeaking()
      setLoadingIdx(null)
      recRef.current?.abort()
    }
    return () => {
      stopSpeaking()
      recRef.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Browser-voice fallback, used only when /api/tts is unavailable.
  function speakWithBrowser(text: string, idx: number) {
    if (!speech) return
    const u = new SpeechSynthesisUtterance(text)
    const voice = pickVoice()
    if (voice) u.voice = voice
    u.rate = 0.95
    u.onend = () => setSpeakingIdx((s) => (s === idx ? null : s))
    u.onerror = () => setSpeakingIdx((s) => (s === idx ? null : s))
    setSpeakingIdx(idx)
    speech.speak(u)
  }

  function toggleSpeak(text: string, idx: number) {
    if (speakingIdx === idx || loadingIdx === idx) {
      stopSpeaking()
      setLoadingIdx(null)
      return
    }
    stopSpeaking()
    setLoadingIdx(idx)
    let a = audioRef.current
    if (!a) {
      a = new Audio()
      audioRef.current = a
    }
    let fellBack = false
    const fallback = () => {
      if (fellBack) return
      fellBack = true
      setLoadingIdx((v) => (v === idx ? null : v))
      speakWithBrowser(text, idx)
    }
    a.onended = () => {
      if (audioRef.current === a) stopSpeaking()
    }
    a.onerror = fallback
    a.onplaying = () => {
      setLoadingIdx((v) => (v === idx ? null : v))
      setSpeakingIdx(idx)
    }
    // Direct GET src: playback starts inside the tap gesture itself, which is
    // what iOS requires; the request streams while the element buffers.
    a.src = `/api/tts?text=${encodeURIComponent(text)}`
    a.play().catch(fallback)
  }

  // First-visit nudge: reveal what the chat button is once the visitor has
  // settled in. Desktop only, once per session.
  useEffect(() => {
    if (open) return
    if (window.matchMedia('(max-width: 767px)').matches) return
    let seen = false
    try {
      seen = sessionStorage.getItem('bc-chat-greeted') === '1'
    } catch {
      /* private mode: just show it */
    }
    if (seen) return

    let done = false
    const cleanup = () => {
      clearTimeout(dwell)
      window.removeEventListener('scroll', onScroll)
    }
    let linger: ReturnType<typeof setTimeout> | undefined
    const reveal = () => {
      if (done) return
      done = true
      setShowGreeting(true)
      cleanup()
      linger = setTimeout(() => {
        setShowGreeting(false)
        try {
          sessionStorage.setItem('bc-chat-greeted', '1')
        } catch {
          /* ignore */
        }
      }, 9000)
    }
    const onScroll = () => {
      if (window.scrollY > 700) reveal()
    }
    const dwell = setTimeout(reveal, 12000)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cleanup()
      clearTimeout(linger)
    }
  }, [open])

  const dismissGreeting = () => {
    setShowGreeting(false)
    try {
      sessionStorage.setItem('bc-chat-greeted', '1')
    } catch {
      /* ignore */
    }
  }

  const toggleOpen = () => {
    setOpen((v) => !v)
    dismissGreeting()
  }

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, open])

  async function send(text?: string) {
    const content = (text ?? draft).trim()
    if (!content || busy) return
    const next: Msg[] = [...msgs, { role: 'user', content }]
    setMsgs(next)
    setDraft('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(1) }), // opener is client-side only
      })

      if (res.headers.get('x-cdm-stream') === '1' && res.body) {
        // Word-by-word: grow the last assistant bubble as deltas arrive.
        setMsgs((m) => [...m, { role: 'assistant', content: '' }])
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let full = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          full += decoder.decode(value, { stream: true })
          const visible = extractChips(full).content
          setMsgs((m) => {
            const copy = m.slice()
            copy[copy.length - 1] = { role: 'assistant', content: visible }
            return copy
          })
        }
        const { content: finalText, chips } = extractChips(full)
        setMsgs((m) => {
          const copy = m.slice()
          copy[copy.length - 1] = {
            role: 'assistant',
            content: finalText || 'Sorry, I came up empty. Please call us and we will help.',
            chips,
          }
          return copy
        })
      } else {
        const data = (await res.json()) as { reply?: string; error?: string }
        setMsgs((m) => [
          ...m,
          {
            role: 'assistant',
            content:
              data.reply ??
              data.error ??
              'Something went wrong. Please reach us through the contact page.',
          },
        ])
      }
    } catch {
      setMsgs((m) => [
        ...m,
        { role: 'assistant', content: 'I could not connect just now. Please try again in a moment.' },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* Launcher: a labeled button above the mobile capsule / desktop CTA. */}
      <div className="group fixed bottom-24 right-4 z-40 lg:bottom-28 lg:right-8">
        {/* One-time greeting: teaches first-time visitors what this is */}
        {showGreeting && !open && (
          <div className="absolute bottom-full right-0 mb-3 w-64 border border-border bg-white p-4 shadow-[0_28px_60px_-24px_rgba(16,40,80,0.5)]">
            <button
              type="button"
              onClick={dismissGreeting}
              aria-label="Dismiss"
              className="absolute right-2 top-2 grid h-6 w-6 place-items-center text-muted-foreground transition-colors hover:bg-paper-2 hover:text-foreground"
            >
              <X size={13} />
            </button>
            <button type="button" onClick={toggleOpen} className="flex items-start gap-2.5 pr-4 text-left">
              <span className="grid h-8 w-8 shrink-0 place-items-center bg-cave">
                <img src={IMAGES.logo} alt="" className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-display text-[15px] font-semibold uppercase tracking-wide text-foreground">Questions? Just ask.</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground">
                  Hours, coolers, catering. We can even read the answers out loud.
                </span>
              </span>
            </button>
            <span aria-hidden className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-border bg-white" />
          </div>
        )}

        {minimized && !open ? (
          <button
            type="button"
            onClick={() => setMinimized(false)}
            aria-label="Show chat"
            title="Chat with us"
            className="grid h-9 w-9 place-items-center rounded-full border border-brand-ice/60 bg-cave/95 shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-all hover:scale-105 md:h-10 md:w-10"
          >
            <img src={IMAGES.logo} alt="" className="h-6 w-6" />
          </button>
        ) : (
          <div className={`relative ${open ? 'hidden' : ''}`}>
            <button
              type="button"
              onClick={toggleOpen}
              aria-label={open ? 'Close chat' : 'Chat with us'}
              aria-expanded={open}
              className={`relative inline-flex items-center justify-center gap-2.5 rounded-full border border-brand-ice/50 bg-cave text-white md:rounded-[2px] shadow-[0_14px_34px_rgba(0,0,0,0.35)] transition-all hover:border-brand-ice hover:scale-[1.03] active:scale-95 ${
                open ? 'h-14 w-14' : 'h-12 w-12 md:h-auto md:w-auto md:py-3.5 md:pl-4 md:pr-5'
              }`}
            >
              {/* live status dot */}
              {!open && (
                <span aria-hidden className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-accent ring-2 ring-cave" />
              )}
              {open ? (
                <X size={24} />
              ) : (
                <>
                  <img src={IMAGES.logo} alt="" className="h-7 w-7" />
                  <span className="hidden text-[15px] font-semibold md:inline">Chat with us</span>
                </>
              )}
            </button>
            {/* Tuck away (phones): tiny minus that shrinks the launcher to a dot */}
            {!open && (
              <button
                type="button"
                onClick={() => setMinimized(true)}
                aria-label="Minimize chat button"
                title="Minimize"
                className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full border border-border bg-white text-muted-foreground shadow-sm transition-colors hover:text-foreground md:-left-2.5 md:-top-2.5 md:h-7 md:w-7"
              >
                <Minus size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {open && (
        <section
          aria-label={`${BUSINESS.name} chat assistant`}
          className="chat-pop fixed inset-x-3 bottom-44 z-40 flex max-h-[min(68dvh,calc(100dvh-14rem))] flex-col overflow-hidden border border-border bg-white shadow-[0_30px_70px_-20px_rgba(16,30,60,0.5)] sm:inset-x-auto sm:right-4 sm:w-[min(92vw,420px)] lg:bottom-48 lg:right-8"
        >
          <header className="flex items-center gap-3.5 border-b border-border bg-cave px-5 py-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10">
              <img src={IMAGES.logo} alt="" className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[19px] font-semibold uppercase leading-tight tracking-wide text-white">{BUSINESS.shortName}</p>
              <p className="mt-0.5 flex items-center gap-2 truncate text-[12px] text-white/60">
                <span aria-hidden className={`inline-block h-2 w-2 shrink-0 rounded-full ${status.open ? 'bg-green-400' : 'bg-white/40'}`} />
                <span className={`truncate ${status.open ? 'text-white' : ''}`}>{status.label}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={toggleOpen}
              aria-label="Close chat"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </header>

          <div ref={scroller} className="flex-1 space-y-3.5 overflow-y-auto px-4 py-5">
            {msgs.map((m, i) => (
              <div key={`${i}-${m.role}`} className="chat-msg">
                <div
                  className={`max-w-[88%] px-4 py-3 text-[16px] leading-relaxed ${
                    m.role === 'user'
                      ? 'ml-auto bg-brand text-white'
                      : 'border border-border bg-background text-foreground'
                  }`}
                >
                  {m.content}
                  {m.chips && m.chips.length > 0 && (
                    <span className="mt-3 flex flex-wrap gap-2">
                      {m.chips.map((c) => (
                        <button
                          key={c.href}
                          type="button"
                          onClick={() => navigate(c.href)}
                          className="inline-flex min-h-[42px] items-center gap-1.5 border border-brand/40 bg-white px-3.5 py-2 text-[14px] font-semibold text-brand-deep transition-colors hover:bg-brand hover:text-white"
                        >
                          {c.label} <ArrowRight size={13} />
                        </button>
                      ))}
                    </span>
                  )}
                </div>
                {/* Listen: reads this answer aloud in the store's own voice */}
                {m.role === 'assistant' && m.content && (
                  <button
                    type="button"
                    onClick={() => toggleSpeak(m.content, i)}
                    aria-pressed={speakingIdx === i}
                    className={`mt-1.5 inline-flex min-h-[38px] items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                      speakingIdx === i || loadingIdx === i
                        ? 'bg-brand text-white'
                        : 'text-muted-foreground hover:bg-background hover:text-brand-deep'
                    }`}
                  >
                    {loadingIdx === i ? (
                      <>
                        <span className="inline-flex items-center gap-1" aria-hidden>
                          <span className="typing-dot !bg-current" />
                          <span className="typing-dot !bg-current" style={{ animationDelay: '0.18s' }} />
                          <span className="typing-dot !bg-current" style={{ animationDelay: '0.36s' }} />
                        </span>
                        <span className="sr-only">Loading audio</span>
                      </>
                    ) : speakingIdx === i ? (
                      <>
                        <Square size={13} /> Stop
                      </>
                    ) : (
                      <>
                        <Volume2 size={15} /> Listen
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
            {msgs.length === 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {STARTERS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="min-h-[44px] border border-border bg-white px-4 py-2.5 text-left text-[14.5px] text-muted-foreground transition-colors hover:border-brand hover:text-brand-deep"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {busy && (
              <div className="inline-flex items-center gap-1.5 border border-border bg-background px-4 py-3.5">
                <span className="typing-dot" />
                <span className="typing-dot" style={{ animationDelay: '0.18s' }} />
                <span className="typing-dot" style={{ animationDelay: '0.36s' }} />
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="flex items-center gap-2 border-t border-border bg-white p-3"
          >
            {micReady && (
              <button
                type="button"
                onClick={toggleMic}
                aria-label={listening ? 'Stop listening' : 'Ask your question by voice'}
                aria-pressed={listening}
                className={`inline-flex h-12 w-12 shrink-0 items-center justify-center border transition-colors ${
                  listening
                    ? 'animate-pulse border-accent bg-accent text-white'
                    : 'border-border bg-background text-muted-foreground hover:border-brand hover:text-brand-deep'
                }`}
              >
                <Mic size={19} />
              </button>
            )}
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={listening ? 'Listening…' : 'Type or tap the mic'}
              aria-label="Your question"
              className="w-full border border-border bg-background px-4 py-3 text-[16px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              aria-label="Send"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-brand text-white transition-colors hover:bg-brand-deep disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="flex items-center gap-2 border-t border-border bg-background px-4 py-2.5">
            <a
              href={`tel:${BUSINESS.phoneDigits}`}
              className="inline-flex min-h-[38px] items-center gap-1.5 bg-brand px-3 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-deep"
            >
              <Phone size={14} /> Call
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${BUSINESS.name}, ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[38px] items-center gap-1.5 border border-border bg-white px-3 text-[12.5px] font-semibold text-foreground transition-colors hover:border-brand hover:text-brand-deep"
            >
              <NavArrow size={14} /> Directions
            </a>
            <p className="ml-auto text-right text-[11px] leading-snug text-muted-foreground">
              Automated assistant. 21+ for alcohol and tobacco.
            </p>
          </div>
        </section>
      )}
    </>
  )
}
