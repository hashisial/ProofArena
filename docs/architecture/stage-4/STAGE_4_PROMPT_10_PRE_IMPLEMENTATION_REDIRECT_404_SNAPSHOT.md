# Stage 4 Prompt 10 Pre-Implementation Redirect and 404 Snapshot

| Area | Baseline |
|---|---|
| Anonymous redirect | Login with attempted-location state |
| Wrong-role redirect | Not-authorized with attempted-location state |
| Unverified redirect | Resend verification with reason |
| Guest-only redirect | Role default |
| Layout fallback | accessPolicy caller-dependent fallback |
| Explicit NotFound | /not-found renders platform NotFound |
| Wildcard | Terminal * renders same component |
| Page internal redirects | Hardcoded cases in active and possible legacy pages |
| External redirects | Checkout/session URLs classified separately |
| Open blockers | Denial priority, unknown roles, /offers, ID/slug semantics, legacy reachability, test baseline |

No implementation snapshot branch was opened.

