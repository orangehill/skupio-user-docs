# skupio-user-docs

User-facing documentation content for [Skupio](https://skupio.co), rendered at **[docs.skupio.co](https://docs.skupio.co)** via the [skupio-docs-site](https://github.com/orangehill/skupio-docs-site) Next.js + Nextra v4 app.

This repo is **content-only**. The site code lives in skupio-docs-site, which mounts this repo as a Git submodule at `content/`.

## Layout

```
user-docs/
├── index.mdx            # docs landing
├── tutorials/           # sequence-paced walkthroughs
├── how-to/              # problem-shaped recipes
├── reference/           # lookup-shaped pages
└── concepts/            # prose-shaped explanations
_meta/
├── terminology.md       # locked phrasing per audience
└── style-guide.md       # voice + structure rules
scripts/
└── leak-check.mjs       # CI gate forbidding secret-shaped patterns
```

## Authoring conventions

- **Frontmatter** follows the locked Skupio convention: `date`, `topic`, `status`, `audience`, `authors`, `companions`. No `title` (the H1 is the title) and no `description` (the first paragraph is the description). See [_meta/frontmatter-conventions.md](https://github.com/orangehill/skupio-docs/blob/main/_meta/frontmatter-conventions.md) for the full schema.
- **Voice**: second person, present tense, sentence-case headings, no emojis. See `_meta/style-guide.md`.
- **Terminology**: Skupio-specific terms have locked phrasing per audience. See `_meta/terminology.md`.
- **No engineer audience.** This is a public, user-facing repo. Frontmatter `audience` may not include `engineer`. The leak-check CI gate fails the build on violations.
- **No secrets, env-var names, internal class paths, or vendor scoring/reorder language.** The leak-check CI gate enforces a denylist. Run locally with `pnpm leak-check`.

## Local preview

The renderer is in [skupio-docs-site](https://github.com/orangehill/skupio-docs-site). To preview content edits:

```bash
cd ../skupio-docs-site
git submodule update --init --recursive   # mounts this repo at content/
pnpm dev                                  # http://localhost:3000
```

## Contributing

Edit a file → submit a PR. Each PR runs:
1. Frontmatter schema validation
2. Leak-check (forbids secret-shaped patterns + engineer-audience tags)
3. Markdown link resolution
4. MDX render smoke test

A maintainer reviews per `CODEOWNERS`. See `.github/PULL_REQUEST_TEMPLATE.md` for the contributor checklist.

## License

- **Content** (everything under `user-docs/`): [CC-BY-4.0](user-docs/LICENSE). Use it, fork it, share it, attribute Skupio.
- **Scripts and config** (everything else): [MIT](LICENSE).
