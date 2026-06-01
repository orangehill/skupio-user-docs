# Security policy

## Reporting a vulnerability in Skupio

If you've discovered a vulnerability in the Skupio product, the API, or the Chrome extension, please email **security@skupio.co** with:

- A description of the vulnerability
- Steps to reproduce
- Affected component (extension, dashboard, API, docs site)
- Your suggested severity rating

We aim to acknowledge within 2 business days and triage within 5.

## Scope of this repo

This repository (`skupio-user-docs`) contains **only public documentation content**. It is intentionally separated from the engineering source so it can be safely fork-and-PR-friendly.

The CI on every PR enforces a leak-detection gate that blocks merges containing patterns matching env-var names, internal service paths, or vendor-internal language. If a leak-check false positive blocks a legitimate edit, mention `@tihomiro` in the PR and we'll review.

## What Skupio support will never do

Skupio support staff will **never** ask you for:

- Workspace API keys, vendor credentials, or any secret value
- Your LinkedIn session cookies
- SSH keys or repo access tokens
- Payment credentials outside the official Stripe checkout

If you receive a request matching any of the above in an issue or PR on this repo, it is fraudulent. Report it to **security@skupio.co**.
