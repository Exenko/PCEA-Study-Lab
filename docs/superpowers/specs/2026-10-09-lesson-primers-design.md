# Lesson Primers — Design

## Goal

Each lesson section opens with a short interactive hook (a "primer") before any explanation, following Brilliant.org's interaction-first approach: the learner commits a guess, then the section's reading answers a question they already hold, and explicitly calls back to their guess.

Pilot scope: module M01 only (9 sections). Scale to other modules after studying with the pilot.

## Decisions

- Primer = hook at the start of a section (not module-level, not a prerequisite check).
- Built from existing directives (`check`, `challenge`, `widget`) plus two new interaction types: `sort` and `order`.
- Ungraded but must-attempt: one committed attempt, no wrong-answer state, never written to `checks`/stats/mastery/streaks.
- Approach: primer is a tagged first step of `section.body` (not a separate data field).

## Authoring syntax

### Primer marker

A single-line `:::primer:::` at the start of a section's first step makes that step the primer. The primer ends at the next `+++`. A wrapping block is not used because `Render.splitDirectives` closes any directive on a bare `:::`, so nesting is unsupported.

```
:::primer:::
Program offices, contractors, CAPE, GAO. Some of these have a stake in the number coming out low.

:::sort orgs
Q: Who's an advocate for the program, and who's independent?
buckets: Advocate | Independent
- Program Office = Advocate
- Prime contractor = Advocate
- CAPE = Independent
- GAO = Independent
> Advocates want the program to proceed, which creates pressure toward optimistic estimates.
:::

+++
### Why independence matters
{{primer}} Independent organizations exist precisely to counter that pressure...
```

### `:::sort [id]`

- `Q:` prompt line.
- Optional `buckets: A | B | ...`; if omitted, buckets are the distinct answers in first-appearance order.
- Items: `- item text = bucket`.
- `>` lines: explanation shown after commit.
- Display order of items is a shuffle seeded by the block's check id (stable across visits).
- Interaction: drag an item to a bucket, or tap an item then tap a bucket. Commit button enabled once every item is placed.

### `:::order [id]`

- `Q:` prompt line.
- Items listed in correct order as `1. text`, `2. text`, ... (must be numbered 1..n).
- `>` lines: explanation.
- Display order: seeded shuffle that is never already the correct order.
- Interaction: drag to reorder, plus up/down buttons on each item (keyboard and mobile). Commit button always enabled.

### Use outside primers

`sort` and `order` also work in ordinary steps as normal graded checks (retry until correct, recorded in `checks` like `:::check`).

### `{{primer}}`

Inline token usable in any later step of a section that has a primer. Renders a one-line recap of the learner's stored primer answer, e.g. "You put the prime contractor under Independent. It's actually an advocate." or "You sorted all 4 correctly." Renders nothing if no primer answer is stored.

Recap content by type:
- sort: all-correct line, or name up to 2 misplaced items with their correct bucket.
- order: all-correct line, or "You had N of M steps in the right place" plus the first misplaced step.
- check: "You picked X" plus whether it was right.
- challenge (predict): "You guessed X; the actual value is Y."

## Runtime behavior

- **Detection:** `Render.section` checks whether the first step begins with `:::primer:::`; that step gets class `.primer`, a "Before you read" header, and its blocks render with `ctx.primer = true`.
- **Commit-once:** in primer context, `check`, `sort`, `order`, and `challenge` accept a single committed attempt. After commit, show the learner's answer beside the correct one and the explanation. The block is marked done, so the existing `pending()` gate (js/learn.js) unlocks Continue.
- **Widget-only primers are invalid:** a primer must contain at least one committable block.
- **Storage:** `Store.data.primers[secKey] = {type, answer, score, at, mod}` where `secKey = m.id + '/' + s.id` and `score` is e.g. `"3/4"` (`"1/1"`/`"0/1"` for check and challenge). Nothing is written to `Store.data.checks`.
- **Sync:** `primers` is merged per key with newest-`mod`-wins in js/storage.js, the same as `checks`.
- **Revisit:** if a primer answer exists, the primer renders in its answered state. A "Try again" link clears the stored entry and re-renders the primer unanswered.
- **Full-page mode:** primer renders at the top, interactive, non-blocking.
- **Existing progress:** the primer becomes step 0, so in-progress M01 sections resume one step earlier. Completed sections stay complete. No migration.

## Code layout

- **js/primer.js (new):** pure logic, no DOM. Parse `sort`/`order` bodies, seeded shuffle, scoring, recap text generation. Mirrors the role of js/challenge.js.
- **js/render.js:** `buildSort`, `buildOrder` (DOM), primer step detection, commit-once handling for blocks in primer context, `{{primer}}` substitution, dispatch of `sort`/`order` in `buildStep`.
- **js/storage.js:** `primers` default and merge.
- **Validator** (whatever `tests/validate.test.js` exercises): new rules below.
- **CSS:** "Before you read" primer styling, bucket and drag-target styles, order item controls.
- **content/m01.js:** primers for all 9 sections plus `{{primer}}` callbacks.

## Validation rules

- `:::primer:::` only in a section's first step.
- Each primer contains at least one committable block (`check`, `challenge`, `sort`, `order`).
- Each `sort` answer names a declared bucket (when `buckets:` is given); at least 2 buckets.
- `order` items numbered 1..n, at least 3 items.
- `{{primer}}` only in sections that have a primer.

## M01 content plan

Accuracy rule: every primer answer must be traceable to that section's own body text (already CEBoK-aligned). Primers introduce no new facts. Each primer is one interaction plus one or two lines of framing.

| Section | Hook | Kind | `{{primer}}` placement |
|---|---|---|---|
| definition | Sort 4 scenarios into Estimating vs Analysis | sort | At the definitions |
| context | Order the lifecycle milestones where estimates are required | order | Where milestones are introduced |
| orgs | Sort organizations into Advocate vs Independent | sort | At "Why independence matters" |
| quality | `quality-check` widget preset showing a flawed estimate + "what's wrong?" check | widget + check | Where the matching characteristic is introduced |
| products | Sort artifacts into the 4 products | sort | At the product list |
| process | Order the 7 process steps | order | Before the step-by-step walkthrough |
| methods | Sort programs at different design maturity into Analogy / Parametric / Build-up | sort | At methodology selection |
| trl | Predict challenge on a `trl` widget preset: uncertainty at low TRL | challenge | At "low TRL -> higher uncertainty" |
| validation | Sort activities into Sanity check / Cross-check / Sensitivity | sort | At the first of the three |

Existing widgets in context (`lifecycle-estimates`) and process (`wbs-tree`) stay later in their sections.

## Testing

Automated (`npm test`):
- `tests/primer.test.js`: sort/order parsing incl. bucket inference; shuffle deterministic per id and `order` shuffle never already correct; scoring; recap text for all-correct, partial, and missing answer for each type.
- `tests/merge.test.js`: `primers` newest-`mod`-wins.
- `tests/validate.test.js`: new rules, run over all 16 modules (M01 passes, others unaffected).
- Primer commit writes `primers`, never `checks`.

Manual (browser): all 9 M01 sections in step mode; full-page mode; "Try again"; sort and order via keyboard and up/down buttons at phone width.

## Out of scope

Primers for M02-M16; reworking existing section steps; module-level warm-ups; other Brilliant-style changes (diagram-as-answer, difficulty ramps).
