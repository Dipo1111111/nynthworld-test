import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const progressRef = useRef(null);
  const percentageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      }
    });

    // Reset initial state
    gsap.set(progressRef.current, { width: 0 });
    gsap.set(percentageRef.current, { innerHTML: '0%' });

    // Animate loading progress
    tl.to(progressRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const progress = Math.round(tl.progress() * 100);
        if (percentageRef.current) {
          percentageRef.current.textContent = `${progress}%`;
        }
      }
    });
  }, [onComplete]);

  return (
    <div 
      ref={loaderRef} 
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
    >
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div 
          ref={progressRef} 
          className="h-full bg-black w-0 transition-all duration-300"
        />
      </div>
      <div 
        ref={percentageRef} 
        className="text-black text-xl font-medium"
      >
        0%
      </div>
    </div>
  );
};

export default Loader;