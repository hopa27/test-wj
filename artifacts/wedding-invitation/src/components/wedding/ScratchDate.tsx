import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

function getTimeLeft() {
  const target = new Date(weddingDetails.dateISO).getTime();
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-6 text-center"
    >
      <p className="font-serif text-xs tracking-[0.25em] uppercase text-foreground/50 mb-4">
        Counting down to the big day
      </p>
      <div className="flex justify-center gap-3">
        {units.map((u) => (
          <div
            key={u.label}
            className="flex flex-col items-center bg-card border border-accent/30 rounded-lg px-3 py-3 min-w-[68px] shadow-sm"
          >
            <span className="font-display text-3xl text-primary tabular-nums leading-none">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="font-serif text-[10px] tracking-[0.18em] uppercase text-foreground/50 mt-2">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const CONFETTI_COLORS = ['#D4AF37', '#FFE58F', '#b31217', '#f48ca8', '#e07b39', '#8e0e12', '#fbb6c9'];

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.4;
        const distance = 80 + Math.random() * 180;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 60 - Math.random() * 80,
          rotate: Math.random() * 720 - 360,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          w: 5 + Math.random() * 5,
          h: 8 + Math.random() * 6,
          delay: Math.random() * 0.15,
          duration: 1.2 + Math.random() * 0.9,
          round: Math.random() > 0.6,
        };
      }),
    []
  );

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-visible flex items-center justify-center">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y + 160, opacity: 0, rotate: p.rotate, scale: 0.8 }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.15, 0.6, 0.45, 1] }}
          className="absolute"
          style={{
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
import { weddingDetails } from '../../lib/weddingDetails';
import { OrnamentalDivider } from './OrnamentalDivider';

export function ScratchDate({ onRevealed }: { onRevealed?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateSize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Redraw cover if not fully revealed
      if (!isRevealed) {
        // Draw elegant gold foil cover
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#b31217');
        gradient.addColorStop(0.5, '#8e0e12');
        gradient.addColorStop(1, '#4a0d10');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add pattern/texture overlay
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        for(let i = 0; i < canvas.width; i += 4) {
          ctx.fillRect(i, 0, 1, canvas.height);
        }
        
        // Add text — sized to the card and split over two lines so it fits
        // the narrow arch shape
        const fontSize = Math.max(12, Math.round(canvas.width * 0.065));
        ctx.font = `600 ${fontSize}px "Cinzel", serif`;
        ctx.fillStyle = '#FFE58F'; // Soft gold for contrast on the red foil
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2 - fontSize * 0.75);
        ctx.fillText('THE DATE', canvas.width / 2, canvas.height / 2 + fontSize * 0.75);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Redraw when the card's actual size changes (e.g. it mounted while the
    // page was still hidden behind the intro and measured 0×0).
    const ro = new ResizeObserver(() => {
      if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
        updateSize();
      }
    });
    ro.observe(container);

    const getCoordinates = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    let lastPoint: { x: number; y: number } | null = null;
    let strokeCount = 0;

    /**
     * Dry paint-brush stroke: a ragged core plus long bristle streaks
     * dragged along the stroke direction, with spatter flecks at the
     * edges — like paint scraped over rough paper.
     */
    const stampBrush = (x: number, y: number, angle = Math.random() * Math.PI * 2) => {
      const r = 16;
      ctx.fillStyle = 'rgba(0,0,0,1)';

      // Ragged core — a blob built from overlapping offset circles
      for (let i = 0; i < 5; i++) {
        const ox = (Math.random() - 0.5) * r * 0.9;
        const oy = (Math.random() - 0.5) * r * 0.9;
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, r * (0.55 + Math.random() * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      // Bristle streaks — thin elongated strips along the drag direction
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      for (let i = 0; i < 6; i++) {
        // Perpendicular offset spreads bristles across the brush width
        const spread = (Math.random() - 0.5) * r * 2.4;
        const px = x - sin * spread;
        const py = y + cos * spread;
        const len = r * (0.8 + Math.random() * 1.8);
        const width = 0.8 + Math.random() * 2.2;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.fillRect(-len / 2, -width / 2, len, width);
        ctx.restore();
      }

      // Spatter flecks at the ragged edges
      for (let i = 0; i < 5; i++) {
        const a = Math.random() * Math.PI * 2;
        const dist = r * (0.9 + Math.random() * 1.1);
        const fr = 0.8 + Math.random() * 2.6;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * dist, y + Math.sin(a) * dist, fr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const scratch = (x: number, y: number) => {
      if (!ctx) return;
      ctx.globalCompositeOperation = 'destination-out';

      if (lastPoint) {
        // Stamp along the path so fast swipes leave a continuous groove
        const dx = x - lastPoint.x;
        const dy = y - lastPoint.y;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        const steps = Math.max(1, Math.floor(dist / 6));
        for (let i = 1; i <= steps; i++) {
          stampBrush(lastPoint.x + (dx * i) / steps, lastPoint.y + (dy * i) / steps, angle);
        }
      } else {
        stampBrush(x, y);
      }
      lastPoint = { x, y };

      // Checking pixels is expensive — do it every few stamps, not every move
      strokeCount++;
      if (strokeCount % 6 === 0) checkScratched();
    };

    let revealed = false;
    const checkScratched = () => {
      if (revealed) return;
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      let sampled = 0;
      // Sample every 4th pixel — plenty accurate, 4x cheaper
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] < 40) transparent++;
        sampled++;
      }

      const percent = (transparent / sampled) * 100;
      if (percent > 40) {
        revealed = true;
        setIsRevealed(true);
        onRevealed?.();
      }
    };

    const handleDown = (e: MouseEvent | TouchEvent) => {
      isDrawing.current = true;
      lastPoint = null;
      const { x, y } = getCoordinates(e);
      scratch(x, y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault(); // Prevent scrolling while scratching on mobile
      const { x, y } = getCoordinates(e);
      scratch(x, y);
    };

    const handleUp = () => {
      isDrawing.current = false;
      lastPoint = null;
      checkScratched();
    };

    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', handleMove, { passive: false });
    canvas.addEventListener('mouseup', handleUp);
    canvas.addEventListener('mouseleave', handleUp);

    canvas.addEventListener('touchstart', handleDown, { passive: true });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('resize', updateSize);
      ro.disconnect();
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleUp);
      canvas.removeEventListener('mouseleave', handleUp);

      canvas.removeEventListener('touchstart', handleDown);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleUp);
    };
  }, [isRevealed]);

  return (
    <section className="py-12 px-6 bg-background flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-5">
          <h3 className="font-display text-4xl text-primary mb-2">The Auspicious Day</h3>
          <OrnamentalDivider className="w-[180px] mx-auto text-accent/50" />
        </div>

        {/* Rectangular scratch card */}
        <div className="relative w-full max-w-[340px] mx-auto">
          <div
            ref={containerRef}
            className="relative w-full aspect-[16/7] overflow-hidden rounded-xl shadow-2xl border-2 border-accent/60 bg-card"
          >
            {/* Inner gold line */}
            <div
              className="absolute inset-[6px] rounded-lg border border-accent/40 pointer-events-none z-20"
            />

            {/* Content revealed beneath */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-card">
              <p className="font-serif text-3xl text-gradient-gold mb-1">{weddingDetails.date}</p>
              <p className="font-serif text-sm uppercase tracking-[0.2em] text-foreground/70">Monday</p>
            </div>

            {/* Canvas cover */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 z-10 cursor-pointer transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            />

            {/* Confetti explosion on reveal */}
            {isRevealed && <ConfettiBurst />}
          </div>

        </div>

        {!isRevealed && (
          <p className="text-center text-xs text-foreground/50 font-serif tracking-[0.2em] uppercase mt-6">
            Scratch the card to continue
          </p>
        )}

        {/* Countdown appears once the date is revealed */}
        {isRevealed && <Countdown />}
      </motion.div>
    </section>
  );
}
