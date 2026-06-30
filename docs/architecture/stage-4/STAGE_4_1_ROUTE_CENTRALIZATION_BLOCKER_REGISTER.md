# Stage 4.1 Route Centralization Blocker Register

| ID | Blocker | Source/system | Severity | Why | Action/owner | Blocks planning | Blocks implementation | Human review |
|---|---|---|---|---|---|---|---|---|
| CB-001 | 34 metadata omissions | routeMetadata | critical | policy/nav/guard coverage incomplete | Prompt 3 plans; human roles | no | yes | yes |
| CB-002 | 72 hardcoded occurrences | 28 files | high | behavior and active status vary | Prompt 3 migration map | no | yes | yes |
| CB-003 | nine semantic aliases | routes.js | high | canonical key removal can break consumers | Prompt 3 normalization | no | yes | yes |
| CB-004 | /offers status | public routes | medium | base-only vs missing page unknown | human | no | yes | yes |
| CB-005 | dynamic ID/slug uncertainty | marketplace service | high | builder may generate wrong semantics | human/API owner | yes | yes | yes |
| CB-006 | generic protected role intent | dashboard | critical | access could be broadened or narrowed | human/security | no | yes | yes |
| CB-007 | duplicate/legacy guards | auth system | critical | wrong guard may be modified | Prompt 3 exclude; Stage 4.2 | no | yes | yes |
| CB-008 | redirect/404 policy distributed | guards/pages/utils | critical | route migration can change flow | Stage 4.3 | no | yes | yes |
| CB-009 | legacy path retention unknown | profiles/recommendations/system | high | inbound links may break | human/product | no | yes | yes |
| CB-010 | hidden navigation intent unknown | nav/declarations | medium | central metadata could expose routes | human/product | no | yes | yes |
| CB-011 | route regression baseline absent | tests | critical | no behavior proof | later Stage 4/human | no | yes | yes |
| CB-012 | browser/API boundary | client/server | critical | merging creates duplicate architecture | architecture owner | yes if crossed | yes | yes |
| CB-013 | separate ProofArena route risk | architecture | critical | violates ADR/Stage 2 | all prompts | yes if proposed | yes | yes |

Planning is allowed with caution except where CB-005 or CB-012 would be guessed. Implementation is blocked.

