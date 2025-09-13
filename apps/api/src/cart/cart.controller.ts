import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto, CartResponseDto, CartSummaryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
interface AuthenticatedRequest {
  user: { userId: number };
}

@ApiTags('Cart Management')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get current cart',
    description: 'Retrieve the current cart for authenticated user or session-based guest user'
  })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request - missing user authentication or session ID',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for guest cart (optional if authenticated)',
    required: false,
  })
  @ApiBearerAuth()
  async getCart(
    @Req() req: AuthenticatedRequest,
    @Headers('x-session-id') sessionId?: string,
  ): Promise<CartResponseDto> {
    const userId = req.user?.userId;
    return this.cartService.getCart(userId, sessionId);
  }

  @Get('summary')
  @ApiOperation({ 
    summary: 'Get cart summary',
    description: 'Get cart totals and summary information'
  })
  @ApiResponse({
    status: 200,
    description: 'Cart summary retrieved successfully',
    type: CartSummaryDto,
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for guest cart (optional if authenticated)',
    required: false,
  })
  @ApiBearerAuth()
  async getCartSummary(
    @Req() req: AuthenticatedRequest,
    @Headers('x-session-id') sessionId?: string,
  ): Promise<CartSummaryDto> {
    const userId = req.user?.userId;
    return this.cartService.getCartSummary(userId, sessionId);
  }

  @Post('items')
  @ApiOperation({ 
    summary: 'Add item to cart',
    description: 'Add a product to the cart with specified quantity'
  })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid product, insufficient stock, or validation error',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for guest cart (optional if authenticated)',
    required: false,
  })
  @ApiBearerAuth()
  async addItemToCart(
    @Body() addItemDto: AddCartItemDto,
    @Req() req: AuthenticatedRequest,
    @Headers('x-session-id') sessionId?: string,
  ): Promise<CartResponseDto> {
    const userId = req.user?.userId;
    return this.cartService.addItemToCart(addItemDto, userId, sessionId);
  }

  @Patch('items/:id')
  @ApiOperation({ 
    summary: 'Update cart item',
    description: 'Update the quantity of a specific cart item'
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid quantity or insufficient stock',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only modify your own cart items',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for guest cart (optional if authenticated)',
    required: false,
  })
  @ApiBearerAuth()
  async updateCartItem(
    @Param('id', ParseIntPipe) itemId: number,
    @Body() updateItemDto: UpdateCartItemDto,
    @Req() req: AuthenticatedRequest,
    @Headers('x-session-id') sessionId?: string,
  ): Promise<CartResponseDto> {
    const userId = req.user?.userId;
    return this.cartService.updateCartItem(itemId, updateItemDto, userId, sessionId);
  }

  @Delete('items/:id')
  @ApiOperation({ 
    summary: 'Remove item from cart',
    description: 'Remove a specific item from the cart'
  })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only modify your own cart items',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for guest cart (optional if authenticated)',
    required: false,
  })
  @ApiBearerAuth()
  async removeCartItem(
    @Param('id', ParseIntPipe) itemId: number,
    @Req() req: AuthenticatedRequest,
    @Headers('x-session-id') sessionId?: string,
  ): Promise<CartResponseDto> {
    const userId = req.user?.userId;
    return this.cartService.removeCartItem(itemId, userId, sessionId);
  }

  @Delete()
  @ApiOperation({ 
    summary: 'Clear cart',
    description: 'Remove all items from the cart'
  })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for guest cart (optional if authenticated)',
    required: false,
  })
  @ApiBearerAuth()
  async clearCart(
    @Req() req: AuthenticatedRequest,
    @Headers('x-session-id') sessionId?: string,
  ): Promise<{ message: string }> {
    const userId = req.user?.userId;
    return this.cartService.clearCart(userId, sessionId);
  }

  @Post('validate')
  @ApiOperation({ 
    summary: 'Validate cart stock',
    description: 'Check if all items in cart are still available with current stock levels'
  })
  @ApiResponse({
    status: 200,
    description: 'Cart validation completed',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        issues: { 
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for guest cart (optional if authenticated)',
    required: false,
  })
  @ApiBearerAuth()
  async validateCartStock(
    @Req() req: AuthenticatedRequest,
    @Headers('x-session-id') sessionId?: string,
  ): Promise<{ isValid: boolean; issues: string[] }> {
    const userId = req.user?.userId;
    return this.cartService.validateCartStock(userId, sessionId);
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Merge guest cart with user cart',
    description: 'Merge a guest session cart with authenticated user cart after login'
  })
  @ApiResponse({
    status: 200,
    description: 'Carts merged successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID of guest cart to merge',
    required: true,
  })
  @ApiBearerAuth()
  async mergeGuestCart(
    @Req() req: AuthenticatedRequest,
    @Headers('x-session-id') sessionId: string,
  ): Promise<CartResponseDto> {
    const userId = req.user.userId;
    return this.cartService.mergeGuestCartWithUser(sessionId, userId);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Checkout cart to order',
    description: 'Convert current cart into an order and clear the cart'
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully from cart',
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'number' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - empty cart or stock validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required for checkout',
  })
  @ApiBearerAuth()
  async checkoutCart(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ orderId: number; message: string }> {
    const userId = req.user.userId;
    return this.cartService.convertCartToOrder(userId);
  }
}