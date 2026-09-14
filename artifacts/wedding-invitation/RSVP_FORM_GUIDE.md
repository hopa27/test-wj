# How RSVPs work — and how not to break them

## The short version

When a guest fills the RSVP card on the wedding website, the site quietly
sends their answers into a **Google Form** behind the scenes. The responses
land in that form's "Responses" tab (and its linked Google Sheet, if you
created one).

**Important:** the website and the Google Form are connected by exact,
hardcoded details — the form's ID, each question's internal field ID, and the
*exact wording* of every answer option (down to spaces and punctuation).

> ⚠️ If anyone edits the Google Form — rewords an option, deletes or re-adds a
> question, or replaces the form — the website will keep showing guests the
> "Thank you!" screen, **but their RSVPs will silently vanish.** There is no
> error message anywhere.

## Rules of thumb

- **Don't edit the Google Form** once invitations go out. It's safe to *view*
  responses; just don't touch the questions or options.
- Safe edits: form title, description, theme colors.
- Risky edits (will break RSVPs until the website is updated to match):
  - changing the wording of any answer option
  - deleting a question and re-adding it (this changes its internal ID)
  - turning off "Accepting responses"
  - deleting or replacing the form
- If you *must* change the form, the website's copy of the details lives in
  `src/lib/weddingDetails.ts` under `rsvpForm` — it has to be updated to match,
  then the site rebuilt and republished.

## Checking that everything still works

### Automatic check (seconds)

From the project, run:

```
pnpm --filter @workspace/wedding-invitation run check:rsvp-form
```

It fetches the live Google Form and confirms every field and option the
website depends on still exists. Green checks = you're safe. Any ✖ = RSVPs
are likely being lost — fix the form or the site config before sharing links.

Run this after **any** change to the Google Form, and it's a good idea to run
it once a week while RSVPs are open.

### It also runs automatically

You don't have to remember to run it:

- **Every build/publish**: the check runs as the first step of the website
  build (`pnpm --filter @workspace/wedding-invitation run build`). If the form
  is out of sync, the build **fails loudly** before a broken site can be
  published.
- **Project validation**: it's registered as the `rsvp-form` validation check,
  so it runs whenever the project's validation checks are run (e.g. after the
  agent finishes a task).

If a build suddenly fails with ✖ marks from this check, it's not a code bug —
the Google Form changed. Fix the form (or update `rsvpForm` in
`src/lib/weddingDetails.ts`), then build again.

### Quick end-to-end test (2 minutes)

1. Open the wedding website in a **private/incognito** browser window.
2. Scroll to the RSVP card and submit a test response — use the name
   **"TEST — please ignore"** so it's easy to spot and delete later.
3. Open the Google Form → **Responses** tab (or the linked Google Sheet).
4. Confirm the test response appears with all fields filled in correctly
   (name, attending, guest count, events, contact number).
5. Delete the test row from the sheet / responses.

If the test response does **not** appear, RSVPs are being lost. Run the
automatic check above to see exactly which field broke, then either undo the
form change or update `rsvpForm` in `src/lib/weddingDetails.ts` to match.
