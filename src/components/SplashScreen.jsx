// SplashScreen.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// ─── tiny hook: persist sound preference ─────────────────────────────────────
const PREF_KEY = 'tonymilanzi_sound';
const savePref = (val) => localStorage.setItem(PREF_KEY, val ? '1' : '0');

// ─── Audio helpers ────────────────────────────────────────────────────────────
const AUDIO = {
  click: '/assets/audio/click.mp3',
  hover: '/assets/audio/hover.mp3',
  music: '/assets/audio/eliveta.mp3',
};

const createAudio = (src, { volume = 1, loop = false } = {}) => {
  const a = new Audio(src);
  a.volume = volume;
  a.loop   = loop;
  return a;
};

// ─── SplashScreen ─────────────────────────────────────────────────────────────
const SplashScreen = ({ onComplete }) => {
  const splashRef     = useRef(null);
  const barRef        = useRef(null);
  const barFillRef    = useRef(null);
  const logoRef       = useRef(null);
  const taglineRef    = useRef(null);
  const counterRef    = useRef(null);
  const promptRef     = useRef(null);
  const promptCardRef = useRef(null);   // ← the frosted card
  const yesRef        = useRef(null);
  const noRef         = useRef(null);

  const clickSfx  = useRef(null);
  const hoverSfx  = useRef(null);
  const musicRef  = useRef(null);

  const [loadDone, setLoadDone] = useState(false);

  // ── init audio ─────────────────────────────────────────────────────────────
  useEffect(() => {
    clickSfx.current = createAudio(AUDIO.click, { volume: 0.7 });
    hoverSfx.current = createAudio(AUDIO.hover, { volume: 0.4 });
    musicRef.current = createAudio(AUDIO.music, { volume: 0.15, loop: true });
  }, []);

  // ── loading bar timeline ───────────────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => setLoadDone(true) });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: 40, letterSpacing: '0.5em' },
      { opacity: 1, y: 0, letterSpacing: '0.08em', duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(
      taglineRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(
      barRef.current,
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )
    .to(
      barFillRef.current,
      {
        width: '100%',
        duration: 2,
        ease: 'power1.inOut',
        onUpdate: function () {
          const progress = Math.round(this.progress() * 100);
          if (counterRef.current) counterRef.current.textContent = `${progress}%`;
        },
      },
      '+=0.1'
    )
    .to({}, { duration: 0.25 });
  }, []);

  // ── reveal prompt ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loadDone) return;
    if (counterRef.current) counterRef.current.textContent = '100%';

    const tl = gsap.timeline();

    // dim the logo + tagline so the card pops
    tl.to(
      [logoRef.current, taglineRef.current, barRef.current, counterRef.current],
      { opacity: 0.08, duration: 0.5, ease: 'power2.inOut' }
    )
    // backdrop overlay fades in first
    .fromTo(
      promptRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )
    // card slides up
    .fromTo(
      promptCardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' },
      '-=0.2'
    )
    // buttons stagger in
    .fromTo(
      [yesRef.current, noRef.current],
      { opacity: 0, y: 12, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)', stagger: 0.1 },
      '-=0.3'
    );
  }, [loadDone]);

  // ── exit ───────────────────────────────────────────────────────────────────
  const exitSplash = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.add('ready');
        onComplete?.();
      },
    });

    tl.to(
      promptCardRef.current,
      { opacity: 0, y: -16, scale: 0.97, duration: 0.35, ease: 'power2.in' }
    )
    .to(
      promptRef.current,
      { opacity: 0, duration: 0.25, ease: 'power2.in' },
      '-=0.2'
    )
    .to(
      splashRef.current,
      { yPercent: -100, duration: 1, ease: 'power4.inOut' },
      '-=0.1'
    );
  };

  // ── audio helpers ──────────────────────────────────────────────────────────
  const playClick = () => {
    if (!clickSfx.current) return;
    clickSfx.current.currentTime = 0;
    clickSfx.current.play().catch(() => {});
  };

  const handleHover = () => {
    if (!hoverSfx.current) return;
    hoverSfx.current.currentTime = 0;
    hoverSfx.current.play().catch(() => {});
  };

  const handleYes = () => {
    playClick();
    savePref(true);
    if (musicRef.current) musicRef.current.play().catch(() => {});
      window.bgMusic = musicRef.current; // global tracking for easy access in other components
    gsap.to(yesRef.current, {
      scale: 0.93, duration: 0.08, yoyo: true, repeat: 1, onComplete: exitSplash,
    });
  };

  const handleNo = () => {
    window.bgMusic = musicRef.current; // even if they choose no, we create the audio instance so we can control it globally (e.g. pause/play from a music toggle in the UI)
    playClick();
    savePref(false);
    gsap.to(noRef.current, {
      scale: 0.93, duration: 0.08, yoyo: true, repeat: 1, onComplete: exitSplash,
    });
  };

  return (
    <div
      ref={splashRef}
      className="fixed inset-0 z-[100] flex flex-col items-center
                 justify-center bg-[#0a0a0a] overflow-hidden"
    >
      {/* ── subtle grid ───────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,245,0,0.03) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(212,245,0,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── radial glow ───────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 50%,' +
            'rgba(212,245,0,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── logo ──────────────────────────────────────────────────── */}
      <h1
        ref={logoRef}
        className="relative font-display text-6xl md:text-8xl
                   tracking-[0.08em] text-white opacity-0 select-none z-10"
      >
        TONY<span className="text-[#d4f500]">MILANZI</span>
      </h1>

      {/* ── tagline ───────────────────────────────────────────────── */}
      <p
        ref={taglineRef}
        className="relative mt-4 text-sm tracking-[0.3em] uppercase
                   text-white/40 opacity-0 font-mono z-10"
      >
        Design · Development · Strategy
      </p>

      {/* ── loading bar ───────────────────────────────────────────── */}
      <div
        ref={barRef}
        className="relative mt-16 w-48 md:w-64 h-[1px]
                   bg-white/10 opacity-0 origin-left z-10"
      >
        <div
          ref={barFillRef}
          className="absolute top-0 left-0 h-full w-0 bg-[#d4f500]"
          style={{ boxShadow: '0 0 8px rgba(212,245,0,0.6)' }}
        />
      </div>

      {/* ── counter ───────────────────────────────────────────────── */}
      <span
        ref={counterRef}
        className="relative mt-3 text-xs tracking-widest text-white/30
                   font-mono tabular-nums z-10"
      >
        0%
      </span>

      {/* ═══════════════════════════════════════════════════════════
          SOUND PROMPT LAYER
          Full-screen semi-opaque backdrop + centred frosted card
      ════════════════════════════════════════════════════════════ */}
      <div
        ref={promptRef}
        className="absolute inset-0 z-20 flex items-center justify-center opacity-0"
        style={{ pointerEvents: loadDone ? 'auto' : 'none' }}
      >
        {/* ── full-screen vignette so logo behind is fully suppressed */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(10,10,10,0.82) 30%, rgba(10,10,10,0.97) 100%)',
          }}
        />

        {/* ── frosted glass card ──────────────────────────────────── */}
        <div
          ref={promptCardRef}
          className="relative flex flex-col items-center gap-8 px-10 py-12
                     opacity-0"
          style={{
            // layered backgrounds for depth
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)',
            backdropFilter:        'blur(28px) saturate(160%) brightness(0.6)',
            WebkitBackdropFilter:  'blur(28px) saturate(160%) brightness(0.6)',
            border:                '1px solid rgba(212,245,0,0.14)',
            borderRadius:           6,
            boxShadow:
              '0 0 0 1px rgba(0,0,0,0.6) inset,' +
              '0 32px 80px rgba(0,0,0,0.55),' +
              '0 0 60px rgba(212,245,0,0.04)',
            minWidth: 320,
            maxWidth: 400,
          }}
        >
          {/* inner top accent line */}
          <div
            className="absolute top-0 left-8 right-8 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(212,245,0,0.35), transparent)',
            }}
          />

          {/* ── icon ────────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full"
            style={{
              background: 'rgba(212,245,0,0.07)',
              border: '1px solid rgba(212,245,0,0.22)',
              boxShadow: '0 0 24px rgba(212,245,0,0.08)',
            }}
          >
            <svg
              width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="#d4f500" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </div>

          {/* ── copy ────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-2 text-center">
            <p
              className="text-white text-sm tracking-[0.35em] uppercase font-mono"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Enable Sound?
            </p>
            <p
              className="text-[10px] tracking-[0.2em] uppercase font-mono leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Background music &amp; UI audio
            </p>
          </div>

          {/* ── divider ─────────────────────────────────────────────── */}
          <div
            className="w-full h-px"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />

          {/* ── buttons ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-4 w-full">
            {/* YES */}
            <button
              ref={yesRef}
              onClick={handleYes}
              onMouseEnter={handleHover}
              className="group relative flex-1 flex items-center justify-center
                         gap-2 py-3 text-xs tracking-[0.35em] uppercase font-mono
                         overflow-hidden transition-colors duration-200"
              style={{
                border: '1px solid rgba(212,245,0,0.5)',
                color: '#d4f500',
                background: 'rgba(212,245,0,0.06)',
                borderRadius: 3,
              }}
            >
              {/* hover fill */}
              <span
                className="pointer-events-none absolute inset-0 origin-left
                           scale-x-0 group-hover:scale-x-100
                           transition-transform duration-300 ease-out"
                style={{ background: 'rgba(212,245,0,0.10)' }}
              />
              <svg
                width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className="relative"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <span className="relative">Yes</span>
            </button>

            {/* separator */}
            <span
              className="text-[10px] font-mono select-none"
              style={{ color: 'rgba(255,255,255,0.15)' }}
            >
              /
            </span>

            {/* NO */}
            <button
              ref={noRef}
              onClick={handleNo}
              onMouseEnter={handleHover}
              className="group relative flex-1 flex items-center justify-center
                         gap-2 py-3 text-xs tracking-[0.35em] uppercase font-mono
                         overflow-hidden transition-colors duration-200"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 3,
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 origin-left
                           scale-x-0 group-hover:scale-x-100
                           transition-transform duration-300 ease-out"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
              <svg
                width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className="relative"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9"  x2="17" y2="15" />
                <line x1="17" y1="9"  x2="23" y2="15" />
              </svg>
              <span className="relative">No</span>
            </button>
          </div>

          {/* ── hint ────────────────────────────────────────────────── */}
          <p
            className="text-[9px] tracking-[0.25em] uppercase font-mono"
            style={{ color: 'rgba(255,255,255,0.18)' }}
          >
            Preference saved for next visit
          </p>

          {/* inner bottom accent line */}
          <div
            className="absolute bottom-0 left-8 right-8 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;