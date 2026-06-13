# ProofArena by ScaleOps

ProofArena is a verified outcome execution network. Clients define measurable
outcomes, providers compete through execution plans, proof validates delivery,
and reputation follows verified results.

Long-term product direction:

- [ProofArena Outcome OS 2045](docs/PROOFARENA_OUTCOME_OS_2045.md)
- [ProofArena Trust Infrastructure Protocol](docs/PROOFARENA_TRUST_INFRASTRUCTURE_PROTOCOL.md)

## Applications

- `client`: React and Vite product experience
- `server`: Express and MongoDB API

## Architecture

- [Canonical Architecture](ARCHITECTURE.md)
- [Stage 1 Completion Report](STAGE_1_COMPLETION_REPORT.md)
- [Project Structure](PROJECT_STRUCTURE.md)
- [Module Boundaries](MODULE_BOUNDARIES.md)
- [Environment Setup](ENVIRONMENT_SETUP.md)

## Local Development

Environment setup and validation rules are documented in
[ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

Before merging structural changes, run `npm run check:boundaries` from both
application directories.
