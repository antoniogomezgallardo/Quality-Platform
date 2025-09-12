# Shopping Cart API Documentation

## Overview

The Shopping Cart API provides comprehensive functionality for managing shopping carts in the Quality Platform e-commerce system. It supports both authenticated user carts and guest session-based carts, with seamless cart merging capabilities when guests log in.

## Authentication

Cart endpoints support both authenticated and guest access:

- **Authenticated Users**: Use JWT Bearer token in Authorization header
- **Guest Users**: Use `x-session-id` header with a unique session identifier

```bash
# For authenticated users
Authorization: Bearer YOUR_JWT_TOKEN

# For guest users
x-session-id: YOUR_SESSION_ID
```

## Base URL

```
http://localhost:3000/api/cart
```

## Endpoints

### 1. Get Cart

Retrieve the current cart for authenticated user or guest session.

**Endpoint:** `GET /api/cart`  
**Authentication:** Optional (supports both user and guest carts)

**Headers:**
- `Authorization: Bearer <token>` (optional, for authenticated users)
- `x-session-id: <session-id>` (optional, for guest carts)

```bash
# For authenticated user
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# For guest user
curl -X GET http://localhost:3000/api/cart \
  -H "x-session-id: guest-session-123"
```

**Response:**
```json
{
  "id": "cart_abc123",
  "userId": 1,
  "sessionId": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  },
  "cartItems": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "addedAt": "2024-01-15T10:15:00Z",
      "product": {
        "id": 1,
        "name": "Wireless Bluetooth Headphones",
        "description": "High-quality wireless headphones",
        "price": 199.99,
        "stock": 50,
        "category": "Electronics",
        "imageUrl": "https://example.com/image.jpg",
        "isActive": true
      }
    }
  ]
}
```

### 2. Get Cart Summary

Get cart totals and summary information.

**Endpoint:** `GET /api/cart/summary`  
**Authentication:** Optional (supports both user and guest carts)

```bash
curl -X GET http://localhost:3000/api/cart/summary \
  -H "x-session-id: guest-session-123"
```

**Response:**
```json
{
  "totalItems": 5,
  "totalAmount": 599.95,
  "itemCount": 3,
  "isEmpty": false
}
```

### 3. Add Item to Cart

Add a product to the cart with specified quantity.

**Endpoint:** `POST /api/cart/items`  
**Authentication:** Optional (supports both user and guest carts)

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "x-session-id: guest-session-123" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

**Response:** Returns updated cart object (same structure as Get Cart)

### 4. Update Cart Item

Update the quantity of a specific cart item.

**Endpoint:** `PATCH /api/cart/items/:id`  
**Authentication:** Optional (supports both user and guest carts)

**Request Body:**
```json
{
  "quantity": 3
}
```

```bash
curl -X PATCH http://localhost:3000/api/cart/items/1 \
  -H "Content-Type: application/json" \
  -H "x-session-id: guest-session-123" \
  -d '{"quantity": 3}'
```

**Response:** Returns updated cart object

### 5. Remove Item from Cart

Remove a specific item from the cart.

**Endpoint:** `DELETE /api/cart/items/:id`  
**Authentication:** Optional (supports both user and guest carts)

```bash
curl -X DELETE http://localhost:3000/api/cart/items/1 \
  -H "x-session-id: guest-session-123"
```

**Response:** Returns updated cart object

### 6. Clear Cart

Remove all items from the cart.

**Endpoint:** `DELETE /api/cart`  
**Authentication:** Optional (supports both user and guest carts)

```bash
curl -X DELETE http://localhost:3000/api/cart \
  -H "x-session-id: guest-session-123"
```

**Response:**
```json
{
  "message": "Cart cleared successfully"
}
```

### 7. Validate Cart Stock

Check if all items in cart are still available with current stock levels.

**Endpoint:** `POST /api/cart/validate`  
**Authentication:** Optional (supports both user and guest carts)

```bash
curl -X POST http://localhost:3000/api/cart/validate \
  -H "x-session-id: guest-session-123"
```

**Response:**
```json
{
  "isValid": true,
  "issues": []
}
```

**Response (with issues):**
```json
{
  "isValid": false,
  "issues": [
    "Insufficient stock for \"Product Name\". Available: 5, In cart: 10",
    "Product \"Another Product\" is no longer available"
  ]
}
```

### 8. Merge Guest Cart with User Cart

Merge a guest session cart with authenticated user cart after login.

**Endpoint:** `POST /api/cart/merge`  
**Authentication:** Required (JWT Bearer token)

**Headers:**
- `Authorization: Bearer <token>` (required)
- `x-session-id: <guest-session-id>` (required)

```bash
curl -X POST http://localhost:3000/api/cart/merge \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-session-id: guest-session-to-merge"
```

**Response:** Returns merged cart object

