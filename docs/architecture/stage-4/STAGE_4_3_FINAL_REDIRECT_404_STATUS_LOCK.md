# Stage 4.3 Final Redirect and 404 Status Lock

**Lock status: LOCKED WITH CAUTION - AUDITED AND PLANNED; HARDENING DEFERRED.**

The current guard/layout/page redirect behavior, explicit NotFound, and terminal wildcard remain unchanged. One platform browser fallback system is retained; server API 404 is separate.

Blockers: denial priority, unknown roles, /offers, identifier semantics, imperative redirects, legacy reachability, explicit/wildcard URL policy, and browser regression coverage. Production edits require human approval and a new gate.

