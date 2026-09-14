import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { weddingDetails } from '../../lib/weddingDetails';
import { OrnamentalDivider } from './OrnamentalDivider';
import { OrnateFrame } from './OrnateFrame';

const LANTERNS = [
  { left: '5%', delay: 0, duration: 15, scale: 0.72 },
  { left: '19%', delay: 5, duration: 19, scale: 0.5 },
  { left: '34%', delay: 9, duration: 17, scale: 0.8 },
  { left: '52%', delay: 2, duration: 21, scale: 0.56 },
  { left: '69%', delay: 7, duration: 16, scale: 0.7 },
  { left: '85%', delay: 1, duration: 20, scale: 0.6 },
];

function Lantern({ scale }: { scale: number }) {
  return (
    <div
      className="relative rounded-[45%_45%_35%_35%] bg-gradient-to-b from-[#ffe7a3] via-[#f3ad49] to-[#b95d25] shadow-[0_0_22px_rgba(255,191,73,0.9)]"
      style={{ width: 32 * scale, height: 43 * scale }}
    >
      <span className="absolute inset-x-[18%] bottom-[-3px] h-[4px] rounded-full bg-[#6d2e16]" />
      <span className="absolute left-1/2 bottom-[-7px] h-[7px] w-[4px] -translate-x-1/2 rounded-full bg-[#fff3b0] shadow-[0_0_8px_#ffd36a]" />
    </div>
  );
}

function SkyLanterns() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none" aria-hidden>
      {LANTERNS.map((lantern, index) => (
        <motion.div
          key={index}
          className="absolute bottom-[-70px]"
          style={{ left: lantern.left }}
          animate={{
            y: [0, '-115svh'],
            x: [0, index % 2 === 0 ? 16 : -16, 0],
            opacity: [0, 0.9, 0.75, 0],
          }}
          transition={{
            duration: lantern.duration,
            delay: lantern.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.15, 0.8, 1],
          }}
        >
          <Lantern scale={lantern.scale} />
        </motion.div>
      ))}
    </div>
  );
}

/** Twinkling gold glitter specks scattered across the section. */
function Glitter() {
  const prefersReducedMotion = useReducedMotion();
  const specks = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 22 : 38;
    return Array.from({ length: count }).map((_, i) => ({
      key: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 6,
      duration: 2.5 + Math.random() * 3.5,
      drift: -6 - Math.random() * 10,
    }));
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {specks.map((s) => (
        <motion.span
          key={s.key}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: 'radial-gradient(circle, #FFF3C4 0%, #FFE58F 45%, rgba(212,175,55,0) 100%)',
            boxShadow: '0 0 6px rgba(255,229,143,0.9), 0 0 12px rgba(212,175,55,0.5)',
            willChange: 'transform, opacity',
          }}
          animate={{
            opacity: [0, 1, 0.2, 0.9, 0],
            scale: [0.4, 1.15, 0.7, 1, 0.4],
            y: [0, s.drift],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function Closing() {
  return (
    <section id="closing" className="py-16 px-6 text-center relative overflow-hidden bg-[#2a0709]">
      {/* Deep maroon backdrop with a soft radial warmth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(179,18,23,0.35) 0%, rgba(74,13,16,0.15) 45%, transparent 75%)',
        }}
      />
      {/* Ornamental gold frame, matching the hero */}
      <OrnateFrame className="z-20" />
      {/* Background subtle mandala — crowning the top of the section */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-15">
        <img
          src={`${import.meta.env.BASE_URL}images/mandala.webp`}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-[120vw] max-w-[600px]"
          aria-hidden
        />
      </div>
      {/* Mandala emerging from the bottom edge, mirroring the top */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none opacity-15" aria-hidden>
        <img
          src={`${import.meta.env.BASE_URL}images/mandala.webp`}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-[120vw] max-w-[600px]"
        />
      </div>
      {/* Twinkling gold glitter */}
      <Glitter />
      <SkyLanterns />
      <div className="max-w-xl mx-auto relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img
            src={`${import.meta.env.BASE_URL}images/ganesha-emblem.webp`}
            alt="Ganesha emblem"
            loading="lazy"
            decoding="async"
            className="w-24 h-24 mx-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] mb-2"
          />

          <h2 className="font-display text-4xl text-gradient-gold mb-4">
            The Journey Begins
          </h2>
          <p className="font-sans text-[#f5ead9]/85 leading-relaxed mb-5">
            {weddingDetails.closingMessage}
          </p>
          <p className="font-serif text-sm text-accent/90 mb-6">
            Regards, {weddingDetails.closingRegards}
          </p>

          <p className="font-serif tracking-[0.2em] text-accent text-sm uppercase">
            With Love
          </p>
          <p className="font-display text-5xl text-gradient-gold mt-4 py-2 ml-[-31px]">
            {weddingDetails.brideName} &<br />
            <span className="inline-block pl-16">{weddingDetails.groomName}</span>
          </p>
          
          <OrnamentalDivider className="w-[200px] mx-auto text-accent/50 mt-5 mb-5" />

          <img
            src={`${import.meta.env.BASE_URL}images/wedding-logo.webp`}
            alt="Juhi & Shubhojit monogram"
            loading="lazy"
            decoding="async"
            className="w-20 h-20 md:w-24 md:h-24 mx-auto object-contain drop-shadow-[0_0_18px_rgba(212,175,55,0.35)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