### 9. Checkout Cart to Order

Convert current cart into an order and clear the cart.

**Endpoint:** `POST /api/cart/checkout`  
**Authentication:** Required (JWT Bearer token)

```bash
curl -X POST http://localhost:3000/api/cart/checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "orderId": 123,
  "message": "Order created successfully from cart"
}
```

## Cart Features

### Session-Based Carts (Guest Users)

- **Automatic Creation**: Carts are created automatically when first item is added
- **Session Persistence**: Carts persist using the `x-session-id` header
- **No Authentication Required**: Guest users can manage carts without registration

### User-Based Carts (Authenticated Users)

- **User Association**: Carts are linked to authenticated user accounts
- **Cross-Device Sync**: User carts sync across devices when logged in
- **Persistent Storage**: User carts persist indefinitely until manually cleared

### Cart Merging

- **Automatic Merging**: When guest users log in, their session cart merges with user cart
- **Intelligent Merging**: For duplicate products, takes the maximum quantity
- **Stock Validation**: Only valid items (with sufficient stock) are merged

### Stock Management

- **Real-Time Validation**: Stock levels checked when adding/updating items
- **Prevent Overselling**: Cannot add more items than available stock
- **Stock Monitoring**: Validation endpoint checks current stock availability

### Business Rules

#### Adding Items
- Product must exist and be active
- Sufficient stock must be available
- If item already exists in cart, quantities are combined
- Stock validation prevents overselling

#### Updating Items
- Only cart owner (user or session) can modify items
- Quantity must be positive and within stock limits
- Stock validation applies to updated quantities

#### Cart Validation
- Real-time stock checking against current inventory
- Identifies inactive products
- Reports stock insufficiency issues
- Validates all items before checkout

#### Checkout Process
- User authentication required for checkout
- Complete stock validation before order creation
- Automatic stock reduction upon order creation
- Cart is cleared after successful order creation
- Rollback on any failure during checkout

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
  "message": "You can only modify your own cart items",
  "error": "Forbidden"
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Product with ID 999 not found",
  "error": "Not Found"
}
```

## Example Workflows

### Guest User Shopping Flow

1. **Browse Products and Add to Cart**
```bash
# Add first item - cart created automatically
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "x-session-id: guest-abc123" \
  -d '{"productId": 1, "quantity": 1}'
```

2. **Add More Items**
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "x-session-id: guest-abc123" \
  -d '{"productId": 2, "quantity": 2}'
```

3. **Check Cart Summary**
```bash
curl -X GET http://localhost:3000/api/cart/summary \
  -H "x-session-id: guest-abc123"
```

4. **User Registers/Logs In**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

5. **Merge Guest Cart**
```bash
curl -X POST http://localhost:3000/api/cart/merge \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "x-session-id: guest-abc123"
```

6. **Checkout**
```bash
curl -X POST http://localhost:3000/api/cart/checkout \
  -H "Authorization: Bearer JWT_TOKEN"
```

### Authenticated User Shopping Flow

1. **Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

2. **Add Items to Cart**
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d '{"productId": 1, "quantity": 3}'
```

3. **Update Item Quantity**
```bash
curl -X PATCH http://localhost:3000/api/cart/items/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d '{"quantity": 5}'
```

4. **Validate Cart Before Checkout**
```bash
curl -X POST http://localhost:3000/api/cart/validate \
  -H "Authorization: Bearer JWT_TOKEN"
```

5. **Checkout**
```bash
curl -X POST http://localhost:3000/api/cart/checkout \
  -H "Authorization: Bearer JWT_TOKEN"
```

## Integration with Other APIs

### Products API Integration
- Real-time stock validation against Products API
- Product information included in cart responses
- Active product status checking

### Orders API Integration
- Seamless cart-to-order conversion
- Automatic stock reduction during checkout
- Order creation with cart item details

### Authentication Integration
- Support for both authenticated and guest workflows
- Automatic cart association on login
- JWT token validation for protected endpoints

## Performance Considerations

- **Database Indexing**: Optimized queries with proper indexing on cart and user relationships
- **Session Management**: Efficient session-based cart storage
- **Stock Validation**: Batch validation for better performance
- **Transaction Safety**: Database transactions ensure data consistency

## Security Features

- **Cart Ownership Validation**: Users can only access their own carts
- **Session Security**: Secure session-based guest cart management
- **Stock Validation**: Prevents manipulation of stock levels
- **Input Validation**: Comprehensive validation of all input data

## Testing with Swagger UI

Visit `http://localhost:3000/api/docs` to access the interactive Swagger UI documentation where you can test all cart endpoints directly in your browser.

## Related Documentation

- [Product API Documentation](./products.md)
- [Order API Documentation](./orders.md)
- [Authentication Guide](../getting-started.md#authentication)
- [API Getting Started Guide](../getting-started.md)