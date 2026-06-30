# Module README Template

```markdown
# <Module Name> Module

## Purpose
<Business capability owned by this module.>

## Allowed Contents
- Module-specific components, hooks, services, types, API adapters, validation, constants, and tests only after explicit migration approval.

## Forbidden Contents
- App entries, routers, route constants, navigation, layouts/dashboard/sidebar, API clients, auth/session/role systems, config/env/deploy, shared-library governance, fake services/models/controllers, or compatibility copies.

## Platform Dependencies
<Approved ScaleOps route, auth, API, shell, config, and backend runtime dependencies.>

## Shared Dependencies
<Approved shared UI, utilities, types, validation, and testing helpers.>

## Do-Not-Duplicate Warning
Reuse existing ScaleOps platform systems and current domain owners. Do not create parallel behavior.

## Current Behavior
No production behavior is added by this README-only scaffold.

## Future Migration
Migrate one tested vertical slice only after import/dependent mapping, ownership approval, route/API/auth separation, validation, and rollback planning.
```

