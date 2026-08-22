---
name: Preview port routing
description: The imported Vite portfolio must serve on the workspace preview port for the Replit preview gateway to reach it.
---

The portfolio preview workflow should use port 5000 explicitly rather than relying on Vite's default 5173.

**Why:** The workflow can report a healthy Vite server while the preview gateway returns an error when the app is only listening on 5173.

**How to apply:** Keep the dev command and workflow wait port aligned at 5000, and verify the workflow logs show Vite listening on 0.0.0.0:5000.