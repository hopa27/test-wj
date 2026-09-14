import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { OrnamentalDivider } from './OrnamentalDivider';
import { preloadCriticalAssets, waitForCriticalAssets } from '../../lib/preloadAssets';

interface ScrollIntroProps {
  onOpen: () => void;
  /** Fired once the intro overlay has fully faded away */
  onDone?: () => void;
}

/** Synthesized "swish" — a filtered noise sweep, no audio file needed. */
function playSwish() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const duration = 0.9;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(6000, ctx.currentTime + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + duration * 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + duration);
    noise.onended = () => {
      if (ctx.state !== 'closed') void ctx.close().catch(() => {});
    };
  } catch {
    // Audio not available — the visual flare still plays.
  }
}

const GLITTER_COLORS = ['#FFE58F', '#D4AF37', '#FFF6D8', '#E8C560', '#B58500'];

/** Photorealistic carved wooden scroll rod with gold finials. */
function Rod({ flip = false }: { flip?: boolean }) {
  return (
    <div className="relative w-full flex justify-center">
      <img
        src={`${import.meta.env.BASE_URL}images/scroll-rod.webp`}
        alt=""
        aria-hidden
        draggable={false}
        className={`w-full max-w-[360px] h-auto drop-shadow-[0_5px_8px_rgba(74,13,16,0.4)] ${flip ? '-scale-y-100' : ''}`}
      />
    </div>
  );
}

