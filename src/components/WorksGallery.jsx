import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ──────────────────────────────────────────────────────────────────
const projects = [
  { id: '01', title: 'AURA', tag: 'Web / WebGL', media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGJxeXNwaHlyZ2N6bmJ6YXR3YmJ6bmJ6YXR3YmJ6bmJ6YXR3YmJ6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxZESnlIQg/giphy.gif' },
  { id: '02', title: 'NEXUS', tag: 'Identity', media: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600' },
  { id: '03', title: 'LUMINA', tag: 'E-Commerce', media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGJxeXNwaHlyZ2N6bmJ6YXR3YmJ6bmJ6YXR3YmJ6bmJ6YXR3YmJ6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lTfuxZ75zC0nSg/giphy.gif' },
  { id: '04', title: 'ECHO', tag: '3D Motion', media: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600' },
  { id: '05', title: 'SYNTH', tag: 'UI System', media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGJxeXNwaHlyZ2N6bmJ6YXR3YmJ6bmJ6YXR3YmJ6bmJ6YXR3YmJ6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif' },
  { id: '06', title: 'VERTEX', tag: 'Branding', media: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600' },
  { id: '07', title: 'QUANTUM', tag: 'Spatial', media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600' },
  { id: '08', title: 'PULSE', tag: 'App Design', media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGJxeXNwaHlyZ2N6bmJ6YXR3YmJ6bmJ6YXR3YmJ6bmJ6YXR3YmJ6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/xT9IgN8YKUIqYIK4Jq/giphy.gif' },
  { id: '09', title: 'CRUX', tag: 'Campaign', media: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600' },
  { id: '10', title: 'OMNI', tag: 'Platform', media: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600' },
  { id: '11', title: 'FLUX', tag: 'Identity', media: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600' },
  { id: '12', title: 'NOVA', tag: 'Motion', media: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600' },
];

const WorkGallery = () => {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const gridRef = useRef(null);
  const hintRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // ─── CONFIG ───
  // Using State to handle window-dependent units
  const [layout, setLayout] = useState({
    itemDim: 0, 
    cols: 4, 
    rows: 3, 
    speed: 0.4
  });

  useEffect(() => {
    const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        setLayout({
            itemDim: mobile ? window.innerWidth * 0.7 : window.innerWidth * 0.25,
            cols: mobile ? 2 : 4,
            rows: mobile ? 6 : 3,
            speed: mobile ? 0.2 : 0.4
        });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    if (layout.itemDim === 0) return;

    // ─── 1. HINT ANIMATION (Desktop Cursor Follow) ───
    if (!isMobile) {
        const moveHint = (e) => {
            gsap.to(hintRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.7,
                ease: "power3.out"
            });
        };
        window.addEventListener('mousemove', moveHint);
        return () => window.removeEventListener('mousemove', moveHint);
    }

    // ─── 2. SCROLL ENTRY ───
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=150%",
      pin: true,
      animation: gsap.fromTo(wrapperRef.current, 
        { scale: 0.8, rotationX: 15, opacity: 0, y: 100 },
        { scale: 1, rotationX: 0, opacity: 1, y: 0, ease: "power2.out" }
      ),
      scrub: 1,
    });

    // ─── 3. INFINITE PAN ───
    const grid = gridRef.current;
    const BW = layout.itemDim * layout.cols;
    const BH = layout.itemDim * layout.rows;

    let targetX = -BW, targetY = -BH;
    let currentX = -BW, currentY = -BH;
    let isDragging = false, startX = 0, startY = 0;

    const ticker = () => {
      if (!isDragging) {
        targetX -= layout.speed;
        targetY -= layout.speed * 0.5;
      }

      if (targetX > 0) { targetX -= BW; currentX -= BW; }
      if (targetX < -BW * 2) { targetX += BW; currentX += BW; }
      if (targetY > 0) { targetY -= BH; currentY -= BH; }
      if (targetY < -BH * 2) { targetY += BH; currentY += BH; }

      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      gsap.set(grid, { x: currentX, y: currentY });
    };

    gsap.ticker.add(ticker);

    const onDown = (e) => {
      isDragging = true;
      const x = e.clientX || e.touches[0].clientX;
      const y = e.clientY || e.touches[0].clientY;
      startX = x - targetX;
      startY = y - targetY;
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      const y = e.clientY || (e.touches ? e.touches[0].clientY : 0);
      targetX = x - startX;
      targetY = y - startY;
    };
    const onUp = () => isDragging = false;

    grid.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      gsap.ticker.remove(ticker);
      grid.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [layout, isMobile]);

  return (
    <section ref={sectionRef} className={`relative w-full h-screen bg-[#050505] overflow-hidden ${isMobile ? '' : 'cursor-none'}`}>
      
      {/* ─── NAVIGATION HINT ─── */}
      <div 
        ref={hintRef} 
        className={`${isMobile 
            ? 'fixed bottom-10 left-1/2 -translate-x-1/2 flex-row border-t border-b border-[#d4f500]/20 py-2' 
            : 'fixed top-0 left-0 flex-col -translate-x-1/2 -translate-y-1/2'} 
            z-[110] pointer-events-none flex items-center gap-3 transition-opacity duration-500`}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 border border-[#d4f500] rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4f500" strokeWidth="2" className={isMobile ? 'animate-pulse' : ''}>
                <path d="M15 18l-6-6 6-6" />
                <path d="M9 18l6-6-6-6" className="opacity-30" />
            </svg>
        </div>
        <span className="font-mono text-[7px] md:text-[8px] text-[#d4f500] uppercase tracking-[0.4em] whitespace-nowrap bg-black/80 px-3 py-1.5 rounded-sm">
            {isMobile ? 'Swipe to explore' : 'Drag to explore'}
        </span>
      </div>

      {/* ─── STATIC UI ─── */}
      <div className="absolute top-10 left-8 md:top-16 md:left-16 z-[100] pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-[#d4f500] rounded-full shadow-[0_0_10px_#d4f500]" />
            <span className="font-mono text-[8px] text-[#d4f500] tracking-[0.3em] uppercase">Archive_Map.v2</span>
        </div>
        <h2 className="font-display text-4xl md:text-7xl text-white tracking-tighter uppercase leading-[0.8] mix-blend-difference">
          Selected <br/><span className="text-white/20">Works</span>
        </h2>
      </div>

      {/* ─── 3D GALLERY WRAPPER ─── */}
      <div ref={wrapperRef} className="w-full h-full perspective-[2000px]" style={{ transformStyle: 'preserve-3d' }}>
        <div 
            ref={gridRef} 
            className="absolute top-0 left-0 flex flex-wrap will-change-transform"
            style={{ 
                width: layout.itemDim * layout.cols * 3, 
                height: layout.itemDim * layout.rows * 3 
            }}
        >
          {[...Array(9)].map((_, blockIdx) => (
            <div 
                key={blockIdx} 
                className="grid"
                style={{ 
                    width: layout.itemDim * layout.cols, 
                    height: layout.itemDim * layout.rows,
                    gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${layout.rows}, 1fr)`
                }}
            >
              {projects.map((project, i) => (
                <div 
                    key={`${blockIdx}-${i}`} 
                    className="relative p-1.5 md:p-2 group active:scale-95 transition-transform duration-300"
                    style={{ width: layout.itemDim, height: layout.itemDim }}
                >
                    <div className="w-full h-full bg-[#111] border border-white/5 relative overflow-hidden group-hover:border-[#d4f500]/40 transition-colors duration-500">
                        <img 
                            src={project.media} 
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-700 pointer-events-none group-hover:scale-110 group-hover:opacity-100"
                        />
                        
                        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10 pointer-events-none">
                            <div className="flex justify-between items-start">
                                <span className="font-mono text-[7px] text-white/40 tracking-[0.2em]">{project.id}</span>
                                <div className="w-1.5 h-1.5 border border-[#d4f500] rotate-45" />
                            </div>

                            <div className="bg-black/40 backdrop-blur-sm p-3 -mx-4 -mb-4 border-t border-white/5">
                                <span className="font-mono text-[6px] text-[#d4f500] tracking-[0.4em] uppercase mb-1 block">
                                    {project.tag}
                                </span>
                                <h3 className="font-display text-xl md:text-3xl text-white uppercase tracking-tighter leading-none">
                                    {project.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── DECORATIVE CORNER ─── */}
      <div className="absolute bottom-8 right-8 z-[100] hidden md:block">
        <div className="flex items-center gap-4 font-mono text-[7px] text-white/20 tracking-[1em] uppercase">
            <span>Selected Works</span>
            <div className="w-12 h-px bg-white/10" />
            <span></span>
        </div>
      </div>
    </section>
  );
};

export default WorkGallery;