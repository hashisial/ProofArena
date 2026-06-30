# Stage 4.3 Broken Route and Fallthrough Verification

| Risk | Verification | Final disposition |
|---|---|---|
| /offers constant without route | verified | Human decision before centralization or redirect |
| Marketplace service slug versus serviceId | verified semantic mismatch risk | API/domain contract required |
| Wildcard terminal ordering | verified current | Add regression test before edits |
| Metadata gaps | verified | Do not treat absence as public or unrestricted intent |
| Hidden routes | partially verified | Formal deep-link-only catalog required |
| Explicit NotFound and wildcard URL difference | verified | Product decision if canonical redirect desired |
| Legacy Auth/Admin destinations | static non-import only | Reachability review before cleanup |
| Browser/API 404 confusion | verified boundary risk | Separate documentation and tests |

