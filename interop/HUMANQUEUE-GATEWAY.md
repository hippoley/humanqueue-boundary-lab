# Real HumanQueue Gateway: interoperability assessment (2026-10-08)

This assessment is based on source inspection of [hippoley/HumanQueue](https://github.com/hippoley/HumanQueue), not on a successful live connection or third-party adoption.

## Actual gateway contract

| Operation | Gateway route | Difference from Boundary Lab |
| --- | --- | --- |
| Create | `POST /v1/human` | Returns `{request,created,human_uri}`; requires `uri,source,ref,title`. |
| Inspect one | `GET /v1/requests/{id}` | Returns request, request-specific events, resume outbox. |
| List waiting | `GET /v1/queue` | Returns `{items:[...]}`, with Gateway-specific filtering. |
| Human resolve | `POST /v1/requests/{id}/resolve` | Body uses `{actor,actor_kind,action}`. Terminal state is `resolved` (not `simulated_completed` or `rejected`). |
| Duplicate resolution | Same resolve route | Source code explicitly returns HTTP 409 on an already terminal request, including an additional store-level race guard. |
| Authorization | `/v1/*` middleware | Optional/required token per Gateway configuration; never assume production credentials are absent. |

## Important semantic mismatches

- A **rejected** human action is still a **resolved** gateway request; the choice lives under `resolution.action`. Don't map Gateway `resolved` blindly to `simulated_completed`.
- The Lab's `simulation.continued` and `simulation.stopped` event types are **not** guaranteed by the Gateway. Real resume delivery, confirmation, uncertainty, and outbox events are distinct.
- Do not equate successful human resolution with successful native runtime continuation.
- `GET /v1/queue` may not include all outstanding requests under budget/defer policies; verify each request by its ID rather than interpreting missing queue items as completed.
- Authentication, gateway lifecycle, persistent SQLite, and actual external webhook resume are not demonstrated by the Lab's five in-memory tests.
- Source inspection does not establish a live successful HTTP test or a deployment.

## Safe integration gate before the first live probe

1. Launch an **isolated local Gateway** with a fresh temporary SQLite database and no live channel destinations or resume webhooks.
2. Determine the configured Gateway token and use it only in process environment or another secret store; never commit it.
3. Create two test requests with unique source refs and explicit approval/rejection options.
4. Inspect each request separately before and after resolution; assert A's decision never affects B's canonical state.
5. Replay A's decision and require HTTP 409, then verify A's persisted resolution and related event history are unchanged.
6. Record the Gateway commit SHA, Python version, command, redacted response evidence, and any untested guarantees in a reproducible report.
7. Adapt `conformance/run.mjs` to the Gateway's actual action and event vocabulary rather than falsifying uniform semantics.

**Current verification: SOURCE_REVIEW_ONLY.** No real Gateway HTTP conformance run has yet been performed. No third-party adoption or endorsement is claimed.
