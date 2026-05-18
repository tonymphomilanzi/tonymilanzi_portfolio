// App.jsx

import React, { useState } from 'react';
import SplashScreen    from './components/SplashScreen';
import CurtainReveal   from './components/CurtainReveal';
import Hero            from './components/Hero';
import MarqueeSection  from './components/MarqueeSection';
import ServicesSection from './components/ServicesSection';
import CustomCursor from './components/ui/CustomCursor';
import WorksGallery from './components/WorksGallery';
import About        from './components/About';

// import Projects     from './components/Projects';
// import Contact      from './components/Contact';
// import Footer       from './components/Footer';

const App = () => {
  // splash done → trigger curtain
  const [splashDone,   setSplashDone]   = useState(false);
  // curtain done → show content fully
  const [curtainDone,  setCurtainDone]  = useState(false);

  return (
    <>
      {/* layer 1 — splash (z-100) */}
      <SplashScreen onComplete={() => setSplashDone(true)} />

      {/* layer 2 — curtain (z-90) */}
      <CurtainReveal
        trigger={splashDone}
        onComplete={() => setCurtainDone(true)}
      />

      {/* layer 3 — actual site */}
      <main
        className={`transition-opacity duration-500 ${
          curtainDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <CustomCursor
         color="#d6ed29"
         size={64}
         lag={0.8}
         showCoords={false}
        />
        <Hero />
        <MarqueeSection />
        <ServicesSection />
        <WorksGallery />
        <About />
        {/* <About />    */}
        {/* <Projects /> */}
        {/* <Contact />  */}
        {/* <Footer />   */}
      </main>
    </>
  );
};

export default App;