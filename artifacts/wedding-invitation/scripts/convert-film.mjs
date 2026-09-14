#!/usr/bin/env node
/**
 * Converts the couple's video into the two-tier webp frame sequence used by
 * the scroll-scrub film section (ScrollFilm.tsx).
 *
 * Usage:
 *   node scripts/convert-film.mjs <path-to-video> [fps]
 *
 * Output (into public/film/):
 *   lo/0001.webp …   small, heavily-compressed scrub tier (~480px wide)
 *   hi/0001.webp …   crisp tier shown when scrolling pauses (~1080px wide)
 *   manifest.json    { frameCount, width, height }
 *
 * Requires ffmpeg (already available in the Replit environment).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, '..', 'public', 'film');

const input = process.argv[2];
const fps = Number(process.argv[3] || 12);

if (!input || !fs.existsSync(input)) {
  console.error('Usage: node scripts/convert-film.mjs <path-to-video> [fps=12]');
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, 'lo'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'hi'), { recursive: true });

console.log(`Extracting frames at ${fps}fps…`);
execFileSync('ffmpeg', [
  '-i', input, '-vf', `fps=${fps},scale=480:-2`,
  '-c:v', 'libwebp', '-quality', '55', '-y',
  path.join(outDir, 'lo', '%04d.webp'),
], { stdio: 'inherit' });
execFileSync('ffmpeg', [
  '-i', input, '-vf', `fps=${fps},scale=1080:-2`,
  '-c:v', 'libwebp', '-quality', '72', '-y',
  path.join(outDir, 'hi', '%04d.webp'),
], { stdio: 'inherit' });

const frames = fs.readdirSync(path.join(outDir, 'lo')).filter((f) => f.endsWith('.webp'));
const frameCount = frames.length;

// Read the hi-tier dimensions from ffprobe on the first frame.
const probe = execFileSync('ffprobe', [
  '-v', 'error', '-select_streams', 'v:0',
  '-show_entries', 'stream=width,height', '-of', 'csv=s=x:p=0',
  path.join(outDir, 'hi', '0001.webp'),
]).toString().trim();
const [width, height] = probe.split('x').map(Number);

fs.writeFileSync(
  path.join(outDir, 'manifest.json'),
  JSON.stringify({ frameCount, width, height, fps }, null, 2),
);

const size = (dir) =>
  fs.readdirSync(dir).reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0);
console.log(`Done: ${frameCount} frames, ${width}x${height}`);
console.log(`  lo tier: ${(size(path.join(outDir, 'lo')) / 1e6).toFixed(1)} MB`);
console.log(`  hi tier: ${(size(path.join(outDir, 'hi')) / 1e6).toFixed(1)} MB`);
console.log('The film section will now appear automatically on the invite.');
