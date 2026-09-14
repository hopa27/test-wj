# Wedding Invitation

A mobile-first, static Hindu wedding invitation website: guests tap a closed envelope to open the invitation (starting subtle background music), then scroll through a Mahakal temple parallax hero with falling petals, a names reveal with Sanskrit text, a scratch-card date reveal, event timeline, venue, and blessings.

## Run & Operate

- `pnpm install --frozen-lockfile` — install the workspace dependencies from the lockfile
- `pnpm --filter @workspace/wedding-invitation run dev` — run the invitation locally; Replit normally starts this through the managed `artifacts/wedding-invitation: web` workflow
- `pnpm --filter @workspace/wedding-invitation run typecheck` — typecheck the invitation
- `pnpm --filter @workspace/wedding-invitation run build` — create the production build
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/wedding-invitation run check:rsvp-form` — verify the RSVP Google Form still matches the site's hardcoded field IDs/options (see `artifacts/wedding-invitation/RSVP_FORM_GUIDE.md`)
- No environment variables are required to run the invitation.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite 7, Tailwind CSS 4
- Animation: Framer Motion
- Offline support: Vite PWA

## Where things live

- `artifacts/wedding-invitation/` — the static wedding invitation web app (React + Vite, frontend-only, no backend)
- `artifacts/wedding-invitation/src/lib/weddingDetails.ts` — couple names, date, venue, events (edit here to personalize)
- `artifacts/wedding-invitation/public/audio/ambient.mp3` — generated background music
- `artifacts/wedding-invitation/src/index.css` — theme tokens (gold/temple palette)

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
