import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import BlindSimulation from './components/BlindSimulation';
import KakaoFloat from './components/KakaoFloat';

// === Custom Gold Cursor ===
function GoldCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('button, a, [role="button"], .cursor-pointer, input, textarea')) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  // Only show on non-touch devices
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
  if (isTouchDevice) return null;

  return <div ref={cursorRef} className={`custom-cursor ${hovering ? 'hovering' : ''}`} />;
}

// === Loading Intro ===
function LoadingIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0); // 0: logo fade-in, 1: curtain open, 2: done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1800);
    const t2 = setTimeout(() => { setPhase(2); onComplete(); }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-stone-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Gold gradient glow */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.15) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Logo */}
          <motion.div
            className="text-center z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 0 ? 1 : 0, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-serif font-bold tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #B8860B, #FFD700, #D4A843, #FFD700, #B8860B)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              animate={{ backgroundPosition: ['0% center', '200% center'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              ESABELLA
            </motion.h1>
            <motion.p
              className="text-white/30 text-xs tracking-[0.5em] uppercase mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Premium Free Blind
            </motion.p>
          </motion.div>

          {/* Curtain left */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-stone-950 z-20"
            animate={phase >= 1 ? { x: '-100%' } : {}}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Curtain right */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-stone-950 z-20"
            animate={phase >= 1 ? { x: '100%' } : {}}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-amber-100">
      {/* Film grain overlay */}
      <div className="grain-overlay" />

      {/* Custom gold cursor */}
      <GoldCursor />

      {/* Loading intro */}
      {!introComplete && <LoadingIntro onComplete={() => setIntroComplete(true)} />}

      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      {currentPage === 'home' ? (
        <Home onNavigate={setCurrentPage} />
      ) : (
        <main className="pt-20 bg-stone-50 min-h-screen">
          <BlindSimulation />
        </main>
      )}
      <KakaoFloat />
    </div>
  );
}
