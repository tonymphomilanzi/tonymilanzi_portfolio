import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── NEW: CUSTOM CURSOR COMPONENT ───────────────────────────────────────────
const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const labelRef = useRef(null);

    useGSAP(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;
        
        // QuickTo is more optimized for high-frequency updates like mouse moves
        const xTo = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3.out" });
        
        const xTargetTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "none" });
        const yTargetTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "none" });

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            xTo(clientX);
            yTo(clientY);
            xTargetTo(clientX);
            yTargetTo(clientY);
            
            if (labelRef.current) {
                labelRef.current.innerText = `${Math.round(clientX)},${Math.round(clientY)}`;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <>
            {/* The lagging circle */}
            <div 
                ref={followerRef} 
                className="fixed top-0 left-0 w-12 h-12 border border-[#d4f500]/30 rounded-full pointer-events-none z-[9999] -ml-6 -mt-6 flex items-center justify-center transition-opacity duration-300"
            >
                {/* Internal crosshair */}
                <div className="w-[1px] h-2 bg-[#d4f500]/20 absolute top-0" />
                <div className="w-[1px] h-2 bg-[#d4f500]/20 absolute bottom-0" />
                <div className="h-[1px] w-2 bg-[#d4f500]/20 absolute left-0" />
                <div className="h-[1px] w-2 bg-[#d4f500]/20 absolute right-0" />
            </div>

            {/* The sharp point and coordinates */}
            <div ref={cursorRef} className="fixed top-0 left-0 pointer-events-none z-[9999] -ml-1 -mt-1">
                <div className="w-2 h-2 bg-[#d4f500] rounded-full shadow-[0_0_10px_#d4f500]" />
                <div ref={labelRef} className="ml-4 mt-2 font-mono text-[7px] text-[#d4f500] opacity-50 uppercase tracking-tighter" />
            </div>
        </>
    );
};

