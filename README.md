# Te Kudasai

A modern ticketing application built as a replacement for another service desk system. This monorepo includes a backend API and frontend web application, managed with Turbo.

## Quick Start

```bash
# Install dependencies
bun install

# Start development servers
bun dev

# Build all apps
bun run build

# Run tests
bun run test
```

## Project Structure

```
te-kudasai/
├── apps/
│   ├── backend/     # Hono web framework with TypeScript
│   └── frontend/    # React 19 with Vite and TailwindCSS
├── packages/
│   └── forms/       # Shared form types and utilities
└── docs/            # Project documentation
```

## Documentation

- [Development Guide](docs/development.md) - Setup and development workflow
- [Architecture](docs/architecture.md) - System design and tech stack
- [Backend](docs/backend.md) - Backend architecture and features
- [Frontend](docs/frontend.md) - Frontend architecture and components
- [API Reference](docs/api.md) - API documentation and endpoints
- [Database](docs/database.md) - Database schema and migrations
- [Testing](docs/testing.md) - Testing strategy and tools

## Tech Stack

- **Runtime**: Bun (package manager and runtime)
- **Backend**: Hono web framework with TypeScript
- **Frontend**: React 19 with Vite, TailwindCSS, and React Router v7
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: better-auth with custom encrypted plugin
- **Testing**: Vitest for both backend and frontend
- **Code Quality**: Biome for formatting and linting

## License

MIT License