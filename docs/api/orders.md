# Order Management API Documentation

## Overview

The Order Management API provides comprehensive functionality for creating, managing, and tracking customer orders. It includes features for stock management, order status tracking, and role-based access control for both customers and administrators.

## Authentication

All order endpoints require JWT authentication. Include the JWT token in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

### Role-Based Access

- **USER**: Can manage their own orders (create, view, update their own orders)
- **ADMIN**: Can manage all orders and access administrative functions

## Base URL

```
http://localhost:3000/api/orders
```

## Endpoints

### 1. Create Order

Create a new order with multiple products.

**Endpoint:** `POST /api/orders`  
**Authentication:** Required (USER/ADMIN)  
**Role:** Any authenticated user

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 2
      },
      {
        "productId": 3,
        "quantity": 1
      }
    ],
    "notes": "Please handle with care"
  }'
```

**Response:**
```json
{
  "id": 1,
  "userId": 2,
  "status": "PENDING",
  "total": 599.97,
  "notes": "Please handle with care",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "user": {
    "id": 2,
    "email": "user@quality-platform.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User"
  },
  "orderItems": [
    {
      "id": 1,
      "quantity": 2,
      "price": 199.99,
      "product": {
        "id": 1,
        "name": "Wireless Bluetooth Headphones",
        "price": 199.99
      }
    }
  ]
}
```

### 2. Get All Orders (Admin Only)

Retrieve all orders with advanced filtering and pagination.

**Endpoint:** `GET /api/orders`  
**Authentication:** Required (ADMIN only)  
**Role:** ADMIN

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by order status
- `userId` (optional): Filter by user ID
- `startDate` (optional): Filter orders after this date
- `endDate` (optional): Filter orders before this date
- `minTotal` (optional): Filter orders with minimum total
- `maxTotal` (optional): Filter orders with maximum total
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort direction (asc/desc, default: desc)

```bash
curl -X GET "http://localhost:3000/api/orders?page=1&limit=5&status=PENDING" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 3. Get User Orders

Retrieve current user's orders with filtering and pagination.

**Endpoint:** `GET /api/orders/my-orders`  
**Authentication:** Required (USER/ADMIN)  
**Role:** Any authenticated user

```bash
curl -X GET "http://localhost:3000/api/orders/my-orders?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Order by ID

Retrieve a specific order by ID.

**Endpoint:** `GET /api/orders/:id`  
**Authentication:** Required (USER/ADMIN)  
**Role:** Users can only access their own orders, ADMINs can access any order

```bash
curl -X GET http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Update Order

Update an existing order (limited fields).

**Endpoint:** `PATCH /api/orders/:id`  
**Authentication:** Required (USER/ADMIN)  
**Role:** Users can update their own orders (notes only), ADMINs can update any order including status

```bash
curl -X PATCH http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "notes": "Updated delivery instructions"
  }'
```

### 6. Cancel Order

Cancel an existing order and restore stock.

**Endpoint:** `POST /api/orders/:id/cancel`  
**Authentication:** Required (USER/ADMIN)  
**Role:** Users can cancel their own orders, ADMINs can cancel any order

```bash
curl -X POST http://localhost:3000/api/orders/1/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "status": "CANCELLED",
  "message": "Order cancelled successfully"
}
```

### 7. Update Order Status (Admin Only)

Update the status of an order.

**Endpoint:** `PATCH /api/orders/:id/status`  
**Authentication:** Required (ADMIN only)  
**Role:** ADMIN

**Valid Status Values:**
- `PENDING`
- `CONFIRMED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

```bash
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "status": "SHIPPED"
  }'
```

### 8. Get Order Statistics

Get comprehensive order statistics.

**Endpoint:** `GET /api/orders/stats`  
**Authentication:** Required (USER/ADMIN)  
**Role:** Users get their own stats, ADMINs get global stats

```bash
curl -X GET http://localhost:3000/api/orders/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "totalOrders": 15,
  "pendingOrders": 3,
  "completedOrders": 8,
  "totalRevenue": 2499.85,
  "averageOrderValue": 166.66
}
```

### 9. Get Orders by User (Admin Only)

Retrieve all orders for a specific user.

**Endpoint:** `GET /api/orders/user/:userId`  
**Authentication:** Required (ADMIN only)  
**Role:** ADMIN

```bash
curl -X GET http://localhost:3000/api/orders/user/2 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

## Order Status Workflow

Orders follow a specific status workflow:

1. **PENDING** → Initial state when order is created
2. **CONFIRMED** → Order confirmed and being processed
3. **SHIPPED** → Order has been shipped
4. **DELIVERED** → Order successfully delivered
5. **CANCELLED** → Order cancelled (stock restored)

### Status Transition Rules

- Orders can be cancelled at any time except when already DELIVERED
- Once DELIVERED, status cannot be changed
- Once CANCELLED, status cannot be changed to anything else
- Only ADMINs can change order status (except cancellation which users can do for their own orders)

## Stock Management

The system automatically handles inventory management:

- **Order Creation**: Stock is reduced when order is created
- **Order Cancellation**: Stock is restored when order is cancelled
- **Stock Validation**: Orders cannot be created if insufficient stock is available

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Insufficient stock for \"Product Name\". Available: 5, Requested: 10",
  "error": "Bad Request"
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**403 Forbidden**
```json
{
  "statusCode": 403,
  "message": "You can only access your own orders",
  "error": "Forbidden"
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Order with ID 999 not found",
  "error": "Not Found"
}
```

## Business Rules

### Order Creation
- All products must exist and be active
- Sufficient stock must be available for all items
- Total amount is calculated automatically based on current product prices
- Stock is immediately reserved upon order creation

### Order Modification
- Users can only modify their own orders
- Only notes can be modified by users
- ADMINs can modify any field including status
- Completed (DELIVERED) and cancelled orders cannot be modified

### Order Cancellation
- Users can cancel their own orders
- ADMINs can cancel any order
- Delivered orders cannot be cancelled
- Stock is automatically restored upon cancellation

### Stock Management
- Real-time stock tracking and validation
- Automatic stock reduction on order creation
- Automatic stock restoration on order cancellation
- Prevention of overselling through validation

## Example Workflows

### Complete Order Creation Workflow

1. **User Authentication**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@quality-platform.com", "password": "user123"}'
```

2. **Check Product Availability**
```bash
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

3. **Create Order**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [{"productId": 1, "quantity": 1}],
    "notes": "Standard delivery please"
  }'
```

4. **Track Order Status**
```bash
curl -X GET http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Admin Order Management Workflow

1. **Admin Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@quality-platform.com", "password": "admin123"}'
```

2. **View All Orders**
```bash
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

3. **Update Order Status**
```bash
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{"status": "CONFIRMED"}'
```

4. **View Statistics**
```bash
curl -X GET http://localhost:3000/api/orders/stats \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

## Testing with Swagger UI

Visit `http://localhost:3000/api` to access the interactive Swagger UI documentation where you can test all endpoints directly in your browser.

## Related Documentation

- [Product API Documentation](./products.md)
- [Authentication Guide](../getting-started.md#authentication)
- [API Getting Started Guide](../getting-started.md)