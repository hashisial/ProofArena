# Duplicate API, Auth, and Role System Prevention Audit

| ID | Path | Type/purpose | Scope | Duplicate risk | Security risk | Required action/docs | Human |
|---|---|---|---|---|---|---|---|
| AR-01 | `client/src/services/apiClient.js` | API client/base/auth/errors | ScaleOps-wide | Critical if copied | Critical | Canonical transport; API lock. | Yes |
| AR-02 | `client/src/services/api.js` | Service facade/legacy aggregation | ScaleOps-wide | Medium overlap | Medium | Keep distinct from transport; investigate later. | Yes |
| AR-03 | `client/src/features/*/*Service.js` | Domain services | Product/shared | Low if using client | Medium | Reuse AR-01; no new instance. | No |
| AR-04 | Pages found by request grep | API helper consumers | Product | Medium apparent | Medium | Most call imported helpers; inspect before calling raw. | No |
| AR-05 | Direct `fetch` outside transport | Not confirmed in ProofArena module | N/A | Critical if added | High | Request scan before edits. | No |
| AR-06 | `features/auth/AuthProvider.jsx` | Auth provider/context | ScaleOps-wide | Critical if copied | Critical | One provider. | Yes |
| AR-07 | `store/useAuthStore.js`; `authSession.js` | Session state/events | ScaleOps-wide | Critical if copied | Critical | One session source. | Yes |
| AR-08 | `routes/ProtectedRoute.jsx` | Auth guard | ScaleOps-wide | Critical if bypassed | Critical | Preserve. | Yes |
| AR-09 | `routes/RoleRoute.jsx`; `features/auth/RequireRole.jsx` | Role guards | ScaleOps-wide overlap | Medium | Critical | Map intended contexts before consolidation. | Yes |
| AR-10 | `features/auth/roleAccess.js`; `utils/accessPolicy.js` | Role/access helpers | ScaleOps-wide overlap | Medium | High | Preserve semantics; Stage 26 review. | Yes |
| AR-11 | `utils/getDashboardPathForRole.js`; auth route utils | Role redirects | ScaleOps-wide | Medium | High | Route/role QA before change. | Yes |
| AR-12 | `server/src/middleware/authMiddleware.js`; `auth.middleware.js` | Backend auth variants | ScaleOps-wide overlap | High | Critical | Determine active imports before consolidation. | Yes |
| AR-13 | `server/src/middleware/roleMiddleware.js`; `role.middleware.js` | Backend role variants | ScaleOps-wide overlap | High | Critical | Determine active imports and policies. | Yes |
| AR-14 | `server/src/services/authService.js`; `auth.service.js`; `modules/auth/auth.service.js` | Backend auth service variants | ScaleOps-wide overlap | High | Critical | Existing cleanup candidate; no new service. | Yes |
| AR-15 | `server/src/controllers/authController.js`; `auth.controller.js`; module controller | Backend auth controllers | ScaleOps-wide overlap | High | Critical | Trace route imports; no casual merge. | Yes |
| AR-16 | `server/src/routes/authRoutes.js`; `routes/v1/auth.routes.js`; module routes | Backend auth route variants | ScaleOps-wide/versioned overlap | High | Critical | Preserve contracts; map before cleanup. | Yes |
| AR-17 | Server admin/role middleware | Backend authorization | ScaleOps-wide | High if bypassed | Critical | Apply shared middleware. | Yes |
| AR-18 | Hardcoded role checks in components | UI presentation/access hints | Mixed | Medium | High if sole control | Require guard and backend enforcement. | Yes |
| AR-19 | ProofArena-specific token/auth files | Not found | N/A | Critical if created | Critical | Stop creation. | Yes |
| AR-20 | `server/src/app.js`; API registries | One API composition | ScaleOps-wide | Critical if forked | Critical | Preserve one app and response/error/security systems. | Yes |

The multiple backend auth variants are confirmed overlap candidates. This audit does not determine deletion or consolidation safety.

