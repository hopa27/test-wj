#!/usr/bin/env node
/**
 * RSVP form health check.
 *
 * The wedding site submits RSVPs to a Google Form using hardcoded field IDs
 * and exact option strings (see src/lib/weddingDetails.ts -> rsvpForm).
 * If anyone edits the Google Form's questions or options, submissions can
 * fail silently: guests still see the thank-you screen but no data arrives.
 *
 * This script fetches the live Google Form and verifies that every field ID
 * and every option string the site depends on still exists on the form.
 *
 * Run it after ANY edit to the Google Form:
 *   node artifacts/wedding-invitation/scripts/check-rsvp-form.mjs
 * or:
 *   pnpm --filter @workspace/wedding-invitation run check:rsvp-form
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const detailsPath = path.join(here, '..', 'src', 'lib', 'weddingDetails.ts');

// Extract the rsvpForm config from weddingDetails.ts without a TS toolchain:
// pull out the values we depend on with targeted regexes.
const src = await readFile(detailsPath, 'utf8');

function grab(re, label) {
  const m = src.match(re);
  if (!m) {
    console.error(`✖ Could not find ${label} in weddingDetails.ts — has the file been restructured?`);
    process.exit(2);
  }
  return m[1];
}

const formId = grab(/formId:\s*"([^"]+)"/, 'formId');
const entryIds = [...src.matchAll(/"entry\.(\d+)"/g)].map((m) => m[1]);
const yesOption = grab(/yes:\s*"([^"]+)"/, 'attendingOptions.yes');
const noOption = grab(/no:\s*"([^"]+)"/, 'attendingOptions.no');
const guestOptions = JSON.parse(grab(/guestOptions:\s*(\[[^\]]*\])/, 'guestOptions'));
const eventOptions = JSON.parse(grab(/eventOptions:\s*(\[[^\]]*\])/, 'eventOptions'));

if (entryIds.length === 0) {
  console.error('✖ No entry.<id> field IDs found in weddingDetails.ts');
  process.exit(2);
}

const url = `https://docs.google.com/forms/d/e/${formId}/viewform`;
console.log(`Fetching live Google Form…\n  ${url}\n`);

let html;
try {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    console.error(`✖ Google Form returned HTTP ${res.status}. The form may have been deleted, closed, or the link changed.`);
    process.exit(1);
  }
  html = await res.text();
} catch (err) {
  console.error(`✖ Could not reach Google Forms: ${err.message}`);
  process.exit(1);
}

if (/not accepting responses|no longer accepting responses/i.test(html)) {
  console.error('✖ The Google Form is NOT accepting responses. Re-open it in Google Forms (Responses → Accepting responses).');
  process.exit(1);
}

// The form page embeds all field IDs and option strings in FB_PUBLIC_LOAD_DATA_.
// Option strings may appear HTML/JSON-escaped, so check a few encodings.
function containsText(needle) {
  const variants = new Set([
    needle,
    needle.replace(/'/g, '&#39;'),
    needle.replace(/'/g, '\\u0027'),
    JSON.stringify(needle).slice(1, -1),
  ]);
  return [...variants].some((v) => html.includes(v));
}

let failures = 0;
const check = (ok, label) => {
  console.log(`${ok ? '✔' : '✖'} ${label}`);
  if (!ok) failures++;
};

for (const id of entryIds) {
  check(html.includes(id), `field ID ${id} still exists on the form`);
}
check(containsText(yesOption), `"Yes" option text unchanged: ${JSON.stringify(yesOption)}`);
check(containsText(noOption), `"No" option text unchanged: ${JSON.stringify(noOption)}`);
for (const opt of guestOptions) {
  check(containsText(opt), `guest count option "${opt}" still exists`);
}
for (const opt of eventOptions) {
  check(containsText(opt), `event option "${opt}" still exists`);
}

console.log('');
if (failures > 0) {
  console.error(`✖ ${failures} check(s) FAILED. RSVPs from the website are likely being lost.`);
  console.error('  Fix: either revert the Google Form change, or update rsvpForm in');
  console.error('  src/lib/weddingDetails.ts to match the form (see RSVP_FORM_GUIDE.md).');
  process.exit(1);
}
console.log('✔ All checks passed. The website and the Google Form are in sync.');
console.log('  For a full end-to-end test, follow "Quick end-to-end test" in RSVP_FORM_GUIDE.md.');
