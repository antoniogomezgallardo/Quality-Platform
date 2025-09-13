import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto, QueryOrderDto, OrderResponseDto, PaginatedOrdersDto, OrderStatsDto } from './dto';
import { Prisma, OrderStatus, Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const { items, notes } = createOrderDto;

    return await this.prisma.$transaction(async (prisma) => {
      let totalAmount = 0;
      const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        if (!product.isActive) {
          throw new BadRequestException(`Product "${product.name}" is not available`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          product: {
            connect: { id: product.id },
          },
          quantity: item.quantity,
          price: product.price,
        });

        await prisma.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });
      }

      const order = await prisma.order.create({
        data: {
          userId,
          total: totalAmount,
          notes,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return new OrderResponseDto(order);
    });
  }

  async findAll(query: QueryOrderDto, userId?: number, userRole?: Role): Promise<PaginatedOrdersDto> {
    const { page = 1, limit = 10, status, userId: filterUserId, startDate, endDate, minTotal, maxTotal, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    
    const skip = (page - 1) * limit;
    
    const where: Prisma.OrderWhereInput = {};

    if (userRole !== Role.ADMIN && userId) {
      where.userId = userId;
    } else if (filterUserId && userRole === Role.ADMIN) {
      where.userId = filterUserId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (minTotal !== undefined || maxTotal !== undefined) {
      where.total = {};
      if (minTotal !== undefined) where.total.gte = minTotal;
      if (maxTotal !== undefined) where.total.lte = maxTotal;
    }

    const orderBy: Prisma.OrderOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: orders.map(order => new OrderResponseDto(order)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async findOne(id: number, userId?: number, userRole?: Role): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (userRole !== Role.ADMIN && userId && order.userId !== userId) {
      throw new ForbiddenException('You can only access your own orders');
    }

    return new OrderResponseDto(order);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, userId?: number, userRole?: Role): Promise<OrderResponseDto> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (userRole !== Role.ADMIN && userId && existingOrder.userId !== userId) {
      throw new ForbiddenException('You can only modify your own orders');
    }

    if (userRole !== Role.ADMIN && updateOrderDto.status) {
      throw new ForbiddenException('Only administrators can change order status');
    }

    if (existingOrder.status === OrderStatus.DELIVERED || existingOrder.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot modify completed or cancelled orders');
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return new OrderResponseDto(order);
  }

  async cancel(id: number, userId?: number, userRole?: Role): Promise<OrderResponseDto> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (userRole !== Role.ADMIN && userId && existingOrder.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    if (existingOrder.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel delivered orders');
    }

    if (existingOrder.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    return await this.prisma.$transaction(async (prisma) => {
      for (const orderItem of existingOrder.orderItems) {
        await prisma.product.update({
          where: { id: orderItem.productId },
          data: {
            stock: {
              increment: orderItem.quantity,
            },
          },
        });
      }

      const order = await prisma.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return new OrderResponseDto(order);
    });
  }

  async getStats(userId?: number, userRole?: Role): Promise<OrderStatsDto> {
    const where: Prisma.OrderWhereInput = {};
    
    if (userRole !== Role.ADMIN && userId) {
      where.userId = userId;
    }

    const [totalOrders, pendingOrders, completedOrders, orderTotals] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.count({ 
        where: { ...where, status: OrderStatus.PENDING } 
      }),
      this.prisma.order.count({ 
        where: { ...where, status: OrderStatus.DELIVERED } 
      }),
      this.prisma.order.aggregate({
        where,
        _sum: { total: true },
        _avg: { total: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: orderTotals._sum.total || 0,
      averageOrderValue: orderTotals._avg.total || 0,
    };
  }

  async getUserOrders(userId: number, query: QueryOrderDto): Promise<PaginatedOrdersDto> {
    return this.findAll(query, userId, Role.USER);
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.status === OrderStatus.CANCELLED && status !== OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot change status of cancelled order');
    }

    if (order.status === OrderStatus.DELIVERED && status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot change status of delivered order');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return new OrderResponseDto(updatedOrder);
  }
}