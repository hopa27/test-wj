import React from 'react';
import { motion } from 'framer-motion';
import { Mandala } from './Mandala';

type PhotoInterludeProps = {
  src: string;
  alt: string;
  framed?: boolean;
};

export function PhotoInterlude({ src, alt, framed = false }: PhotoInterludeProps) {
  return (
    <section
      className={`relative w-full overflow-hidden ${
        framed
          ? 'bg-[#FBF6EF]'
          : 'bg-[#FBF6EF]'
      }`}
    >
      {framed && (
        <>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-20" aria-hidden>
            <Mandala variant="full" className="w-[420px]" />
          </div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-20" aria-hidden>
            <Mandala variant="full" className="w-[420px]" />
          </div>
        </>
      )}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto w-full max-w-3xl overflow-hidden"
      >
        <img
          src={`${import.meta.env.BASE_URL}${src}`}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`block w-full ${framed ? 'object-contain' : 'max-h-[90svh] object-cover'}`}
        />
      </motion.div>
    </section>
  );
}