# Existing Shared Code Inventory

| ID | File/path | Purpose/users | Reuse/ownership | Risk | Recommendation |
|---|---|---|---|---|---|
| SH-01 | `client/src/components/ui/*` | Generic UI primitives used across pages/features | High/shared-governed | Medium | Keep; approve additions through gate. |
| SH-02 | `components/ui/PageHeader.jsx`; `SectionHeader.jsx`; `UniversalBackButton.jsx` | Page/navigation-flavored UI | Medium/shared-platform overlap | High | Verify against common/navigation duplicates. |
| SH-03 | `client/src/components/common/*` | Back/footer/page header/placeholders | Mixed/unknown | High | Item-level review; placeholder files not generic. |
| SH-04 | `client/src/hooks/useAsync.js`; debounce/media/toggle/click/copy/localStorage | Generic hooks | Multi-use/shared candidate | Medium | Keep pending consumer/tests. |
| SH-05 | Root admin/lead/outreach/profile/dashboard/subscription hooks | Feature/platform hooks | Low/single-domain or platform | High | Future module/platform owner; not approved shared. |
| SH-06 | `client/src/hooks/useAuth.js` | Re-export of feature auth hook | Platform bridge | High | Keep temporarily; no new shared auth hook. |
| SH-07 | Generic formatting/cn/slugify/truncate/copy utilities | Pure helpers | Multi-use/shared candidate | Low-medium | Approved shared-utils candidates. |
| SH-08 | `utils/challengeNextAction.js`; `proofReadiness.js`; provider/profile helpers | Feature helpers | Module-specific | High | Keep current, classify to modules later. |
| SH-09 | Route/navigation/access/storage utilities | Platform helpers | Platform-owned | Critical | Never place under module/shared without governance. |
| SH-10 | `utils/constants.js` | Fallback product records | Feature/public fallback | High | Not approved shared constants. |
| SH-11 | `client/src/types/access.js`; navigation/routes/auth types | Platform contracts | Platform-owned | High | Keep platform governed. |
| SH-12 | `client/src/types/profile.js`; profile readiness types | Profile contracts | Module-specific | Medium | Future profile ownership after migration. |
| SH-13 | Route/API/navigation/status/design/query constants | Platform/mixed contracts | Platform-owned | Critical | No module/shared replacement. |
| SH-14 | `client/src/services/apiClient.js`; contracts/errors/query client/socket | Platform services | Platform-owned | Critical | Do not move/duplicate. |
| SH-15 | `client/src/services/api.js` | Broad facade importing feature services | Reverse dependency bridge | High | Freeze; trace/retire later. |
| SH-16 | `services/shared/serviceUtils.js` | Shared service helper | Shared candidate | Medium | Verify consumers/purity. |
| SH-17 | `client/src/lib/README.md` | Reserved library documentation | Docs-only | Low | Do not create library blindly. |
| SH-18 | Server response/error/async/query/pagination/sanitize/slugify/logger utils | Cross-cutting backend helpers | Platform/shared | High | Keep; no module copies. |
| SH-19 | Server cookie/token/ownerScope/profileProjection utils | Security/domain-specific helpers | Platform/module mixed | Critical | Separate ownership review. |
| SH-20 | Server roles/queue/status/subscription/service/profile constants | Platform/domain mixed | Mixed | High | Classify by owner before moves. |
| SH-21 | Target-domain server services | Domain use cases in root service layer | Module-specific | High | Future vertical migration, not shared. |
| SH-22 | Infrastructure services: cloudinary/database/email/queue/socket/stripe | Platform adapters | Platform-owned | Critical | Never module-copy. |
| SH-23 | Other business services (analytics/blog/leads/network/etc.) | Non-target domains | Module/domain | Medium-high | Outside current target modules. |
| SH-24 | `server/src/config/*` | Env/DB/CORS/cloudinary setup | Platform-owned | Critical | Never shared/module ownership. |

