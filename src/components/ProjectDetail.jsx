import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── MOCK DATA (Move this to a separate file later) ────────────────────────
const PROJECTS_DATA = {
  aura: {
    title: "Aura",
    category: "Web / WebGL",
    year: "2024",
    role: "Lead Developer",
    client: "Aura Digital",
    desc: "A high-performance immersive WebGL experience designed to push the boundaries of spatial navigation in the browser. Using custom shaders and advanced particle physics.",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200"
    ]
  },
  nexus: {
    title: "Nexus",
    category: "Identity / Product",
    year: "2023",
    role: "Brand Strategist",
    client: "Nexus Labs",
    desc: "Architecting a scalable identity system for a decentralized future. We focused on visual dominance and high-fidelity product design for the next generation of users.",
    images: [
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200"
    ]
  }
  // Add more projects here...
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS_DATA[slug] || PROJECTS_DATA['aura']; // Fallback
  
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);

  useGSAP(() => {
    // ─── INITIAL REVEAL ───
    const tl = gsap.timeline();
    
    tl.fromTo(".p-back", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 })
      .fromTo(".p-title", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, "-=0.5")
      .fromTo(".p-meta", { opacity: 0, x: 20 }, { opacity: 1, x: 0, stagger: 0.1 }, "-=0.6")
      .fromTo(".p-hero-img", { scale: 1.2, filter: 'blur(20px)' }, { scale: 1, filter: 'blur(0px)', duration: 1.5, ease: "power4.out" }, "-=1");

    // ─── SCROLL PARALLAX ───
    gsap.to(".p-hero-img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // ─── STICKY SIDEBAR FADE ───
    ScrollTrigger.create({
        trigger: ".p-content",
        start: "top center",
        onEnter: () => gsap.to(".p-back", { color: '#d4f500', duration: 0.3 }),
        onLeaveBack: () => gsap.to(".p-back", { color: '#ffffff', duration: 0.3 }),
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] min-h-screen w-full text-white selection:bg-[#d4f500] selection:text-black">
      
      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 w-full z-[100] p-8 md:p-12 flex justify-between items-start pointer-events-none">
        <Link 
            to="/" 
            className="p-back pointer-events-auto flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] group"
        >
            <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center group-hover:border-[#d4f500] transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </div>
            <span>Back to Archives</span>
        </Link>
        <div className="p-meta font-mono text-[8px] text-white/30 uppercase tracking-[0.6em] hidden md:block">
            Project Node // {project.year}
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section ref={heroRef} className="relative h-[90vh] w-full flex items-end px-8 md:px-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img 
                src={project.images[0]} 
                className="p-hero-img w-full h-full object-cover opacity-40 brightness-50"
                alt={project.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="overflow-hidden">
                <h1 className="p-title font-display text-[15vw] leading-[0.8] uppercase tracking-tighter">
                    {project.title.split('').map((char, i) => (
                        <span key={i} className={i % 2 === 0 ? "text-white" : "text-[#d4f500]"}>{char}</span>
                    ))}
                </h1>
            </div>
            <div className="p-meta max-w-xs text-right">
                <span className="font-mono text-[#d4f500] text-[10px] uppercase tracking-[0.4em] mb-4 block">
                    {project.category}
                </span>
                <p className="font-mono text-white/40 text-[11px] leading-relaxed">
                    {project.desc}
                </p>
            </div>
        </div>
      </section>

      {/* ─── CONTENT GRID ─── */}
      <section className="p-content relative w-full px-8 md:px-12 py-32 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Sidebar Metadata */}
        <div className="md:col-span-3 space-y-12">
            <div className="p-meta space-y-2">
                <h4 className="font-mono text-[9px] text-[#d4f500] uppercase tracking-[0.3em]">Role</h4>
                <p className="text-xl font-light">{project.role}</p>
            </div>
            <div className="p-meta space-y-2">
                <h4 className="font-mono text-[9px] text-[#d4f500] uppercase tracking-[0.3em]">Client</h4>
                <p className="text-xl font-light">{project.client}</p>
            </div>
            <div className="p-meta space-y-2">
                <h4 className="font-mono text-[9px] text-[#d4f500] uppercase tracking-[0.3em]">Date</h4>
                <p className="text-xl font-light">{project.year}</p>
            </div>
        </div>

        {/* Large Imagery / Case Study */}
        <div className="md:col-span-9 space-y-32">
            <div className="aspect-video w-full bg-white/5 overflow-hidden">
                <img 
                    src={project.images[1]} 
                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-1000" 
                    alt="Process"
                />
            </div>
            
            <div className="max-w-2xl">
                <h3 className="font-display text-4xl md:text-6xl uppercase tracking-tighter mb-8 italic">
                    Pushing the boundaries of <span className="text-[#d4f500]">digital interaction.</span>
                </h3>
                <p className="text-white/50 text-lg leading-relaxed font-light">
                    The core objective was to create a seamless bridge between data and visual emotion. By leveraging 
                    hardware acceleration and custom physics engines, we achieved a result that feels alive.
                </p>
            </div>
        </div>
      </section>

      {/* ─── FOOTER: NEXT PROJECT ─── */}
      <footer className="w-full py-40 px-8 md:px-12 border-t border-white/5 flex flex-col items-center justify-center text-center">
         <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.5em] mb-6">Next Project</span>
         <Link 
            to="/work/nexus" 
            className="group relative inline-block"
         >
            <h2 className="font-display text-[10vw] uppercase leading-none group-hover:text-[#d4f500] transition-colors duration-500">Nexus</h2>
            <div className="absolute -bottom-4 left-0 w-0 h-1 bg-[#d4f500] group-hover:w-full transition-all duration-700" />
         </Link>
      </footer>
    </div>
  );
};

export default ProjectDetail;