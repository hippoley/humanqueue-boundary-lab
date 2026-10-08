# HumanQueue Boundary Lab

A small, interactive, **in-memory simulation** demonstrating how a proposed autonomous-agent operation can pause for a human approval or rejection and return the outcome to the **same task**. It does not perform any real deployment, external operation, or agent resume.

**Prior-work disclosure:** The main page `src/index.html` is an **exact copy of the pre-existing original** [`PAJ-Eval/docs/human/index.html`](https://github.com/hippoley/PAJ-Eval/blob/main/docs/human/index.html), brought over at the entrant's explicit request on 2026-10-08. It is **not** original work made during this competition. The new competition-period implementation remains separately accessible at `/lab` (`src/lab.html`, `src/core.js`, `src/server.js`, tests and conformance runner). Do not describe the copied original page as a competition-built feature. Existing [HumanQueue](https://github.com/hippoley/HumanQueue) and PAJ-Eval are disclosed inspirations and source assets.

## Try locally
Requires Node.js 18 or newer, no dependencies or credentials.

```bash
npm test
npm start
```

Open http://localhost:3000 for the **exact original human:// interactive page**, reproduced from the entrant's existing PAJ-Eval repository. The original page is a browser-side simulated experience and is **pre-existing work, not a newly built hackathon feature**. Open http://localhost:3000/lab for this competition-period standalone Node.js-backed Boundary Lab; create two tasks, approve one, reject the other, attempt replay, and inspect the audit events. Its state resets when the process restarts.

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
