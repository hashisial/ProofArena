# Backend Modules

`modules/` is the incremental target for domain ownership in the existing
ScaleOps API. It does not replace the active layer-oriented backend in one
bulk move.

Current request handling remains:

```text
route -> middleware/validator -> controller -> service -> model
```

Each domain may migrate into `modules/<domain>/` only as a complete,
tested vertical slice. Shared platform capabilities such as database,
security, queues, payments, storage, email, and realtime remain outside
product modules.

