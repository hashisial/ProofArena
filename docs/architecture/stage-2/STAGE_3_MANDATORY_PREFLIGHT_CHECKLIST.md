# Stage 3 Mandatory Preflight Checklist

| Check | Required action/doc | Pass | Fail | Stop condition |
|---|---|---|---|---|
| P3-01 | Read Stage 2 final handoff | Boundary understood | Not read | Stop before analysis |
| P3-02 | Read final Stage 2 source index | Authority hierarchy used | Older docs treated primary | Stop on authority conflict |
| P3-03 | Read Stage 2.1 parent lock | ScaleOps remains parent | Boundary weakened | Stop |
| P3-04 | Read Stage 2.2 module authority lock | ProofArena remains module | Standalone framing | Stop |
| P3-05 | Read Stage 2.3 separate-app lock | No parallel runtime planned | Separate system proposed | Stop |
| P3-06 | Read ADR-0001 adoption/rulebook | Work complies | ADR conflict | Stop absent superseding ADR |
| P3-07 | Confirm ScaleOps parent | Explicitly recorded | Not confirmed | Stop |
| P3-08 | Confirm ProofArena flagship module | Explicitly recorded | Not confirmed | Stop |
| P3-09 | Confirm no separate ProofArena app | One runtime plan | New app/package/entry | Stop |
| P3-10 | Confirm no duplicate nav/route/dashboard/API/auth | Existing owners reused | Parallel system planned | Stop |
| P3-11 | Fit modules inside current architecture | Ownership/dependencies mapped | New platform layer | Stop |
| P3-12 | Prevent module folders duplicating platform systems | Public boundary only | Compatibility copies | Stop |
| P3-13 | Place shared code only in approved shared owners | Reuse proven | Feature dumping | Stop |
| P3-14 | Confirm production authorization | Later prompt explicitly permits | Audit-only edit | Stop on non-doc change |
| P3-15 | Escalate ambiguous ownership | Mark unknown/human review | Guess ownership | Stop until disposition |

