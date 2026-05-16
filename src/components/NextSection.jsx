// NextSection.jsx
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NextSection = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const optionsRef = useRef([]);
  const rulersRef = useRef([]);

  useGSAP(() => {
    // Animate grid lines drawing (like a blueprint being sketched)
    gsap.fromTo(
      rulersRef.current,
      { strokeDasharray: 2000, strokeDashoffset: 2000 },
      {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut',
        delay: 0.2,
      }
    );

    // Stagger options fade in + scale up (like UI elements snapping into place)
    gsap.fromTo(
      optionsRef.current,
      { autoAlpha: 0, scale: 0.95, y: 20 },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.4)',
        stagger: 0.25,
        delay: 0.8,
      }
    );

    // Pin this section? No — let it scroll naturally, but add a subtle parallax on scroll
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        // Slight parallax on the grid as user scrolls through
        gsap.to(gridRef.current, {
          y: self.progress * 30,
          ease: 'none',
        });
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
    >
      {/* Grid background (faint) */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ background: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)' }} />

      {/* Ruler guides (SVG) */}
      <svg className="absolute inset-0 z-10 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        {/* Horizontal rulers */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <line
            key={`h-${percent}`}
            ref={(el) => (rulersRef.current[`h${percent}`] = el)}
            x1={0}
            y1={`${percent}%`}
            x2={100}
            y2={`${percent}%`}
            stroke="#d4f500"
            strokeWidth="1"
            strokeDasharray="2000"
            strokeDashoffset="2000"
          />
        ))}
        {/* Vertical rulers */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <line
            key={`v-${percent}`}
            ref={(el) => (rulersRef.current[`v${percent}`] = el)}
            x1={`${percent}%`}
            y1={0}
            x2={`${percent}%`}
            y2={100}
            stroke="#d4f500"
            strokeWidth="1"
            strokeDasharray="2000"
            strokeDashoffset="2000"
          />
        ))}
      </svg>

      {/* Options grid */}
      <div
        ref={gridRef}
        className="relative z-20 w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          {
            title: 'View My Works',
            desc: 'A curated selection of my projects, showcasing my design and development skills.',
            action: 'Explore',
          },
          {
            title: 'Get to Know Me',
            desc: 'Learn more about my background, my philosophy, and what drives my creativity.',
            action: 'Discover',
          },
          {
            title: 'Let\'s Create Something',
            desc: 'Start a conversation about your next big idea. Let’s turn it into reality.',
            action: 'Chat',
          },
        ].map((opt, i) => (
          <div
            ref={(el) => (optionsRef.current[i] = el)}
            key={i}
            className="group relative p-8 border border-[#333] bg-[#111] hover:border-[#d4f500] transition-all duration-300"
          >
            <div className="absolute top-2 left-2 text-xs text-[#d4f500] font-mono opacity-50">
              {i + 1}/3
            </div>
            <h3 className="text-2xl font-display text-white mb-4">{opt.title}</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">{opt.desc}</p>
            <button className="px-6 py-2 bg-[#d4f500] text-black font-bold hover:bg-[#b3c400] transition-colors">
              {opt.action}
            </button>
            {/* Marker at bottom-right */}
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#d4f500] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Measurement labels */}
      <div className="absolute top-4 left-4 text-xs text-[#d4f500] font-mono">
        <div>0px</div>
        <div>100px</div>
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-[#d4f500] font-mono">
        <div>100px</div>
        <div>0px</div>
      </div>
    </section>
  );
};

export default NextSection;