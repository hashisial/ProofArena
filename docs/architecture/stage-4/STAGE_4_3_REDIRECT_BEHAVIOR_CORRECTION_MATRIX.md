# Stage 4.3 Redirect Behavior Correction Matrix

| Behavior | Verified target | Priority | State | Correction status |
|---|---|---|---|---|
| Anonymous protected | login | parent/child guard | from preserved | verified |
| Wrong role | not-authorized | child role guard | from preserved | verified |
| Unverified email | resend verification | parent email guard | from/reason | verified |
| Authenticated guest-only | role default | PublicOnlyRoute | no from | verified with caution |
| Layout policy denial | getUnauthorizedFallback result | after parent, before content | no from | overlap risk |
| Invalid onboarding step | not-found | page validation | none | verified |
| Unknown browser path | NotFound | terminal wildcard | location retained | verified |
| Page full-reload redirects | varied | event-specific | router state lost | migration candidate |
| External checkout/session | provider URL | event-specific | leaves app | not internal route migration |

