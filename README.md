# VertiGIS Studio Workflow

A Claude Code plugin for authoring, debugging, and validating [VertiGIS Studio Workflow](https://www.vertigisstudio.com/products/vertigis-studio-workflow/)
(formerly Geocortex Workflow) `.json` files.

## Install

Add this repository as a marketplace and install the plugin:

```
/plugin marketplace add celestial-labs/vertigis-studio-workflow-skill
/plugin install vertigis-studio-ai
```

## Skills

- **[vertigis-studio-workflow](skills/vertigis-studio-workflow/SKILL.md)** — analyze, explain,
  edit, debug, validate, and generate VertiGIS Studio Workflow JSON: steps, transitions, forms, blocks
  (ForEach/Loop/TryCatch/Container/Subworkflow), ArcGIS actions, form events, and expressions.

## Development

Skill scripts (`skills/vertigis-studio-workflow/scripts/`) are TypeScript, run with
[Bun](https://bun.sh) and type-checked with `tsc`:

```
npm install
npx tsc --noEmit
```
