# API Reference

This document lists all available API endpoints and their load testing priorities.

> **Load Testing Priority**  
> ⭐️⭐️⭐️ High Priority - Critical for performance  
> ⭐️⭐️ Medium Priority - Important but less critical  
> ⭐ Low Priority - Less critical for load testing

## Health Check
- ⭐️⭐️ `GET /api/health`

## Authentication (`/api/auth/*`)
- ⭐️⭐️⭐️ `POST /api/auth/signin`
- ⭐️⭐️ `POST /api/auth/signup`
- ⭐️⭐️ `GET /api/auth/session`
- ⭐ `POST /api/auth/signout`
- ⭐ `POST /api/auth/verify-request`
- ⭐ `POST /api/auth/verify`
- ⭐ `POST /api/auth/reset-password-request`
- ⭐ `POST /api/auth/reset-password`
- ⭐ `GET /api/auth/providers`
- ⭐ `GET /api/auth/{provider}`
- ⭐ `GET /api/auth/{provider}/callback`

## Tickets (`/api/tickets`)

### User Tickets
- ⭐️⭐️⭐️ `GET /api/tickets/my`
- ⭐️⭐️⭐️ `POST /api/tickets/my`
- ⭐️⭐️⭐️ `GET /api/tickets/my/:id`

### Admin Tickets
- ⭐️⭐️ `GET /api/tickets`
- ⭐️⭐️ `GET /api/tickets/:id`
- ⭐️⭐️ `PATCH /api/tickets/:id`
- ⭐ `DELETE /api/tickets/:id`
- ⭐ `POST /api/tickets/:id/assign-toggle`
- ⭐ `POST /api/tickets/:id/open-form`

## Forms (`/api/forms`)

### Public Forms
- ⭐️⭐️ `GET /api/forms/enabled`
- ⭐️⭐️ `GET /api/forms/enabled/:id`

### Form Management
- ⭐ `GET /api/forms`
- ⭐ `POST /api/forms`
- ⭐ `GET /api/forms/:id`
- ⭐ `PATCH /api/forms/:id`
- ⭐ `DELETE /api/forms/:id`

## Rate Limiting (TODO)

API endpoints are rate limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- Ticket endpoints: 60 requests per minute
- Form endpoints: 30 requests per minute

## Versioning

The API is versioned through the URL path:
- Current version: `/api/v1/*`
- Future versions should use `/api/v2/*`, etc. 