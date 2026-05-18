import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// ─── Sound Preferences ───────────────────────────────────────────────────────
const PREF_KEY = 'tonymilanzi_sound';
const savePref = (val) => localStorage.setItem(PREF_KEY, val ? '1' : '0');

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

const SplashScreen = ({ onComplete }) => {
  const splashRef     = useRef(null);
  const tonyRef       = useRef(null);
  const milanziRef    = useRef(null);
  const taglineRef    = useRef(null);
  const barRef        = useRef(null);
  const barFillRef    = useRef(null);
  const counterRef    = useRef(null);
  const promptRef     = useRef(null);
  const promptCardRef = useRef(null);

  const clickSfx  = useRef(null);
  const hoverSfx  = useRef(null);
  const musicRef  = useRef(null);

  const [loadDone, setLoadDone] = useState(false);

  useEffect(() => {
    clickSfx.current = createAudio(AUDIO.click, { volume: 0.7 });
    hoverSfx.current = createAudio(AUDIO.hover, { volume: 0.4 });
    musicRef.current = createAudio(AUDIO.music, { volume: 0.15, loop: true });
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ 
      onComplete: () => setLoadDone(true) 
    });

    // 1. Reset positions
    gsap.set([tonyRef.current, milanziRef.current], { opacity: 1 });

    // 2. The Great Convergence
    tl.fromTo(
      tonyRef.current,
      { yPercent: -150, skewY: 10, filter: 'blur(10px)' },
      { yPercent: 0, skewY: 0, filter: 'blur(0px)', duration: 1.8, ease: 'expo.out' }
    )
    .fromTo(
      milanziRef.current,
      { yPercent: 150, skewY: -10, filter: 'blur(10px)' },
      { yPercent: 0, skewY: 0, filter: 'blur(0px)', duration: 1.8, ease: 'expo.out' },
      "<" // Start exactly at the same time as Tony
    )
    .fromTo(
      taglineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 0.5, y: 0, duration: 1, ease: 'power3.out' },
      "-=0.8"
    )
    .fromTo(
      barRef.current,
      { width: 0, opacity: 0 },
      { width: '240px', opacity: 1, duration: 0.8, ease: 'power4.inOut' },
      "-=1"
    )
    .to(
      barFillRef.current,
      {
        width: '100%',
        duration: 2,
        ease: 'slow(0.7, 0.7, false)',
        onUpdate: function () {
          const progress = Math.round(this.progress() * 100);
          if (counterRef.current) counterRef.current.textContent = `${progress}%`;
        },
      },
      "-=0.5"
    );
  }, []);

  useEffect(() => {
    if (!loadDone) return;

    const tl = gsap.timeline();
    // Push the names into the background depth
    tl.to([tonyRef.current, milanziRef.current, taglineRef.current, barRef.current, counterRef.current], {
      opacity: 0.03,
      scale: 0.92,
      duration: 1.5,
      ease: 'power4.inOut'
    })
    .fromTo(
      promptRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      "-=0.8"
    )
    .fromTo(
      promptCardRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out' },
      "-=0.5"
    );
  }, [loadDone]);

  const exitSplash = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.add('ready');
        onComplete?.();
      },
    });

    tl.to(promptCardRef.current, { opacity: 0, y: -20, duration: 0.6, ease: 'power4.in' })
      .to(splashRef.current, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.3');
  };

  const handleYes = () => {
    clickSfx.current?.play();
    savePref(true);
    if (musicRef.current) musicRef.current.play();
    window.bgMusic = musicRef.current;
    exitSplash();
  };

  const handleNo = () => {
    clickSfx.current?.play();
    savePref(false);
    window.bgMusic = musicRef.current;
    exitSplash();
  };

  return (
    <div ref={splashRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      
      {/* ── Massive Bold Typography ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <div className="flex flex-col items-center text-center overflow-hidden">
          <div className="overflow-hidden">
            <h1 
              ref={tonyRef} 
              className="text-white font-black leading-[0.75] tracking-tighter"
              style={{ fontSize: 'clamp(4rem, 16vw, 20rem)' }}
            >
              TONY
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 
              ref={milanziRef} 
              className="text-[#d4f500] font-black leading-[0.75] tracking-tighter"
              style={{ fontSize: 'clamp(4rem, 16vw, 20rem)' }}
            >
              MILANZI
            </h1>
          </div>
        </div>

       
  <p
  ref={taglineRef}
  className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
>
  Brand Strategist · Creative Technologist · Experience Architect
</p>

        
        <div ref={barRef} className="relative mt-12 h-[1px] bg-white/10 overflow-hidden">
          <div ref={barFillRef} className="absolute top-0 left-0 h-full w-0 bg-[#d4f500]" />
        </div>
        <span ref={counterRef} className="mt-4 font-mono text-[10px] text-white/20 tracking-widest">00%</span>
      </div>

      {/* ── Narrative Sound Prompt ── */}
      <div ref={promptRef} className="absolute inset-0 z-20 flex items-center justify-center opacity-0 bg-[#050505]/60 backdrop-blur-md">
        <div 
          ref={promptCardRef} 
          className="relative max-w-xl w-full px-12 py-16 text-center flex flex-col items-center gap-12"
        >
          {/* Minimal Audio Visualization */}
          <div className="flex gap-[3px] h-10 items-end">
            {[0.4, 0.7, 1, 0.6, 0.8, 0.5].map((h, i) => (
              <div 
                key={i} 
                className="w-1 bg-[#d4f500] shadow-[0_0_10px_#d4f500]" 
                style={{ 
                  height: `${h * 100}%`,
                  animation: `wave 1s ease-in-out infinite alternate ${i * 0.1}s` 
                }} 
              />
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-[#d4f500] font-mono text-[10px] tracking-[0.6em] uppercase">System Initialization</h2>
            <p className="text-white text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              This experience is <br />designed to be heard.
            </p>
            <p className="text-white/40 text-[11px] font-mono uppercase tracking-[0.2em] max-w-sm mx-auto leading-loose">
              Enable the soundscape to enhance the digital atmosphere.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 w-full max-w-xs">
            <button
              onClick={handleYes}
              onMouseEnter={() => hoverSfx.current?.play()}
              className="group relative w-full py-5 border border-[#d4f500] text-[#d4f500] text-[10px] font-mono uppercase tracking-[0.4em] rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,245,0,0.3)]"
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">Enable Sound</span>
              <div className="absolute inset-0 bg-[#d4f500] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
            </button>
            <button
              onClick={handleNo}
              onMouseEnter={() => hoverSfx.current?.play()}
              className="text-white/20 text-[9px] font-mono uppercase tracking-[0.3em] hover:text-white transition-colors"
            >
              Mute Experience
            </button>
          </div>
        </div>
      </div>

      {/* ── Grain Texture ── */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150 brightness-150" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave {
          from { transform: scaleY(0.5); }
          to { transform: scaleY(1.2); }
        }
        .ease-expo { transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); }
      `}} />
    </div>
  );
};

export default SplashScreen;