// ─── Ruler Grid Background ───────────────────────────────────────────────────
const RulerGrid = () => {
    const STEP = 80;
    const TICK_SMALL = 6;
    const TICK_MID = 10;
    const TICK_LARGE = 14;
    const COLS = Math.ceil(1920 / STEP) + 2;
    const ROWS = Math.ceil(1080 / STEP) + 2;
  
    return (
      <svg className="pointer-events-none absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.15 }} aria-hidden>
        <defs>
          <pattern id="cell" x="0" y="0" width={STEP} height={STEP} patternUnits="userSpaceOnUse">
            <rect width={STEP} height={STEP} fill="none" />
            <line x1={STEP} y1="0" x2={STEP} y2={STEP} stroke="#d4f500" strokeWidth="0.35" />
            <line x1="0" y1={STEP} x2={STEP} y2={STEP} stroke="#d4f500" strokeWidth="0.35" />
            <line x1={STEP / 2} y1="0" x2={STEP / 2} y2={TICK_MID} stroke="#d4f500" strokeWidth="0.5" />
            <line x1={STEP / 2} y1={STEP} x2={STEP / 2} y2={STEP - TICK_MID} stroke="#d4f500" strokeWidth="0.5" />
            <line x1={STEP / 4} y1="0" x2={STEP / 4} y2={TICK_SMALL} stroke="#d4f500" strokeWidth="0.4" />
            <line x1={(STEP * 3) / 4} y1="0" x2={(STEP * 3) / 4} y2={TICK_SMALL} stroke="#d4f500" strokeWidth="0.4" />
            <line x1="0" y1={STEP / 2} x2={TICK_MID} y2={STEP / 2} stroke="#d4f500" strokeWidth="0.5" />
            <line x1={STEP} y1={STEP / 2} x2={STEP - TICK_MID} y2={STEP / 2} stroke="#d4f500" strokeWidth="0.5" />
            <line x1="0" y1={STEP / 4} x2={TICK_SMALL} y2={STEP / 4} stroke="#d4f500" strokeWidth="0.4" />
            <line x1="0" y1={(STEP * 3) / 4} x2={TICK_SMALL} y2={(STEP * 3) / 4} stroke="#d4f500" strokeWidth="0.4" />
            <circle cx={STEP} cy={STEP} r="1.2" fill="#d4f500" opacity="0.5" />
          </pattern>
          {/* patterns remain the same */}
          <pattern id="rulerTop" x="0" y="0" width={STEP} height="24" patternUnits="userSpaceOnUse">
            <rect width={STEP} height="24" fill="#0a0a0a" />
            <line x1={STEP} y1="0" x2={STEP} y2="24" stroke="#d4f500" strokeWidth="0.4" />
            <line x1={STEP / 2} y1="24" x2={STEP / 2} y2={24 - TICK_MID} stroke="#d4f500" strokeWidth="0.5" />
            <line x1={STEP / 4} y1="24" x2={STEP / 4} y2={24 - TICK_SMALL} stroke="#d4f500" strokeWidth="0.4" />
            <line x1={(STEP * 3) / 4} y1="24" x2={(STEP * 3) / 4} y2={24 - TICK_SMALL} stroke="#d4f500" strokeWidth="0.4" />
            <line x1={STEP} y1="24" x2={STEP} y2={24 - TICK_LARGE} stroke="#d4f500" strokeWidth="0.7" />
          </pattern>
          <pattern id="rulerLeft" x="0" y="0" width="24" height={STEP} patternUnits="userSpaceOnUse">
            <rect width="24" height={STEP} fill="#0a0a0a" />
            <line x1="0" y1={STEP} x2="24" y2={STEP} stroke="#d4f500" strokeWidth="0.4" />
            <line x1="24" y1={STEP / 2} x2={24 - TICK_MID} y2={STEP / 2} stroke="#d4f500" strokeWidth="0.5" />
            <line x1="24" y1={STEP / 4} x2={24 - TICK_SMALL} stroke="#d4f500" strokeWidth="0.4" />
            <line x1="24" y1={(STEP * 3) / 4} x2={24 - TICK_SMALL} stroke="#d4f500" strokeWidth="0.4" />
            <line x1="24" y1={STEP} x2={24 - TICK_LARGE} stroke="#d4f500" strokeWidth="0.7" />
          </pattern>
          <radialGradient id="fadeOut" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="60%" stopColor="white" stopOpacity="0.07" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="gridMask">
            <rect width="100%" height="100%" fill="url(#fadeOut)" />
          </mask>
        </defs>
        <g mask="url(#gridMask)"><rect width="100%" height="100%" fill="url(#cell)" /></g>
        <rect x="0" y="0" width="100%" height="24" fill="url(#rulerTop)" opacity="0.55" />
        <rect x="0" y="0" width="24" height="100%" fill="url(#rulerLeft)" opacity="0.55" />
        <line x1="0" y1="24" x2="100%" y2="24" stroke="#d4f500" strokeWidth="0.6" opacity="0.4" />
        <line x1="24" y1="0" x2="24" y2="100%" stroke="#d4f500" strokeWidth="0.6" opacity="0.4" />
        <rect x="0" y="0" width="24" height="24" fill="#0a0a0a" />
        <circle cx="12" cy="12" r="2.5" fill="#d4f500" opacity="0.4" />
        {Array.from({ length: Math.ceil(COLS / 2) }, (_, i) => {
          const x = (i + 1) * STEP * 2;
          return <text key={`col-${i}`} x={x + 3} y="16" fontSize="7" fill="#d4f500" opacity="0.55" fontFamily="monospace">{x}</text>;
        })}
        {Array.from({ length: Math.ceil(ROWS / 2) }, (_, i) => {
          const y = (i + 1) * STEP * 2;
          return <text key={`row-${i}`} x="2" y={y - 3} fontSize="7" fill="#d4f500" opacity="0.55" fontFamily="monospace" transform={`rotate(-90, 2, ${y - 3})`}>{y}</text>;
        })}
      </svg>
    );
  };

// (TiltImage, ProjectGallery, TiltText, MusicWave remain unchanged)
const TiltImage = ({ src }) => {
    const imgRef = useRef(null);
    const onMove = (e) => {
      const el = imgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      gsap.to(el, { rotateX: -ny * 12, rotateY: nx * 12, scale: 1.05, opacity: 0.35, duration: 0.4 });
    };
    const onLeave = () => {
      gsap.to(imgRef.current, { rotateX: 0, rotateY: 0, scale: 1, opacity: 0.1, duration: 0.8 });
    };
    return (
      <div ref={imgRef} onPointerMove={onMove} onPointerLeave={onLeave} className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-white/5" style={{ opacity: 0.1, filter: 'grayscale(100%)', transformStyle: 'preserve-3d', perspective: '1000px' }}>
        <img src={src} alt="Project" className="w-full h-full object-cover pointer-events-none" />
      </div>
    );
};

