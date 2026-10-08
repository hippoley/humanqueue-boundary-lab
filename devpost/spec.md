---
status: draft
source: ChatGPT-assisted architecture draft of current repository; no claim of completed 4-spec interview
---
# HumanQueue Boundary Lab — Technical Specification

## How This Works, In Plain Language
A task is created with a unique ID and placed on hold. A human decision changes **only that ID**, and the system records what happened. If somebody sends a second decision for a resolved task, the app refuses it. All action results are simulated.

## Where It Runs and How Someone Tries It
Requires Node.js >=18. From the repository root run `npm test` then `npm start`; visit `http://localhost:3000`. Use two distinct tasks to observe independence.

## Components

### Boundary State Engine
Implements `prd.md > Create a Waiting Boundary` and `prd.md > Resolve the Exact Task`.
- File: `src/core.js`
- Uses `crypto.randomUUID()` for stable per-process task IDs.
- In-memory `Map` stores request state.
- `create` validates inputs and records `boundary.created`.
- `decide` checks request existence, pending status, decision and actor; records resolution and simulation outcome.
- Rejected second decisions return HTTP-equivalent 409 and do not append events.

### HTTP API
Implements the requests required by `prd.md > Features and Behavior`.
- File: `src/server.js`
- `GET /` serves the interface.
- `GET /api/state` returns tasks and events.
- `POST /api/tasks` creates the waiting boundary.
- `POST /api/tasks/:id/decision` accepts one approval/rejection.
- Validates JSON; prevents oversized request bodies; returns error codes.

### Browser Interface
Implements `prd.md > Core Journey` and `prd.md > Look and Feel`.
- File: `src/index.html`
- Plain HTML/CSS/JavaScript; calls HTTP endpoints, renders task cards and event list.
- HTML-escapes user values before rendering.
- Uses dark visual styling matching the existing demo.

### Verification
Implements `prd.md > Resolve the Exact Task`, `prd.md > Guard Against Duplicate Decisions`, and `prd.md > Inspect the Event Timeline`.
- File: `test/core.test.js`
- Tests: exact task isolation, rejection, duplicate decision guard, invalid requests.
- GitHub Actions: `.github/workflows/ci.yml` uses Node 22 and `npm test`.

## Annotated File Structure
```
LICENSE                     Apache-2.0 license
README.md                   Getting started and limitations
package.json                Node scripts and package metadata
src/core.js                 Request state and audit logic
src/server.js               HTTP surface
src/index.html              Interactive UI
test/core.test.js           Automated core checks
.github/workflows/ci.yml    Continuous tests
devpost/                    Competition process and planning files
```

## Major Dependencies
- Node.js built-ins: `http`, `fs`, `path`, `url`, `crypto`, `node:test`.
- No external npm runtime dependencies.
- Documentation: https://nodejs.org/api/ and https://docs.github.com/en/actions .

## Decisions and Open Issues
- **Prior work:** this small implementation is separate from pre-existing HumanQueue. Any later copied assets/code require explicit attribution.
- **No real execution:** approval updates a simulation state only.
- **No durable storage:** restart clears tasks/events.
- **Safety:** not suitable as a production approval endpoint.
- **Learner review required:** stack choice, local-only vs. optional deployment, storage limitation, and appearance must be confirmed in a genuine Skill Pack conversation.
- **Process requirement not met:** an actual `1-start → 2-scope → 3-prd → 4-spec → 5-build` journey with participant input has not yet been evidenced. This file is a draft rather than a backdated artifact.

## Entrant Decision — 2026-10-08
The entrant selected a simulated end-to-end product, not a real agent connector. The existing in-memory approach is consistent with that product boundary. This does not constitute approval of the technical architecture or proof that the official `4-spec` skill ran.
