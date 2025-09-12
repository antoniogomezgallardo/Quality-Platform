import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderItem, OrderStatus, Product, User } from '@prisma/client';

export class OrderItemResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 199.99 })
  price: number;

  @ApiProperty({ example: 'Wireless Bluetooth Headphones' })
  productName: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  productImage: string | null;

  constructor(orderItem: OrderItem & { product: Product }) {
    this.id = orderItem.id;
    this.productId = orderItem.productId;
    this.quantity = orderItem.quantity;
    this.price = orderItem.price;
    this.productName = orderItem.product.name;
    this.productImage = orderItem.product.imageUrl;
  }
}

export class OrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'john@example.com' })
  userEmail: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ example: 399.98 })
  total: number;

  @ApiProperty({ example: 'Please deliver after 2 PM' })
  notes: string | null;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ type: [OrderItemResponseDto] })
  orderItems: OrderItemResponseDto[];

  constructor(order: Order & { user: User; orderItems: (OrderItem & { product: Product })[] }) {
    this.id = order.id;
    this.userId = order.userId;
    this.userEmail = order.user.email;
    this.status = order.status;
    this.total = order.total;
    this.notes = order.notes || null;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
    this.orderItems = order.orderItems.map(item => new OrderItemResponseDto(item));
  }
}

export class PaginatedOrdersDto {
  @ApiProperty({ type: [OrderResponseDto] })
  data: OrderResponseDto[];

  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNext: boolean;

  @ApiProperty({ example: false })
  hasPrevious: boolean;
}

export class OrderStatsDto {
  @ApiProperty({ example: 125 })
  totalOrders: number;

  @ApiProperty({ example: 15 })
  pendingOrders: number;

  @ApiProperty({ example: 85 })
  completedOrders: number;

  @ApiProperty({ example: 12500.50 })
  totalRevenue: number;

  @ApiProperty({ example: 100.50 })
  averageOrderValue: number;
}