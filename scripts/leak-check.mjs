#!/usr/bin/env node
/**
 * Leak detection for the public docs repo.
 *
 * Walks user-docs/**\/*.md{,x} and fails on any pattern that suggests
 * internal infrastructure, vendor scoring/reorder language, env-var names,
 * Laravel service class paths, or cross-links to engineer-private files.
 *
 * Why this exists: B-wave content in the private skupio-docs repo contains
 * literal API key names + internal class paths + the dynamic-reorder logic of
 * the vendor waterfall. None of that may land in this public, MIT/CC-BY repo.
 *
 * Run:  pnpm leak-check
 * CI:   .github/workflows/leak-check.yml runs this on every PR.
 */
import { readFile } from 'node:fs/promises'
import { globby } from 'globby'
import matter from 'gray-matter'

const DENYLIST = [
  // Env var name shapes
  { rx: /\b[A-Z][A-Z0-9_]+_KEY\b/, msg: 'env-var name pattern (looks like an *_KEY)' },
  { rx: /\b[A-Z][A-Z0-9_]+_SECRET\b/, msg: 'env-var name pattern (looks like an *_SECRET)' },
  { rx: /\b[A-Z][A-Z0-9_]+_TOKEN\b/, msg: 'env-var name pattern (looks like an *_TOKEN)' },
  { rx: /\bANTHROPIC_API_KEY\b/i, msg: 'Anthropic API key name' },
  { rx: /\bOPENAI_API_KEY\b/i, msg: 'OpenAI API key name' },
  { rx: /\bSTRIPE_WEBHOOK_SECRET\b/i, msg: 'Stripe webhook secret name' },
  { rx: /\bJWT_SECRET\b/i, msg: 'JWT secret name' },
  { rx: /\bCSRF_SECRET\b/i, msg: 'CSRF secret name' },

  // Internal Laravel topology
  { rx: /\bphp\s+artisan\b/, msg: 'Laravel artisan command (internal tooling)' },
  { rx: /\bEmailEnrichmentService\b/, msg: 'internal service class name' },
  { rx: /\bIcypeasClient\b/, msg: 'internal client class name' },
  { rx: /\bInstantlyClient\b/, msg: 'internal client class name' },
  { rx: /\bProviderScoringService\b/, msg: 'internal scoring service (vendor waterfall internals)' },
  { rx: /\bProviderVerdictOutcome\b/, msg: 'internal scoring model (vendor waterfall internals)' },
  { rx: /\bconfig\(['"]services\./, msg: 'Laravel config() call' },
  { rx: /\bapp\(['"]/, msg: 'Laravel app() service-locator call' },
  { rx: /\bschedule->/, msg: 'Laravel scheduler reference' },

  // File-system paths suggesting Laravel app root
  { rx: /(^|[\s`(])\/?app\/(Services|Http|Console|Jobs)\//, msg: 'Laravel app-relative path' },
  { rx: /(^|[\s`(])\/?config\/services\.php/, msg: 'Laravel config file path' },
  { rx: /(^|[\s`(])\/?routes\/(api|web)\.php/, msg: 'Laravel routes file' },
  { rx: /(^|[\s`(])\/?bootstrap\//, msg: 'Laravel bootstrap path' },
  { rx: /(^|[\s`(])\/?database\/migrations\//, msg: 'Laravel migrations path' },

  // Cross-links to engineer-private files outside this repo
  { rx: /STATUS-REPORT\.md/i, msg: 'reference to engineer-private STATUS-REPORT.md' },
  { rx: /DASHBOARD-PROPOSAL\.md/i, msg: 'reference to engineer-private DASHBOARD-PROPOSAL.md' },
  { rx: /\.\.\/(?:specs|product|pitch|plans|brainstorms|architecture)\//, msg: 'cross-link to engineer-private docs subtree' },

  // Vendor waterfall internals
  { rx: /\bworkspace[s]?\.\w+_secret\b/, msg: 'workspace secret column name' },
  { rx: /\bworkspace[s]?\.\w+_webhook_secret\b/, msg: 'workspace webhook secret column' },
  { rx: /\bipk_[a-zA-Z0-9]+/, msg: 'looks like an Icypeas API key prefix' },
  { rx: /\brankProvidersFor\b/, msg: 'internal scoring method name' },
  { rx: /\bresolveProvidersFromConfig\b/, msg: 'internal method name' },
  { rx: /\bULTRA_SURE|VERY_SURE\b/, msg: 'internal vendor confidence enum' },

  // Infrastructure hints (Hetzner, Frankfurt-region specifics are okay in marketing,
  // not okay in docs with operational detail)
  { rx: /\bHetzner[\s-]+(CX|CCX|CPX)\b/, msg: 'specific Hetzner SKU' },
  { rx: /\bnbg1-dc[0-9]+\b/, msg: 'specific Hetzner datacenter ID' },

  // Recipe markers for env var generation
  { rx: /openssl\s+rand\s+-base64\s+\d+/, msg: 'env-var generation recipe (leak suggests internal install doc)' },

  // Webhook path-segment auth pattern (the inbound Instantly endpoint)
  { rx: /\/webhook\/\{secret\}/, msg: 'internal webhook path-segment auth pattern' },
]

const ALLOWED_AUDIENCES = ['operator', 'end-user']
const FORBIDDEN_AUDIENCES = ['engineer']

const violations = []
const files = await globby(['user-docs/**/*.md', 'user-docs/**/*.mdx'])

for (const file of files) {
  const raw = await readFile(file, 'utf8')
  const { data: frontmatter, content } = matter(raw)

  // Audience denylist: engineer audience is engineer-private content
  const audiences = Array.isArray(frontmatter.audience) ? frontmatter.audience : []
  for (const aud of audiences) {
    if (FORBIDDEN_AUDIENCES.includes(aud)) {
      violations.push({
        file,
        line: 'frontmatter.audience',
        msg: `forbidden audience "${aud}" — engineer-audience content stays in skupio-docs`,
      })
    }
  }

  // Content denylist
  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const { rx, msg } of DENYLIST) {
      if (rx.test(line)) {
        violations.push({
          file,
          line: `L${i + 1}`,
          snippet: line.trim().slice(0, 100),
          msg,
        })
      }
    }
  }
}

if (violations.length > 0) {
  console.error(`\nLEAK CHECK FAILED — ${violations.length} violation(s)\n`)
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}`)
    console.error(`    ${v.msg}`)
    if (v.snippet) console.error(`    → ${v.snippet}`)
    console.error('')
  }
  console.error('See scripts/leak-check.mjs for the denylist. If a match is a false')
  console.error('positive, mention @tihomiro on the PR and we will adjust the rule.')
  process.exit(1)
}

console.log(`leak-check: OK (${files.length} files scanned, 0 violations)`)
