import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const containerRef = useRef(null);
  const revealRefs = useRef([]);
  const contentRefs = useRef([]);
  const imageRefs = useRef([]);
  const progressRefs = useRef([]); // Refs for the status segments

  const services = [
    {
      title: "Strategic Branding",
      desc: "Building identity systems that don't just look good—they perform. I translate corporate goals into visual dominance through precise positioning and scalable brand architecture.",
      img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200",
      tag: "Identity / Strategy",
      id: "01"
    },
    {
      title: "UI / UX Systems",
      desc: "Creating high-fidelity digital products where logic meets magic. I architect user journeys that reduce friction and maximize conversion, wrapped in a high-end aesthetic.",
      img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200",
      tag: "Product / Web / App",
      id: "02"
    },
    {
      title: "Visual Strategy",
      desc: "Designing for impact. I develop visual narratives that cut through the noise, ensuring your digital presence is felt before it is read.",
      img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
      tag: "Design / Motion / Art",
      id: "03"
    }
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${services.length * 100}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    // ─── ANIMATE PROGRESS BARS (WhatsApp Style) ───
    services.forEach((_, i) => {
        tl.to(progressRefs.current[i], {
            scaleX: 1,
            ease: "none",
            duration: 1 // Each segment takes 1 unit of the timeline
        }, i); // Each starts filling at the start of its index
    });

    // ─── REVEAL SERVICES ───
    services.forEach((_, i) => {
      if (i === 0) return;

      const section = revealRefs.current[i];
      const content = contentRefs.current[i];
      const image = imageRefs.current[i];

      tl.fromTo(section, 
        { clipPath: 'inset(100% 0% 0% 0%)' }, 
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 
        i 
      )
      .fromTo(content,
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 },
        i + 0.2 
      )
      .fromTo(image,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.8 },
        i + 0.1
      );
    });
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden">
      
      {/* ─── WHATSAPP TIMELINE NAVIGATION ─── */}
      <div className="absolute top-10 left-8 right-8 md:left-20 md:right-20 z-[101] flex flex-col gap-4">
         <div className="flex items-center justify-between">
            <h3 className="font-mono text-[9px] text-[#d4f500] tracking-[0.7em] uppercase">
                What I Do
            </h3>
            <span className="font-mono text-[8px] text-white/20 tracking-tighter uppercase">
                Capabilities Matrix // 2024
            </span>
         </div>
         
         <div className="flex gap-2 w-full h-[2px]">
            {services.map((_, i) => (
                <div key={i} className="flex-1 bg-white/5 h-full relative overflow-hidden rounded-full">
                    <div 
                        ref={el => progressRefs.current[i] = el}
                        className="absolute inset-0 bg-[#d4f500] origin-left scale-x-0"
                    />
                </div>
            ))}
         </div>
      </div>

      {services.map((service, i) => (
        <div 
          key={i}
          ref={el => revealRefs.current[i] = el}
          className="absolute inset-0 h-full w-full bg-[#0a0a0a] overflow-hidden"
          style={{ zIndex: i + 1 }}
        >
          <div className="flex h-full w-full flex-col md:flex-row">
            
            {/* LEFT: TEXT CONTENT */}
            <div className="relative w-full md:w-1/2 h-full flex flex-col justify-center px-8 md:px-20 z-10 bg-[#0a0a0a]">
              <div ref={el => contentRefs.current[i] = el} className="max-w-xl">
                <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-[10px] text-[#d4f500] tracking-[0.5em] uppercase">
                        {service.tag}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                </div>
                
                <h2 className="font-display text-5xl md:text-8xl text-white uppercase leading-[0.9] tracking-tighter mb-8">
                  {service.title}
                </h2>
                
                <p className="font-mono text-xs md:text-sm text-white/40 leading-relaxed max-w-md mb-12">
                  {service.desc}
                </p>

                <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl text-white/10">{service.id}</span>
                    <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em]">Expertise Node</span>
                </div>
              </div>

              <div className="absolute left-0 top-0 h-full w-px bg-white/5" />
            </div>

            {/* RIGHT: IMAGE REVEAL */}
            <div className="relative w-full md:w-1/2 h-full overflow-hidden">
                <img 
                    ref={el => imageRefs.current[i] = el}
                    src={service.img} 
                    alt={service.title}
                    className="h-full w-full object-cover grayscale brightness-[0.4]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent md:from-[#0a0a0a]" />
            </div>
          </div>
        </div>
      ))}

      {/* Background Decor */}
      <div className="absolute bottom-10 right-10 z-[100]">
         <div className="font-mono text-[8px] text-[#d4f500]/30 uppercase tracking-[0.5em] flex items-center gap-3">
           <span className="w-8 h-px bg-[#d4f500]/20" /> Service Protocol 04
         </div>
      </div>
    </section>
  );
};

export default ServicesSection;