# Pull request

## What changed

<!-- One or two sentences. -->

## Contributor checklist

Public docs have strict content rules. Tick each box to confirm:

- [ ] No env-var names (e.g. `*_KEY`, `*_SECRET`, `ANTHROPIC_API_KEY`)
- [ ] No internal service, class, table, or config-path names (e.g. `EmailEnrichmentService`, `app/Services/...`, `config('services...')`, `workspaces.instantly_webhook_secret`)
- [ ] No vendor scoring, reorder, or fallback-order language (the vendor waterfall details stay internal)
- [ ] No cross-links into private repos or files outside `skupio-user-docs`
- [ ] No references to internal Slack channels, Linear tickets, or vendor pricing
- [ ] `audience` frontmatter does NOT include `engineer` (this is end-user/operator content)
- [ ] Style guide compliance: second person, present tense, sentence-case headings, no emojis
- [ ] Locked terminology used per `user-docs/_meta/terminology.md`
- [ ] One H1 per file (the H1 is the page title)
- [ ] All links resolve to real files / pages

CI runs `pnpm leak-check`, `pnpm validate:frontmatter`, and link resolution. PRs failing these gates cannot merge.

## Notes

<!-- Optional context for the reviewer. -->
