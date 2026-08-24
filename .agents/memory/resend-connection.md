---
name: Resend connection behavior
description: Resend connection permissions and the portfolio form delivery path.
---

The portfolio contact form uses the Resend connector through the server. A send-only Resend key can successfully POST to the email endpoint while returning 401 for read-only endpoints such as domain listing.

**Why:** The connected credential is intentionally restricted to sending, so a failed domain probe does not prove that form delivery is broken.

**How to apply:** Diagnose the actual POST /emails path and provider response before changing the form when Resend appears connected but reads are unauthorized.