export function ScrollIntro({ onOpen, onDone }: ScrollIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showFlare, setShowFlare] = useState(false);
  const openedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  // Motion value mapping the downward drag distance
  const dragY = useMotionValue(0);

  // Paper height scales directly with the drag.
  const paperHeight = useTransform(dragY, y => Math.max(0, y));
  const hintOpacity = useTransform(dragY, [0, 50], [1, 0]);

  // Preload hero fonts & images while the guest is looking at the sealed scroll.
  useEffect(() => {
    preloadCriticalAssets();
  }, []);

  const openScroll = () => {
    if (openedRef.current) return;
    openedRef.current = true;
    setIsOpen(true);
    // Unroll fully, make sure critical assets are in (briefly capped),
    // then flash the golden flare and reveal the hero.
    Promise.all([
      animate(dragY, Math.min(window.innerHeight, 560), { duration: 0.9, ease: 'easeInOut' }),
      waitForCriticalAssets(),
    ]).then(() => {
      setShowFlare(true);
      playSwish();
      setTimeout(() => {
        onOpen(); // Reveal the rest of the application
        setTimeout(() => {
          setIsRemoving(true); // overlay fully gone
          onDone?.(); // …only now start the music
        }, 700);
      }, 650);
    });
  };

  const handleDragEnd = (_event: any, info: any) => {
    if (info.offset.y > 150 || info.velocity.y > 400) {
      openScroll();
    } else {
      // Not dragged enough: spring back closed
      animate(dragY, 0, { type: 'spring', stiffness: 300, damping: 25 });
    }
  };

  const handleTap = (_event: any, info: any) => {
    // A simple tap (no meaningful drag) also opens the scroll
    if (Math.abs(info.offset?.y ?? 0) < 10) openScroll();
  };

  if (isRemoving) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center bg-background overflow-hidden touch-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: isOpen && showFlare ? 0 : 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Silk cloth texture backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/silk-cloth.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Warm ivory/gold gradient wash over the cloth so it blends with the theme */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(250,244,232,0.82) 0%, rgba(247,238,220,0.62) 40%, rgba(244,231,206,0.55) 70%, rgba(250,244,232,0.85) 100%)',
        }}
      />
      {/* Decorative backdrop behind the scroll */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large soft mandala halo centered behind the scroll */}
        <motion.img
          src={`${import.meta.env.BASE_URL}images/mandala.webp`}
          alt=""
          aria-hidden
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[24vh] left-1/2 -translate-x-1/2 w-[130vw] max-w-[620px] opacity-[0.10]"
          style={{ translateX: '-50%' }}
        />
        {/* Warm glow pooling behind the sealed scroll */}
        <div
          className="absolute top-[18vh] left-1/2 -translate-x-1/2 w-[80vw] max-w-[480px] h-[36vh] rounded-full blur-2xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,229,143,0.35) 0%, rgba(212,175,55,0.15) 45%, transparent 75%)',
          }}
        />
        {/* Gold filigree garlands framing the top corners (mirrors the bottom) */}
        <img
          src={`${import.meta.env.BASE_URL}images/floral-corner.webp`}
          alt=""
          aria-hidden
          className="absolute top-0 left-0 w-[34vw] max-w-[190px] opacity-80 -scale-y-100"
        />
        <img
          src={`${import.meta.env.BASE_URL}images/floral-corner.webp`}
          alt=""
          aria-hidden
          className="absolute top-0 right-0 w-[34vw] max-w-[190px] opacity-80 -scale-100"
        />
        {/* Floral garlands anchoring the bottom corners */}
        <img
          src={`${import.meta.env.BASE_URL}images/floral-corner.webp`}
          alt=""
          aria-hidden
          className="absolute bottom-0 left-0 w-[34vw] max-w-[190px] opacity-80"
        />
        <img
          src={`${import.meta.env.BASE_URL}images/floral-corner.webp`}
          alt=""
          aria-hidden
          className="absolute bottom-0 right-0 w-[34vw] max-w-[190px] opacity-80 -scale-x-100"
        />
        {/* A few drifting gold specks for depth */}
        {!reducedMotion &&
          Array.from({ length: 10 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${8 + ((i * 83) % 84)}%`,
                top: `${10 + ((i * 47) % 70)}%`,
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                background: 'radial-gradient(circle, #FFF3C4 0%, #FFE58F 50%, rgba(212,175,55,0) 100%)',
                boxShadow: '0 0 6px rgba(255,229,143,0.8)',
              }}
              animate={{ opacity: [0, 0.9, 0], y: [0, -14] }}
              transition={{ duration: 3 + (i % 4), delay: (i % 5) * 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
      </div>

      {/* Main container moved down a bit to leave room for the drag hint */}
      <div className="relative w-full max-w-md mt-[20vh] px-4">

        {/* Animated Drag Hint */}
        <motion.div
           style={{ opacity: hintOpacity }}
           className="absolute -top-24 left-0 w-full flex flex-col items-center text-primary pointer-events-none"
        >
           <p className="font-serif text-[10px] tracking-widest uppercase mb-2 font-semibold">
             Tap or drag to open
           </p>
           <motion.div
             animate={{ y: [0, 8, 0] }}
             transition={{ repeat: Infinity, duration: 1.5 }}
           >
             <ChevronDown className="w-5 h-5 opacity-80" />
           </motion.div>
        </motion.div>

        {/* TOP ROD (Fixed, with crest) */}
        <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
          <Rod />
        </div>

        {/* PARCHMENT PAPER (Grows with drag) */}
        <div className="absolute top-[26px] left-0 w-full flex justify-center z-10 pointer-events-none">
          <motion.div
             style={{
               height: paperHeight,
               backgroundImage: `url(${import.meta.env.BASE_URL}images/parchment-texture.webp)`,
               backgroundSize: 'cover',
               backgroundPosition: 'center top',
             }}
             className="w-[75%] max-w-[280px] border-x-[3px] border-[#8a5a2b]/50 shadow-[inset_0_0_30px_rgba(122,58,26,0.28),0_10px_28px_rgba(74,13,16,0.25)] overflow-hidden relative origin-top"
          >
             {/* Soft edge shading so the paper reads as curled off the rods */}
             <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#7a3a1a]/15 via-transparent to-[#7a3a1a]/15" />

             {/* Floral corner garlands */}
             <img
               src={`${import.meta.env.BASE_URL}images/floral-corner.webp`}
               alt=""
               aria-hidden
               draggable={false}
               className="absolute top-0 left-0 w-24 h-24 object-contain object-left-top -scale-y-100 pointer-events-none opacity-95"
             />
             <img
               src={`${import.meta.env.BASE_URL}images/floral-corner.webp`}
               alt=""
               aria-hidden
               draggable={false}
               className="absolute top-0 right-0 w-24 h-24 object-contain object-left-top -scale-100 pointer-events-none opacity-95"
             />

             <div className="absolute top-0 left-0 w-full p-6 pt-14 flex flex-col items-center text-center">
                <p className="font-devanagari text-primary text-xl mb-3 drop-shadow-sm">|| श्री गणेशाय नमः ||</p>
                <p className="font-display text-primary text-4xl mb-2 whitespace-nowrap"><span className="shimmer-text" data-text="You are invited">You are invited</span></p>
                <OrnamentalDivider className="w-[150px] mx-auto text-accent/60 my-3" />
                <p className="font-serif text-[10px] text-foreground/80 tracking-[0.2em] uppercase">
                  To celebrate our union
                </p>
             </div>
          </motion.div>
        </div>

        {/* BOTTOM ROD (Draggable & tappable) */}
        <motion.div
           drag="y"
           dragConstraints={{ top: 0, bottom: 400 }}
           dragElastic={0.05}
           dragMomentum={false}
           style={{ y: dragY }}
           onDragEnd={handleDragEnd}
           onTap={handleTap}
           className="absolute top-[26px] left-0 w-full z-30 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none"
        >
           {/* Invisible extended hitbox for easier mobile grabbing */}
           <div className="absolute inset-x-0 -inset-y-8 z-10" />

           {/* Idle nudge animation hinting the scroll can open */}
           <motion.div
             animate={isOpen ? { y: 0 } : { y: [0, 9, 0, 9, 0, 0] }}
             transition={isOpen ? { duration: 0.2 } : { duration: 2.6, times: [0, 0.12, 0.26, 0.38, 0.52, 1], repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
             whileTap={reducedMotion || isOpen ? undefined : { scale: 0.94, rotate: -1.5 }}
             className="relative w-full flex flex-col items-center"
             style={{ transformOrigin: '50% 60%' }}
           >
             <div className="w-full pointer-events-none relative z-20">
               <Rod flip />
             </div>

             {/* Pulsing golden glow behind the seal */}
             <motion.div
               animate={isOpen ? { opacity: 0 } : { opacity: [0.25, 0.7, 0.25], scale: [1, 1.25, 1] }}
               transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full pointer-events-none z-20 mt-1"
               style={{
                 background:
                   'radial-gradient(circle, rgba(255,229,143,0.9) 0%, rgba(212,175,55,0.4) 50%, rgba(212,175,55,0) 75%)',
               }}
             />

             {/* Wax Seal */}
             <img
               src={`${import.meta.env.BASE_URL}images/wax-seal-custom.webp`}
               alt="Wax seal"
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 object-contain pointer-events-none z-30 mt-1 drop-shadow-lg"
             />
           </motion.div>
        </motion.div>

      </div>

      {/* Golden flare before revealing the hero */}
      <AnimatePresence>
        {showFlare && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Expanding radial glow */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.9 }}
              animate={{ scale: 8, opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="w-[40vmin] h-[40vmin] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,229,143,0.95) 0%, rgba(212,175,55,0.55) 40%, rgba(212,175,55,0) 70%)',
              }}
            />
            {/* Circular glitter spread */}
            {Array.from({ length: 64 }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / 64 + (i % 3) * 0.13;
              const dist = 28 + ((i * 37) % 34); // vmin — ring of varying radius
              const size = 3 + ((i * 13) % 6);
              const color = GLITTER_COLORS[i % GLITTER_COLORS.length];
              const isStar = i % 4 === 0;
              return (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                  animate={{
                    x: `${Math.cos(angle) * dist}vmin`,
                    y: `${Math.sin(angle) * dist}vmin`,
                    scale: [0, 1.4, 0.9, 0],
                    opacity: [1, 1, 0.8, 0],
                    rotate: 180 + (i % 5) * 60,
                  }}
                  transition={{ duration: 1.15 + (i % 5) * 0.12, delay: (i % 8) * 0.03, ease: 'easeOut' }}
                  className="absolute"
                  style={
                    isStar
                      ? {
                          width: size * 2.2,
                          height: size * 2.2,
                          backgroundColor: color,
                          clipPath:
                            'polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)',
                          filter: 'drop-shadow(0 0 4px rgba(255,229,143,0.9))',
                        }
                      : {
                          width: size,
                          height: size,
                          backgroundColor: color,
                          borderRadius: '50%',
                          boxShadow: `0 0 ${size * 2}px rgba(255,229,143,0.85)`,
                        }
                  }
                />
              );
            })}
            {/* Soft golden wash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.2, times: [0, 0.4, 1], ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-br from-[#FFE58F] via-[#f3d27a] to-[#D4AF37]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
