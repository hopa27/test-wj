import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { weddingDetails } from '../../lib/weddingDetails';

export function Invitation() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative flex min-h-[820px] w-full items-start justify-center overflow-hidden bg-[#fbf5e9] bg-[length:100%_100%] bg-top bg-no-repeat px-10 pb-24 pt-24 sm:min-h-[900px] sm:px-16 sm:pt-28 md:min-h-[980px] md:pt-32"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}images/invitation-floral-arch.png)`,
      }}
    >
      <motion.div
        className="absolute left-[10%] top-[30%] z-10 text-[#b31217] drop-shadow-[0_2px_4px_rgba(74,13,16,0.25)]"
        aria-hidden
        initial={{ x: 0, y: 0, rotate: -12, opacity: 0 }}
        animate={
          reduceMotion
            ? { opacity: 0.75 }
            : {
                x: ['0vw', '24vw', '48vw', '70vw'],
                y: [0, -38, 18, -24],
                rotate: [-12, 10, -8, 14],
                opacity: [0, 0.9, 0.9, 0],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 13,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
                times: [0, 0.32, 0.68, 1],
              }
        }
      >
        <motion.svg
          viewBox="0 0 48 36"
          className="h-8 w-10 md:h-10 md:w-12"
          animate={reduceMotion ? undefined : { scaleX: [1, 0.35, 1] }}
          transition={{ duration: 0.42, repeat: Infinity, ease: 'easeInOut' }}
          fill="currentColor"
        >
          <path d="M22 18C15 5 3 3 4 13c1 7 9 9 18 7Z" opacity="0.82" />
          <path d="M26 18C33 5 45 3 44 13c-1 7-9 9-18 7Z" opacity="0.82" />
          <path d="M22 20C14 20 8 25 11 31c3 5 9 1 12-7Z" opacity="0.65" />
          <path d="M26 20c8 0 14 5 11 11-3 5-9 1-12-7Z" opacity="0.65" />
          <ellipse cx="24" cy="20" rx="2" ry="9" fill="#7a151b" />
          <path d="M23 12c-2-5-5-6-7-7M25 12c2-5 5-6 7-7" fill="none" stroke="#7a151b" strokeWidth="1.2" strokeLinecap="round" />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1 }}
        className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center text-center"
      >
        <img
          src={`${import.meta.env.BASE_URL}images/ganesha.webp`}
          alt="Shri Ganesha"
          className="mb-2 h-16 w-16 object-contain drop-shadow-sm md:h-20 md:w-20"
        />
        <p className="font-devanagari text-lg text-primary md:text-2xl">
          || श्री गणेशाय नमः ||
        </p>
        <p className="mt-3 max-w-sm whitespace-pre-line font-devanagari text-xs leading-relaxed text-primary/80 md:text-sm">
          {weddingDetails.shloka}
        </p>
        <p className="mt-5 max-w-sm font-serif text-[11px] leading-relaxed text-foreground/60 md:text-sm">
          With the divine blessings of Shree Ganesh, Baba Mahakal, and our beloved
          family, we joyfully invite you to celebrate the sacred union of
        </p>

        <div className="mt-8 flex flex-col items-center">
          <h2 className="font-display text-5xl leading-none text-primary drop-shadow-sm md:text-7xl">
            {weddingDetails.brideName}
          </h2>
          <p className="relative z-20 mt-3 max-w-[15rem] rounded-full bg-[#fbf5e9]/90 px-4 py-1.5 font-serif text-[10px] leading-relaxed tracking-wide text-foreground/70 shadow-[0_2px_10px_rgba(74,13,16,0.08)] backdrop-blur-[2px] md:max-w-xs md:text-xs">
            Daughter of Mr. Sandeep Mehendale &amp; Mrs. Kalpana Mehendale
          </p>

          <span className="my-4 font-display text-3xl text-accent">&</span>

          <h2 className="font-display text-5xl leading-none text-primary drop-shadow-sm md:text-7xl">
            {weddingDetails.groomName}
          </h2>
          <p className="mt-2 max-w-xs font-serif text-[10px] leading-relaxed tracking-wide text-foreground/60 md:text-xs">
            Son of Mr. Goutam Saha and Mrs. Rumu Saha
          </p>
        </div>
      </motion.div>
    </section>
  );
}