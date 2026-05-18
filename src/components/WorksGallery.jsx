import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CONFIG = {
  cols: 7,
  rows: 6,
  tileW: 2.2,
  tileH: 1.6,
  gapX: 0.06,
  gapY: 0.06,
  inertia: 0.88,       // drag lag/smoothness
  tiltAmt: 0.12,       // 3D tilt intensity
  dragSpeed: 1.4,
};

// ─── PROJECT DATA ─────────────────────────────────────────────────────────────
const TOTAL = CONFIG.cols * CONFIG.rows;
const PROJECTS = Array.from({ length: TOTAL }, (_, i) => ({
  id: i,
  url: `https://picsum.photos/seed/${i + 10}/400/300`,
  year: `${2020 + (i % 5)}`,
  tags: [
    ["EXPERIENCE", "WEBSITE", "3D"],
    ["COMMUNICATION", "CAMPAIGN", "SOCIAL"],
    ["FILM", "BRAND", "IDENTITY"],
    ["PRODUCT", "PLATFORM", "UX"],
    ["STRATEGY", "CONTENT", "AR"],
  ][i % 5],
  client: [
    "GOOGLE", "NETFLIX", "APPLE", "DIAGEO", "NIKE",
    "MONDAY", "PHANTOM", "SKYSCANNER", "SONY", "TESLA",
  ][i % 10],
}));

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
const CustomCursor = ({ isDragging }) => {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const actual = useRef({ x: -300, y: -300 });
  const smooth = useRef({ x: -300, y: -300 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => { actual.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const tick = () => {
      smooth.current.x += (actual.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (actual.current.y - smooth.current.y) * 0.1;
      const s = isDragging ? 54 : 40;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${smooth.current.x - s / 2}px,${smooth.current.y - s / 2}px)`;
        ringRef.current.style.width = `${s}px`;
        ringRef.current.style.height = `${s}px`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${actual.current.x - 3}px,${actual.current.y - 3}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [isDragging]);

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center"
        style={{
          border: isDragging ? "1.5px solid rgba(255,255,255,0.85)" : "1.5px solid rgba(255,255,255,0.3)",
          background: isDragging ? "rgba(255,255,255,0.04)" : "transparent",
          willChange: "transform, width, height",
          transition: "border-color 0.25s, background-color 0.25s",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          style={{ opacity: isDragging ? 1 : 0.45, transition: "opacity 0.2s" }}>
          {isDragging ? (
            <path d="M9 11V6a1 1 0 0 1 2 0v3m0 0V5a1 1 0 0 1 2 0v4m0 0V6a1 1 0 0 1 2 0v4m0 0a1 1 0 0 1 2 0v3c0 3.314-2.686 6-6 6H9a6 6 0 0 1-6-6V9a1 1 0 0 1 2 0v2"
              stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          ) : (
            <path d="M7 11.5V7a1 1 0 0 1 2 0v3.5M9 7V4a1 1 0 0 1 2 0v5M11 5a1 1 0 0 1 2 0v4m0 0a1 1 0 0 1 2 0v3.5A5.5 5.5 0 0 1 9.5 18H9a5 5 0 0 1-5-5v-2a1 1 0 0 1 2 0v1.5"
              stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          )}
        </svg>
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-white"
        style={{ willChange: "transform" }}
      />
    </>
  );
};

// ─── TEXTURE TILE (Three.js mesh) ─────────────────────────────────────────────
const TileMesh = ({ project, position, gridPos, onProjectClick }) => {
  const meshRef = useRef();
  const borderRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [tex, setTex] = useState(null);
  const scaleTarget = useRef(new THREE.Vector3(1, 1, 1));

  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    const t = loader.load(project.url, (loaded) => {
      loaded.minFilter = THREE.LinearFilter;
      loaded.magFilter = THREE.LinearFilter;
      setTex(loaded);
    });
    return () => t?.dispose();
  }, [project.url]);

  useFrame(() => {
    if (!meshRef.current) return;
    scaleTarget.current.set(
      hovered ? 1.04 : 1,
      hovered ? 1.04 : 1,
      1
    );
    meshRef.current.scale.lerp(scaleTarget.current, 0.1);
  });

  if (!tex) {
    // Skeleton
    return (
      <mesh position={position}>
        <planeGeometry args={[CONFIG.tileW, CONFIG.tileH]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
    );
  }

  return (
    <group position={position}>
      {/* Main image plane */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "none"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "none"; }}
        onClick={(e) => { e.stopPropagation(); onProjectClick(project); }}
      >
        <planeGeometry args={[CONFIG.tileW, CONFIG.tileH]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>

      {/* Hover border */}
      <mesh position={[0, 0, -0.001]} visible={hovered}>
        <planeGeometry args={[CONFIG.tileW + 0.04, CONFIG.tileH + 0.04]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>

      {/* Bottom meta overlay — small text via canvas texture */}
      <MetaOverlay project={project} tileW={CONFIG.tileW} tileH={CONFIG.tileH} />
    </group>
  );
};

// ─── META OVERLAY (canvas → texture) ─────────────────────────────────────────
const MetaOverlay = ({ project, tileW, tileH }) => {
  const [tex, setTex] = useState(null);

  useEffect(() => {
    const W = 400, H = 300;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Bottom gradient
    const grad = ctx.createLinearGradient(0, H * 0.55, 0, H);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.72)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Year — top left tiny
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillText(project.year, 10, 22);

    // Client — top left
    ctx.font = "bold 11px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText(project.client, 10, 36);

    // Tags — bottom
    ctx.font = "9px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    const tagStr = project.tags.join("  ·  ");
    ctx.fillText(tagStr, 10, H - 10);

    const t = new THREE.CanvasTexture(canvas);
    t.minFilter = THREE.LinearFilter;
    setTex(t);
    return () => t.dispose();
  }, [project]);

  if (!tex) return null;

  return (
    <mesh position={[0, 0, 0.001]}>
      <planeGeometry args={[tileW, tileH]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
};

// ─── INFINITE PAN GRID ────────────────────────────────────────────────────────
const InfiniteScene = ({ onProjectClick, isAnimatingIn }) => {
  const { viewport, size, gl } = useThree();
  const groupRef = useRef();

  // Pan state
  const targetPan = useRef(new THREE.Vector2(0, 0));
  const currentPan = useRef(new THREE.Vector2(0, 0));
  const velocity = useRef(new THREE.Vector2(0, 0));
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  // Grid dimensions
  const stepX = CONFIG.tileW + CONFIG.gapX;
  const stepY = CONFIG.tileH + CONFIG.gapY;
  const totalW = CONFIG.cols * stepX;
  const totalH = CONFIG.rows * stepY;

  // Pre-compute base positions (centered)
  const items = useMemo(() => {
    const list = [];
    const offsetX = -((CONFIG.cols - 1) * stepX) / 2;
    const offsetY = -((CONFIG.rows - 1) * stepY) / 2;
    for (let r = 0; r < CONFIG.rows; r++) {
      for (let c = 0; c < CONFIG.cols; c++) {
        const idx = r * CONFIG.cols + c;
        list.push({
          project: PROJECTS[idx % PROJECTS.length],
          baseX: offsetX + c * stepX,
          baseY: offsetY + r * stepY,
          col: c,
          row: r,
        });
      }
    }
    return list;
  }, [stepX, stepY]);

  // Entrance animation
  const entranceProgress = useRef(0);
  const entranceComplete = useRef(false);

  // Input
  useEffect(() => {
    const canvas = gl.domElement;

    const onDown = (e) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      lastTime.current = performance.now();
      velocity.current.set(0, 0);
    };

    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      // Momentum: hand off velocity to target
      targetPan.current.x += velocity.current.x * 8;
      targetPan.current.y += velocity.current.y * 8;
    };

    const onMove = (e) => {
      if (!isDragging.current) return;
      const now = performance.now();
      const dt = Math.max(now - lastTime.current, 1);
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;

      const worldX = (dx / size.width) * viewport.width * CONFIG.dragSpeed;
      const worldY = (dy / size.height) * viewport.height * CONFIG.dragSpeed;

      targetPan.current.x += worldX;
      targetPan.current.y -= worldY;

      // Track velocity for momentum
      velocity.current.x = worldX / (dt / 16);
      velocity.current.y = -worldY / (dt / 16);

      lastMouse.current = { x: e.clientX, y: e.clientY };
      lastTime.current = now;
    };

    // Touch
    const onTouchStart = (e) => {
      isDragging.current = true;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastTime.current = performance.now();
      velocity.current.set(0, 0);
    };
    const onTouchEnd = () => {
      isDragging.current = false;
      targetPan.current.x += velocity.current.x * 8;
      targetPan.current.y += velocity.current.y * 8;
    };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      const now = performance.now();
      const dt = Math.max(now - lastTime.current, 1);
      const dx = e.touches[0].clientX - lastMouse.current.x;
      const dy = e.touches[0].clientY - lastMouse.current.y;
      const worldX = (dx / size.width) * viewport.width * CONFIG.dragSpeed;
      const worldY = (dy / size.height) * viewport.height * CONFIG.dragSpeed;
      targetPan.current.x += worldX;
      targetPan.current.y -= worldY;
      velocity.current.x = worldX / (dt / 16);
      velocity.current.y = -worldY / (dt / 16);
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastTime.current = now;
    };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [viewport, size, gl]);

  useFrame(() => {
    if (!groupRef.current) return;

    // ── Entrance camera zoom ──
    if (isAnimatingIn && !entranceComplete.current) {
      entranceProgress.current = Math.min(entranceProgress.current + 0.012, 1);
      const e = 1 - Math.pow(1 - entranceProgress.current, 3);
      groupRef.current.position.z = THREE.MathUtils.lerp(-6, 0, e);
      groupRef.current.children.forEach((child, idx) => {
        const delay = (idx / groupRef.current.children.length) * 0.4;
        const childE = Math.max(0, Math.min(1, (entranceProgress.current - delay) / 0.6));
        child.scale.setScalar(THREE.MathUtils.lerp(0.7, 1, childE));
        if (child.material) {
          child.material.opacity = childE;
        }
      });
      if (entranceProgress.current >= 1) entranceComplete.current = true;
    }

    // ── Inertia pan ──
    const lerpF = 1 - CONFIG.inertia;
    currentPan.current.x = THREE.MathUtils.lerp(currentPan.current.x, targetPan.current.x, lerpF);
    currentPan.current.y = THREE.MathUtils.lerp(currentPan.current.y, targetPan.current.y, lerpF);

    // ── Tilt ──
    const lagX = targetPan.current.x - currentPan.current.x;
    const lagY = targetPan.current.y - currentPan.current.y;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, lagX * CONFIG.tiltAmt, 0.07);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, lagY * CONFIG.tiltAmt, 0.07);

    // ── Update tile positions with infinite wrap ──
    groupRef.current.children.forEach((child, i) => {
      const item = items[i];
      if (!item) return;

      let wx = item.baseX + currentPan.current.x;
      let wy = item.baseY + currentPan.current.y;

      // Modulo wrap — infinite in both X and Y
      wx = (((wx + totalW / 2) % totalW) + totalW) % totalW - totalW / 2;
      wy = (((wy + totalH / 2) % totalH) + totalH) % totalH - totalH / 2;

      child.position.x = wx;
      child.position.y = wy;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <TileMesh
          key={i}
          project={item.project}
          position={[item.baseX, item.baseY, 0]}
          gridPos={{ col: item.col, row: item.row }}
          onProjectClick={onProjectClick}
        />
      ))}
    </group>
  );
};

// ─── CAMERA SETUP ─────────────────────────────────────────────────────────────
const CameraSetup = () => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 9);
    camera.fov = 58;
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
};

// ─── PROJECT MODAL ────────────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative max-w-xl w-full mx-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 0.35s cubic-bezier(0.25,0.46,0.45,0.94) forwards" }}
      >
        <img src={project.url} alt="" className="w-full object-cover" style={{ maxHeight: "65vh" }} />
        <div
          className="absolute inset-0 flex flex-col justify-end p-5"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)" }}
        >
          <p className="font-mono text-[8px] text-white/40 uppercase tracking-[0.35em] mb-1">
            {project.client} · {project.year}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {project.tags.map((t) => (
              <span key={t} className="font-mono text-[6.5px] text-white/30 border border-white/10 px-1.5 py-0.5 uppercase tracking-widest">
                {t}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center border border-white/15 text-white/40 hover:text-white hover:border-white/35 transition-colors font-mono text-[9px]"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const WorksSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [cursorIn, setCursorIn] = useState(false);

  // Intersection → trigger entrance
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setIsAnimatingIn(true), 100);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Drag state for cursor
  useEffect(() => {
    const dn = () => setIsDragging(true);
    const up = () => setIsDragging(false);
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousedown", dn); window.removeEventListener("mouseup", up); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.96) translateY(10px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {cursorIn && <CustomCursor isDragging={isDragging} />}

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      <section
        ref={sectionRef}
        className="relative w-full bg-[#0d0d0d] overflow-hidden"
        style={{ height: "100vh", cursor: cursorIn ? "none" : "auto" }}
        onMouseEnter={() => setCursorIn(true)}
        onMouseLeave={() => setCursorIn(false)}
      >
        {/* ── CANVAS ── */}
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
          frameloop="always"
        >
          <color attach="background" args={["#0d0d0d"]} />
          <CameraSetup />
          <InfiniteScene
            onProjectClick={(p) => setSelectedProject(p)}
            isAnimatingIn={isAnimatingIn}
          />
        </Canvas>

        {/* ── EDGE MASKS ── */}
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{ background: "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 60%, #0d0d0d 100%)" }}
        />

        {/* ── TOP LABEL ── */}
        <div
          className="absolute top-7 left-8 z-20 pointer-events-none"
          style={{ animation: isAnimatingIn ? "fadeUp 0.7s 0.3s both" : "none" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-white/30 animate-pulse" />
            <span className="font-mono text-[8px] text-white/30 uppercase tracking-[0.5em]">
              Selected Works
            </span>
          </div>
        </div>

        {/* ── PROJECT COUNT ── */}
        <div
          className="absolute top-7 right-8 z-20 pointer-events-none"
          style={{ animation: isAnimatingIn ? "fadeUp 0.7s 0.4s both" : "none" }}
        >
          <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.35em]">
            {PROJECTS.length} Projects
          </span>
        </div>

        {/* ── DRAG HINT ── */}
        <div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{
            animation: isAnimatingIn ? "fadeUp 0.7s 0.6s both" : "none",
            opacity: isDragging ? 0 : 1,
            transition: "opacity 0.4s",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-5 bg-white/10" />
            <span className="font-mono text-[7px] text-white/20 uppercase tracking-[0.45em]">
              Drag to explore
            </span>
            <div className="h-px w-5 bg-white/10" />
          </div>
        </div>
      </section>
    </>
  );
};

export default WorksSection;