import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const LANTERNS = [
  { left: '5%', delay: 0, duration: 15, scale: 0.72 },
  { left: '17%', delay: 4, duration: 19, scale: 0.48 },
  { left: '31%', delay: 8, duration: 17, scale: 0.82 },
  { left: '48%', delay: 2, duration: 21, scale: 0.55 },
  { left: '64%', delay: 7, duration: 16, scale: 0.7 },
  { left: '79%', delay: 1, duration: 20, scale: 0.58 },
  { left: '91%', delay: 10, duration: 18, scale: 0.78 },
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

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#3a1713]" aria-label="Wedding introduction">
      <img
        src={`${import.meta.env.BASE_URL}images/hero-couple-temple.png`}
        alt="Juhi and Shubhojit in wedding attire at a temple by the water"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />

      {!reduceMotion && (
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none" aria-hidden>
          {LANTERNS.map((lantern, index) => (
            <motion.div
              key={index}
              className="absolute bottom-[-70px]"
              style={{ left: lantern.left }}
              animate={{
                y: [0, '-115svh'],
                x: [0, index % 2 === 0 ? 18 : -18, 0],
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
      )}

      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.35 }}
        className="absolute inset-x-0 top-[5svh] z-10 flex flex-col items-center text-center pointer-events-none"
      >
        <img
          src={`${import.meta.env.BASE_URL}images/wedding-logo.webp`}
          alt="Juhi and Shubhojit monogram"
          className="mb-2 h-16 w-16 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] md:h-20 md:w-20"
        />
        <h1 className="font-display text-4xl text-[#fff8e8] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:text-6xl">
          <span className="shimmer-text" data-text="Juhi">Juhi</span>{' '}
          <span className="mx-1 align-middle font-serif text-2xl text-[#7a151b] md:text-3xl">Weds</span>
          <br />
          <span className="shimmer-text" data-text="Shubhojit">Shubhojit</span>
        </h1>
      </motion.div>
    </section>
  );
}