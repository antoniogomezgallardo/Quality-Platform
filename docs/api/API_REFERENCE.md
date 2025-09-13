# Quality Platform API Reference

## 🌐 Base URL
- Development: `http://localhost:3001/api`
- Production: Configure in environment

## 🔑 Authentication
The API uses JWT Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📚 Interactive Documentation
Access Swagger UI at: `http://localhost:3001/api/docs`

---

## 🏥 Health & Monitoring

### GET /api/health
Basic health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00Z",
  "uptime": 3600,
  "environment": "development"
}
```

### GET /api/health/ready
Readiness probe including database connectivity.

### GET /api/health/live
Liveness probe for container orchestration.

---

## 🔐 Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "access_token": "jwt-token"
}
```

### POST /api/auth/login
Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

### GET /api/auth/me
Get current authenticated user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

---

## 📦 Product Management

### GET /api/products
List products with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in name/description
- `category` (string): Filter by category
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `inStock` (boolean): Show only in-stock items

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": 29.99,
      "category": "Electronics",
      "stock": 100,
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### GET /api/products/:id
Get single product details.

### GET /api/products/categories
Get all available product categories.

### GET /api/products/category/:category
Get products by specific category.

### GET /api/products/search/:term
Search products by name or description.

### POST /api/products
Create new product (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 49.99,
  "category": "Electronics",
  "stock": 50,
  "imageUrl": "https://example.com/image.jpg"
}
```

### PATCH /api/products/:id
Update product (Admin only).

### PATCH /api/products/:id/stock
Update product stock (Admin only).

### DELETE /api/products/:id
Delete product (Admin only).

---

## 🛒 Shopping Cart

### GET /api/cart
Get current cart (session or user-based).

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "items": [
    {
      "id": "uuid",
      "productId": "product-uuid",
      "quantity": 2,
      "price": 29.99,
      "product": {
        "name": "Product Name",
        "imageUrl": "https://example.com/image.jpg"
      }
    }
  ],
  "totalItems": 2,
  "totalAmount": 59.98
}
```

### GET /api/cart/summary
Get cart summary with totals.

### POST /api/cart/items
Add item to cart.

**Request Body:**
```json
{
  "productId": "product-uuid",
  "quantity": 2
}
```

### PATCH /api/cart/items/:id
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 3
}
```

### DELETE /api/cart/items/:id
Remove item from cart.

### DELETE /api/cart
Clear entire cart.

### POST /api/cart/validate
Validate cart stock availability.

### POST /api/cart/merge
Merge guest cart with user cart (requires authentication).

### POST /api/cart/checkout
Convert cart to order (requires authentication).

---

## 📋 Order Management

### GET /api/orders
List all orders (Admin only).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `userId` (string): Filter by user
- `startDate` (string): Date range start
- `endDate` (string): Date range end

### GET /api/orders/my-orders
Get current user's orders.

### GET /api/orders/:id
Get single order details.

### GET /api/orders/stats
Get order statistics.

**Response:** `200 OK`
```json
{
  "totalOrders": 150,
  "totalRevenue": 15000.00,
  "averageOrderValue": 100.00,
  "ordersByStatus": {
    "PENDING": 10,
    "CONFIRMED": 20,
    "SHIPPED": 50,
    "DELIVERED": 70
  }
}
```

### GET /api/orders/user/:userId
Get orders for specific user (Admin only).

### POST /api/orders
Create new order.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "shippingAddress": "123 Main St, City, Country",
  "notes": "Please handle with care"
}
```

### PATCH /api/orders/:id
Update order notes.

### PATCH /api/orders/:id/status
Update order status (Admin only).

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Valid Status Values:**
- `PENDING`
- `CONFIRMED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

### POST /api/orders/:id/cancel
Cancel order and restore stock.

---

## 🔒 Security & Roles

### User Roles
- **USER**: Regular customer (default)
- **ADMIN**: Full system access

### Protected Endpoints
- 🔓 Public: Health, Product listing, Cart operations (session-based)
- 🔐 Authenticated: Profile, Orders, Cart checkout
- 👑 Admin Only: Product CUD, Order management, User management

---

## 📊 Response Formats

### Success Response
```json
{
  "data": {},
  "meta": {
    "timestamp": "2025-01-15T10:00:00Z"
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "statusCode": 400,
  "timestamp": "2025-01-15T10:00:00Z"
}
```

### Pagination Response
```json
{
  "data": [],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🚀 Rate Limiting

- **Default**: 100 requests per minute per IP
- **Authenticated**: 200 requests per minute per user
- **Admin**: No rate limiting

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. All monetary values are in USD (configurable)
3. Stock validation occurs on cart operations and checkout
4. Session-based carts expire after 7 days of inactivity
5. JWT tokens expire after 7 days (configurable)