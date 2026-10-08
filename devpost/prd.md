---
status: draft
source: ChatGPT-assisted draft based on current prototype; no claim of completed 3-prd interview
---
# HumanQueue Boundary Lab — Product Requirements

## Product Goal
Turn `scope.md > The Unique Kernel` into a clearly demonstrable interactive experience. All operations are explicitly simulated.

## Core Journey
The visitor opens a single page, sees a compact explanation that no real agent actions occur, creates a proposed operation, resolves the resulting human-boundary card, and inspects the audit timeline. Multiple pending tasks can coexist.

## Features and Behavior

### 1. Create a Waiting Boundary
Implements `scope.md > The Core Loop`.
- Visitor enters a title and proposed operation, then submits.
- A unique ID and `awaiting_human` status appear.
- Empty/invalid fields produce a clear error; no task is created.
- Acceptance: create two tasks and see two different IDs.

### 2. Resolve the Exact Task
Implements `scope.md > The Unique Kernel`.
- Every pending card offers Approve and Reject.
- A named human actor is captured for the audit trail.
- Approve changes that task to `simulated_completed`; Reject changes it to `rejected`.
- Acceptance: acting on Task A leaves Task B unchanged.

### 3. Guard Against Duplicate Decisions
Implements `scope.md > Proof of Success`.
- A previously resolved task cannot be resolved again.
- Acceptance: repeated API decision returns a conflict and creates no new audit events.

### 4. Inspect the Event Timeline
- Show append-only-style in-memory events with task identity, timestamp, and transition kind.
- Acceptance: each valid decision creates exactly one boundary resolution and one simulation outcome event.

## Look and Feel
**Existing implementation:** dark, compact, high-contrast dashboard with clearly differentiated approve/reject controls, task cards, and timeline.
**Not yet learner-approved:** the entrant should review this visual direction in a real `3-prd` interview.

## Empty and Error States
No tasks shows a neutral empty state. Input errors and unknown/duplicate decisions are surfaced as errors. Network errors are visible in the status area.

## Now / Later
Now: local browser demonstration, basic validation, audit timeline, automated tests.
Later: durable storage, authentication, role policies, actual connectors, notifications.

## Product Decisions Awaiting Entrant Approval
Confirm audience and design language, whether the actor prompt is acceptable, and whether error-state visibility meets the intended demo. Do not mark approved until the learner explicitly approves during the actual planning process.

## Attribution
Inspired conceptually by pre-existing HumanQueue; this document is a transparent assistant-prepared draft and is **not** evidence the official Skill Pack was run.

## Entrant Decision — 2026-10-08
The entrant confirmed **Option A**, a browser-based simulated approval flow. Real agent resume and live production actions remain out of scope. The exact layout, actor prompt, and acceptance of this entire PRD remain subject to a genuine `3-prd` review; this document is still a draft.
