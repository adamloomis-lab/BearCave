import { useEffect, useRef, useState } from 'react'
import { Headphones, Play, Pause, SkipBack, SkipForward, X, Minus } from 'lucide-react'
import { narration } from '@/data/narration'
import { speech, pickVoice, warmVoices } from '@/lib/readAloud'

// "Listen to this page": an audio tour of the current page in the store's
// own voice. Audio is pre-generated per section (scripts/narrate.mjs) and
// served as static files; any missing file falls back to the browser voice, so
// the player works even before audio is generated. While a section plays, the
// matching [data-narrate] block scrolls into view and gently highlights.
// User-initiated only (WCAG 1.4.2), stops on navigation and close.

const slugFor = (path: string) => (path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-'))

function clearHighlight() {
  document.querySelectorAll('.narrate-active').forEach((el) => el.classList.remove('narrate-active'))
}

function highlight(anchor?: string) {
  clearHighlight()
  if (!anchor) return
  const el = document.querySelector(`[data-narrate="${anchor}"]`) ?? document.getElementById(anchor)
  if (!el) return
  el.classList.add('narrate-active')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

export default function NarrationPlayer({ path }: { readonly path: string }) {
  const page = narration[path]
  const [openPanel, setOpenPanel] = useState(false)
  // Pre-start pill is minimizable (house standard): tucks to a 44px icon-only
  // button; the choice persists for the visit via sessionStorage and survives
  // client-side navigation. The icon restores the full pill.
  const [min, setMin] = useState(() => {
    try {
      return sessionStorage.getItem('bc-listen-min') === '1'
    } catch {
      return false
    }
  })
  const setMinimized = (v: boolean) => {
    setMin(v)
    try {
      sessionStorage.setItem('bc-listen-min', v ? '1' : '0')
    } catch {
      // Private mode: the preference just lives for this render.
    }
  }
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Monotonic token: anything async from a previous play is ignored.
  const runRef = useRef(0)

  useEffect(() => warmVoices(), [])

  // The audio element persists across sections and stops: the first tap
  // unlocks it on iOS, and reusing it lets auto-advance keep playing the real
  // voice instead of downgrading to the system voice.
  const stop = () => {
    runRef.current += 1
    const a = audioRef.current
    if (a) {
      a.onended = null
      a.onerror = null
      a.pause()
    }
    speech?.cancel()
    clearHighlight()
    setPlaying(false)
  }

  // Navigation resets everything (the effect also runs on unmount).
  useEffect(() => {
    setOpenPanel(false)
    setIdx(0)
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  if (!page) return null
  const sections = page.sections
  const current = sections[idx]

  function speakFallback(text: string, run: number, onDone: () => void) {
    if (!speech) {
      onDone()
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    const voice = pickVoice()
    if (voice) u.voice = voice
    u.rate = 0.95
    u.onend = () => {
      if (runRef.current === run) onDone()
    }
    u.onerror = () => {
      if (runRef.current === run) onDone()
    }
    speech.speak(u)
  }

  function playSection(i: number) {
    stop()
    const section = sections[i]
    if (!section) {
      setIdx(0)
      return
    }
    const run = runRef.current
    setIdx(i)
    setPlaying(true)
    highlight(section.anchor)
    const advance = () => {
      if (runRef.current !== run) return
      if (i + 1 < sections.length) playSection(i + 1)
      else {
        stop()
        setIdx(0)
      }
    }

    let audio = audioRef.current
    if (!audio) {
      audio = new Audio()
      audioRef.current = audio
    }
    let fellBack = false
    const fallback = () => {
      // No pre-generated file (yet): read this section with the browser voice.
      if (fellBack || runRef.current !== run) return
      fellBack = true
      speakFallback(section.text, run, advance)
    }
    audio.onended = () => {
      if (runRef.current === run) advance()
    }
    audio.onerror = fallback
    audio.src = `/audio/narration/${slugFor(path)}/${section.id}.mp3`
    audio.play().catch(fallback)
  }

  const toggle = () => {
    if (playing) stop()
    else playSection(idx)
  }

  return (
    <div className="fixed right-4 top-[112px] z-30 flex flex-col items-end lg:right-8">
      {!openPanel && min ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          aria-label="Show the Listen to this page button"
          title="Listen to this page"
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-white/95 text-brand-deep shadow-[0_14px_34px_-14px_rgba(16,48,80,0.45)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brand/40"
        >
          <Headphones size={16} />
        </button>
      ) : !openPanel ? (
        <div className="inline-flex items-center overflow-hidden border border-border bg-white/95 shadow-[0_14px_34px_-14px_rgba(16,48,80,0.45)] backdrop-blur">
          <button
            type="button"
            onClick={() => {
              setOpenPanel(true)
              playSection(0)
            }}
            className="inline-flex items-center gap-2 py-2.5 pl-3.5 pr-3 text-[13px] font-semibold text-foreground transition-colors hover:text-brand-deep"
          >
            <Headphones size={16} className="text-brand-deep" />
            Listen to this page
          </button>
          <button
            type="button"
            onClick={() => setMinimized(true)}
            aria-label="Minimize the Listen to this page button"
            className="grid h-9 w-8 place-items-center self-stretch border-l border-border/70 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <Minus size={14} />
          </button>
        </div>
      ) : (
        <section
          aria-label="Page narration player"
          className="chat-pop w-[min(92vw,320px)] border border-border bg-white p-4 shadow-[0_28px_60px_-24px_rgba(16,48,80,0.5)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {page.title}
              </p>
              <p className="mt-0.5 truncate font-display text-[16px] font-semibold uppercase tracking-wide text-foreground">
                {current?.title}
              </p>
              <p className="text-[11.5px] text-muted-foreground" aria-live="polite">
                Part {idx + 1} of {sections.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                stop()
                setOpenPanel(false)
                setIdx(0)
              }}
              aria-label="Close the narration player"
              className="grid h-8 w-8 shrink-0 place-items-center text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => playSection(Math.max(0, idx - 1))}
              disabled={idx === 0}
              aria-label="Previous section"
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand-deep disabled:opacity-35"
            >
              <SkipBack size={17} />
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pause narration' : 'Play narration'}
              className="grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-[0_12px_26px_-10px_rgba(180,50,40,0.8)] transition-transform hover:scale-105 active:scale-95"
            >
              {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={() => playSection(Math.min(sections.length - 1, idx + 1))}
              disabled={idx >= sections.length - 1}
              aria-label="Next section"
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand-deep disabled:opacity-35"
            >
              <SkipForward size={17} />
            </button>
          </div>

          {/* Section progress ticks */}
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {sections.map((s, i) => (
              <span
                key={s.id}
                className={`h-1 flex-1 transition-colors ${
                  i < idx ? 'bg-brand-ice' : i === idx ? 'bg-brand' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
