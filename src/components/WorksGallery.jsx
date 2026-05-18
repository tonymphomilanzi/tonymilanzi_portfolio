import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── CONFIGURATION ─────────────────────────────────────────────────────────
const GALLERY_CONFIG = {
  itemWidth: '30vw',       // Width of each project card
  itemHeight: '40vh',      // Height of each project card
  autoMove: true,          // Should it drift on its own?
  driftSpeedX: 0.4,        // Horizontal drift speed
  driftSpeedY: 0.2,        // Vertical drift speed
  friction: 0.08,          // Smoothness of the drag (lower = heavier)
  columnsPerBlock: 4,      // How many projects wide
  rowsPerBlock: 3,         // How many projects high
};

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
  const galleryWrapperRef = useRef(null);
  const gridRef = useRef(null);
  const hintRef = useRef(null);

  useGSAP(() => {
    // ─── 1. CURSOR HINT FOLLOW ───
    const moveHint = (e) => {
      const rect = sectionRef.current.getBoundingClientRect();
      gsap.to(hintRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out"
      });
    };
    window.addEventListener('mousemove', moveHint);

    // ─── 2. SCROLL ENTRY ───
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=120%",
      pin: true,
      animation: gsap.fromTo(galleryWrapperRef.current, 
        { scale: 0.8, rotationX: 25, opacity: 0, y: 200 },
        { scale: 1, rotationX: 0, opacity: 1, y: 0, ease: "power2.out" }
      ),
      scrub: 1,
    });

    // ─── 3. INFINITE PAN LOGIC ───
    const grid = gridRef.current;
    
    // Calculate Block Dimensions based on config
    const getBW = () => (window.innerWidth * parseFloat(GALLERY_CONFIG.itemWidth) / 100) * GALLERY_CONFIG.columnsPerBlock;
    const getBH = () => (window.innerHeight * parseFloat(GALLERY_CONFIG.itemHeight) / 100) * GALLERY_CONFIG.rowsPerBlock;

    let BW = getBW();
    let BH = getBH();

    let targetX = -BW;
    let targetY = -BH;
    let currentX = -BW;
    let currentY = -BH;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const onResize = () => { BW = getBW(); BH = getBH(); };
    window.addEventListener('resize', onResize);

    const ticker = () => {
      if (!isDragging && GALLERY_CONFIG.autoMove) {
        targetX -= GALLERY_CONFIG.driftSpeedX;
        targetY -= GALLERY_CONFIG.driftSpeedY;
      }

      // Wrapping logic
      if (targetX > 0) { targetX -= BW; currentX -= BW; }
      if (targetX < -BW * 2) { targetX += BW; currentX += BW; }
      if (targetY > 0) { targetY -= BH; currentY -= BH; }
      if (targetY < -BH * 2) { targetY += BH; currentY += BH; }

      currentX += (targetX - currentX) * GALLERY_CONFIG.friction;
      currentY += (targetY - currentY) * GALLERY_CONFIG.friction;

      gsap.set(grid, { x: currentX, y: currentY });
    };

    gsap.ticker.add(ticker);

    // ─── DRAG EVENTS ───
    const onPointerDown = (e) => {
      isDragging = true;
      startX = e.clientX - targetX;
      startY = e.clientY - targetY;
      gsap.to(hintRef.current, { scale: 0.8, opacity: 0.5, duration: 0.2 });
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      targetX = e.clientX - startX;
      targetY = e.clientY - startY;
    };

    const onPointerUp = () => {
      isDragging = false;
      gsap.to(hintRef.current, { scale: 1, opacity: 1, duration: 0.2 });
    };

    grid.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('mousemove', moveHint);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(ticker);
      grid.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-[#050505] overflow-hidden cursor-none">
      
      {/* ─── CUSTOM CURSOR HINT ─── */}
      <div 
        ref={hintRef} 
        className="fixed top-0 left-0 z-[110] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-10 h-10 border border-[#d4f500] rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4f500" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
                <path d="M9 18l6-6-6-6" className="opacity-30" />
            </svg>
        </div>
        <span className="font-mono text-[7px] text-[#d4f500] uppercase tracking-[0.3em] whitespace-nowrap bg-black/80 px-2 py-1">
            Drag to Explore
        </span>
      </div>

      {/* ─── STATIC UI ─── */}
      <div className="absolute top-12 left-12 z-[100] pointer-events-none">
        <h2 className="font-display text-5xl text-white tracking-tighter uppercase leading-[0.8]">
          Selected <br/><span className="text-[#d4f500]">Archives</span>
        </h2>
      </div>

      {/* ─── 3D GALLERY ─── */}
      <div ref={galleryWrapperRef} className="w-full h-full perspective-[2000px]" style={{ transformStyle: 'preserve-3d' }}>
        <div 
            ref={gridRef} 
            className="absolute top-0 left-0 flex flex-wrap will-change-transform"
            style={{ 
                width: `calc(${GALLERY_CONFIG.itemWidth} * ${GALLERY_CONFIG.columnsPerBlock} * 3)`, 
                height: `calc(${GALLERY_CONFIG.itemHeight} * ${GALLERY_CONFIG.rowsPerBlock} * 3)` 
            }}
        >
          {[...Array(9)].map((_, blockIdx) => (
            <div 
                key={blockIdx} 
                className="grid"
                style={{ 
                    width: `calc(${GALLERY_CONFIG.itemWidth} * ${GALLERY_CONFIG.columnsPerBlock})`, 
                    height: `calc(${GALLERY_CONFIG.itemHeight} * ${GALLERY_CONFIG.rowsPerBlock})`,
                    gridTemplateColumns: `repeat(${GALLERY_CONFIG.columnsPerBlock}, 1fr)`,
                    gridTemplateRows: `repeat(${GALLERY_CONFIG.rowsPerBlock}, 1fr)`
                }}
            >
              {projects.map((project, i) => (
                <div key={`${blockIdx}-${i}`} className="relative p-2 group">
                    <div className="w-full h-full bg-[#111] border border-white/5 relative overflow-hidden">
                        
                        {/* Media (GIF/IMG Support) */}
                        <img 
                            src={project.media} 
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none"
                        />

                        {/* Always Visible Labels */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
                            <div className="flex justify-between items-start">
                                <span className="font-mono text-[8px] text-white/40 tracking-[0.2em]">0{project.id}</span>
                                <div className="w-1.5 h-1.5 bg-[#d4f500] rounded-full shadow-[0_0_8px_#d4f500]" />
                            </div>

                            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="font-mono text-[7px] text-[#d4f500] tracking-[0.4em] uppercase mb-1 block opacity-70">
                                    {project.tag}
                                </span>
                                <h3 className="font-display text-3xl text-white uppercase tracking-tighter leading-none">
                                    {project.title}
                                </h3>
                            </div>
                        </div>

                        {/* Technical Overlay */}
                        <div className="absolute inset-0 border-[10px] border-transparent group-hover:border-[#d4f500]/5 transition-all duration-500 pointer-events-none" />
                    </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkGallery;