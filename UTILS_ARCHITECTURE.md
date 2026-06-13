# ScaleOps / ProofArena Utility Architecture

## Purpose

Utilities contain small, reusable, mostly pure operations that do not own UI,
HTTP lifecycle, persistence, authorization, or domain business rules.
ProofArena reuses the ScaleOps utility layers; it does not have a separate
generic utility system.

The repository uses JavaScript, so canonical utility files use `.js`.

## Canonical Locations

```text
client/src/utils/       Browser-safe and presentation-oriented helpers
server/src/utils/       Server-safe infrastructure helpers
```

Stable exports are available from:

```text
client/src/utils/index.js
server/src/utils/index.js
```

Direct file imports remain valid and are preferred inside low-level
infrastructure when they make dependencies clearer or avoid circular imports.

## Frontend Utilities

| Utility | Responsibility |
| --- | --- |
| `cn.js` | Merge conditional class names and resolve conflicting Tailwind classes |
| `formatDate.js` | Format dates, date-times, and relative dates |
| `formatCurrency.js` | Format USD by default and support future currencies/locales |
| `formatNumber.js` | Format standard, compact, and percentage values |
| `truncateText.js` | Safely shorten display text |
| `slugify.js` | Convert display text into URL-safe slugs |
| `validators.js` | Generic email, URL, password, username, and required-value checks |
| `storage.js` | SSR-safe string and JSON storage access |

Other existing frontend helpers remain available. Helpers such as
`challengeNextAction`, `proofReadiness`, `providerActions`, and
`providerReadiness` contain domain rules and should eventually move into their
owning feature directories when those imports can be migrated safely.

### Frontend Rules

- Keep generic utilities independent of React and feature services.
- Use `Intl` for dates, currencies, percentages, and numbers.
- Use `storage.js` for non-sensitive browser persistence.
- Never store access tokens, refresh tokens, private proof, or server records
  through the generic storage helper.
- Keep validation authoritative on the server; frontend validators only improve
  form feedback.
- Prefer `cn()` over string concatenation for reusable component classes.

### Frontend Examples

```js
import {
  cn,
  formatCompactNumber,
  formatCurrency,
  getJsonStorageItem,
  isValidEmail,
  setJsonStorageItem,
  slugify,
  truncateText,
} from "../utils/index.js";

cn("px-4 text-sm", isActive && "text-green-700", "px-6");
formatCurrency(1250); // "$1,250.00"
formatCompactNumber(4500000); // "4.5M"
truncateText(description, 120);
slugify("Verified Outcome Plan");
isValidEmail("client@example.com");

const filters = getJsonStorageItem("workspace.filters", {});
setJsonStorageItem("workspace.filters", filters);
```

## Backend Utilities

| Utility | Responsibility |
| --- | --- |
| `logger.js` | Environment-aware structured logging with secret redaction |
| `token.utils.js` | Existing canonical JWT generation, verification, and hashing |
| `sanitizeInput.js` | Recursive basic input cleanup and unsafe-key removal |
| `pagination.js` | Normalize page/limit/skip and create pagination metadata |
| `buildQuery.js` | Build allowlisted filters and escaped search expressions |
| `apiResponse.js` | Standard API success/error response envelopes |
| `AppError.js` | Operational error representation |
| `asyncHandler.js` | Forward async Express errors |
| `slugify.js` | Server-safe slug creation |

`token.utils.js` fulfills the requested token utility. A second
`generateToken.js` file was intentionally not created because it would
duplicate the live authentication implementation.

### Backend Rules

- Treat all request input as untrusted.
- Validate with route validators before business logic.
- Use `sanitizeInput` as defense in depth, not as a replacement for validation.
- Build database filters from explicit allowlists. Never pass request query
  objects directly to Mongoose.
- Escape user search text before constructing regular expressions.
- Apply pagination limits before database reads.
- Never log secrets, credentials, authorization headers, cookies, or tokens.
- Keep result/public-data sanitizers in domain services because those rules are
  business-specific.

### Backend Examples

```js
import {
  buildQuery,
  createPaginationMeta,
  getPagination,
  logger,
  sanitizeInput,
} from "../utils/index.js";

const { limit, page, skip } = getPagination(request.query, {
  defaultLimit: 20,
  maxLimit: 50,
});

const query = buildQuery(request.query, {
  allowedFilters: ["status", "category"],
  searchFields: ["title", "summary"],
});

const safePayload = sanitizeInput(request.body);
const pagination = createPaginationMeta({ limit, page, total });
logger.info("Resources fetched", { count: items.length });
```

## What Does Not Belong In Generic Utilities

- Challenge status transitions
- Provider readiness or ranking rules
- Proof/reputation calculations
- Authorization and ownership checks
- Mongoose queries tied to one model
- React hooks, component state, notifications, or routing
- API request construction owned by feature services
- Response shaping that determines public/private fields

Place these concerns in the owning feature, service, hook, middleware, or
model layer.

## Current Duplication And Migration Notes

- Pagination parsing is repeated across several backend services. New or
  safely touched services should migrate to `pagination.js` incrementally.
- Regex escaping is repeated across search services. New query builders should
  use `buildQuery.js` or `escapeRegex`.
- Several pages still access `localStorage` directly. Migrate them only when
  those workflows are touched and tested.
- Feature-specific helpers currently living in `client/src/utils/` should move
  into feature directories through tested, import-safe migrations.

## Verification

```powershell
cd client
npm run lint
npm run build

cd ..\server
node --check src/utils/pagination.js
node --check src/utils/buildQuery.js
node --check src/utils/sanitizeInput.js
node --check src/utils/logger.js
node --check src/middleware/sanitizeMiddleware.js
```

