# Frontend

This document outlines the frontend architecture and components of Te Kudasai.

## Overview

The frontend is built with React 19, Vite, and TailwindCSS, following modern React patterns and best practices.

## Directory Structure

```
apps/frontend/
├── src/
│   ├── main.tsx          # Application entry point
│   ├── App.tsx           # Root component
│   ├── api/              # API client and types
│   ├── components/       # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layouts/      # Layout components
│   │   ├── tickets/      # Ticket components
│   │   ├── form-builder/ # Form builder components
│   │   └── *.tsx         # Other components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   ├── agent/        # Agent pages
│   │   ├── auth/         # Authentication pages
│   │   └── customer/     # Customer pages
│   └── index.css         # Global styles
├── public/               # Static assets
├── tests/                # Test files
│   ├── msw/              # Mock Service Worker
│   ├── pages/            # Component tests based on page
│   └── utils.tsx         # Test utilities
└── components.json       # shadcn/ui config
```

## Core Features

### Authentication
- OAuth login with GitHub and GitLab
- Session management
- Protected routes
- Role-based access control

### Ticket Management
- Ticket creation with dynamic forms
- Ticket listing and filtering
- Status updates
- Assignment management

### Form Builder
- Dynamic form rendering with form-builder components
- Sortable form elements
- Field validation
- Form submission and management

### User Interface
- Responsive design with TailwindCSS
- Color scheme support
- Loading states and empty states
- Error handling and toast notifications
- Command palette for navigation

## Technical Details

### State Management
- TanStack Query for server state
- React Hook Form for forms
- Context API for global state
- Local storage for persistence

### Routing
- React Router v7
- Nested routes with layouts
- Route guards

## Development

### Setup
1. Install dependencies: `bun install`
2. Configure environment variables
3. Start development server: `bun run dev`

### Testing
- Component tests with React Testing Library
- Integration tests

### Build
- Production build: `bun run build`
- Preview build: `bun run preview`
- Asset optimization
- Bundle analysis
