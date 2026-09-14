import React from 'react';
import { motion } from 'framer-motion';
import { weddingDetails } from '../../lib/weddingDetails';
import { CalendarClock, MapPin, Sparkles, Music, Flame, PartyPopper } from 'lucide-react';

const EVENT_ICONS = [Sparkles, Music, Flame, PartyPopper];

// Vibrant per-event color themes: Haldi, Sangeet, Wedding, Reception
const EVENT_THEMES = [
  {
    // Haldi — marigold yellow
    accent: '#E8A200',
    heading: '#9C6D00',
    gradient: 'linear-gradient(135deg, rgba(255,196,0,0.10) 0%, rgba(255,140,0,0.05) 55%, transparent 100%)',
    glow: 'rgba(255,180,0,0.18)',
    watermark: 'rgba(232,162,0,0.14)',
  },
  {
    // Sangeet — festive violet/magenta
    accent: '#B0338F',
    heading: '#7C2265',
    gradient: 'linear-gradient(135deg, rgba(186,51,166,0.09) 0%, rgba(120,40,180,0.05) 55%, transparent 100%)',
    glow: 'rgba(186,51,166,0.16)',
    watermark: 'rgba(176,51,143,0.14)',
  },
  {
    // Wedding — regal rose pink
    accent: '#C2185B',
    heading: '#8E1044',
    gradient: 'linear-gradient(135deg, rgba(214,51,108,0.09) 0%, rgba(160,20,90,0.05) 55%, transparent 100%)',
    glow: 'rgba(214,51,108,0.16)',
    watermark: 'rgba(194,24,91,0.14)',
  },
  {
    // Reception — royal sapphire blue
    accent: '#2E4FB5',
    heading: '#1F3684',
    gradient: 'linear-gradient(135deg, rgba(62,90,200,0.09) 0%, rgba(40,50,150,0.05) 55%, transparent 100%)',
    glow: 'rgba(62,90,200,0.16)',
    watermark: 'rgba(46,79,181,0.14)',
  },
];
import { Mandala } from './Mandala';
import { OrnamentalDivider } from './OrnamentalDivider';

