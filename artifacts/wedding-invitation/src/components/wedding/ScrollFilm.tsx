import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  getFilmManifest,
  loadFilmManifest,
  loFrameUrl,
  hiFrameUrl,
  preloadLoTier,
  type FilmManifest,
} from '../../lib/film';

/**
 * Cinematic scroll-scrubbed film: a tall section with a sticky canvas that
 * plays a pre-rendered webp frame sequence as the guest scrolls, like a
 * royal-wedding invite film.
 *
 * Renders nothing until the couple's video has been converted with
 * `node scripts/convert-film.mjs <video>` (see FILM_GUIDE.md).
 */
export function ScrollFilm() {
  const [manifest, setManifest] = useState<FilmManifest | null>(getFilmManifest());
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!manifest) loadFilmManifest().then((m) => m && setManifest(m));
  }, [manifest]);

  if (!manifest) return null;
  if (reducedMotion) return <StaticStill manifest={manifest} />;
  return <FilmScrubber manifest={manifest} />;
}

/** Reduced-motion fallback: a single crisp still, no tall scroll section. */
function StaticStill({ manifest }: { manifest: FilmManifest }) {
  const mid = Math.max(1, Math.round(manifest.frameCount / 2));
  return (
    <section className="relative w-full bg-background py-10 px-4 flex justify-center">
      <img
        src={hiFrameUrl(mid)}
        alt="A moment from our film"
        className="w-full max-w-3xl rounded-xl border border-accent/30 shadow-lg object-contain"
      />
    </section>
  );
}

function FilmScrubber({ manifest }: { manifest: FilmManifest }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loImages = useRef<(HTMLImageElement | null)[]>([]);
  const hiCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const state = useRef({
    frame: -1, // last drawn frame (fractional for cross-fade)
    raf: 0,
    idleTimer: 0,
    active: false,
    destroyed: false,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { frameCount } = manifest;
    const s = state.current;

    s.destroyed = false;

    // Kick off (or reuse) the lo-tier preload. We retain only the small
    // (480px) Image elements; the browser manages their decoded bitmaps.
    preloadLoTier(manifest).then((imgs) => {
      if (s.destroyed) return;
      loImages.current = imgs;
      scheduleDraw();
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sizeCanvas = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      s.frame = -1; // force redraw
      scheduleDraw();
    };

    /** Draw an image cover-fit onto the canvas with the given alpha. */
    const drawCover = (img: HTMLImageElement, alpha: number) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / total));
    };

    const draw = () => {
      s.raf = 0;
      if (s.destroyed || !s.active) return;
      const imgs = loImages.current;
      if (!imgs.length) return;
      const f = progress() * (frameCount - 1);
      if (Math.abs(f - s.frame) < 0.02) return;
      s.frame = f;

      const i = Math.floor(f);
      const a = imgs[i];
      const b = imgs[Math.min(i + 1, frameCount - 1)];
      if (!a) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCover(a, 1);
      // Cross-fade toward the next frame for smoother motion at low fps.
      if (b && b !== a) drawCover(b, f - i);
      ctx.globalAlpha = 1;

      // When scrolling pauses, swap in the crisp hi-res frame.
      window.clearTimeout(s.idleTimer);
      s.idleTimer = window.setTimeout(() => drawHi(Math.round(s.frame)), 180);
    };

    // Device-adaptive hi-res cache: keep it small on phones.
    const hiCacheCap = window.innerWidth < 768 ? 6 : 20;

    const drawHi = (index: number) => {
      if (s.destroyed || !s.active) return;
      const n = index + 1; // frames are 1-based on disk
      const cached = hiCache.current.get(n);
      if (cached) {
        // Touch-on-read so revisited frames stay cached (LRU).
        hiCache.current.delete(n);
        hiCache.current.set(n, cached);
        if (Math.round(s.frame) === index) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawCover(cached, 1);
        }
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (s.destroyed) return;
        while (hiCache.current.size >= hiCacheCap) {
          const oldest = hiCache.current.keys().next().value;
          if (oldest === undefined) break;
          hiCache.current.delete(oldest);
        }
        hiCache.current.set(n, img);
        if (s.active && Math.round(s.frame) === index) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawCover(img, 1);
        }
      };
      img.src = hiFrameUrl(n);
    };

    const scheduleDraw = () => {
      if (!s.raf && s.active) s.raf = requestAnimationFrame(draw);
    };
    const onScroll = () => scheduleDraw();

    // Only listen to scroll while the section is on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        s.active = entry.isIntersecting;
        if (s.active) {
          window.addEventListener('scroll', onScroll, { passive: true });
          s.frame = -1;
          scheduleDraw();
        } else {
          window.removeEventListener('scroll', onScroll);
          // Go fully quiescent off-screen: cancel pending draw work.
          if (s.raf) {
            cancelAnimationFrame(s.raf);
            s.raf = 0;
          }
          window.clearTimeout(s.idleTimer);
        }
      },
      { rootMargin: '20% 0px' },
    );
    io.observe(section);

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    return () => {
      s.destroyed = true;
      s.active = false;
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', sizeCanvas);
      if (s.raf) cancelAnimationFrame(s.raf);
      window.clearTimeout(s.idleTimer);
      hiCache.current.clear();
    };
  }, [manifest]);

  // ~55vh of scroll per second of film, clamped so short/long clips both feel right.
  const seconds = manifest.frameCount / (manifest.fps || 12);
  const heightVh = Math.min(500, Math.max(220, Math.round(seconds * 55) + 100));

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#120607]"
      style={{ height: `${heightVh}vh` }}
      aria-label="Our film — scroll to play"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <canvas ref={canvasRef} className="h-full w-full" />
        {/* Gentle vignettes blending the film into the page */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  );
}
