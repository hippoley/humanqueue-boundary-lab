---
status: draft
source: ChatGPT-assisted draft informed by prior entrant instructions; not an approved Devpost Learn Skill Pack output
---
# HumanQueue Boundary Lab — Scope

## Inspiration & Identity
The entrant's existing [HumanQueue](https://github.com/hippoley/HumanQueue) explores trustworthy handoffs between autonomous systems and humans. The new competition-period Boundary Lab is a **separate simulation**, not a repackaged release of that prior repository.

## Intended User
A developer or hackathon judge exploring what a reliable human approval boundary means for an autonomous agent.

## Problem
An agent can pause for authorization but lose track of the exact waiting task, or accidentally reapply a decision. An approval button alone does not prove safe return to the same execution.

## The Unique Kernel
For each simulated proposed operation, create an identifiable waiting task, accept one human decision, transition only that task, and retain an inspectable event history.

## The Core Loop
1. A visitor enters a task title and proposed operation.
2. The app creates a pending boundary with its own ID.
3. The visitor chooses approve or reject and identifies the decision maker.
4. The app changes the matching simulated task to completed or rejected.
5. The visitor inspects the audit timeline; duplicate decisions are rejected.

## Proof of Success
A judge can create two tasks and approve one without changing the other, reject the second, and observe the correct recorded events. An attempt to approve again does not repeat the simulated operation.

## The POC Boundary
**Now:** one-user local web demo, Node.js server, in-memory task state, approve/reject, exact task IDs, auditable transitions, deterministic tests.
**Later:** real agents, external actions, authentication, persistent databases, distributed concurrency, deployment, mobile clients, notifications.

## Honest Limitations
This is simulation only. An approval never executes a production deployment or resumes a real runtime; restarting the process resets state.

## Decisions Needing Entrant Review
Confirm the intended audience, minimum demo experience, visual direction, and whether this PoC boundary matches your priorities. A learner-led interview with the official Skill Pack is still required before changing this file to `approved`.

## Entrant Decision — 2026-10-08
The entrant explicitly chose **Option A: interactive simulation**, not a live Codex/Claude Code connector. This approves the project *direction and POC boundary*, not completion of the official Devpost Learn Skill Pack interviews or the entire planning document. The draft remains open for the required learner-led review.
