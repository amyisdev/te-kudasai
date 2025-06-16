# Backend

This document outlines the backend architecture and features of Te Kudasai.

## Overview

The backend is built with Hono web framework and TypeScript, following a modular architecture with domain-driven organization.

## Directory Structure

```
apps/backend/
├── bin/
│   └── serve.ts          # Production server
├── src/
│   ├── index.ts          # Application entry point
│   ├── auth/             # Authentication module
│   │   ├── plugins/      # Custom auth plugins
│   │   └── users/        # User management
│   ├── db/               # Database configuration
│   ├── forms/            # Form management
│   ├── tickets/          # Ticket management
│   └── shared/           # Shared utilities
├── drizzle/              # Database migrations
│   ├── *.sql             # Migration files
│   └── meta/             # Migration metadata
├── tests/                # Test files
│   ├── integration/      # Integration tests
│   ├── unit/             # Unit tests
│   └── utils/            # Test utilities
└── docs/                 # API documentation
```

## Core Features

### Authentication
- OAuth 2.0 integration with GitHub and GitLab
- Custom encryption plugin for enhanced security
- Role-based access control (Admin/User)
- Session management with HTTP-only cookies

### Ticket Management
- Create, read, update, and delete tickets
- Status tracking and workflow management
- Assignment and reassignment capabilities
- Form-based ticket creation

### Form Builder
- Dynamic form definitions
- Field validation
- Conditional logic

### User Management
- User listing and management
- Role assignment and permissions (Admin/User)

## Technical Details

### Database Integration
- PostgreSQL with Drizzle ORM
- Connection pooling
- Migration management

### API Design
- RESTful endpoints
- JSON responses
- Request validation
- Error handling

### Security
- Input sanitization
- Rate limiting
- CORS configuration
- Security headers

## Development

### Setup
1. Install dependencies: `bun install`
2. Configure environment variables
3. Run migrations: `bun run db:migrate`
4. Start development server: `bun run dev`

### Testing
- Unit tests with Vitest
- Integration tests
- Unit tests
- Performance tests (TODO)

### Deployment
- Docker support
- Environment configuration
- Health checks
- Monitoring setup

## Error Handling

The backend implements a consistent error handling strategy:
- Standardized error responses
- Error logging
- Client-friendly messages
- Debug information in development

## Monitoring (TODO)

- Health check endpoint
- Performance metrics
- Error tracking
- Usage statistics 