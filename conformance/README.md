# Boundary Conformance Runner (experimental)

Run from the repository root: `node conformance/run.mjs`.

This executable produces machine-readable JSON with PASS / FAIL / NOT_TESTED statuses and exits nonzero on measured failures. The adapter in `adapter.mjs` targets the local BoundaryLab *simulation*. You can replace that adapter with one wrapping another implementation if the same interface is preserved:

- `create()` → unique task with `id`
- `resolve(id, decision)` → result with `code`
- `state()` → `{tasks: [{id,status}], events: [{taskId,type}]}`

This is **not** a standardized interoperability protocol. The five checks describe only the narrow contract above. Crash recovery, native runtime resume, external side effects and authentication are explicitly `NOT_TESTED`, rather than scored as PASS. A passing report proves only the tested semantics of the attached adapter; no independent adoption is implied.

To test third-party implementations, adapt these three operations to a real service, pin its version, then publish reproducible commands and expected failure semantics. Never report real side-effect guarantees from this simulation.
