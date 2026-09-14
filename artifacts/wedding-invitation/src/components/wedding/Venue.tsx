import React from 'react';
import { motion } from 'framer-motion';
import { weddingDetails } from '../../lib/weddingDetails';
import { Map } from 'lucide-react';
import { Mandala } from './Mandala';
import { OrnamentalDivider } from './OrnamentalDivider';

export function Venue() {
  return (
    <section
      className="py-24 px-6 relative overflow-hidden flex justify-center"
      style={{
        background:
          'linear-gradient(180deg, #FBF6EF 0%, #F4E7CE 30%, #D9B98F 55%, #8C4A3C 78%, #4A0D10 92%, #34080A 100%)',
      }}
    >
      {/* Subtle gold wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 45%, transparent 75%)',
        }}
      />
      {/* Continuation of the photo section's bottom-left mandala across the seam */}
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-20" aria-hidden>
        <Mandala variant="full" className="w-[420px]" />
      </div>
      {/* Mandala straddling the bottom edge — its other half continues in the section below */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none opacity-15" aria-hidden>
        <img
          src={`${import.meta.env.BASE_URL}images/mandala.webp`}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-[120vw] max-w-[600px]"
        />
      </div>
      {/* Subtle Mandala */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-[0.06]">
        <Mandala variant="full" className="w-[500px] text-accent" />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border border-accent/40 px-4 py-8 md:px-6 md:py-12 rounded-2xl bg-[#FBF6EF]/90 backdrop-blur-sm shadow-xl relative"
        >
          {/* Corner flourishes matching the hero frame */}
          {[
            "top-3 left-3",
            "top-3 right-3 rotate-90",
            "bottom-3 right-3 rotate-180",
            "bottom-3 left-3 -rotate-90",
          ].map((pos) => (
            <svg
              key={pos}
              viewBox="0 0 60 60"
              className={`absolute ${pos} w-12 h-12 text-accent/60 pointer-events-none`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M2 30 C2 14 14 2 30 2" />
              <path d="M8 30 C8 17.8 17.8 8 30 8" opacity="0.55" />
              <path d="M14 30 C14 21.2 21.2 14 30 14" opacity="0.35" />
              <circle cx="2" cy="30" r="1.8" fill="currentColor" stroke="none" />
              <circle cx="30" cy="2" r="1.8" fill="currentColor" stroke="none" />
              <path d="M17 17 l3.2 3.2 M17 17 l4.5 -1 M17 17 l-1 4.5" opacity="0.6" />
              <circle cx="17" cy="17" r="2.4" opacity="0.8" />
              <circle cx="17" cy="17" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          ))}

          <h2 className="font-display text-5xl text-primary mb-2 mt-4">The Venue</h2>
          <OrnamentalDivider className="w-[180px] mx-auto text-accent/50 mb-8" />

          {/* Venue photo */}
          <div className="relative rounded-xl overflow-hidden border border-accent/30 shadow-lg mb-8 max-w-md mx-auto">
            <img
              src={`${import.meta.env.BASE_URL}images/venue-hotel-miracle.webp`}
              alt="Hotel Miracle at dusk"
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
          </div>

          
          <p className="font-serif text-2xl text-[#4a0d10] mb-2">
            {weddingDetails.venue}
          </p>
          <p className="font-serif text-sm text-[#4a0d10]/60 leading-relaxed max-w-sm mx-auto mb-6">
            {weddingDetails.venueAddress}
          </p>

          {/* Embedded map */}
          <div className="relative rounded-xl overflow-hidden border border-accent/30 shadow-lg mb-2 max-w-md mx-auto">
            <iframe
              title="Map to Hotel Miracle"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${weddingDetails.venue}, ${weddingDetails.venueAddress}`)}&output=embed`}
              className="w-full h-[260px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <a 
            href={weddingDetails.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-[background-color,transform] motion-safe:active:scale-[0.97] shadow-md"
          >
            <Map className="w-4 h-4" />
            <span>Open in Maps</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