const ProjectGallery = () => {
    const images = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400",
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=400",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400",
    ];
    return (
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-6 gap-4 px-12 py-20 pointer-events-auto">
        {images.map((src, i) => (
          <div key={i} className={`flex flex-col gap-4 ${i % 2 === 0 ? 'mt-20' : 'mt-0'}`}>
            <TiltImage src={src} />
            <TiltImage src={images[(i + 1) % 6]} />
          </div>
        ))}
      </div>
    );
};

const TiltText = ({ children, className, style }) => {
    const wrapRef = useRef(null);
    const onMove = useCallback((e) => {
      const el = wrapRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      gsap.to(el, { rotateX: -ny * 4, rotateY: nx * 4, x: nx * 6, y: ny * 4, duration: 0.45, ease: 'power2.out', transformPerspective: 900 });
    }, []);
    const onLeave = useCallback(() => {
      gsap.to(wrapRef.current, { rotateX: 0, rotateY: 0, x: 0, y: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    }, []);
    return (<h1 ref={wrapRef} className={className} style={{...style, willChange: 'transform', transformStyle: 'preserve-3d'}} onPointerMove={onMove} onPointerLeave={onLeave}>{children}</h1>);
};

const MusicWave = () => {
    const [isMuted, setIsMuted] = useState(false);
    const barsRef = useRef([]);

    useEffect(() => {
        if (window.bgMusic) {
            setIsMuted(window.bgMusic.muted || window.bgMusic.paused);
        }
    }, []);

    const toggleMusic = () => {
        const audio = window.bgMusic;
        if (!audio) return;
        if (audio.paused) {
            audio.play().catch(e => console.log("Playback failed", e));
            audio.muted = false;
            setIsMuted(false);
        } else {
            const newMuteState = !audio.muted;
            audio.muted = newMuteState;
            setIsMuted(newMuteState);
        }
    };

    useGSAP(() => {
        if (!isMuted) {
            barsRef.current.forEach((bar, i) => {
                gsap.to(bar, { scaleY: "random(0.3, 1.2)", duration: 0.4, repeat: -1, yoyo: true, delay: i * 0.1, ease: "sine.inOut" });
            });
        } else {
            gsap.killTweensOf(barsRef.current);
            gsap.to(barsRef.current, { scaleY: 0.1, duration: 0.5, ease: "power2.out" });
        }
    }, [isMuted]);

    return (
        <div onClick={toggleMusic} className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 cursor-pointer group select-none">
            <div className="flex flex-col items-end">
                <span className="font-mono text-[8px] tracking-[0.3em] text-[#d4f500] uppercase transition-opacity group-hover:opacity-70">{isMuted ? 'Unmute' : 'Mute'}</span>
                <span className="font-mono text-[6px] tracking-[0.1em] text-white/20 uppercase">Soundscape</span>
            </div>
            <div className="flex items-end gap-[3px] h-5 w-8 justify-center">
                {[...Array(5)].map((_, i) => (
                    <div key={i} ref={el => barsRef.current[i] = el} className="w-[2px] bg-[#d4f500] origin-bottom shadow-[0_0_8px_#d4f500]" style={{height:'100%'}}/>
                ))}
            </div>
        </div>
    );
};

const PANELS = [
    { top: 'CREATING', topAccent: false, bottom: 'HUMAN', bottomAccent: true, tag: 'Brand Strategist · Digital Marketer' },
    { top: 'CENTRIC',  topAccent: true, bottom: 'DESIGN', bottomAccent: false, tag: 'Web · Graphic · Mobile UI/UX' },
    { top: 'DIGITAL',  topAccent: false, bottom: 'EXPERIENCES', bottomAccent: true, tag: 'App Design · Motion · Systems' },
];

const Hero = () => {
  const sectionRef = useRef(null);
  const panelsRef  = useRef([]);
  const galleryRef = useRef(null);
  const scrollHintRef = useRef(null);
  const scrollHintIndicatorRef = useRef(null);

  useGSAP(() => {
    // Indicator Animation for the Scroll Hint
    if (scrollHintIndicatorRef.current) {
        gsap.fromTo(scrollHintIndicatorRef.current,
            { y: 0, opacity: 0.4 },
            { y: 80, opacity: 1, duration: 1.5, ease: 'power1.inOut', repeat: -1, yoyo: true }
        );
    }

    gsap.to(galleryRef.current, { yPercent: -10, scrollTrigger: { trigger: sectionRef.current, scrub: true } });
    const panels = panelsRef.current.filter(Boolean);
    gsap.set(panels, { autoAlpha: 0 }); gsap.set(panels[0], { autoAlpha: 1 });
    const tl = gsap.timeline();
    for (let i = 0; i < panels.length - 1; i++) {
      tl.to(panels[i], { autoAlpha: 0, duration: 0.4 }, i);
      tl.to(panels[i+1], { autoAlpha: 1, duration: 0.5 }, i + 0.15);
    }

    ScrollTrigger.create({ 
        trigger: sectionRef.current, 
        start: 'top top', 
        end: () => `+=${(panels.length - 1) * window.innerHeight}`, 
        pin: true, 
        animation: tl, 
        scrub: 0.9, 
        snap: 1 / (panels.length - 1),
        onUpdate: (self) => {
            if (self.progress > 0.01 && scrollHintRef.current) {
                gsap.to(scrollHintRef.current, { autoAlpha: 0, x: 20, duration: 0.3, overwrite: true });
            } else if (self.progress <= 0.01 && scrollHintRef.current) {
                gsap.to(scrollHintRef.current, { autoAlpha: 1, x: 0, duration: 0.3, overwrite: true });
            }
        }
    });
  }, []);

  return (
    <section ref={sectionRef} className="hero-section relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* ─── ADDED CUSTOM CURSOR ─── */}
      <CustomCursor />
      
      <MusicWave />

      <div ref={galleryRef} className="absolute inset-0 z-[1] will-change-transform">
        <ProjectGallery />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2]">
        <RulerGrid />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[3]" 
           style={{ background: 'radial-gradient(circle at center, transparent 0%, #0a0a0a 85%)' }} />

      <div className="absolute inset-0 z-10 pointer-events-none">
        {PANELS.map((panel, i) => (
          <div key={i} ref={(el) => (panelsRef.current[i] = el)} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-4">
            <div className="text-[10px] tracking-[0.4em] uppercase font-mono mb-2 text-[#d4f500]/50">{panel.tag}</div>
            <div className="pointer-events-auto">
                <TiltText className="font-display leading-[0.88] uppercase tracking-tight text-white select-none" style={{ fontSize: 'clamp(3.5rem, 16vw, 14rem)' }}>
                    <span data-accent={panel.topAccent} style={{ color: panel.topAccent ? '#d4f500' : 'white' }}>{panel.top}</span><br />
                    <span data-accent={panel.bottomAccent} style={{ color: panel.bottomAccent ? '#d4f500' : 'white' }}>{panel.bottom}</span>
                </TiltText>
            </div>
            <div className="mt-4 px-3 py-1 border border-[#d4f500]/20 text-[9px] tracking-[0.3em] uppercase text-[#d4f500]/40 font-mono">0{i+1} / 03</div>
          </div>
        ))}
      </div>

      {/* ─── VERTICAL SCROLL RULER (ON RIGHT) ─── */}
      <div 
        ref={scrollHintRef} 
        className="fixed right-10 top-1/2 -translate-y-1/2 z-[50] flex items-center gap-4 select-none pointer-events-none group"
      >
        <div className="flex flex-col items-center gap-2">
            <span className="text-[7px] font-mono text-[#d4f500]/40 tracking-widest uppercase [writing-mode:vertical-lr] rotate-180">Measurement</span>
            <div className="w-[1px] h-8 bg-[#d4f500]/20" />
            <span className="text-[9px] font-mono text-[#d4f500] uppercase [writing-mode:vertical-lr] rotate-180 tracking-[0.6em] font-bold">Scroll</span>
        </div>

        <div className="relative h-[120px] w-6 flex items-start justify-end pr-1 border-r border-[#d4f500]/20">
            {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="absolute right-0 bg-[#d4f500]/40" style={{ top: `${(i * 10)}%`, height: '1px', width: i % 4 === 0 ? '8px' : '4px', opacity: i % 4 === 0 ? 0.6 : 0.3 }} />
            ))}
            <div className="absolute -right-10 top-0 text-[6px] font-mono text-[#d4f500]/30">Y.00</div>
            <div className="absolute -right-10 bottom-0 text-[6px] font-mono text-[#d4f500]/30">Y.99</div>
            <div ref={scrollHintIndicatorRef} className="absolute right-[-4px] top-0 flex items-center">
                <div className="w-4 h-[1px] bg-[#d4f500] shadow-[0_0_10px_#d4f500]" />
                <div className="ml-1 text-[7px] font-mono text-[#d4f500] opacity-80">POS_LVL</div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;