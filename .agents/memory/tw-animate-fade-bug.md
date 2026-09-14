---
name: tw-animate fade-in classes don't fire
description: Post-intro content reveal in the wedding invitation goes blank when using tw-animate-css utility classes
---
The wedding invitation's post-intro reveal (home.tsx) was twice left blank because a wrapper used `opacity-0 animate-in fade-in duration-1000 delay-500 fill-mode-forwards`. The animation classes never fire in this setup, so the wrapper stays at opacity 0 and the page appears empty (only the floating audio toggle visible).

**Why:** tw-animate-css enter animations did not apply in this project's Tailwind v4 setup; the design subagent reintroduced the same pattern during a rework and re-broke the page.

**How to apply:** For reveal/fade-in of mounted content, use a framer-motion `motion.div` with `initial={{opacity:0}} animate={{opacity:1}}`. After any design-subagent rework of home.tsx or intro components, check for reintroduced `animate-in` wrappers.
