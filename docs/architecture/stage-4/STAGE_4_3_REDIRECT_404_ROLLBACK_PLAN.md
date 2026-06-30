# Stage 4.3 Redirect and 404 Rollback Plan

Rollback each exact redirect or fallback batch. Restore the previous target, navigation method, state payload, history replacement behavior, and wildcard ordering. Do not replace the entire router or introduce a parallel fallback.

Triggers: loop, blank page, unauthorized access, lost intended destination, wrong role landing, broken query/hash, wildcard interception, external URL mishandling, or API/browser 404 confusion. Re-run the complete state/history matrix after rollback.

