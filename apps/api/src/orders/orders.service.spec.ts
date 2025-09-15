import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto, QueryOrderDto, OrderResponseDto, OrderSortBy, SortOrder } from './dto';
import { OrderStatus, Role } from '@prisma/client';

// Create a mock PrismaService with transaction support
const mockPrismaService = {
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: typeof mockPrismaService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    role: Role.USER,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test product description',
    price: 99.99,
    stock: 50,
    category: 'Electronics',
    imageUrl: 'https://example.com/test-product.jpg',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockOrderItem = {
    id: 1,
    orderId: 1,
    productId: 1,
    quantity: 2,
    price: 99.99,
    product: mockProduct,
  };

  const mockOrder = {
    id: 1,
    userId: 1,
    total: 199.98,
    status: OrderStatus.PENDING,
    notes: 'Test order',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    user: mockUser,
    orderItems: [mockOrderItem],
  };

  const mockCreateOrderDto: CreateOrderDto = {
    items: [
      {
        productId: 1,
        quantity: 2,
      },
    ],
    notes: 'Test order',
  };

  const mockUpdateOrderDto: UpdateOrderDto = {
    notes: 'Updated order',
    status: OrderStatus.CONFIRMED,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get(PrismaService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    beforeEach(() => {
      // Mock transaction to execute the callback immediately
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(mockPrismaService);
      });
    });

    it('should create a new order successfully', async () => {
      // Given
      const userId = 1;
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({ ...mockProduct, stock: 48 });
      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      // When
      const result = await service.create(userId, mockCreateOrderDto);

      // Then
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { stock: 48 }, // 50 - 2
      });
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          userId,
          total: 199.98, // 99.99 * 2
          notes: 'Test order',
          orderItems: {
            create: [
              {
                product: { connect: { id: 1 } },
                quantity: 2,
                price: 99.99,
              },
            ],
          },
        },
        include: {
          user: true,
          orderItems: { include: { product: true } },
        },
      });
      expect(result).toBeInstanceOf(OrderResponseDto);
    });

    it('should throw NotFoundException when product not found', async () => {
      // Given
      const userId = 1;
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.create(userId, mockCreateOrderDto)).rejects.toThrow(
        new NotFoundException('Product with ID 1 not found')
      );
    });

    it('should throw BadRequestException when product is inactive', async () => {
      // Given
      const userId = 1;
      const inactiveProduct = { ...mockProduct, isActive: false };
      mockPrismaService.product.findUnique.mockResolvedValue(inactiveProduct);

      // When & Then
      await expect(service.create(userId, mockCreateOrderDto)).rejects.toThrow(
        new BadRequestException('Product "Test Product" is not available')
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      // Given
      const userId = 1;
      const lowStockProduct = { ...mockProduct, stock: 1 };
      mockPrismaService.product.findUnique.mockResolvedValue(lowStockProduct);

      // When & Then
      await expect(service.create(userId, mockCreateOrderDto)).rejects.toThrow(
        new BadRequestException('Insufficient stock for "Test Product". Available: 1, Requested: 2')
      );
    });

    it('should calculate total correctly for multiple items', async () => {
      // Given
      const userId = 1;
      const multiItemOrder: CreateOrderDto = {
        items: [
          { productId: 1, quantity: 2 },
          { productId: 1, quantity: 1 },
        ],
        notes: 'Multi-item order',
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue(mockProduct);
      mockPrismaService.order.create.mockResolvedValue({
        ...mockOrder,
        total: 299.97, // (99.99 * 2) + (99.99 * 1)
      });

      // When
      await service.create(userId, multiItemOrder);

      // Then
      expect(mockPrismaService.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            total: expect.any(Number),
          }),
        })
      );

      // Verify the total is close to expected value (handling floating point precision)
      const callArgs = mockPrismaService.order.create.mock.calls[0][0];
      expect(callArgs.data.total).toBeCloseTo(299.97, 2);
    });
  });

  describe('findAll', () => {
    const mockQueryDto: QueryOrderDto = {
      page: 1,
      limit: 10,
      status: OrderStatus.PENDING,
      userId: 1,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      minTotal: 100,
      maxTotal: 500,
      sortBy: OrderSortBy.CREATED_AT,
      sortOrder: SortOrder.DESC,
    };

    it('should return paginated orders for admin user', async () => {
      // Given
      const mockOrders = [mockOrder];
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);
      mockPrismaService.order.count.mockResolvedValue(1);

      // When
      const result = await service.findAll(mockQueryDto, 1, Role.ADMIN);

      // Then
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1, // Admin can filter by specific user
          status: OrderStatus.PENDING,
          createdAt: {
            gte: new Date('2024-01-01'),
            lte: new Date('2024-12-31'),
          },
          total: {
            gte: 100,
            lte: 500,
          },
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          orderItems: { include: { product: true } },
        },
      });

      expect(result).toEqual({
        data: expect.arrayContaining([expect.any(OrderResponseDto)]),
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      });
    });

    it('should filter orders by userId for non-admin users', async () => {
      // Given
      const userId = 2;
      mockPrismaService.order.findMany.mockResolvedValue([]);
      mockPrismaService.order.count.mockResolvedValue(0);

      // When
      await service.findAll(mockQueryDto, userId, Role.USER);

      // Then
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 2, // Non-admin user can only see their own orders
          }),
        })
      );
    });

    it('should handle empty filters correctly', async () => {
      // Given
      const emptyQuery: QueryOrderDto = {};
      mockPrismaService.order.findMany.mockResolvedValue([]);
      mockPrismaService.order.count.mockResolvedValue(0);

      // When
      await service.findAll(emptyQuery, undefined, Role.ADMIN);

      // Then
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          orderItems: { include: { product: true } },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return order when found and user is authorized', async () => {
      // Given
      const orderId = 1;
      const userId = 1;
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      // When
      const result = await service.findOne(orderId, userId, Role.USER);

      // Then
      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
        include: {
          user: true,
          orderItems: { include: { product: true } },
        },
      });
      expect(result).toBeInstanceOf(OrderResponseDto);
    });

    it('should throw NotFoundException when order not found', async () => {
      // Given
      const orderId = 999;
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.findOne(orderId, 1, Role.USER)).rejects.toThrow(
        new NotFoundException('Order with ID 999 not found')
      );
    });

    it('should throw ForbiddenException when user tries to access another user\'s order', async () => {
      // Given
      const orderId = 1;
      const unauthorizedUserId = 2;
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      // When & Then
      await expect(service.findOne(orderId, unauthorizedUserId, Role.USER)).rejects.toThrow(
        new ForbiddenException('You can only access your own orders')
      );
    });

    it('should allow admin to access any order', async () => {
      // Given
      const orderId = 1;
      const adminUserId = 2;
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      // When
      const result = await service.findOne(orderId, adminUserId, Role.ADMIN);

      // Then
      expect(result).toBeInstanceOf(OrderResponseDto);
    });
  });

  describe('update', () => {
    it('should update order successfully', async () => {
      // Given
      const orderId = 1;
      const userId = 1;
      const updatedOrder = { ...mockOrder, ...mockUpdateOrderDto };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockResolvedValue(updatedOrder);

      // When
      const result = await service.update(orderId, mockUpdateOrderDto, userId, Role.ADMIN);

      // Then
      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
      });
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: mockUpdateOrderDto,
        include: {
          user: true,
          orderItems: { include: { product: true } },
        },
      });
      expect(result).toBeInstanceOf(OrderResponseDto);
    });

    it('should throw NotFoundException when order not found', async () => {
      // Given
      const orderId = 999;
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.update(orderId, mockUpdateOrderDto, 1, Role.ADMIN)).rejects.toThrow(
        new NotFoundException('Order with ID 999 not found')
      );
    });

    it('should throw ForbiddenException when non-admin user tries to change status', async () => {
      // Given
      const orderId = 1;
      const userId = 1;
      const statusUpdateDto = { status: OrderStatus.CONFIRMED };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      // When & Then
      await expect(service.update(orderId, statusUpdateDto, userId, Role.USER)).rejects.toThrow(
        new ForbiddenException('Only administrators can change order status')
      );
    });

    it('should throw BadRequestException when trying to modify completed order', async () => {
      // Given
      const orderId = 1;
      const completedOrder = { ...mockOrder, status: OrderStatus.DELIVERED };
      mockPrismaService.order.findUnique.mockResolvedValue(completedOrder);

      // When & Then
      await expect(service.update(orderId, mockUpdateOrderDto, 1, Role.ADMIN)).rejects.toThrow(
        new BadRequestException('Cannot modify completed or cancelled orders')
      );
    });
  });

  describe('cancel', () => {
    beforeEach(() => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(mockPrismaService);
      });
    });

    it('should cancel order and restore stock successfully', async () => {
      // Given
      const orderId = 1;
      const userId = 1;
      const cancelledOrder = { ...mockOrder, status: OrderStatus.CANCELLED };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.product.update.mockResolvedValue(mockProduct);
      mockPrismaService.order.update.mockResolvedValue(cancelledOrder);

      // When
      const result = await service.cancel(orderId, userId, Role.USER);

      // Then
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { stock: { increment: 2 } },
      });
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
        include: {
          user: true,
          orderItems: { include: { product: true } },
        },
      });
      expect(result).toBeInstanceOf(OrderResponseDto);
    });

    it('should throw BadRequestException when trying to cancel delivered order', async () => {
      // Given
      const orderId = 1;
      const deliveredOrder = { ...mockOrder, status: OrderStatus.DELIVERED };
      mockPrismaService.order.findUnique.mockResolvedValue(deliveredOrder);

      // When & Then
      await expect(service.cancel(orderId, 1, Role.USER)).rejects.toThrow(
        new BadRequestException('Cannot cancel delivered orders')
      );
    });

    it('should throw BadRequestException when order is already cancelled', async () => {
      // Given
      const orderId = 1;
      const cancelledOrder = { ...mockOrder, status: OrderStatus.CANCELLED };
      mockPrismaService.order.findUnique.mockResolvedValue(cancelledOrder);

      // When & Then
      await expect(service.cancel(orderId, 1, Role.USER)).rejects.toThrow(
        new BadRequestException('Order is already cancelled')
      );
    });
  });

  describe('getStats', () => {
    it('should return order statistics for admin', async () => {
      // Given
      const mockStats = {
        totalOrders: 10,
        pendingOrders: 3,
        completedOrders: 7,
        orderTotals: {
          _sum: { total: 1000 },
          _avg: { total: 100 },
        },
      };

      mockPrismaService.order.count
        .mockResolvedValueOnce(mockStats.totalOrders) // Total orders
        .mockResolvedValueOnce(mockStats.pendingOrders) // Pending orders
        .mockResolvedValueOnce(mockStats.completedOrders); // Completed orders

      mockPrismaService.order.aggregate.mockResolvedValue(mockStats.orderTotals);

      // When
      const result = await service.getStats(undefined, Role.ADMIN);

      // Then
      expect(result).toEqual({
        totalOrders: 10,
        pendingOrders: 3,
        completedOrders: 7,
        totalRevenue: 1000,
        averageOrderValue: 100,
      });
    });

    it('should return user-specific statistics for non-admin users', async () => {
      // Given
      const userId = 1;
      mockPrismaService.order.count.mockResolvedValue(5);
      mockPrismaService.order.aggregate.mockResolvedValue({
        _sum: { total: 500 },
        _avg: { total: 100 },
      });

      // When
      await service.getStats(userId, Role.USER);

      // Then
      expect(mockPrismaService.order.count).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      // Given
      const orderId = 1;
      const newStatus = OrderStatus.CONFIRMED;
      const updatedOrder = { ...mockOrder, status: newStatus };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockResolvedValue(updatedOrder);

      // When
      const result = await service.updateOrderStatus(orderId, newStatus);

      // Then
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { status: newStatus },
        include: {
          user: true,
          orderItems: { include: { product: true } },
        },
      });
      expect(result).toBeInstanceOf(OrderResponseDto);
    });

    it('should throw BadRequestException when trying to change status of cancelled order', async () => {
      // Given
      const orderId = 1;
      const cancelledOrder = { ...mockOrder, status: OrderStatus.CANCELLED };
      mockPrismaService.order.findUnique.mockResolvedValue(cancelledOrder);

      // When & Then
      await expect(service.updateOrderStatus(orderId, OrderStatus.CONFIRMED)).rejects.toThrow(
        new BadRequestException('Cannot change status of cancelled order')
      );
    });

    it('should throw BadRequestException when trying to change status of delivered order', async () => {
      // Given
      const orderId = 1;
      const deliveredOrder = { ...mockOrder, status: OrderStatus.DELIVERED };
      mockPrismaService.order.findUnique.mockResolvedValue(deliveredOrder);

      // When & Then
      await expect(service.updateOrderStatus(orderId, OrderStatus.CONFIRMED)).rejects.toThrow(
        new BadRequestException('Cannot change status of delivered order')
      );
    });
  });

  describe('getUserOrders', () => {
    it('should delegate to findAll with user role', async () => {
      // Given
      const userId = 1;
      const query: QueryOrderDto = { page: 1, limit: 5 };
      const findAllSpy = jest.spyOn(service, 'findAll').mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      });

      // When
      await service.getUserOrders(userId, query);

      // Then
      expect(findAllSpy).toHaveBeenCalledWith(query, userId, Role.USER);
    });
  });

  describe('Error Handling', () => {
    it('should handle database transaction failures', async () => {
      // Given
      const userId = 1;
      const transactionError = new Error('Transaction failed');
      mockPrismaService.$transaction.mockRejectedValue(transactionError);

      // When & Then
      await expect(service.create(userId, mockCreateOrderDto)).rejects.toThrow(transactionError);
    });

    it('should handle concurrent modification errors', async () => {
      // Given
      const orderId = 1;
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockRejectedValue(new Error('Record was modified'));

      // When & Then
      await expect(service.update(orderId, mockUpdateOrderDto, 1, Role.ADMIN)).rejects.toThrow(
        'Record was modified'
      );
    });
  });
});