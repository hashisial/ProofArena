# Client Configuration

`env.js` is the canonical owner for public Vite runtime configuration.

- Read client environment values through `clientEnv`.
- Never place secrets in `VITE_` variables.
- Keep endpoint paths in constants and HTTP behavior in the API client.
- `VITE_API_URL` remains a compatibility alias; new environments should use
  `VITE_API_BASE_URL`.
