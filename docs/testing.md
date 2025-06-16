# Testing

This document outlines the testing strategy, tools, and best practices for Te Kudasai.

## Overview

Te Kudasai uses a comprehensive testing strategy with Vitest for both backend and frontend testing, ensuring code quality and reliability.

## Testing Strategy

### Test Types
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and database interactions
- **Component Tests**: React components with user interactions

### Coverage Goals
- Maintain minimum 80% test coverage
- Focus on critical business logic
- Test error handling and edge cases
- Validate user interactions and workflows

## Backend Testing

### Test Structure
Located in `apps/backend/tests/`:
```
tests/
├── integration/          # API endpoint tests
│   ├── forms/           # Form management tests
│   ├── tickets/         # Ticket system tests
│   └── users/           # User management tests
├── unit/                # Unit tests
│   ├── auth/           # Authentication logic
│   └── shared/         # Utility functions
└── utils/              # Test utilities
    ├── auth.ts         # Authentication helpers
    └── seeder.ts       # Test data generation
```

### Testing Tools
- **Vitest**: Test runner and framework
- **Test Database**: Isolated test environment using PGlite
- **Seeder**: Test data generation
- **Auth Utilities**: Authentication helpers for tests

### Test Categories

#### Integration Tests
- API endpoint functionality
- Database operations
- Authentication & authorization flows
- Error handling

#### Unit Tests
- Utility functions
- Middleware functionality
- Error handling

## Frontend Testing

### Test Structure
Located in `apps/frontend/tests/`:
```
tests/
├── msw/                 # Mock Service Worker
│   ├── handlers/       # API mock handlers
│   └── server.ts       # MSW server setup
├── pages/              # Page component tests
│   ├── admin/         # Admin page tests
│   ├── agent/         # Agent page tests
│   ├── auth/          # Authentication tests
│   └── customer/      # Customer page tests
├── setup-tests.ts      # Test configuration
└── utils.tsx          # Test utilities
```

### Testing Tools
- **Vitest**: Test runner and framework
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **User Event**: User interaction simulation

### Test Categories

#### Component Tests Based On Page
- User interface rendering
- User interactions
- Complete page functionality
- Navigation and routing
- Form submissions
- Error states

## Shared Package Testing

Currently no tests are implemented

## Running Tests

### Backend Tests
```bash
# Run all backend tests
cd apps/backend
bun run test

# Run tests in watch mode
bun run test:watch

# Generate coverage report
bun run coverage
```

### Frontend Tests
```bash
# Run all frontend tests
cd apps/frontend
bun run test

# Run tests in watch mode
bun run test:watch

# Generate coverage report
bun run coverage
```

### Root Level Tests
```bash
# Run all tests across the monorepo
bun run test

# Run tests in watch mode
bun run test:watch

# Generate coverage reports
bun run coverage
```

## Best Practices

### Test Writing
- Write descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Test one thing at a time
- Use meaningful assertions

### Test Data
- Use factories for test data generation
- Isolate test data between tests
- Clean up after tests
- Use realistic test scenarios

### Mocking
- Mock external dependencies
- Use MSW for API mocking
- Mock only what's necessary
- Keep mocks simple and focused

### Maintenance
- Keep tests up to date with code changes
- Refactor tests when needed
- Remove obsolete tests
- Monitor test performance

## Continuous Integration

### Test Automation
- Run tests on every commit
- Fail builds on test failures
- Generate coverage reports

### Quality Gates
- Minimum coverage requirements
- No failing tests allowed

## Debugging Tests

### Common Issues
- Database state conflicts
- Async operation timing
- Mock configuration problems
- Environment variable issues

### Debugging Tools
- Vitest debugging features
- Browser developer tools
- Test output analysis
- Coverage report analysis 