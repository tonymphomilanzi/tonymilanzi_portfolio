import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SplashScreen    from './components/SplashScreen';
import CurtainReveal   from './components/CurtainReveal';
import Hero            from './components/Hero';
import MarqueeSection  from './components/MarqueeSection';
import ServicesSection from './components/ServicesSection';
import CustomCursor    from './components/ui/CustomCursor';
import WorksGallery    from './components/WorksGallery';
import About           from './components/About';
import ProjectDetail   from './components/ProjectDetail';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Home = () => (
  <>
    <Hero />
    <MarqueeSection />
    <ServicesSection />
    <WorksGallery />
    <About />
  </>
);

const App = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [curtainDone, setCurtainDone] = useState(false);
  const { pathname } = useLocation();

  // 1. Force Manual Scroll Restoration (Prevents browser jump)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // 2. Immediate top for Project Details
  useEffect(() => {
    if (pathname.startsWith('/work')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // 3. Restore Scroll while curtain is OPAQUE (The Secret)
  useEffect(() => {
    if (splashDone && pathname === '/') {
      const savedPos = sessionStorage.getItem('tony_milanzi_scroll_pos');
      if (savedPos) {
        // Jump while the curtain is still fully covering the screen
        window.scrollTo(0, parseInt(savedPos));
        // Ensure GSAP knows where we are
        ScrollTrigger.refresh();
        sessionStorage.removeItem('tony_milanzi_scroll_pos');
      }
    }
  }, [splashDone, pathname]);

  return (
    <>
      <SplashScreen onComplete={() => setSplashDone(true)} />

      <CurtainReveal
        trigger={splashDone}
        onComplete={() => setCurtainDone(true)}
      />

      <main className={`transition-opacity duration-500 ${curtainDone ? 'opacity-100' : 'opacity-0'}`}>
        <CustomCursor color="#d6ed29" size={64} lag={0.8} showCoords={false} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>
    </>
  );
};

export default App;