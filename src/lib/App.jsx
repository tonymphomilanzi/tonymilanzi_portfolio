import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ContactSection from './components/ContactSection';

import MyWorks from './MyWorks'


export default function App() {
   const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white px-6 font-sans relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-8 overflow-hidden pointer-events-none">
        <div className="w-[400px] h-[400px] bg-gradient-to-br from-purple-600 via-purple-500 to-yellow-400 opacity-20 blur-[120px] rounded-full absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute inset-0 bg-stars z-0 pointer-events-none" />

      <main className="page-content">

      {/* Header */}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Hero Section */}
      <Hero />


      <About />


    

      {/**<ContactSection />**/}

      {/* Footer */}
      <Footer />
    </main>
    </div>
  );
}
