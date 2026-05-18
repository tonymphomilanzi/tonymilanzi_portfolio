import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MarqueeSection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { x: '60vw' },
      {
        x: '-250%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=4000',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      }
    );
  }, []);

  // ── Brand Positioning Copy ──
  const thePitch = [
    'Innovation Through Design',
    'Strategy Led Design',
    'Brand Systems That Scale',
    'Digital Experiences That Convert',
    'Visual Identity With Purpose',
    'Creative Direction & Motion',
    'Designing Brands For The Future',
    'Bold Storytelling',
    'Where Strategy Meets Aesthetics',
  ];

  // ── Marquee Row ──
  const MarqueeRow = ({ outlined = false }) => (
    <div
      className={`flex items-center gap-16 md:gap-24 py-2 ${
        outlined ? 'text-transparent' : 'text-white'
      }`}
      style={
        outlined
          ? { WebkitTextStroke: '1px rgba(255,255,255,0.15)' }
          : {}
      }
    >
      {[...Array(3)].map((_, groupIdx) => (
        <React.Fragment key={groupIdx}>
          {thePitch.map((text, i) => (
            <div
              key={`${groupIdx}-${i}`}
              className="flex items-center gap-16 md:gap-24"
            >
              <span className="font-display text-[16vw] md:text-[14vw] leading-[0.85] uppercase tracking-tighter whitespace-nowrap">
                {text}
              </span>

              <span className="text-[#d4f500] text-[10vw] md:text-[8vw] font-display opacity-30 select-none">
                /
              </span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] flex flex-col justify-center"
    >
      {/* ───────────────── Background Grid ───────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,245,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,245,0,0.5) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />

      {/* ───────────────── Gradient Overlays ───────────────── */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10" />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />

      {/* ───────────────── Moving Marquee ───────────────── */}
      <div
        ref={containerRef}
        className="flex flex-col gap-0 will-change-transform"
      >
        <MarqueeRow outlined={false} />
      </div>

      {/* ───────────────── Left Metadata ───────────────── */}
      <div className="absolute top-12 left-12 z-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#d4f500]" />

          <span className="font-mono text-[10px] text-[#d4f500] uppercase tracking-[0.5em]">
            The Proposition
          </span>
        </div>

        <p className="mt-2 font-mono text-[8px] text-white/20 uppercase tracking-[0.2em] max-w-[240px] leading-relaxed">
          Building modern brands through strategy, visual identity,
          digital experiences, motion, and marketing.
        </p>
      </div>

      {/* ───────────────── Right Metadata ───────────────── */}
      <div className="absolute bottom-12 right-12 z-20 text-right">
        <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em]">
          02 — Identity System
        </div>

        <div className="mt-1 font-mono text-[7px] text-[#d4f500]/40 uppercase tracking-[0.2em]">
          Strategy / Identity / Motion / Digital
        </div>
      </div>

      {/* ───────────────── Center Line ───────────────── */}
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#d4f500]/5" />
    </section>
  );
};

export default MarqueeSection;