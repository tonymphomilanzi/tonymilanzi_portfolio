import React, { useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Header = ({ isOpen, setIsOpen }) => {
  // Header entrance animation
  useGSAP(() => {
    gsap.fromTo(
      '.animate-header',
      { opacity: 0, y: -100 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  // Animate the page content up/down when the full-screen menu toggles
  useEffect(() => {
    gsap.to('.page-content', {
      y: isOpen ? 1000 : 0, // no content push now, since menu overlays it
      duration: 0.6,
      ease: 'power3.inOut',
    });
  }, [isOpen]);

  return (
    <header className="relative z-50 flex justify-between items-center py-6 px-6">
      <h1 className="animate-header text-xl font-extrabold tracking-tight">T.M</h1>

      {/* Always-visible toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="transition-transform duration-300 hover:scale-110 z-[60]"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white transition-transform duration-300 rotate-90" />
        ) : (
          <Menu className="w-7 h-7 text-white transition-transform duration-300" />
        )}
      </button>

      {/* Full-screen Menu */}
      <div
        className={`fixed inset-0 bg-zinc-900/95 backdrop-blur-md text-white flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.83,0,0.17,1)] transform ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <nav className="flex flex-col space-y-8 text-2xl font-light tracking-wide text-zinc-300">
          <a
            href="#features"
            className="hover:text-purple-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Features
          </a>
          <a
            href="#about"
            className="hover:text-purple-400 transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a
            href="#get-started"
            className="hover:text-purple-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
