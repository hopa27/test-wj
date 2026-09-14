---
name: Imported Git history gaps
description: How to recognize and safely recover when an imported repository cannot push because old Git objects are missing.
---

An imported or grafted repository can have a usable current tree but incomplete historical objects. If a push to a confirmed-empty remote transfers data and then fails with “did not receive expected object,” do not keep retrying or assume the remote is ahead. Preserve the inherited history on a local backup branch, then publish the current tree as a clean root commit.

**Why:** Reconnecting HTTPS credentials and switching to a repository-scoped SSH deploy key fixed authentication, but the push still failed during remote unpack because an old object was absent locally. A root snapshot removed the broken ancestry while preserving every current project file.

**How to apply:** First verify through the provider API that the remote is actually empty. Preserve the old branch before changing history. Use a repository-scoped deploy key only when normal account authentication remains unavailable, and keep its private key outside tracked project files.