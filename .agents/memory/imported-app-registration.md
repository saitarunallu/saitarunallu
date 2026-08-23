---
name: Imported app registration
description: Workflow behavior to watch when importing an existing repository into an artifact workspace.
---

When importing an existing web repository, preserve or restore its artifact registration before relying on the managed preview workflow; a copied app directory alone may not create a restartable workflow.

**Why:** The imported portfolio source was present and typechecked, but its artifact registration and managed workflow were removed during setup, so restarting by the initially returned managed name failed until the current workflow was checked.

**How to apply:** After importing, list the current artifacts and workflows, use the exact active workflow name, and only then restart and verify the preview.