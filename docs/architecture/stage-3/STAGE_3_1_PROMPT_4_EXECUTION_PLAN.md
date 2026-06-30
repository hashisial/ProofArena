# Prompt 4 Execution Plan

## Current Authorization

- Approved modules: none.
- Human-review candidates: offers, challenges, plans, matching.
- Blocked: auth, profile, proof, messages, payments, admin.

## Allowed Prompt 4 Work

1. Read all Prompt 3 gates and do-not-move maps.
2. Recheck whether a human approval record exists.
3. Check exact/similar module paths.
4. If approval remains absent, create only the pre-scaffold safety check, README template, result report, manifest/tracker updates.
5. If approval later exists, create only approved directory plus `README.md` using the template.

## Forbidden

No index/barrel, source logic, service, adapter, hook, component, page, route, controller, model, validator, mock, import, package/config change, or existing-file move.

## Validation and Rollback

- `git status --short`; verify allowed paths only.
- Search for new imports/references and route/API/auth changes.
- Run boundary checks only if source scaffold was created.
- Rollback is removal of only newly created unreferenced README/folder.
- Stop on missing approval, existing equivalent path, import change, or behavior-bearing file.

