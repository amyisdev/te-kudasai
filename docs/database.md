# Database

This document outlines the database schema, migrations, and data management for Te Kudasai.

## Overview

Te Kudasai uses PostgreSQL 17+ as the primary database with Drizzle ORM for type-safe database operations and schema management.

## Schema Overview

The application uses three main entities with role-based access control:

### Users
- **Purpose**: Authentication and user management
- **Roles**: Admin, User
- **Features**: OAuth integration, profile management, role-based permissions

### Tickets
- **Purpose**: Core ticketing system
- **Features**: Status workflow, assignment management, form-based creation
- **Relationships**: Belongs to User (creator), optionally assigned to User (agent)

### Forms
- **Purpose**: Dynamic form definitions for ticket creation
- **Features**: Field definitions, validation rules, conditional logic
- **Relationships**: Has many Tickets

## Migration Management

### Migration Files
Located in `apps/backend/drizzle/` and fully managed by Drizzle.

### Migration Metadata
- `meta/` directory contains migration snapshots and journal
- Tracks schema changes and rollback information
- Ensures consistent database state across environments

## Database Configuration

### Connection
- Uses connection pooling for performance
- Environment-based configuration
- SSL support for production

### Schema Definition
- Located in `apps/backend/src/db/schema.ts`
- Type-safe schema definitions with Drizzle
- Automatic TypeScript type generation

## Development Workflow

### Local Development
1. Start PostgreSQL (locally or via Docker)
2. Run migrations: `bun run db:migrate`
3. Seed data (if needed): `bun run db:seed`

### Schema Changes
1. Modify schema in files imported by `schema.ts`
2. Generate migration: `bun run db:generate`
3. Apply migration: `bun run db:migrate`
4. Commit both schema and migration files

### Data Seeding
- Test data generation for development
- User roles and permissions setup
- Sample forms and tickets

## Performance Considerations

### Indexing
- Primary keys and foreign keys indexed
- Search fields optimized
- Query performance monitoring

### Query Optimization
- Efficient joins and relationships
- Pagination for large datasets

### Connection Management
- Connection pooling
- Timeout configuration
- Resource cleanup

## Backup and Recovery (TODO)

### Backup Strategy
- Regular automated backups
- Point-in-time recovery capability
- Cross-region backup storage

### Recovery Procedures
- Database restoration process
- Migration rollback procedures
- Data integrity verification

## Monitoring (TODO)

### Health Checks
- Connection monitoring
- Query performance tracking
- Resource usage alerts

### Metrics
- Query execution times
- Connection pool status
- Database size and growth 