export function Timeline() {
  return (
    <section className="pt-24 pb-8 px-6 bg-[#FBF6EF] relative overflow-hidden">
      {/* Mandalas following the RSVP section's pattern */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 pointer-events-none opacity-20">
        <Mandala variant="full" className="w-[420px]" />
      </div>
      <div className="absolute top-[30%] left-0 -translate-x-1/3 pointer-events-none opacity-10">
        <Mandala variant="full" className="w-[350px]" />
      </div>
      <div className="absolute top-[60%] right-0 translate-x-1/3 pointer-events-none opacity-10">
        <Mandala variant="full" className="w-[350px]" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-20">
        <Mandala variant="full" className="w-[420px]" />
      </div>
      
      <div className="max-w-xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl text-primary mb-4">Celebrations</h2>
          <OrnamentalDivider className="w-[200px] mx-auto text-accent/50" />
        </motion.div>

        <div className="relative border-l border-accent/30 ml-4 md:ml-8">
          {weddingDetails.events.map((event, index) => (
            <motion.div 
              key={event.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`${index === weddingDetails.events.length - 1 ? 'mb-0' : 'mb-12'} ml-8 relative`}
            >
              {/* Ornamental timeline marker — petal rosette */}
              <svg
                viewBox="0 0 24 24"
                className="absolute w-6 h-6 top-0.5"
                style={{
                  // Center the rosette exactly on the 1px timeline: items are ml-8 (32px)
                  // from the border line, marker is 24px wide → 32 + 12 - 0.5
                  left: '-43.5px',
                  color: EVENT_THEMES[index % EVENT_THEMES.length].accent,
                  filter: `drop-shadow(0 0 6px ${EVENT_THEMES[index % EVENT_THEMES.length].glow})`,
                }}
                aria-hidden
              >
                {/* Eight petals */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path
                    key={deg}
                    d="M12 3.2 C10.6 6 10.6 8.4 12 10 C13.4 8.4 13.4 6 12 3.2 Z"
                    fill="currentColor"
                    opacity="0.85"
                    transform={`rotate(${deg} 12 12)`}
                  />
                ))}
                <circle cx="12" cy="12" r="2.6" fill="var(--card, #fff)" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              </svg>
              
              <div
                className="relative bg-background/80 rounded-xl p-6 shadow-sm overflow-hidden border"
                style={{ borderColor: `${EVENT_THEMES[index % EVENT_THEMES.length].accent}35` }}
              >
                {/* Vibrant color wash */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: EVENT_THEMES[index % EVENT_THEMES.length].gradient }}
                />

                {/* Colored corner glow */}
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                  style={{ background: EVENT_THEMES[index % EVENT_THEMES.length].glow }}
                />

                {/* Large event icon watermark */}
                {(() => {
                  const Icon = EVENT_ICONS[index % EVENT_ICONS.length];
                  return (
                    <Icon
                      className="absolute -right-4 -bottom-4 w-28 h-28 rotate-[-8deg] pointer-events-none"
                      style={{ color: EVENT_THEMES[index % EVENT_THEMES.length].watermark }}
                      strokeWidth={1}
                    />
                  );
                })()}

                {/* Twinkling glitter specks */}
                {[
                  { top: '14%', left: '68%', size: 5, delay: 0 },
                  { top: '30%', left: '86%', size: 3.5, delay: 0.9 },
                  { top: '64%', left: '76%', size: 4.5, delay: 1.7 },
                  { top: '80%', left: '54%', size: 3, delay: 0.4 },
                  { top: '20%', left: '42%', size: 3, delay: 2.3 },
                  { top: '52%', left: '92%', size: 4, delay: 1.2 },
                ].map((g, gi) => (
                  <motion.svg
                    key={gi}
                    viewBox="0 0 10 10"
                    className="absolute pointer-events-none"
                    style={{
                      top: g.top,
                      left: g.left,
                      width: g.size * 2.4,
                      height: g.size * 2.4,
                      color: EVENT_THEMES[index % EVENT_THEMES.length].accent,
                    }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.15, 0.5], rotate: [0, 45, 90] }}
                    transition={{ duration: 2.4, delay: g.delay, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <path d="M5 0 L6.1 3.9 L10 5 L6.1 6.1 L5 10 L3.9 6.1 L0 5 L3.9 3.9 Z" fill="currentColor" />
                  </motion.svg>
                ))}

                {/* Ornamental flourish — top right corner */}
                <svg
                  viewBox="0 0 64 64"
                  className="absolute top-1.5 right-1.5 w-10 h-10 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  style={{ color: `${EVENT_THEMES[index % EVENT_THEMES.length].accent}99` }}
                  aria-hidden
                >
                  {/* Corner arcs */}
                  <path d="M62 24 C62 12 52 2 40 2" />
                  <path d="M62 32 C62 15.5 48.5 2 32 2" opacity="0.45" />
                  {/* Curling vine with leaves */}
                  <path d="M40 2 C34 8 34 14 40 18 C46 14 46 8 40 2" strokeWidth="0.9" />
                  <path d="M62 24 C56 30 50 30 46 24 C50 20 56 20 62 24" strokeWidth="0.9" />
                  {/* Central lotus bud */}
                  <path d="M50 8 C47 12 47 16 50 19 C53 16 53 12 50 8 Z" fill="currentColor" stroke="none" opacity="0.7" />
                  <circle cx="43.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
                  <circle cx="55" cy="21" r="1.2" fill="currentColor" stroke="none" />
                  <circle cx="58" cy="10" r="1" fill="currentColor" stroke="none" opacity="0.7" />
                </svg>

                {/* Ornamental corner strokes */}
                <svg viewBox="0 0 40 40" className="absolute top-1.5 left-1.5 w-7 h-7 text-accent/50 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M2 20 C2 10 10 2 20 2" />
                  <path d="M7 20 C7 12.8 12.8 7 20 7" opacity="0.5" />
                  <circle cx="11.5" cy="11.5" r="1.3" fill="currentColor" stroke="none" />
                </svg>
                <svg viewBox="0 0 40 40" className="absolute bottom-1.5 right-1.5 w-7 h-7 text-accent/50 rotate-180 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M2 20 C2 10 10 2 20 2" />
                  <path d="M7 20 C7 12.8 12.8 7 20 7" opacity="0.5" />
                  <circle cx="11.5" cy="11.5" r="1.3" fill="currentColor" stroke="none" />
                </svg>

                <div className="relative">
                  <h3
                    className="font-display text-4xl mb-2"
                    style={{ color: EVENT_THEMES[index % EVENT_THEMES.length].heading }}
                  >
                    {event.name}
                  </h3>
                  <div
                    className="w-10 h-[1px] mb-4"
                    style={{ background: `${EVENT_THEMES[index % EVENT_THEMES.length].accent}88` }}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center text-foreground/80 gap-3">
                      <CalendarClock className="w-4 h-4" style={{ color: EVENT_THEMES[index % EVENT_THEMES.length].accent }} />
                      <span className="text-sm tracking-wide uppercase">{event.day}, {event.date} • {event.time}</span>
                    </div>

                    <div className="flex items-center text-foreground/80 gap-3">
                      <MapPin className="w-4 h-4" style={{ color: EVENT_THEMES[index % EVENT_THEMES.length].accent }} />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
