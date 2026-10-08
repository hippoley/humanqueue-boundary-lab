# Boundary invariants: reproducible third-party evaluation

This document describes verifiable behavior of the **simulation** in this repository. It does not claim production durability, real agent resume, or third-party adoption.

## Falsifiable claims
- **ID isolation:** deciding request B never changes pending request A or C.
- **At-most-once resolution within one process:** a second decision returns 409 and adds no event.
- **Fail-closed invalid inputs:** bad actor, decision or malformed create payload does not resolve a task.
- **Audit ordering:** each successful decision emits one resolution and one simulated action outcome.
- **Snapshot isolation:** modifying a returned snapshot does not mutate in-memory source state.

## Reproduce
```sh
npm test
npm start
```
Visit http://localhost:3000, create three tasks, reject B, approve A, leave C pending, and inspect the event sequence. Restarting the server **clears all state**.

## Adversarial checklist for outside reviewers
1. Replay the same approval twice: does the second change state or append events?
2. Send a decision with an unknown request ID: does anything change?
3. Send malformed actor, decision or reason: can invalid data unlock a task?
4. Interleave tasks A, B, C and resolve them out of creation order: is task identity intact?
5. Kill/restart the Node process: observe that the system **does not** guarantee durability.

## Not demonstrated
- Database durability or crash recovery.
- Exactly-once real side effects.
- Framework-native resume.
- Authorization, authentication, approver identity verification.
- Independent field adoption or any specific business outcome.

## External validation invitation
If you integrate or evaluate the boundary semantics, please open a GitHub issue documenting: runtime/version, task identity assumptions, a minimal reproducer, expected and observed behavior, and which invariant matters to your workflow. Critical counterexamples and non-adoption decisions are welcome. Do not claim to depend on this repo unless you genuinely do.

## Research differentiation
Temporal and agent frameworks already implement human waits, replay and interruption. This prototype does **not** compete with their durability primitives. Its possible contribution is a compact, tool-agnostic, adversarially testable reference for boundary identity and decision semantics. This value hypothesis needs independent validation before claiming standardization, reuse, or an emerging protocol.

## Hackathon integrity
Planning drafts in `devpost/` are assistant-prepared, not proof the official Devpost Learn Skill Pack has run. Entrant review and real Skill Pack sessions are still needed.
