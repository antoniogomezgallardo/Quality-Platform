# Product Management API

## Overview

The Product Management API provides comprehensive CRUD operations for managing an e-commerce product catalog. It includes advanced features like filtering, search, pagination, and role-based access control.

## Features

- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete products
- ✅ **Advanced Filtering**: Search by name/description, filter by category, price range, stock status
- ✅ **Pagination Support**: Configurable page sizes with metadata
- ✅ **Category Management**: Dynamic category listing and filtering
- ✅ **Stock Management**: Real-time inventory tracking and updates
- ✅ **Role-Based Access**: Admin-only access for product management operations
- ✅ **Search Functionality**: Full-text search across product fields
- ✅ **Data Validation**: Comprehensive input validation and error handling

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Get All Products
```http
GET /api/products?page=1&limit=10&search=wireless&category=Electronics&minPrice=50&maxPrice=200&sortBy=name&sortOrder=asc
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page, max 100 (default: 10) 
- `search` (optional): Search term for name/description
- `category` (optional): Filter by product category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `isActive` (optional): Filter by active status (true/false)
- `inStock` (optional): Filter by stock availability (true/false)
- `sortBy` (optional): Sort field (name, price, category, createdAt, updatedAt)
- `sortOrder` (optional): Sort direction (asc, desc)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Wireless Bluetooth Headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 199.99,
      "stock": 50,
      "category": "Electronics",
      "imageUrl": "https://example.com/image.jpg",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "hasNext": false,
  "hasPrevious": false
}
```

#### Get Single Product
```http
GET /api/products/{id}
```

**Response:**
```json
{
  "id": 1,
  "name": "Wireless Bluetooth Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 199.99,
  "stock": 50,
  "category": "Electronics",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### Get All Categories
```http
GET /api/products/categories
```

**Response:**
```json
{
  "categories": ["Electronics", "Wearables", "Lifestyle", "Furniture", "Fitness", "Appliances"],
  "count": 6
}
```

#### Get Products by Category
```http
GET /api/products/category/{category}
```

#### Search Products
```http
GET /api/products/search/{searchTerm}
```

### Protected Endpoints (Admin Only)

> **Authentication Required**: All admin endpoints require a valid JWT token with ADMIN role.
> Include: `Authorization: Bearer <jwt_token>`

#### Create Product
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 100,
  "category": "Electronics",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true
}
```

**Validation Rules:**
- `name`: Required string, min 1 character
- `description`: Optional string
- `price`: Required positive number
- `stock`: Required integer >= 0
- `category`: Required string
- `imageUrl`: Optional valid URL
- `isActive`: Optional boolean (default: true)

#### Update Product
```http
PATCH /api/products/{id}
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>

{
  "name": "Updated Product Name",
  "price": 109.99
}
```

#### Update Product Stock
```http
PATCH /api/products/{id}/stock
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>

{
  "quantity": -5
}
```

> **Note**: `quantity` can be positive (add stock) or negative (reduce stock). The operation will fail if it would result in negative stock.

#### Delete Product
```http
DELETE /api/products/{id}
Authorization: Bearer <admin_jwt_token>
```

## Authentication & Authorization

### Getting Admin Access

1. **Register/Login as Admin**:
   ```bash
   # Use seeded admin account
   POST /api/auth/login
   {
     "email": "admin@quality-platform.com",
     "password": "admin123"
   }
   ```

2. **Use JWT Token**:
   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Role-Based Access Control

- **Public Access**: Product listing, search, categories, single product view
- **Admin Only**: Create, update, delete products, stock management

## Error Handling

The API returns consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created (for POST operations)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid JWT)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (product doesn't exist)
- `500` - Internal Server Error

## Sample Data

The API comes pre-seeded with sample data:

### Categories Available
- **Electronics**: Headphones, Keyboards, Speakers, Chargers, SSDs
- **Wearables**: Fitness watches and smart accessories
- **Lifestyle**: Water bottles and personal items  
- **Furniture**: Office chairs and ergonomic equipment
- **Fitness**: Yoga mats and exercise equipment
- **Appliances**: Coffee makers and kitchen equipment

### Test Products
Run `pnpm run db:seed` to populate with 10 sample products across all categories.

## Development Examples

### Search for Wireless Products
```bash
curl "http://localhost:3000/api/products?search=wireless"
```

### Get Electronics Under $200
```bash
curl "http://localhost:3000/api/products?category=Electronics&maxPrice=200"
```

### Get Out of Stock Products (Admin)
```bash
curl "http://localhost:3000/api/products?inStock=false" \
  -H "Authorization: Bearer <admin_jwt>"
```

### Create New Product (Admin)
```bash
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_jwt>" \
  -d '{
    "name": "Gaming Mouse",
    "description": "High-precision gaming mouse with RGB lighting",
    "price": 79.99,
    "stock": 25,
    "category": "Electronics",
    "imageUrl": "https://example.com/gaming-mouse.jpg"
  }'
```

## Interactive Documentation

For interactive API testing, visit the Swagger UI at:
**http://localhost:3000/api/docs** (when server is running)

The Swagger interface provides:
- Live API testing with authentication
- Complete request/response schemas
- Parameter validation
- Real-time example responses

## Integration with Order System

The Product API is designed to integrate seamlessly with the upcoming Order Management system:

- **Stock Management**: Automatic inventory updates when orders are placed
- **Price Calculation**: Real-time pricing for order totals
- **Product Validation**: Ensures ordered products exist and are available
- **Category Filtering**: Enables category-based shopping experiences

## Best Practices

### For Frontend Integration
1. **Pagination**: Always implement pagination for product lists
2. **Search Debouncing**: Debounce search queries to reduce API calls
3. **Error Handling**: Implement proper error states for all scenarios
4. **Loading States**: Show loading indicators during API calls
5. **Cache Management**: Consider caching category and product data

### For Admin Operations
1. **Bulk Operations**: Consider implementing batch operations for efficiency
2. **Input Validation**: Validate data on both client and server sides
3. **Confirmation Dialogs**: Always confirm destructive operations like delete
4. **Audit Logging**: Track all administrative changes for compliance
5. **Stock Alerts**: Implement low-stock notifications

## Next Steps

The Product API provides the foundation for:
- **Phase 3B**: Order Management System with cart functionality
- **Phase 4**: Frontend application with shopping interface
- **Advanced Features**: Bulk operations, product variants, reviews, recommendations

For more information, see the main [API Getting Started Guide](./getting-started.md).