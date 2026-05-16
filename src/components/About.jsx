import React from 'react';
import HighlightText from './HighlightText';

const About = () => {
  return (
    <section className="about-section min-h-screen flex items-center justify-center text-white">
      <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-10">
        
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-900 text-transparent bg-clip-text">
          WHO AM I ?
        </h2>

        <div className="about-text text-left text-lg sm:text-xl md:text-2xl leading-relaxed space-y-6 max-w-3xl">
          <p>
            I'm a creator who believes in creating experiences that feel human 
            intuitive, emotional, and purposeful.
          </p>
          <p>
            Every project I touch is an opportunity to tell a story — not just through
            visuals, but through how people feel when they use it.
          </p>
          <p>
            My creative works spans from <span className="bg-black">brand strategy</span>, design, code and product development.
          </p>
          <p>I love shaping ideas from raw concepts into something
  tangible.</p>
        </div>

      </div>
    </section>
  );
};

export default About;


