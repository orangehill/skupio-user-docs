---
date: 2026-06-01
topic: terminology
status: locked
audience: [operator, end-user]
authors: [tihomir-opacic, claude-opus-4-7]
---

# Terminology

This file locks the canonical phrasing of Skupio-specific terms across the user-facing docs. Parallel content authors should refer here before introducing a synonym.

## Locked terms

| Term | Canonical phrasing | When to use | When to avoid |
|---|---|---|---|
| Skupio | "Skupio" — no "the Skupio platform" | always | "the platform," "the app," "the tool" |
| Workflow | "the 7-stage workflow" | introducing the end-to-end flow | "the pipeline," "the process," "the loop" |
| Sample-then-trust | "sample-then-trust" | describing the lead workshop UX pattern | "trust-after-sample," "preview-then-approve" |
| Vendor waterfall | "the multi-provider email finder" (end-user) / "the enrichment waterfall" (operator) | explaining how Skupio finds emails | the actual vendor order (Icypeas → AMF → MV → MEV) is internal — never enumerate publicly |
| Deliverability stack | "Skupio's deliverability tuning" | high-level concept | the bounce-feedback scoring + reorder mechanism stays internal |
| Reply classification | "reply intent classification (5 buckets)" — bucket names locked: interested, send later, wrong person, not interested, out of office | inbox docs, sequence-studio docs | "reply categorization," "auto-tagging" |
| Mixed Interaction Model | "Mixed Interaction Model" | when explaining the studio UX | "the UI pattern," "the layout" |
| Two-phase launch | "two-phase Instantly launch (test cohort → main send)" | campaign-launch docs | "staged send," "warm-up send" |
| Hybrid architecture | "the hybrid architecture: browser-first extension + cloud orchestrator" | concept docs | "the dual-stack," "the split design" |
| Audio-first iteration | "audio-first iteration" or "voice → Opus iteration" | offer/audience/sequence studio docs | "voice authoring," "speech-to-text mode" |

## Distinct nouns (do not confuse)

| Distinct terms | Meaning |
|---|---|
| **Campaign** | A scheduled run that pairs a sequence + a lead list + sender(s). Lives in Skupio. |
| **Sequence** | The 5-step email cadence the AI authors. Lives inside a campaign. |
| **Cadence** | Not used in Skupio (this is Instantly's term). Use "sequence." |
| **Lead list** | A named collection of scraped leads, with a `lead-list` slug. Use "lead list" — two words. |
| **Audience** | The persona definition (job titles, industries, seniority) that filters who gets scraped. Audience produces a lead list when run. |
| **Offer** | The value proposition Skupio uses to write the AI sequence. Authored in the offer studio. |
| **Value proposition** | Not used internally; "offer" is the docs canonical. |
| **Workspace** | The tenancy boundary. Billing, members, lead lists, and campaigns are workspace-scoped. |
| **Team** | Marketing-only synonym for workspace. Use "workspace" in docs. |
| **Account** | The user's login (one per email). One account can belong to multiple workspaces. |

## Per-audience rules

| Audience | Words to avoid | Words to prefer |
|---|---|---|
| `[end-user]` | scrape, JWT, URN, webhook, endpoint, payload, classifier | collect, sign in, link, get notified, send-and-receive, message |
| `[operator]` | (no banned terms — operator docs may use precise nouns) | always introduce internal acronyms on first use (e.g. "Cross-provider consensus (CPC)") |

End-user docs may use "scrape" only when referring to the extension by its product name ("Skupio scrapes leads from LinkedIn") — never as a verb the user runs ("you scrape," "scraping leads"). Prefer "collect," "find," "import," or "add."

## Capitalisation

- **Free LinkedIn** — capitalised, two words. Refers to LinkedIn's free tier as distinct from Sales Navigator.
- **Sales Navigator** — capitalised, no hyphen. Always "Sales Navigator," never "Sales Nav" or "Sales Navigator Pro."
- **Skupio** — always capitalised first letter only. Never "SKUPIO" or "skupio.co" as the product name (use the URL only as a URL).
- **Claude Opus 4.7** — model docs only. For end-user pages, refer to "the AI" or "Claude." Never expose the model version in end-user prose.
- **Instantly** — capitalised first letter; brand name.

## Numbered references

- "v3.0" — the upcoming launch version. Use this as the milestone marker; avoid "v3" without the patch level.
- "v3.1," "v3.2" — fast-follow versions for deferred features (public API, MCP, etc.)
- Never write "version 3.0" or "v.3.0" — always "v3.0."
