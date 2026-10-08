# Boundary Conformance Runner (experimental)

Run from the repository root: `node conformance/run.mjs`.

This executable produces machine-readable JSON with PASS / FAIL / NOT_TESTED statuses and exits nonzero on measured failures. The adapter in `adapter.mjs` targets the local BoundaryLab *simulation*. You can replace that adapter with one wrapping another implementation if the same interface is preserved:

- `create()` → unique task with `id`
- `resolve(id, decision)` → result with `code`
- `state()` → `{tasks: [{id,status}], events: [{taskId,type}]}`

This is **not** a standardized interoperability protocol. The five checks describe only the narrow contract above. Crash recovery, native runtime resume, external side effects and authentication are explicitly `NOT_TESTED`, rather than scored as PASS. A passing report proves only the tested semantics of the attached adapter; no independent adoption is implied.

To test third-party implementations, adapt these three operations to a real service, pin its version, then publish reproducible commands and expected failure semantics. Never report real side-effect guarantees from this simulation.

## External adapter entry point

Run an alternate adapter without modifying the conformance runner:

```sh
HUMANQ_ADAPTER=./conformance/adapter.mjs node conformance/run.mjs
# For your own implementation, replace the path with your ESM adapter module.
```

Your module must export `makeAdapter()` returning an object with `create()`, `resolve(id, decision)` and `state()` as specified above. The runner uses a fresh adapter for each check. **Only execute adapters you trust:** a module can execute arbitrary local code when imported. The adapter path is local to the current machine; no network verification or authentication is performed by this runner. A test PASS is not evidence of crash durability or external side-effect idempotency.
