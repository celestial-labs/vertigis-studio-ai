---
name: vertigis-studio-workflow
description: Analyze, edit, debug, validate, and generate VertiGIS Studio Workflow .json files (gcx:wf:* actions). Use for any workflow.json file, building/extending/fixing/explaining a VertiGIS Workflow (steps, transitions, forms, blocks like ForEach/Loop/TryCatch/Container/Subworkflow, ArcGIS actions, form events), gcx:wf:* action questions, expression write/fix, or import/runtime failures. Always consult this skill before any edit—small mistakes silently break the file.
---

# VertiGIS Studio Workflow

Read/edit/validate `.json` for the **VertiGIS Studio Workflow Designer** (`gcx:wf:*` actions).
Strict, tool-specific JSON—small mistakes break import or fail silently (missing `position`,
inline steps where a block needs its own component, missing `branch`, wrong action string).
All detail is in `references/`; this file is a router.

**Never write or edit workflow JSON from memory. Always check the reference first.**

## When to Activate
- A `.json` workflow is shared, referenced, or to be produced
- Building/extending/fixing/explaining a VertiGIS Workflow
- `gcx:wf:*` action question (which one, or its inputs/outputs)
- Writing/reading/fixing an **expression** (`=$activityId.output`, strings, `undefined`)
- Import or silent runtime failure
- Any edit to an existing workflow JSON

## Quick Reference
| Task | Read |
|---|---|
| Structure, import failures, container/step/transition shape | `references/schema.md` |
| Which activity to use + inputs/outputs | `references/activities.md` |
| Expression write/fix | `references/expression-syntax.md` |

Most tasks need >1 file (new workflow needs all three). Read everything that applies first.

## Working with a workflow.json
One loop covers analyze, edit, build. Skip what doesn't apply.

1. **Establish the file.** Existing → read in full. New → check before writing, ask only if truly
   unclear (else assume sensible defaults, say so briefly): trigger? data touched (feature layer,
   form, API)? end result? client or server? needs a form?
2. **Read `references/schema.md`.** Existing → walk `start.id` → main component → follow transitions;
   for block steps (Container/Subworkflow/ForEach/Loop/TryCatch) find matching component via its
   top-level `branch`-tagged transition; for `Display Form` check `forms` + `<event>$<elementName>`
   transitions. New → sketch flow first: steps, branches, which parts need their own component.
3. **Read `references/activities.md`** per `action`. Unfamiliar → look up, don't guess. Missing →
   say so, don't invent an action string.
4. **Read `references/expression-syntax.md`** for any expression (read or write).
5. **Do the work.**
   - *Explain*: plain language (trigger, data flow, branching, forms). Not a JSON restatement.
   - *Edit*: smallest correct change; keep ids; scan current max before adding.
   - *Generate*: write full JSON to `workflow.json` in CWD. Never print JSON in chat. Follow
     `schema.md` generation rules (unique ids, real `position`, correct `name`/`accessors`/
     `annotations`, no dangling transitions, no comments).
6. **Final check.** Confirm all, then deliver: ☐ ids unique ☐ every step has real `position` ☐
   every block is a separate component with `branch` transition ☐ every action string exists &
   spelled right ☐ every expression references a real `name` with matching `accessors`/
   `annotations`.
7. **Hand back**: edited file in place, or new file saved + shared.

## Reference files
- `references/schema.md`: structure, step/transition + expression object shape, block-splitting, forms/events, generation rules.
- `references/activities.md`: `gcx:wf:*` catalog (action strings, inputs/outputs). Not exhaustive—flag gaps.
- `references/expression-syntax.md`: `=`, output/form refs, string building, escaping, client/server diffs.

## Note
"VertiGIS Workflow" includes **Geocortex Workflow** (former name). Same format, same concepts.