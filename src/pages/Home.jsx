import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import NynthWorldStore from '../components/NynthWorldStore';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useGSAP(() => {
    if (!loading) {
      // Navbar animations
      gsap.from('.nav-item', {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });

      // Logo animation
      gsap.from('.logo', {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "back.out(1.7)"
      });

      // Product cards animation
      gsap.from('.product-card', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        delay: 1,
        ease: "power3.out"
      });
    }
  }, [loading]);

  return (
    <>
      {loading ? (
        <Loader onComplete={() => setLoading(false)} showWelcomeText={true} />
      ) : (
        <div ref={contentRef}>
          <Navbar />
          <NynthWorldStore />
        </div>
      )}
    </>
  );
};

export default Home;