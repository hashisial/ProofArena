# Proof Feature Boundary

This directory is intentionally documentation-only until a distinct proof
workflow is defined.

Existing ownership remains:

- `client/src/features/proofAssets/` owns proof asset server state and API
  integration.
- `client/src/components/proof/` owns current proof UI components.

Do not duplicate proof asset services or hooks in this directory.
