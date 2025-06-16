# Architecture

This document outlines the system architecture and technical decisions for Te Kudasai.

## System Overview

Te Kudasai is a monorepo application built with a modern tech stack, following a modular architecture that separates concerns between frontend and backend services.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │     │     Backend     │     │    Database     │
│  React + Vite   │◄────┤    Hono API     │◄────┤   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Tech Stack

### Runtime & Build Tools
- **Package Manager & Runtime**: [Bun](https://bun.sh/)
- **Build System**: [Turbo](https://turbo.build/) for monorepo management
- **Frontend Build**: [Vite](https://vitejs.dev/)
- **Code Quality**: [Biome](https://biomejs.dev/) for formatting and linting

### Backend
- **Framework**: [Hono](https://hono.dev/) - Lightweight, fast web framework
- **Language**: TypeScript
- **Database ORM**: [Drizzle](https://orm.drizzle.team/) - TypeScript ORM
- **Authentication**: [better-auth](https://github.com/honojs/better-auth) with custom encryption

### Frontend
- **Framework**: React 19
- **Routing**: React Router v7
- **State Management**: 
  - TanStack Query for server state
  - React Hook Form for forms
- **UI Components**: 
  - Radix UI primitives
  - TailwindCSS for styling
- **Testing**: React Testing Library with MSW

### Database
- **Type**: PostgreSQL 17+
- **Schema Management**: Drizzle Kit
- **Migrations**: Drizzle migrations

## Key Design Decisions

### Monorepo Structure
- Shared code in `packages/` directory
- Separate apps in `apps/` directory
- Turbo for build orchestration and caching

### Authentication Strategy
- OAuth 2.0 with GitHub/GitLab
- Custom encryption plugin for enhanced security
- Role-based access control (Admin/Agent/Customer)

### API Design
- RESTful endpoints
- JSON responses
- Standardized error handling
- Request/response validation

### Frontend Architecture
- Component-based design
- Custom hooks for business logic
- Responsive design with TailwindCSS
- Progressive enhancement

### Testing Strategy
- Vitest for both frontend and backend
- React Testing Library for component testing
- MSW for API mocking
- Integration tests for critical paths

## Performance Considerations

### Backend
- Connection pooling for database
- Caching strategies for frequently accessed data
- Optimized database queries
- Rate limiting for API endpoints

### Frontend
- Code splitting
- Lazy loading of components
- Optimized asset loading
- Service worker for offline support

## Security Measures

- HTTPS enforcement
- CSRF protection
- Rate limiting
- Input validation
- Secure session management
- Regular security audits

## Scalability

The architecture is designed to scale horizontally:
- Stateless backend services
- Database connection pooling
- Caching layer ready
- Load balancer ready 