# Container

> An activity that acts as a container for nested workflow components. Use this activity to organize your workflow.

| | |
|---|---|
| **Action** | `gcx:wf:core::Container` |
| **Suite / Category** | `gcx:wf:builtin` · Basics |
| **Child components** | 1 · branch `content` |
| **Inputs / Outputs** | none |
| **Designer UI** | drill-in "subworkflow", nestable to any depth |
| **Example** | [`assets/examples/DeepContainer.json`](../../assets/examples/DeepContainer.json) |

> Purely structural — no inputs, no outputs, no own scope, no error handling.

## When to use

- Split a long flow into named stages ("Get input" → "Process" → "Show result").
- Keep a component under 100 steps.

> [!NOTE]
> A Container only wraps steps. It adds no behavior: execution is the same as if its steps sat inline.

## JSON wiring

```text
components[]  (flat list, any depth)
├─ main component
│   └─ Container step ──┐  top-level transition, branch "content"
└─ child component      │
    └─ start step  ◄────┘  purpose "start", position "0,0", title = Container title
```

| Part | Where | Shape |
|---|---|---|
| Container step | parent component `steps` | `"action": "gcx:wf:core::Container"`, `"inputs": {}` |
| Child component | own `components` entry | unique `id`, exactly one start step |
| Link | top-level `transitions` | `{ "branch": "content", "source": {Container}, "target": {child start} }` |

> [!NOTE]
> `components` never nests. A Container inside a child component is just a top-level transition
> whose `source` step lives in that child component.

> [!TIP]
> The Designer gives Container steps no `name` — there is nothing to reference.
> Document the stage in `title` / `description`.

## Runtime behavior

1. Container step enters its `content` child component.
2. Child component runs until it has no more transitions.
3. Control returns to the Container step → its own outgoing transitions run.

- **Shared scope:** inner steps see all outer `$name`s; inner outputs stay readable after the Container.
- **Offline:** works with intermittent connectivity (no network access of its own).

> [!WARNING]
> Errors inside are **not** caught — they propagate to the nearest enclosing Try Catch or fail the workflow.

> [!IMPORTANT]
> `Exit` inside a Container ends the **whole workflow**, not just the Container.