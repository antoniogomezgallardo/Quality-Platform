# Authentication Guide

## Overview

The Quality Platform API uses JWT (JSON Web Token) authentication with Passport.js for secure user authentication and authorization. The authentication system supports user registration, login, and protected route access.

## Authentication Flow

1. **User Registration** (`POST /api/auth/register`)
   - User provides email, username, password, and optional personal details
   - System validates input and checks for existing users
   - Password is hashed using bcryptjs
   - User is created in database
   - JWT token is returned with user information

2. **User Login** (`POST /api/auth/login`)
   - User provides email and password
   - System validates credentials against database
   - JWT token is returned with user information

3. **Protected Routes**
   - Include JWT token in `Authorization` header as `Bearer <token>`
   - Token is validated and user information is extracted
   - User information is available in request context

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|------------------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login existing user | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Registration

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

### Get Current User Profile

```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "isActive": true,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

## Using JWT Tokens

### Include Token in Requests

For protected endpoints, include the JWT token in the Authorization header:

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Token Structure

The JWT token contains:
- **Subject (sub)**: User ID
- **Email**: User email
- **Role**: User role (USER/ADMIN)
- **Expiration**: Token expiry time (default: 7 days)

## Environment Configuration

Configure JWT settings in your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

**Important Security Notes:**
- Use a strong, unique JWT secret in production
- Keep the JWT secret secure and never expose it
- Consider shorter expiration times for sensitive applications
- Implement token refresh mechanism for longer sessions

## Database Schema

The authentication system uses the following User model:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  password  String   // Hashed with bcryptjs
  firstName String?
  lastName  String?
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

enum Role {
  USER
  ADMIN
}
```

## Password Security

- Passwords are hashed using bcryptjs with salt rounds of 12
- Plain text passwords are never stored in the database
- Password validation requires minimum 6 characters

## Error Handling

Common authentication errors:

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Invalid input data or validation failed |
| 401 | Unauthorized | Invalid credentials or missing/expired token |
| 409 | Conflict | User with email or username already exists |

## Testing Authentication

### Using Swagger UI

1. Navigate to http://localhost:3000/api/docs
2. Use the `/auth/register` or `/auth/login` endpoints
3. Copy the `access_token` from the response
4. Click the "Authorize" button at the top of the Swagger page
5. Enter `Bearer <your-token>` in the JWT-auth field
6. Test protected endpoints like `/auth/me`

### Using curl

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Extract the access_token from response and use it:
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Implementation Details

### Passport Strategies

1. **LocalStrategy**: Validates email/password during login
2. **JwtStrategy**: Validates JWT tokens for protected routes

### Guards

- **LocalAuthGuard**: Used for login endpoint
- **JwtAuthGuard**: Used for protecting routes that require authentication

### Password Hashing

Uses bcryptjs with 12 salt rounds for secure password hashing:

```typescript
const hashedPassword = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

This authentication system provides a solid foundation for secure user management in the Quality Platform API.