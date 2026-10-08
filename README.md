# HumanQueue Boundary Lab

A small, interactive, **in-memory simulation** demonstrating how a proposed autonomous-agent operation can pause for a human approval or rejection and return the outcome to the **same task**. It does not perform any real deployment, external operation, or agent resume.

**Conceptual predecessor:** [HumanQueue](https://github.com/hippoley/HumanQueue). This competition-period standalone prototype is separate and does not copy the predecessor's source code.

## Try locally
Requires Node.js 18 or newer, no dependencies or credentials.

```bash
npm test
npm start
```

Open http://localhost:3000. Create two tasks, approve one, reject the other, and inspect the audit events. State is intentionally reset when the process restarts.

## Core behavior
- `src/core.js`: exact task identity, decisions, audit timeline, fail-closed duplicate handling.
- `src/server.js`: local HTTP API.
- `src/index.html`: interactive browser interface.
- `test/core.test.js`: four automated tests.
- `.github/workflows/ci.yml`: automated test runner.

## Security and limitations
Educational simulation only: no authentication, durable storage, multi-user concurrency guarantee, production integration, or external side effects. Never expose this local prototype as a production approval endpoint.

## Hackathon status and provenance
**Not yet eligible for a truthful final eligibility attestation.** The official Devpost Learn Skill Pack has not been executed during this ChatGPT-assisted code publication. Required flipped interaction sessions and skill-generated planning documents (`scope.md`, `prd.md`, `spec.md`) must be completed by the entrant using the actual Skill Pack; do not backfill fictitious usage. Existing HumanQueue is conceptual inspiration; this project's implementation and limitations are documented here. The entrant must independently verify all final Devpost requirements, public video, and eligibility statements.

## License
Apache-2.0, see [LICENSE](LICENSE).
