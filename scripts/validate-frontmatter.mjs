#!/usr/bin/env node
/**
 * Frontmatter schema validator for the locked Skupio convention.
 *
 * Schema:
 *   date: YYYY-MM-DD (required)
 *   topic: kebab-case (required)
 *   status: draft | living | locked | deprecated (required)
 *   audience: [end-user | operator] (required, at least one, no "engineer")
 *   authors: [string] (required, at least one)
 *   companions: [string] (optional)
 *
 * Forbidden keys (per the locked convention): title, description, version, tags, next, prev.
 *
 * Run:  pnpm validate:frontmatter
 * CI:   .github/workflows/validate-frontmatter.yml on every PR.
 */
import { readFile } from 'node:fs/promises'
import { globby } from 'globby'
import matter from 'gray-matter'
import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true, strict: false })

const schema = {
  type: 'object',
  required: ['date', 'topic', 'status', 'audience', 'authors'],
  properties: {
    date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    topic: { type: 'string', pattern: '^[a-z0-9]+(-[a-z0-9]+)*$' },
    status: { enum: ['draft', 'living', 'locked', 'deprecated'] },
    audience: {
      type: 'array',
      items: { enum: ['end-user', 'operator'] },
      minItems: 1,
      uniqueItems: true,
    },
    authors: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      minItems: 1,
    },
    companions: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  additionalProperties: false,
}

const validate = ajv.compile(schema)
const files = await globby(['user-docs/**/*.md', 'user-docs/**/*.mdx'])

let errorCount = 0

for (const file of files) {
  const raw = await readFile(file, 'utf8')
  const { data } = matter(raw)

  // YAML auto-parses ISO date strings into Date objects. Coerce back to string
  // for validation against the locked YYYY-MM-DD pattern.
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10)
  }

  if (!validate(data)) {
    errorCount++
    console.error(`\n${file}`)
    for (const err of validate.errors ?? []) {
      console.error(`  ${err.instancePath || '/'} ${err.message}`)
      if (err.params?.allowedValues) {
        console.error(`    allowed: ${err.params.allowedValues.join(', ')}`)
      }
    }
  }
}

if (errorCount > 0) {
  console.error(`\nFAILED: ${errorCount} of ${files.length} file(s) have invalid frontmatter`)
  process.exit(1)
}

console.log(`validate:frontmatter: OK (${files.length} files)`)
