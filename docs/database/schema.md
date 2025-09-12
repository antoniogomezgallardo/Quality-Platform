# Database Schema Guide

## Overview

The Quality Platform uses Prisma ORM with SQLite for development and PostgreSQL for production. The database schema is designed around a sample e-commerce system to demonstrate quality engineering practices.

## Database Configuration

### Development (SQLite)
```env
DATABASE_URL="file:./dev.db"
```

### Production (PostgreSQL)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/quality_platform"
```

## Schema Structure

The database consists of four main entities with clear relationships:

```
User (1) ──────── (N) Order (1) ──────── (N) OrderItem (N) ──────── (1) Product
```

## Entity Models

### User Model

Represents system users with authentication and profile information.

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

  // Relationships
  orders Order[]
  
  @@map("users")
}
```

**Key Features:**
- Unique email and username constraints
- Password hashing with bcryptjs (12 salt rounds)
- Role-based access control (USER/ADMIN)
- Soft delete capability with `isActive` field
- Automatic timestamps

### Product Model

Represents products in the e-commerce catalog.

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  stock       Int      @default(0)
  category    String
  imageUrl    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  orderItems OrderItem[]
  
  @@map("products")
}
```

**Key Features:**
- Inventory tracking with stock field
- Category-based organization
- Optional image URL for product photos
- Soft delete with `isActive` field
- Price stored as Float (consider Decimal for production)

### Order Model

Represents customer orders with status tracking.

```prisma
model Order {
  id        Int         @id @default(autoincrement())
  userId    Int
  status    OrderStatus @default(PENDING)
  total     Float
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  // Relationships
  user       User        @relation(fields: [userId], references: [id])
  orderItems OrderItem[]
  
  @@map("orders")
}
```

**Key Features:**
- Status workflow management
- Order total calculation
- Foreign key relationship to User
- One-to-many relationship with OrderItems

### OrderItem Model

Represents individual items within an order (junction table).

```prisma
model OrderItem {
  id        Int @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  price     Float  // Price at time of order

  // Relationships
  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])
  
  @@map("order_items")
}
```

**Key Features:**
- Captures price at time of purchase
- Quantity tracking per order
- Foreign key relationships to both Order and Product

## Enums

### Role Enum
```prisma
enum Role {
  USER   // Standard user account
  ADMIN  // Administrator account
}
```

### OrderStatus Enum
```prisma
enum OrderStatus {
  PENDING    // Order created, awaiting confirmation
  CONFIRMED  // Order confirmed, ready for processing
  SHIPPED    // Order shipped to customer
  DELIVERED  // Order delivered to customer
  CANCELLED  // Order cancelled
}
```

## Relationships

### One-to-Many Relationships

1. **User → Orders**: One user can have many orders
   ```typescript
   // User side
   orders Order[]
   
   // Order side  
   user User @relation(fields: [userId], references: [id])
   userId Int
   ```

2. **Order → OrderItems**: One order can contain many items
   ```typescript
   // Order side
   orderItems OrderItem[]
   
   // OrderItem side
   order Order @relation(fields: [orderId], references: [id])
   orderId Int
   ```

3. **Product → OrderItems**: One product can appear in many order items
   ```typescript
   // Product side
   orderItems OrderItem[]
   
   // OrderItem side
   product Product @relation(fields: [productId], references: [id])
   productId Int
   ```

### Many-to-Many Relationships

Products and Orders have a many-to-many relationship through OrderItems:
- One order can contain multiple products
- One product can be in multiple orders
- OrderItem serves as the junction table with additional fields (quantity, price)

## Database Operations

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_description

# Apply migrations  
npx prisma migrate dev

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate
```

### Database GUI

```bash
# Open Prisma Studio
npx prisma studio
```

Access the database GUI at `http://localhost:5555`

## Sample Queries

### User Operations

```typescript
// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    username: 'johndoe',
    password: hashedPassword,
    firstName: 'John',
    lastName: 'Doe',
  },
});

// Find user with orders
const userWithOrders = await prisma.user.findUnique({
  where: { id: userId },
  include: { orders: true },
});
```

### Product Operations

```typescript
// Find products by category
const products = await prisma.product.findMany({
  where: {
    category: 'Electronics',
    isActive: true,
  },
});

// Update product stock
const product = await prisma.product.update({
  where: { id: productId },
  data: { stock: { decrement: quantity } },
});
```

### Order Operations

```typescript
// Create order with items
const order = await prisma.order.create({
  data: {
    userId,
    total,
    status: 'PENDING',
    orderItems: {
      create: orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  },
  include: {
    orderItems: {
      include: { product: true },
    },
  },
});

// Update order status
const updatedOrder = await prisma.order.update({
  where: { id: orderId },
  data: { status: 'CONFIRMED' },
});
```

## Business Logic Constraints

### Data Validation

1. **Email Uniqueness**: Enforced at database level
2. **Username Uniqueness**: Enforced at database level  
3. **Password Security**: Minimum 6 characters, hashed with bcryptjs
4. **Product Stock**: Must be non-negative
5. **Order Total**: Must be positive
6. **Order Quantity**: Must be positive

### Business Rules

1. **User Registration**: Email and username must be unique
2. **Order Creation**: Must have at least one order item
3. **Stock Management**: Decrement stock when order is confirmed
4. **Order Status Flow**: PENDING → CONFIRMED → SHIPPED → DELIVERED
5. **Soft Delete**: Use `isActive` field instead of hard deletes

## Performance Considerations

### Indexes

Prisma automatically creates indexes for:
- Primary keys (`@id`)
- Unique fields (`@unique`)
- Foreign keys (relationship fields)

### Query Optimization

1. **Use `select` to limit returned fields**:
   ```typescript
   const users = await prisma.user.findMany({
     select: { id: true, email: true, firstName: true },
   });
   ```

2. **Use pagination for large datasets**:
   ```typescript
   const products = await prisma.product.findMany({
     skip: (page - 1) * limit,
     take: limit,
   });
   ```

3. **Use `include` strategically**:
   ```typescript
   // Good: Only include what you need
   const order = await prisma.order.findUnique({
     where: { id },
     include: { orderItems: true },
   });
   ```

## Security Considerations

### Sensitive Data

1. **Passwords**: Always hashed, never stored in plain text
2. **JWT Secrets**: Stored in environment variables
3. **Database URLs**: Never committed to version control

### Data Access

1. **Authentication**: Required for user profile access
2. **Authorization**: Admin role for administrative operations
3. **Data Filtering**: Users can only access their own orders

## Migration Strategy

### Development to Production

1. **SQLite to PostgreSQL**: Update `DATABASE_URL` in environment
2. **Schema Sync**: Run `npx prisma db push` for initial setup
3. **Migration Files**: Use `npx prisma migrate deploy` in production
4. **Data Migration**: Custom scripts for data transformation if needed

### Version Control

- Schema changes are tracked through migration files
- Migration files are committed to version control
- Database schema is the source of truth

This schema provides a solid foundation for demonstrating quality engineering practices while supporting a realistic e-commerce workflow.