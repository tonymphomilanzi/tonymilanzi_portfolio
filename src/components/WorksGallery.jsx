import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom'; 

gsap.registerPlugin(ScrollTrigger);

const GALLERY_CONFIG = {
  itemWidth: '30vw',       
  itemHeight: '40vh',      
  mobileItemDim: '75vw',   
  autoMove: true,          
  driftSpeedX: 0.3,        
  driftSpeedY: 0.15,        
  friction: 0.12,          
  columnsPerBlock: 4,      
  rowsPerBlock: 3,         
};

const projects = [
    { id: '01', slug: 'aura', title: 'AURA', tag: 'Web / WebGL', media: 'assets/projects/1.png' },
    { id: '02', slug: 'nexus', title: 'NEXUS', tag: 'Identity / Product', media: 'assets/projects/2.png' },
    { id: '03', slug: 'vortex', title: 'VORTEX', tag: 'Motion / Film', media: 'assets/projects/3.png' },
    { id: '04', slug: 'echo', title: 'ECHO', tag: 'Experiential / Installation', media: 'assets/projects/4.png' },
    { id: '05', slug: 'nova', title: 'NOVA', tag: 'Branding / Strategy', media: 'assets/projects/5.png' },
    { id: '06', slug: 'pulse', title: 'PULSE', tag: 'UI/UX / App Design', media: 'assets/projects/6.png' },
    { id: '07', slug: 'zenith', title: 'ZENITH', tag: 'AR / Mobile', media: 'assets/projects/7.png' },
    { id: '08', slug: 'aether', title: 'AETHER', tag: 'Data Visualization', media: 'assets/projects/8.png' },
    { id: '09', slug: 'lumen', title: 'LUMEN', tag: 'Packaging / Product', media: 'assets/projects/9.png' },
    { id: '10', slug: 'orbit', title: 'ORBIT', tag: 'Interactive / Web', media: 'assets/projects/10.png' },
    { id: '11', slug: 'prism', title: 'PRISM', tag: 'Print / Editorial', media: 'assets/projects/11.png' },
    { id: '12', slug: 'flux', title: 'FLUX', tag: 'Experimental / Concept', media: 'assets/projects/12.png' },
];

