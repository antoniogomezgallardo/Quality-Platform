import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto, CartResponseDto, CartSummaryDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId?: number, sessionId?: string): Promise<string> {
    if (userId) {
      // For authenticated users, find or create user cart
      let cart = await this.prisma.cart.findFirst({
        where: { userId },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
        });
      }

      return cart.id;
    } else if (sessionId) {
      // For guest users, find or create session cart
      let cart = await this.prisma.cart.findFirst({
        where: { sessionId },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { sessionId },
        });
      }

      return cart.id;
    }

    throw new BadRequestException('Either user authentication or session ID is required');
  }

  async getCart(userId?: number, sessionId?: string): Promise<CartResponseDto> {
    const where: Prisma.CartWhereInput = {};
    
    if (userId) {
      where.userId = userId;
    } else if (sessionId) {
      where.sessionId = sessionId;
    } else {
      throw new BadRequestException('Either user authentication or session ID is required');
    }

    const cart = await this.prisma.cart.findFirst({
      where,
      include: {
        cartItems: {
          include: {
            product: true,
          },
          orderBy: {
            addedAt: 'desc',
          },
        },
        user: userId ? {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        } : false,
      },
    });

    if (!cart) {
      // Create empty cart if none exists
      const newCart = await this.prisma.cart.create({
        data: userId ? { userId } : { sessionId },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
          user: userId ? {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          } : false,
        },
      });
      
      return new CartResponseDto(newCart);
    }

    return new CartResponseDto(cart);
  }

  async addItemToCart(addItemDto: AddCartItemDto, userId?: number, sessionId?: string): Promise<CartResponseDto> {
    const { productId, quantity } = addItemDto;

    // Validate product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (!product.isActive) {
      throw new BadRequestException(`Product "${product.name}" is not available`);
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${quantity}`
      );
    }

    const cartId = await this.getOrCreateCart(userId, sessionId);

    // Check if item already exists in cart
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new BadRequestException(
          `Cannot add ${quantity} items. Total would be ${newQuantity}, but only ${product.stock} available`
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId, sessionId);
  }

  async updateCartItem(itemId: number, updateItemDto: UpdateCartItemDto, userId?: number, sessionId?: string): Promise<CartResponseDto> {
    const { quantity } = updateItemDto;

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    // Verify cart ownership
    if (userId && cartItem.cart.userId !== userId) {
      throw new ForbiddenException('You can only modify your own cart items');
    }
    
    if (sessionId && cartItem.cart.sessionId !== sessionId) {
      throw new ForbiddenException('You can only modify your own cart items');
    }

    // Validate stock availability
    if (cartItem.product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for "${cartItem.product.name}". Available: ${cartItem.product.stock}, Requested: ${quantity}`
      );
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId, sessionId);
  }

  async removeCartItem(itemId: number, userId?: number, sessionId?: string): Promise<CartResponseDto> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    // Verify cart ownership
    if (userId && cartItem.cart.userId !== userId) {
      throw new ForbiddenException('You can only modify your own cart items');
    }
    
    if (sessionId && cartItem.cart.sessionId !== sessionId) {
      throw new ForbiddenException('You can only modify your own cart items');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId, sessionId);
  }

  async clearCart(userId?: number, sessionId?: string): Promise<{ message: string }> {
    const where: Prisma.CartWhereInput = {};
    
    if (userId) {
      where.userId = userId;
    } else if (sessionId) {
      where.sessionId = sessionId;
    } else {
      throw new BadRequestException('Either user authentication or session ID is required');
    }

    const cart = await this.prisma.cart.findFirst({ where });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return { message: 'Cart cleared successfully' };
  }

  async getCartSummary(userId?: number, sessionId?: string): Promise<CartSummaryDto> {
    const cart = await this.getCart(userId, sessionId);
    
    let totalItems = 0;
    let totalAmount = 0;

    cart.cartItems.forEach(item => {
      totalItems += item.quantity;
      totalAmount += item.product.price * item.quantity;
    });

    return {
      totalItems,
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
      itemCount: cart.cartItems.length,
      isEmpty: cart.cartItems.length === 0,
    };
  }

  async validateCartStock(userId?: number, sessionId?: string): Promise<{ isValid: boolean; issues: string[] }> {
    const cart = await this.getCart(userId, sessionId);
    const issues: string[] = [];

    for (const cartItem of cart.cartItems) {
      // Get fresh product data
      const product = await this.prisma.product.findUnique({
        where: { id: cartItem.product.id },
      });

      if (!product) {
        issues.push(`Product "${cartItem.product.name}" is no longer available`);
        continue;
      }

      if (!product.isActive) {
        issues.push(`Product "${product.name}" is no longer active`);
        continue;
      }

      if (product.stock < cartItem.quantity) {
        issues.push(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, In cart: ${cartItem.quantity}`
        );
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  async mergeGuestCartWithUser(sessionId: string, userId: number): Promise<CartResponseDto> {
    return await this.prisma.$transaction(async (prisma) => {
      // Find guest cart
      const guestCart = await prisma.cart.findFirst({
        where: { sessionId },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!guestCart || guestCart.cartItems.length === 0) {
        // No guest cart to merge, just return user's cart
        return this.getCart(userId);
      }

      // Find or create user cart
      let userCart = await prisma.cart.findFirst({
        where: { userId },
      });

      if (!userCart) {
        userCart = await prisma.cart.create({
          data: { userId },
        });
      }

      // Merge cart items
      for (const guestItem of guestCart.cartItems) {
        const existingUserItem = await prisma.cartItem.findUnique({
          where: {
            cartId_productId: {
              cartId: userCart.id,
              productId: guestItem.productId,
            },
          },
        });

        if (existingUserItem) {
          // Update existing item quantity (take the maximum)
          const newQuantity = Math.max(existingUserItem.quantity, guestItem.quantity);
          
          // Validate stock
          if (guestItem.product.stock >= newQuantity) {
            await prisma.cartItem.update({
              where: { id: existingUserItem.id },
              data: { quantity: newQuantity },
            });
          }
        } else {
          // Add new item if stock is available
          if (guestItem.product.stock >= guestItem.quantity) {
            await prisma.cartItem.create({
              data: {
                cartId: userCart.id,
                productId: guestItem.productId,
                quantity: guestItem.quantity,
              },
            });
          }
        }
      }

      // Delete guest cart
      await prisma.cart.delete({
        where: { id: guestCart.id },
      });

      return this.getCart(userId);
    });
  }

  async convertCartToOrder(userId: number): Promise<{ orderId: number; message: string }> {
    const cart = await this.getCart(userId);
    
    if (cart.cartItems.length === 0) {
      throw new BadRequestException('Cannot checkout with an empty cart');
    }

    // Validate stock before creating order
    const stockValidation = await this.validateCartStock(userId);
    if (!stockValidation.isValid) {
      throw new BadRequestException(`Cart validation failed: ${stockValidation.issues.join(', ')}`);
    }

    return await this.prisma.$transaction(async (prisma) => {
      let totalAmount = 0;
      const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

      // Process each cart item
      for (const cartItem of cart.cartItems) {
        const product = await prisma.product.findUnique({
          where: { id: cartItem.product.id },
        });

        if (!product || !product.isActive || product.stock < cartItem.quantity) {
          throw new BadRequestException(`Product "${cartItem.product.name}" is no longer available`);
        }

        const itemTotal = product.price * cartItem.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          product: {
            connect: { id: product.id },
          },
          quantity: cartItem.quantity,
          price: product.price,
        });

        // Reduce stock
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: product.stock - cartItem.quantity },
        });
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          total: totalAmount,
          notes: 'Order created from cart',
          orderItems: {
            create: orderItemsData,
          },
        },
      });

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return {
        orderId: order.id,
        message: 'Order created successfully from cart',
      };
    });
  }
}