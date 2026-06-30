# Stage 4.3 Auth and Role Redirect Baseline Matrix

| User state | Protected route | Wrong-role route | Login/register | Unverified protected | Unknown route |
|---|---|---|---|---|---|
| Anonymous | login with from | login with from | render | no user check | NotFound |
| Authenticated client | render if allowed | not-authorized | client default | resend verification if unverified | NotFound with client links |
| Authenticated provider | render if allowed | not-authorized | dashboard default | resend verification if unverified | NotFound with provider links |
| Support | explicit support/default policy | not-authorized when excluded | support default | resend verification | NotFound |
| Admin | admin routes/override policy | depends on allowed list versus policy | admin default | resend verification | NotFound with admin links |
| Unknown role | auth may pass | not-authorized/home by caller | dashboard fallback | resend if unverified | NotFound/home links |

Priority is parent composition, then child role, then layout metadata. Exact behavior requires runtime tests before edits.

