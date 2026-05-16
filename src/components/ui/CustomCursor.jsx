import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const CustomCursor = ({
  color = '#d4f500',
  size = 48,
  lag = 0.6,
  showCoords = true,
}) => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const labelRef = useRef(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Smooth lagging follower
    const xTo = gsap.quickTo(follower, 'x', {
      duration: lag,
      ease: 'power3.out',
    });

    const yTo = gsap.quickTo(follower, 'y', {
      duration: lag,
      ease: 'power3.out',
    });

    // Sharp dot
    const xDot = gsap.quickTo(cursor, 'x', {
      duration: 0.08,
      ease: 'none',
    });

    const yDot = gsap.quickTo(cursor, 'y', {
      duration: 0.08,
      ease: 'none',
    });

    const move = (e) => {
      const { clientX, clientY } = e;

      xTo(clientX);
      yTo(clientY);

      xDot(clientX);
      yDot(clientY);

      if (showCoords && labelRef.current) {
        labelRef.current.innerText = `${Math.round(clientX)}, ${Math.round(clientY)}`;
      }
    };

    const enter = () => {
      gsap.to([cursor, follower], {
        autoAlpha: 1,
        duration: 0.3,
      });
    };

    const leave = () => {
      gsap.to([cursor, follower], {
        autoAlpha: 0,
        duration: 0.3,
      });
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseenter', enter);
    window.addEventListener('mouseleave', leave);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseenter', enter);
      window.removeEventListener('mouseleave', leave);
    };
  }, [lag, showCoords]);

  return (
    <>
      {/* Lag Circle */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          border: `1px solid ${color}40`,
          borderRadius: '9999px',
          opacity: 0,
        }}
      >
        {/* Crosshair */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: '1px',
            height: '8px',
            background: `${color}50`,
          }}
        />

        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2"
          style={{
            width: '1px',
            height: '8px',
            background: `${color}50`,
          }}
        />

        <div
          className="absolute top-1/2 left-0 -translate-y-1/2"
          style={{
            height: '1px',
            width: '8px',
            background: `${color}50`,
          }}
        />

        <div
          className="absolute top-1/2 right-0 -translate-y-1/2"
          style={{
            height: '1px',
            width: '8px',
            background: `${color}50`,
          }}
        />
      </div>

      {/* Sharp Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          marginLeft: '-4px',
          marginTop: '-4px',
          opacity: 0,
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            background: color,
            borderRadius: '9999px',
            boxShadow: `0 0 12px ${color}`,
          }}
        />

        {showCoords && (
          <div
            ref={labelRef}
            className="absolute left-4 top-3 font-mono text-[8px] tracking-tight whitespace-nowrap"
            style={{
              color,
              opacity: 0.5,
            }}
          />
        )}
      </div>
    </>
  );
};

export default CustomCursor;