# Scroll-Scrub Film — Setup Guide

The invite has a hidden "film" section right after the hero: as guests
scroll, your video plays frame-by-frame on a full-screen sticky canvas,
like a royal-wedding invite. It stays invisible until you add a video.

## Adding your video

1. Upload your clip (MP4/MOV/WebM) anywhere in the project — e.g. drop it
   into `attached_assets/`. A short clip works best: **5–20 seconds**.
2. From the project root, run:

   ```bash
   cd artifacts/wedding-invitation
   node scripts/convert-film.mjs ../../attached_assets/your-video.mp4
   ```

   This extracts ~12 frames per second into `public/film/` in two tiers:
   - `lo/` — small frames used while actively scrolling (preloaded behind
     the wax-seal intro so scrubbing never stutters)
   - `hi/` — crisp frames shown whenever scrolling pauses

3. Reload the invite. The film section appears automatically between the
   hero and the invitation.

## Notes

- **Length**: the page adds roughly half a screen of scroll per second of
  film. A 10-second clip ≈ 5–6 screens of cinematic scrubbing.
- **Size**: a 10s clip is typically ~3–6 MB in the lo tier. If it comes out
  heavier, re-run with a lower fps: `node scripts/convert-film.mjs video.mp4 10`
- **Accessibility**: guests with "reduce motion" enabled see a single crisp
  still from the middle of your film instead of the scroll effect.
- **Replacing the video**: just run the script again — it clears and
  rewrites `public/film/`.
- **Removing the film**: delete the `public/film/` folder.
