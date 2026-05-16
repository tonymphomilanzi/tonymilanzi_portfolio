// CurtainReveal.jsx
// Two panels (top + bottom) that split open after splash
// exposing the Hero underneath — called once splash onComplete fires

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CurtainReveal = ({ trigger, onComplete }) => {
  const topRef    = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    // wait for parent signal
    if (!trigger) return;

    const tl = gsap.timeline({ onComplete });

    tl.to(topRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut',
    })
    .to(
      bottomRef.current,
      {
        yPercent: 100,
        duration: 1.2,
        ease: 'power4.inOut',
      },
      '<' // same time as top
    );

  }, [trigger]);

  return (
    <>
      {/* top curtain */}
      <div
        ref={topRef}
        className="fixed top-0 left-0 w-full h-1/2 z-[90]
                   bg-[#0a0a0a] pointer-events-none"
      />
      {/* bottom curtain */}
      <div
        ref={bottomRef}
        className="fixed bottom-0 left-0 w-full h-1/2 z-[90]
                   bg-[#0a0a0a] pointer-events-none"
      />
    </>
  );
};

export default CurtainReveal;