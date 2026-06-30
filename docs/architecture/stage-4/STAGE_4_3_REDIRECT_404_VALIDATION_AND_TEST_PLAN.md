# Stage 4.3 Redirect and 404 Validation and Test Plan

Cover anonymous, unverified, client, provider, support, admin, super-admin, and unknown roles. Test login return state, wrong-role denial, verification redirects, role default, recovery pages, invalid onboarding parameters, explicit /not-found, unknown paths, dynamic routes, query/hash preservation, replace versus push history, back button, reload, and loop termination.

Machine-compare redirect targets with the established constants registry. Verify wildcard remains terminal and browser/API 404 remain separate. Run existing lint/build/boundary scripts after an approved batch. No change passes with an unexplained destination, access expansion, or history regression.

