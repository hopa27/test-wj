/**
 * Preloads the fonts and images guests see right after opening the wax-seal
 * intro, so nothing pops in or flashes once the scroll unrolls.
 *
 * Kicked off as soon as the intro mounts; the intro awaits the returned
 * promise (with a short cap) before revealing the hero.
 */

// Images visible in the hero and first sections right after opening.
const CRITICAL_IMAGES = [
  'images/hero-redesign/mahakal-background.jpg',
  'images/hero-redesign/floral-arch_2.png',
  'images/hero-redesign/couple_2.png',
  'images/hero-redesign/bottom-foreground.png',
  'images/wedding-logo.webp',
  'images/ganesha.webp',
  'images/mandala.webp',
];

// Font faces used across the page (family + representative weight/size).
const CRITICAL_FONTS = [
  '400 1rem Cinzel',
  '600 1rem Cinzel',
  '400 1rem "Great Vibes"',
  '400 1rem "Yatra One"',
  '400 1rem Lora',
];

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never block the reveal on a failed asset
    img.src = `${import.meta.env.BASE_URL}${src}`;
  });
}

function loadFonts(): Promise<unknown> {
  if (!('fonts' in document)) return Promise.resolve();
  return Promise.all(
    CRITICAL_FONTS.map((f) => document.fonts.load(f).catch(() => undefined)),
  );
}

let preloadPromise: Promise<void> | null = null;

/** Idempotent: starts on first call, later calls return the same promise. */
export function preloadCriticalAssets(): Promise<void> {
  if (!preloadPromise) {
    preloadPromise = Promise.all([
      ...CRITICAL_IMAGES.map(loadImage),
      loadFonts(),
      // If the couple's film has been added, warm its scrub tier too.
      import('./film').then((m) => m.preloadFilmIfPresent()).catch(() => undefined),
    ]).then(() => undefined);
  }
  return preloadPromise;
}

/** Resolves when preloading finishes or after `capMs`, whichever comes first. */
export function waitForCriticalAssets(capMs = 1600): Promise<void> {
  return Promise.race([
    preloadCriticalAssets(),
    new Promise<void>((resolve) => setTimeout(resolve, capMs)),
  ]);
}
