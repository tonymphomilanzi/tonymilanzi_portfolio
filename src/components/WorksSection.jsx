import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { 
  Float, 
  MeshReflectorMaterial, 
  PerspectiveCamera, 
  Html, 
  MeshTransmissionMaterial,
  useTexture 
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── 3D Project Card Component ──────────────────────────────────────────────
const ProjectCard = ({ data, index, scrollProgress }) => {
  const meshRef = useRef();
  
  // Load the project image texture
  const texture = useTexture(data.image);

  useFrame((state) => {
    // Positioning logic: Cards fly from depth (-60) to front (20)
    const zOffset = index * 18;
    const currentZ = 15 - (scrollProgress.value * 80) + zOffset;
    
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, currentZ, 0.08);
    
    // Smooth magnetic tilt
    const mouseX = state.mouse.x * 0.15;
    const mouseY = state.mouse.y * 0.15;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX, 0.05);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -mouseY, 0.05);

    // Hide if too far away or behind camera
    const dist = meshRef.current.position.z;
    meshRef.current.visible = dist < 20 && dist > -40;
  });

  return (
    <group ref={meshRef} position={[0, 0, -60]}>
      {/* 1. THE ACTUAL IMAGE (Background Layer) */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[7, 4.5]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* 2. THE REFRACTION GLASS (Front Layer) */}
      <mesh>
        <planeGeometry args={[7.2, 4.7]} />
        <MeshTransmissionMaterial 
          backside 
          samples={4} 
          thickness={0.2} 
          chromaticAberration={0.05} 
          anisotropy={0.1} 
          distortion={0.1} 
          distortionScale={0.1} 
          temporalDistortion={0.1} 
          color="#ffffff"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 3. PROJECT INFO (HTML Layer for perfect Sharpness) */}
      <Html
        transform
        distanceFactor={5}
        position={[-3.3, 2.6, 0.2]}
        occlude
      >
        <div className="flex flex-col gap-1 pointer-events-none select-none">
          <span className="font-mono text-[10px] text-[#d4f500] uppercase tracking-[0.4em] bg-black/50 px-2 py-1">
            {data.tag}
          </span>
          <h3 className="font-display text-4xl text-white uppercase tracking-tighter drop-shadow-2xl">
            {data.title}
          </h3>
        </div>
      </Html>
    </group>
  );
};

// ─── Main Works Section Component ───────────────────────────────────────────
const WorksSection = () => {
  const containerRef = useRef();
  const scrollProgress = useMemo(() => ({ value: 0 }), []);

  const projects = [
    { 
      title: "THE APEX FRAMEWORK", 
      tag: "Strategy / Identity",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800" 
    },
    { 
      title: "NEBULA SYSTEMS", 
      tag: "UI / UX Innovation",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800"
    },
    { 
      title: "QUANTUM INTERFACE", 
      tag: "Development",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"
    },
    { 
      title: "STRATEGIC SUPREMACY", 
      tag: "Brand Architecture",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800"
    },
  ];

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=500%", 
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.value = self.progress;
      }
    });
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#050505] overflow-hidden">
      
      {/* ── 3D Scene ── */}
      <div className="absolute inset-0 z-0">
        <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={35} />
          
          <Suspense fallback={<Html center className="text-[#d4f500] font-mono uppercase tracking-widest">Initialising Engine...</Html>}>
            <group position={[0, -0.5, 0]}>
              
              {projects.map((proj, i) => (
                <ProjectCard 
                    key={i} 
                    index={i} 
                    data={proj} 
                    scrollProgress={scrollProgress} 
                />
              ))}

              {/* Reflective Perspective Floor */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                  blur={[300, 100]}
                  resolution={1024}
                  mixBlur={1}
                  mixStrength={60}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#050505"
                  metalness={0.5}
                />
              </mesh>
              <gridHelper args={[100, 40, "#d4f500", "#111"]} position={[0, -4.95, 0]} opacity={0.05} transparent />
            </group>

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#d4f500" />
            <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#d4f500" />
          </Suspense>
        </Canvas>
      </div>

      {/* ── HUD / UI Overlays ── */}
      <div className="absolute top-12 left-12 z-10 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[#d4f500] animate-pulse shadow-[0_0_10px_#d4f500]" />
          <span className="font-mono text-[10px] text-[#d4f500] uppercase tracking-[0.5em]">
            Case Archive — 2024
          </span>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 z-10 text-right pointer-events-none">
        <div className="font-mono text-[8px] text-white/20 uppercase tracking-[0.3em] mb-4">
           Digital Showcase / Interactive Depth
        </div>
        <div className="flex items-center gap-4 justify-end">
            <span className="font-mono text-[9px] text-[#d4f500] uppercase tracking-widest">Scroll Engine</span>
            <div className="h-[1px] w-12 bg-[#d4f500]" />
        </div>
      </div>

      {/* Crosshair Mask */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-20">
        <div className="w-12 h-12 border border-[#d4f500] rounded-full" />
        <div className="absolute w-px h-screen bg-[#d4f500]/10" />
        <div className="absolute w-screen h-px bg-[#d4f500]/10" />
      </div>

    </section>
  );
};

export default WorksSection;