const WorksGallery = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const gridRef = useRef(null);
  const hintRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const state = useRef({
    targetX: 0, targetY: 0,
    currentX: 0, currentY: 0,
    lastMouseX: 0, lastMouseY: 0,
    isDown: false,
    BW: 0, BH: 0,
    dragStartPos: { x: 0, y: 0 },
    initialized: false
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(() => {
    const grid = gridRef.current;
    
    // ─── 1. DIMENSIONS ───
    const itemW = isMobile ? window.innerWidth * 0.75 : window.innerWidth * 0.3;
    const itemH = isMobile ? window.innerWidth * 0.75 : window.innerHeight * 0.4;
    state.current.BW = itemW * GALLERY_CONFIG.columnsPerBlock;
    state.current.BH = itemH * GALLERY_CONFIG.rowsPerBlock;
    
    if (!state.current.initialized) {
        state.current.targetX = state.current.currentX = -state.current.BW;
        state.current.targetY = state.current.currentY = -state.current.BH;
        state.current.initialized = true;
    }

    // ─── 2. HINT VISIBILITY LOGIC (Fix for ghost hint) ───
    gsap.set(hintRef.current, { autoAlpha: 0 }); // Start hidden

    ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom", // show as soon as section enters from bottom
        end: "bottom top",   // hide as soon as section leaves top
        onToggle: (self) => {
            // Only show if the section is actually visible on screen
            gsap.to(hintRef.current, { autoAlpha: self.isActive ? 1 : 0, duration: 0.4 });
        }
    });

    if (!isMobile) {
        const xTo = gsap.quickTo(hintRef.current, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(hintRef.current, "y", { duration: 0.4, ease: "power3" });
        const onMouseMove = (e) => { xTo(e.clientX); yTo(e.clientY); };
        window.addEventListener('mousemove', onMouseMove);
    }

    // ─── 3. STABLE REVEAL ───
    if (isMobile) {
        gsap.fromTo(wrapperRef.current, 
            { scale: 0.8, opacity: 0 },
            { 
              scale: 1, opacity: 1, duration: 1, ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
        );
    } else {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1,
          animation: gsap.fromTo(wrapperRef.current, 
            { scale: 0.85, rotationX: 15, opacity: 0 },
            { scale: 1, rotationX: 0, opacity: 1, ease: "power2.out" }
          ),
        });
    }

    // ─── 4. INTERACTION ───
    const setX = gsap.quickSetter(grid, "x", "px");
    const setY = gsap.quickSetter(grid, "y", "px");

    const ticker = () => {
      const s = state.current;
      if (!s.isDown && GALLERY_CONFIG.autoMove) {
        s.targetX -= GALLERY_CONFIG.driftSpeedX;
        s.targetY -= GALLERY_CONFIG.driftSpeedY;
      }
      if (s.targetX > 0) { s.targetX -= s.BW; s.currentX -= s.BW; }
      if (s.targetX < -s.BW * 2) { s.targetX += s.BW; s.currentX += s.BW; }
      if (s.targetY > 0) { s.targetY -= s.BH; s.currentY -= s.BH; }
      if (s.targetY < -s.BH * 2) { s.targetY += s.BH; s.currentY += s.BH; }

      s.currentX += (s.targetX - s.currentX) * GALLERY_CONFIG.friction;
      s.currentY += (s.targetY - s.currentY) * GALLERY_CONFIG.friction;
      setX(s.currentX);
      setY(s.currentY);
    };

    gsap.ticker.add(ticker);

    const onPointerDown = (e) => {
        state.current.isDown = true;
        const x = e.clientX || e.touches?.[0].clientX;
        const y = e.clientY || e.touches?.[0].clientY;
        state.current.lastMouseX = x;
        state.current.lastMouseY = y;
        state.current.dragStartPos = { x, y };
    };

    const onPointerMove = (e) => {
        if (!state.current.isDown) return;
        const x = e.clientX || e.touches?.[0].clientX;
        const y = e.clientY || e.touches?.[0].clientY;
        state.current.targetX += x - state.current.lastMouseX;
        state.current.targetY += y - state.current.lastMouseY;
        state.current.lastMouseX = x;
        state.current.lastMouseY = y;
    };

    const onPointerUp = (e) => {
        if (!state.current.isDown) return;
        state.current.isDown = false;
        const x = e.clientX || e.changedTouches?.[0].clientX;
        const y = e.clientY || e.changedTouches?.[0].clientY;
        const dist = Math.hypot(x - state.current.dragStartPos.x, y - state.current.dragStartPos.y);
        
        if (dist < 10) {
            const projectCard = e.target.closest('[data-slug]');
            if (projectCard) {
                const slug = projectCard.getAttribute('data-slug');
                sessionStorage.setItem('tony_milanzi_scroll_pos', window.scrollY);
                navigate(`/work/${slug}`);
            }
        }
    };

    grid.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    grid.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    return () => {
        gsap.ticker.remove(ticker);
        ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile]); 

  const itemW = isMobile ? GALLERY_CONFIG.mobileItemDim : GALLERY_CONFIG.itemWidth;
  const itemH = isMobile ? GALLERY_CONFIG.mobileItemDim : GALLERY_CONFIG.itemHeight;

  return (
    <section ref={sectionRef} className={`relative w-full h-[85vh] md:h-screen bg-[#050505] overflow-hidden ${isMobile ? '' : 'cursor-none'}`}>
      
      {/* ─── HINT ─── */}
      <div 
        ref={hintRef} 
        style={{ zIndex: 200 }}
        className={`${isMobile 
          ? 'fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-row border border-[#d4f500]/20 rounded-full px-4 py-2 bg-black/60 backdrop-blur-md' 
          : 'fixed top-0 left-0 flex flex-col -translate-x-1/2 -translate-y-1/2'} 
          pointer-events-none items-center gap-2`}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 border border-[#d4f500] rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4f500" strokeWidth="2" className={isMobile ? 'animate-pulse' : ''}>
                <path d="M15 18l-6-6 6-6" /><path d="M9 18l6-6-6-6" className="opacity-30" />
            </svg>
        </div>
        <span className="font-mono text-[7px] text-[#d4f500] uppercase tracking-[0.3em] whitespace-nowrap">
            {isMobile ? 'Swipe to explore' : 'Click to Open'}
        </span>
      </div>

      <div className="absolute top-10 left-10 z-[100] pointer-events-none">
        <h2 className="font-display text-4xl md:text-5xl text-white tracking-tighter uppercase leading-[0.8]">Selected <br/><span className="text-[#d4f500]">Projects</span></h2>
      </div>

      <div ref={wrapperRef} className="w-full h-full perspective-[2000px]" style={{ transformStyle: 'preserve-3d' }}>
        <div ref={gridRef} className="absolute top-0 left-0 flex flex-wrap cursor-grab touch-none"
             style={{ 
               width: `calc(${itemW} * ${GALLERY_CONFIG.columnsPerBlock} * 3)`, 
               height: `calc(${itemH} * ${GALLERY_CONFIG.rowsPerBlock} * 3)` 
             }}>
          {[...Array(9)].map((_, blockIdx) => (
            <div key={blockIdx} className="grid" style={{ width: `calc(${itemW} * ${GALLERY_CONFIG.columnsPerBlock})`, height: `calc(${itemH} * ${GALLERY_CONFIG.rowsPerBlock})`, gridTemplateColumns: `repeat(${GALLERY_CONFIG.columnsPerBlock}, 1fr)`, gridTemplateRows: `repeat(${GALLERY_CONFIG.rowsPerBlock}, 1fr)` }}>
              {projects.map((project, i) => (
                <div key={`${blockIdx}-${i}`} data-slug={project.slug} className="relative p-1 md:p-2 group">
                    <div className="w-full h-full bg-[#111] border border-white/5 relative overflow-hidden transition-colors duration-500 group-hover:border-[#d4f500]/50 pointer-events-none">
                        <img src={project.media} alt={project.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                                <span className="font-mono text-[8px] text-white/40 tracking-[0.2em]">0{project.id}</span>
                                <div className="w-1.5 h-1.5 bg-[#d4f500] rounded-full shadow-[0_0_8px_#d4f500]" />
                            </div>
                            <div>
                                <span className="font-mono text-[7px] text-[#d4f500] tracking-[0.4em] uppercase mb-1 block opacity-80">{project.tag}</span>
                                <h3 className="font-display text-xl md:text-3xl text-white uppercase tracking-tighter leading-none">{project.title}</h3>
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

export default WorksGallery;