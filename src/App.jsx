// App.jsx

import React, { useState } from 'react';
import SplashScreen    from './components/SplashScreen';
import CurtainReveal   from './components/CurtainReveal';
import Hero            from './components/Hero';
import MarqueeSection  from './components/MarqueeSection';
import ServicesSection from './components/ServicesSection';

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

     <div className="absolute inset-0 -z-8 overflow-hidden pointer-events-none">
        <div className="w-[400px] h-[400px] bg-gradient-to-br from-purple-600 via-purple-500 to-yellow-400 opacity-20 blur-[120px] rounded-full absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute inset-0 bg-stars z-0 pointer-events-none" />


      {/* layer 3 — actual site */}
      <main
        className={`transition-opacity duration-500 ${
          curtainDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Hero />
        <MarqueeSection />
        <ServicesSection />
        
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