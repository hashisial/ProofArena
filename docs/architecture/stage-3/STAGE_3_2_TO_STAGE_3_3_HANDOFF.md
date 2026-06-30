# Stage 3.2 to Stage 3.3 Handoff

Stage 3.2 established internal folder standards, module ownership rules, import/export policy, API-adapter and service contracts, frontend ownership contracts, ten-module final ownership, and an enforcement checklist.

Stage 3.3 must inventory existing shared/common/UI/hooks/utils/types/constants/services/config-like code, detect feature leakage and reverse imports, define approved shared categories, and create approval/import/migration gates.

Mandatory reading: Stage 3.1 protection/do-not-move/classification docs; all Stage 3.2 standards/contracts/final locks; Stage 2 final handoff and ADR-0001.

Do not move shared files, rewrite imports, create shared folders, promote single-module code, duplicate API/auth/route/platform logic, or create compatibility copies.

