# Shared vs Module Decision Tree

1. Used by one module only? Keep it in that module.
2. Is it a generic visual primitive with no business/platform behavior? Candidate for `shared/ui` after approval.
3. Is it feature-specific visual composition? Keep in `<module>/components`.
4. Is it a business operation or domain transform? Keep in `<module>/services`.
5. Is it an endpoint wrapper? Keep in `<module>/api`, using the platform API client.
6. Is it auth/session/role behavior? Keep platform/auth owned.
7. Is it route, redirect, navigation, dashboard, sidebar, or layout behavior? Keep platform routing/navigation/shell owned.
8. Is it generic React behavior used by 2+ modules? Candidate for `shared/hooks`.
9. Is it a pure generic helper used by 2+ modules? Candidate for `shared/utils`.
10. Is it a cross-module type/validation contract? Candidate for shared only with explicit contract owner.
11. Is ownership, consumer count, side effect, or dependency direction unclear? Keep in place and mark UNKNOWN.
12. Does promotion create a cycle or feature import from shared? Reject promotion.

