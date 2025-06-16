# Development Guide

This guide covers the development setup, available commands, and workflow for Te Kudasai.

## Development Environment Setup

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- PostgreSQL 17+
- Node.js 22+ (for some development tools)

### Optional: Using Docker for PostgreSQL

If you prefer using Docker for development, you can use the provided `docker-compose.yaml` to run PostgreSQL:

```bash
# Start PostgreSQL container
docker compose up -d db

# Stop PostgreSQL container
docker compose down
```

The PostgreSQL instance will be available at:
- Host: localhost
- Port: 5432
- Default credentials (can be overridden with environment variables):
  - Database: postgres
  - Username: postgres
  - Password: password

To use custom credentials, create a `.env` file in the project root:
```env
POSTGRES_DB=your_database
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
```

### Environment Variables

#### Backend (apps/backend)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/te_kudasai
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITLAB_CLIENT_ID=your_gitlab_client_id
GITLAB_CLIENT_SECRET=your_gitlab_client_secret
```

#### Frontend (apps/frontend)
```env
VITE_API_URL=http://localhost:5173
```

## Available Commands

### Root Level (using Turbo)

```bash
# Development
bun dev              # Start development servers for all apps
bun run build        # Build all apps and packages

# Testing
bun run test         # Run tests across all apps
bun run test:watch   # Run tests in watch mode
bun run coverage     # Generate test coverage reports
```

### Backend (apps/backend)

```bash
# Development
bun run dev          # Start backend development server with hot reload

# Testing
bun run test         # Run backend tests with Vitest
bun run test:watch   # Run backend tests in watch mode
bun run coverage     # Generate backend test coverage
```

### Frontend (apps/frontend)

```bash
# Development
bun run dev          # Start frontend development server with Vite
bun run build        # Build frontend for production

# Testing
bun run test         # Run frontend tests with Vitest
bun run test:watch   # Run frontend tests in watch mode
bun run coverage     # Generate frontend test coverage
```

## Development Workflow

### Code Quality

- Biome is configured for formatting and linting
- Line width: 120 characters
- Single quotes, semicolons as needed
- Organized imports enabled

### Git Workflow

1. Create a new branch for your feature/fix
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

### Database Operations

- Database migrations are managed with Drizzle Kit
- Migration files are in `apps/backend/drizzle/`
- Use standard Drizzle commands for schema changes

### Testing

- Write tests for new features
- Maintain test coverage above 80%
- Run tests locally before pushing changes
