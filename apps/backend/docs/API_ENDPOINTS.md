# API Endpoints

> **Load Testing Priority**  
> ⭐️⭐️⭐️ High Priority - Critical for performance  
> ⭐️⭐️ Medium Priority - Important but less critical  
> ⭐ Low Priority - Less critical for load testing

## Health Check
- ⭐️⭐️ `GET /api/health` - Health check endpoint (important for monitoring)

## Authentication (`/api/auth/*`)
- ⭐️⭐️⭐️ `POST /api/auth/signin` - User login (high traffic, critical for user access)
- ⭐️⭐️ `POST /api/auth/signup` - User registration (important for growth)
- ⭐️ `POST /api/auth/signout` - User logout
- ⭐️⭐️ `GET /api/auth/session` - Get current session (frequently called)
- ⭐ `POST /api/auth/session` - Update session
- ⭐ `POST /api/auth/verify-request` - Request email verification
- ⭐ `POST /api/auth/verify` - Verify email
- ⭐ `POST /api/auth/reset-password-request` - Request password reset
- ⭐ `POST /api/auth/reset-password` - Reset password
- ⭐ `GET /api/auth/providers` - Get available auth providers
- ⭐ `GET /api/auth/{provider}` - Start OAuth flow for a provider
- ⭐ `GET /api/auth/{provider}/callback` - OAuth callback

## Tickets (`/api/tickets`)

### User Tickets (Requires Authentication)
- ⭐️⭐️⭐️ `GET /api/tickets/my` - Get current user's tickets (paginated, high traffic)
- ⭐️⭐️⭐️ `POST /api/tickets/my` - Create a new ticket (critical user action)
- ⭐️⭐️ `GET /api/tickets/my/:id` - Get a specific ticket by ID (frequently used)

### Admin Tickets (Requires Admin)
- ⭐️⭐️ `GET /api/tickets` - Get all tickets (paginated, admin dashboard)
- ⭐️⭐️ `GET /api/tickets/:id` - Get any ticket by ID (admin support)
- ⭐️⭐️ `PATCH /api/tickets/:id` - Update a ticket (important for support workflow)
- ⭐ `DELETE /api/tickets/:id` - Delete a ticket (less frequent)
- ⭐ `POST /api/tickets/:id/assign-toggle` - Toggle ticket assignment (admin workflow)
- ⭐ `POST /api/tickets/:id/open-form` - Reopen form for a ticket (edge case)

## Forms (`/api/forms`)

### Public Forms (Requires Authentication)
- ⭐️⭐️ `GET /api/forms/enabled` - Get all enabled forms (common user action)
- ⭐️⭐️ `GET /api/forms/enabled/:id` - Get a specific enabled form by ID (form display)

### Form Management (Requires Admin)
- ⭐ `GET /api/forms` - Get all forms (admin only)
- ⭐ `POST /api/forms` - Create a new form (admin only, infrequent)
- ⭐ `GET /api/forms/:id` - Get any form by ID (admin only)
- ⭐ `PATCH /api/forms/:id` - Update a form (admin only)
- ⭐ `DELETE /api/forms/:id` - Delete a form (admin only, rare)
