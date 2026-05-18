import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── CONFIGURATION ─────────────────────────────────────────────────────────
const GALLERY_CONFIG = {
  itemWidth: '30vw',       
  itemHeight: '40vh',      
  mobileItemDim: '70vw',   // Square dimension for mobile
  autoMove: true,          
  driftSpeedX: 0.4,        
  driftSpeedY: 0.2,        
  friction: 0.08,          
  columnsPerBlock: 4,      
  rowsPerBlock: 3,         
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
  const [isMobile, setIsMobile] = useState(false);

  // Handle Responsive Check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(() => {
    // ─── 1. CURSOR HINT FOLLOW (Desktop Only) ───
    const moveHint = (e) => {
      if (isMobile) return;
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
    
    // Calculate Responsive Dimensions
    const getBW = () => {
        const val = isMobile ? GALLERY_CONFIG.mobileItemDim : GALLERY_CONFIG.itemWidth;
        return (window.innerWidth * parseFloat(val) / 100) * GALLERY_CONFIG.columnsPerBlock;
    }
    const getBH = () => {
        const val = isMobile ? GALLERY_CONFIG.mobileItemDim : GALLERY_CONFIG.itemHeight;
        return (isMobile ? window.innerWidth : window.innerHeight) * (parseFloat(val) / 100) * GALLERY_CONFIG.rowsPerBlock;
    }

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

      if (targetX > 0) { targetX -= BW; currentX -= BW; }
      if (targetX < -BW * 2) { targetX += BW; currentX += BW; }
      if (targetY > 0) { targetY -= BH; currentY -= BH; }
      if (targetY < -BH * 2) { targetY += BH; currentY += BH; }

      currentX += (targetX - currentX) * GALLERY_CONFIG.friction;
      currentY += (targetY - currentY) * GALLERY_CONFIG.friction;

      gsap.set(grid, { x: currentX, y: currentY });
    };

    gsap.ticker.add(ticker);

    const onPointerDown = (e) => {
      isDragging = true;
      startX = (e.clientX || e.touches?.[0].clientX) - targetX;
      startY = (e.clientY || e.touches?.[0].clientY) - targetY;
      if (!isMobile) gsap.to(hintRef.current, { scale: 0.8, opacity: 0.5, duration: 0.2 });
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      targetX = (e.clientX || e.touches?.[0].clientX) - startX;
      targetY = (e.clientY || e.touches?.[0].clientY) - startY;
    };

    const onPointerUp = () => {
      isDragging = false;
      if (!isMobile) gsap.to(hintRef.current, { scale: 1, opacity: 1, duration: 0.2 });
    };

    grid.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    // Touch support explicitly
    grid.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    return () => {
      window.removeEventListener('mousemove', moveHint);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(ticker);
      grid.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [isMobile]); // Re-run when switching mobile/desktop

  const itemW = isMobile ? GALLERY_CONFIG.mobileItemDim : GALLERY_CONFIG.itemWidth;
  const itemH = isMobile ? GALLERY_CONFIG.mobileItemDim : GALLERY_CONFIG.itemHeight;

  return (
    <section ref={sectionRef} className={`relative w-full h-screen bg-[#050505] overflow-hidden ${isMobile ? '' : 'cursor-none'}`}>
      
      {/* ─── RESPONSIVE HINT ─── */}
      <div 
        ref={hintRef} 
        className={`${isMobile 
            ? 'fixed bottom-10 left-1/2 -translate-x-1/2 flex-row border border-[#d4f500]/20 rounded-full px-4 py-2' 
            : 'fixed top-0 left-0 flex-col -translate-x-1/2 -translate-y-1/2'} 
            z-[110] pointer-events-none flex items-center gap-2 transition-all duration-300`}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 border border-[#d4f500] rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4f500" strokeWidth="2" className={isMobile ? 'animate-pulse' : ''}>
                <path d="M15 18l-6-6 6-6" />
                <path d="M9 18l6-6-6-6" className="opacity-30" />
            </svg>
        </div>
        <span className="font-mono text-[7px] text-[#d4f500] uppercase tracking-[0.3em] whitespace-nowrap bg-black/80 px-2 py-1">
            {isMobile ? 'Swipe to Explore' : 'Drag to Explore'}
        </span>
      </div>

      <div className="absolute top-10 left-10 md:top-12 md:left-12 z-[100] pointer-events-none">
        <h2 className="font-display text-4xl md:text-5xl text-white tracking-tighter uppercase leading-[0.8]">
          Selected <br/><span className="text-[#d4f500]">Archives</span>
        </h2>
      </div>

      <div ref={galleryWrapperRef} className="w-full h-full perspective-[2000px]" style={{ transformStyle: 'preserve-3d' }}>
        <div 
            ref={gridRef} 
            className="absolute top-0 left-0 flex flex-wrap will-change-transform"
            style={{ 
                width: `calc(${itemW} * ${GALLERY_CONFIG.columnsPerBlock} * 3)`, 
                height: `calc(${itemH} * ${GALLERY_CONFIG.rowsPerBlock} * 3)` 
            }}
        >
          {[...Array(9)].map((_, blockIdx) => (
            <div 
                key={blockIdx} 
                className="grid"
                style={{ 
                    width: `calc(${itemW} * ${GALLERY_CONFIG.columnsPerBlock})`, 
                    height: `calc(${itemH} * ${GALLERY_CONFIG.rowsPerBlock})`,
                    gridTemplateColumns: `repeat(${GALLERY_CONFIG.columnsPerBlock}, 1fr)`,
                    gridTemplateRows: `repeat(${GALLERY_CONFIG.rowsPerBlock}, 1fr)`
                }}
            >
              {projects.map((project, i) => (
                <div key={`${blockIdx}-${i}`} className="relative p-1 md:p-2 group">
                    <div className="w-full h-full bg-[#111] border border-white/5 relative overflow-hidden">
                        <img 
                            src={project.media} 
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none"
                        />
                        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10 pointer-events-none">
                            <div className="flex justify-between items-start">
                                <span className="font-mono text-[8px] text-white/40 tracking-[0.2em]">0{project.id}</span>
                                <div className="w-1.5 h-1.5 bg-[#d4f500] rounded-full shadow-[0_0_8px_#d4f500]" />
                            </div>
                            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="font-mono text-[7px] text-[#d4f500] tracking-[0.4em] uppercase mb-1 block opacity-70">
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
    </section>
  );
};

export default WorkGallery;