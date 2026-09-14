---
name: Google Sheet CSV in browser
description: Which Google Sheets CSV endpoint works for client-side fetch
---
Rule: To read a public Google Sheet as CSV from browser JS, use the gviz endpoint `https://docs.google.com/spreadsheets/d/<id>/gviz/tq?tqx=out:csv` — NOT `/export?format=csv`.
**Why:** The /export URL responds 307 to googleusercontent.com; the redirect leg breaks CORS in browsers even though curl -L succeeds, so client fetch fails while server-side checks look fine. gviz serves 200 directly with proper CORS.
**How to apply:** Any feature fetching sheet data client-side (e.g. the blessings wall). Cache-bust with an extra `&t=` param.
