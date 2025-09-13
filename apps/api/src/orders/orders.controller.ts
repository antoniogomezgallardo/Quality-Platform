import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode, HttpStatus, ParseIntPipe, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto, QueryOrderDto, OrderResponseDto, PaginatedOrdersDto, OrderStatsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, OrderStatus } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors or insufficient stock' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  create(@Request() req, @Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of orders', type: PaginatedOrdersDto })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'userId', required: false, type: Number, description: 'Filter by user ID (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Filter by start date' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Filter by end date' })
  @ApiQuery({ name: 'minTotal', required: false, type: Number, description: 'Minimum order total' })
  @ApiQuery({ name: 'maxTotal', required: false, type: Number, description: 'Maximum order total' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'updatedAt', 'total', 'status'], description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  findAll(@Request() req, @Query() query: QueryOrderDto): Promise<PaginatedOrdersDto> {
    return this.ordersService.findAll(query, req.user.id, req.user.role);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({ status: 200, description: 'Order statistics', type: OrderStatsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getStats(@Request() req): Promise<OrderStatsDto> {
    return this.ordersService.getStats(req.user.id, req.user.role);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({ status: 200, description: 'User orders', type: PaginatedOrdersDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserOrders(@Request() req, @Query() query: QueryOrderDto): Promise<PaginatedOrdersDto> {
    return this.ordersService.getUserOrders(req.user.id, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order details', type: OrderResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only access own orders' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<OrderResponseDto> {
    return this.ordersService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - cannot modify completed orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only modify own orders or admin required for status changes' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<OrderResponseDto> {
    return this.ordersService.update(id, updateOrderDto, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid status transition' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus
  ): Promise<OrderResponseDto> {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - cannot cancel delivered orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only cancel own orders' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  cancel(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<OrderResponseDto> {
    return this.ordersService.cancel(id, req.user.id, req.user.role);
  }

  // Admin-only endpoints for order management

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiResponse({ status: 200, description: 'All orders', type: PaginatedOrdersDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  getAllOrders(@Query() query: QueryOrderDto): Promise<PaginatedOrdersDto> {
    return this.ordersService.findAll(query, undefined, Role.ADMIN);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get global order statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Global order statistics', type: OrderStatsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  getGlobalStats(): Promise<OrderStatsDto> {
    return this.ordersService.getStats(undefined, Role.ADMIN);
  }
}