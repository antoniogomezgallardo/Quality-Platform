import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto, CartResponseDto } from './dto';

// Create a mock PrismaService with transaction support
const mockPrismaService = {
  cart: {
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  cartItem: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  order: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('CartService', () => {
  let service: CartService;
  let prismaService: typeof mockPrismaService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
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

  const mockCartItem = {
    id: 1,
    cartId: 'cart-123',
    productId: 1,
    quantity: 2,
    addedAt: new Date('2024-01-01'),
    product: mockProduct,
  };

  const mockCart = {
    id: 'cart-123',
    userId: 1,
    sessionId: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    cartItems: [mockCartItem],
    user: mockUser,
  };

  const mockGuestCart = {
    id: 'guest-cart-456',
    userId: null,
    sessionId: 'session-123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    cartItems: [mockCartItem],
    user: null,
  };

  const mockAddCartItemDto: AddCartItemDto = {
    productId: 1,
    quantity: 2,
  };

  const mockUpdateCartItemDto: UpdateCartItemDto = {
    quantity: 3,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prismaService = module.get(PrismaService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('getOrCreateCart', () => {
    it('should return existing cart for authenticated user', async () => {
      // Given
      const userId = 1;
      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);

      // When
      const result = await service.getOrCreateCart(userId, undefined);

      // Then
      expect(mockPrismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toBe('cart-123');
    });

    it('should create new cart for authenticated user when none exists', async () => {
      // Given
      const userId = 1;
      mockPrismaService.cart.findFirst.mockResolvedValue(null);
      mockPrismaService.cart.create.mockResolvedValue(mockCart);

      // When
      const result = await service.getOrCreateCart(userId, undefined);

      // Then
      expect(mockPrismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockPrismaService.cart.create).toHaveBeenCalledWith({
        data: { userId },
      });
      expect(result).toBe('cart-123');
    });

    it('should return existing cart for guest user with session', async () => {
      // Given
      const sessionId = 'session-123';
      mockPrismaService.cart.findFirst.mockResolvedValue(mockGuestCart);

      // When
      const result = await service.getOrCreateCart(undefined, sessionId);

      // Then
      expect(mockPrismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { sessionId },
      });
      expect(result).toBe('guest-cart-456');
    });

    it('should create new cart for guest user when none exists', async () => {
      // Given
      const sessionId = 'session-123';
      mockPrismaService.cart.findFirst.mockResolvedValue(null);
      mockPrismaService.cart.create.mockResolvedValue(mockGuestCart);

      // When
      const result = await service.getOrCreateCart(undefined, sessionId);

      // Then
      expect(mockPrismaService.cart.create).toHaveBeenCalledWith({
        data: { sessionId },
      });
      expect(result).toBe('guest-cart-456');
    });

    it('should throw BadRequestException when neither userId nor sessionId provided', async () => {
      // When & Then
      await expect(service.getOrCreateCart(undefined, undefined)).rejects.toThrow(
        new BadRequestException('Either user authentication or session ID is required')
      );
    });
  });

  describe('getCart', () => {
    it('should return existing cart for authenticated user', async () => {
      // Given
      const userId = 1;
      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);

      // When
      const result = await service.getCart(userId, undefined);

      // Then
      expect(mockPrismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { userId },
        include: {
          cartItems: {
            include: { product: true },
            orderBy: { addedAt: 'desc' },
          },
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      expect(result).toBeInstanceOf(CartResponseDto);
    });

    it('should create empty cart when none exists', async () => {
      // Given
      const userId = 1;
      const emptyCart = { ...mockCart, cartItems: [] };
      mockPrismaService.cart.findFirst.mockResolvedValue(null);
      mockPrismaService.cart.create.mockResolvedValue(emptyCart);

      // When
      const result = await service.getCart(userId, undefined);

      // Then
      expect(mockPrismaService.cart.create).toHaveBeenCalledWith({
        data: { userId },
        include: {
          cartItems: {
            include: { product: true },
          },
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      expect(result).toBeInstanceOf(CartResponseDto);
    });

    it('should return guest cart with sessionId', async () => {
      // Given
      const sessionId = 'session-123';
      mockPrismaService.cart.findFirst.mockResolvedValue(mockGuestCart);

      // When
      const result = await service.getCart(undefined, sessionId);

      // Then
      expect(mockPrismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { sessionId },
        include: {
          cartItems: {
            include: { product: true },
            orderBy: { addedAt: 'desc' },
          },
          user: false,
        },
      });
      expect(result).toBeInstanceOf(CartResponseDto);
    });

    it('should throw BadRequestException when neither userId nor sessionId provided', async () => {
      // When & Then
      await expect(service.getCart(undefined, undefined)).rejects.toThrow(
        new BadRequestException('Either user authentication or session ID is required')
      );
    });
  });

  describe('addItemToCart', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getOrCreateCart').mockResolvedValue('cart-123');
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));
    });

    it('should add new item to cart successfully', async () => {
      // Given
      const userId = 1;
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.cartItem.findUnique.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue(mockCartItem);

      // When
      const result = await service.addItemToCart(mockAddCartItemDto, userId, undefined);

      // Then
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: mockAddCartItemDto.productId },
      });
      expect(mockPrismaService.cartItem.create).toHaveBeenCalledWith({
        data: {
          cartId: 'cart-123',
          productId: mockAddCartItemDto.productId,
          quantity: mockAddCartItemDto.quantity,
        },
      });
      expect(result).toBeInstanceOf(CartResponseDto);
    });

    it('should update quantity when item already exists in cart', async () => {
      // Given
      const userId = 1;
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.cartItem.findUnique.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        quantity: 4,
      });

      // When
      await service.addItemToCart(mockAddCartItemDto, userId, undefined);

      // Then
      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: mockCartItem.id },
        data: { quantity: 4 }, // 2 existing + 2 new
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      // Given
      const userId = 1;
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.addItemToCart(mockAddCartItemDto, userId, undefined)).rejects.toThrow(
        new NotFoundException('Product with ID 1 not found')
      );
    });

    it('should throw BadRequestException when product is inactive', async () => {
      // Given
      const userId = 1;
      const inactiveProduct = { ...mockProduct, isActive: false };
      mockPrismaService.product.findUnique.mockResolvedValue(inactiveProduct);

      // When & Then
      await expect(service.addItemToCart(mockAddCartItemDto, userId, undefined)).rejects.toThrow(
        new BadRequestException('Product "Test Product" is not available')
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      // Given
      const userId = 1;
      const lowStockProduct = { ...mockProduct, stock: 1 };
      mockPrismaService.product.findUnique.mockResolvedValue(lowStockProduct);

      // When & Then
      await expect(service.addItemToCart(mockAddCartItemDto, userId, undefined)).rejects.toThrow(
        new BadRequestException('Insufficient stock for "Test Product". Available: 1, Requested: 2')
      );
    });

    it('should throw BadRequestException when updating would exceed stock', async () => {
      // Given
      const userId = 1;
      const limitedStockProduct = { ...mockProduct, stock: 3 };
      mockPrismaService.product.findUnique.mockResolvedValue(limitedStockProduct);
      mockPrismaService.cartItem.findUnique.mockResolvedValue(mockCartItem);

      // When & Then
      await expect(service.addItemToCart(mockAddCartItemDto, userId, undefined)).rejects.toThrow(
        new BadRequestException('Cannot add 2 items. Total would be 4, but only 3 available')
      );
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item quantity successfully', async () => {
      // Given
      const userId = 1;
      const itemId = 1;
      const cartItemWithCart = {
        ...mockCartItem,
        cart: mockCart,
      };
      mockPrismaService.cartItem.findUnique.mockResolvedValue(cartItemWithCart);
      mockPrismaService.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        quantity: 3,
      });
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));

      // When
      const result = await service.updateCartItem(itemId, mockUpdateCartItemDto, userId, undefined);

      // Then
      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: itemId },
        data: { quantity: 3 },
      });
      expect(result).toBeInstanceOf(CartResponseDto);
    });

    it('should throw NotFoundException when cart item not found', async () => {
      // Given
      const itemId = 999;
      mockPrismaService.cartItem.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.updateCartItem(itemId, mockUpdateCartItemDto, 1, undefined)).rejects.toThrow(
        new NotFoundException('Cart item with ID 999 not found')
      );
    });

    it('should throw ForbiddenException when user tries to modify another user\'s cart', async () => {
      // Given
      const itemId = 1;
      const userId = 2; // Different user
      const cartItemWithCart = {
        ...mockCartItem,
        cart: mockCart, // Cart belongs to user 1
      };
      mockPrismaService.cartItem.findUnique.mockResolvedValue(cartItemWithCart);

      // When & Then
      await expect(service.updateCartItem(itemId, mockUpdateCartItemDto, userId, undefined)).rejects.toThrow(
        new ForbiddenException('You can only modify your own cart items')
      );
    });

    it('should throw BadRequestException when quantity is zero or negative', async () => {
      // Given
      const itemId = 1;
      const userId = 1;
      const invalidQuantityDto = { quantity: 0 };
      const cartItemWithCart = {
        ...mockCartItem,
        cart: mockCart,
      };
      mockPrismaService.cartItem.findUnique.mockResolvedValue(cartItemWithCart);

      // When & Then
      await expect(service.updateCartItem(itemId, invalidQuantityDto, userId, undefined)).rejects.toThrow(
        new BadRequestException('Quantity must be greater than 0')
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      // Given
      const itemId = 1;
      const userId = 1;
      const highQuantityDto = { quantity: 100 };
      const cartItemWithCart = {
        ...mockCartItem,
        cart: mockCart,
      };
      mockPrismaService.cartItem.findUnique.mockResolvedValue(cartItemWithCart);

      // When & Then
      await expect(service.updateCartItem(itemId, highQuantityDto, userId, undefined)).rejects.toThrow(
        new BadRequestException('Insufficient stock for "Test Product". Available: 50, Requested: 100')
      );
    });
  });

  describe('removeCartItem', () => {
    it('should remove cart item successfully', async () => {
      // Given
      const itemId = 1;
      const userId = 1;
      const cartItemWithCart = {
        ...mockCartItem,
        cart: mockCart,
      };
      mockPrismaService.cartItem.findUnique.mockResolvedValue(cartItemWithCart);
      mockPrismaService.cartItem.delete.mockResolvedValue(mockCartItem);
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));

      // When
      const result = await service.removeCartItem(itemId, userId, undefined);

      // Then
      expect(mockPrismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { id: itemId },
      });
      expect(result).toBeInstanceOf(CartResponseDto);
    });

    it('should throw NotFoundException when cart item not found', async () => {
      // Given
      const itemId = 999;
      mockPrismaService.cartItem.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.removeCartItem(itemId, 1, undefined)).rejects.toThrow(
        new NotFoundException('Cart item with ID 999 not found')
      );
    });

    it('should throw ForbiddenException for unauthorized user', async () => {
      // Given
      const itemId = 1;
      const userId = 2; // Different user
      const cartItemWithCart = {
        ...mockCartItem,
        cart: mockCart,
      };
      mockPrismaService.cartItem.findUnique.mockResolvedValue(cartItemWithCart);

      // When & Then
      await expect(service.removeCartItem(itemId, userId, undefined)).rejects.toThrow(
        new ForbiddenException('You can only modify your own cart items')
      );
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      // Given
      const userId = 1;
      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 2 });

      // When
      const result = await service.clearCart(userId, undefined);

      // Then
      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-123' },
      });
      expect(result).toEqual({ message: 'Cart cleared successfully' });
    });

    it('should handle clearing empty cart', async () => {
      // Given
      const userId = 1;
      mockPrismaService.cart.findFirst.mockResolvedValue(null);

      // When
      const result = await service.clearCart(userId, undefined);

      // Then
      expect(mockPrismaService.cartItem.deleteMany).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'Cart cleared successfully' });
    });

    it('should throw BadRequestException when no userId or sessionId', async () => {
      // When & Then
      await expect(service.clearCart(undefined, undefined)).rejects.toThrow(
        new BadRequestException('Either user authentication or session ID is required')
      );
    });
  });

  describe('getCartSummary', () => {
    it('should calculate cart summary correctly', async () => {
      // Given
      const userId = 1;
      const cartWithMultipleItems = {
        ...mockCart,
        cartItems: [
          { ...mockCartItem, quantity: 2, product: { ...mockProduct, price: 100 } },
          { ...mockCartItem, quantity: 3, product: { ...mockProduct, price: 50 } },
        ],
      };
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(cartWithMultipleItems));

      // When
      const result = await service.getCartSummary(userId, undefined);

      // Then
      expect(result).toEqual({
        totalItems: 5, // 2 + 3
        totalAmount: 350, // (2 * 100) + (3 * 50)
        itemCount: 2,
        isEmpty: false,
      });
    });

    it('should handle empty cart', async () => {
      // Given
      const userId = 1;
      const emptyCart = { ...mockCart, cartItems: [] };
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(emptyCart));

      // When
      const result = await service.getCartSummary(userId, undefined);

      // Then
      expect(result).toEqual({
        totalItems: 0,
        totalAmount: 0,
        itemCount: 0,
        isEmpty: true,
      });
    });

    it('should round total amount to 2 decimal places', async () => {
      // Given
      const userId = 1;
      const cartWithDecimalPrices = {
        ...mockCart,
        cartItems: [
          { ...mockCartItem, quantity: 3, product: { ...mockProduct, price: 33.33 } },
        ],
      };
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(cartWithDecimalPrices));

      // When
      const result = await service.getCartSummary(userId, undefined);

      // Then
      expect(result.totalAmount).toBe(99.99); // 3 * 33.33 = 99.99
    });
  });

  describe('validateCartStock', () => {
    it('should validate cart with sufficient stock', async () => {
      // Given
      const userId = 1;
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      // When
      const result = await service.validateCartStock(userId, undefined);

      // Then
      expect(result).toEqual({
        isValid: true,
        issues: [],
      });
    });

    it('should detect insufficient stock', async () => {
      // Given
      const userId = 1;
      const cartWithHighQuantity = {
        ...mockCart,
        cartItems: [{ ...mockCartItem, quantity: 100 }],
      };
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(cartWithHighQuantity));
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      // When
      const result = await service.validateCartStock(userId, undefined);

      // Then
      expect(result).toEqual({
        isValid: false,
        issues: ['Insufficient stock for "Test Product". Available: 50, In cart: 100'],
      });
    });

    it('should detect inactive products', async () => {
      // Given
      const userId = 1;
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));
      const inactiveProduct = { ...mockProduct, isActive: false };
      mockPrismaService.product.findUnique.mockResolvedValue(inactiveProduct);

      // When
      const result = await service.validateCartStock(userId, undefined);

      // Then
      expect(result).toEqual({
        isValid: false,
        issues: ['Product "Test Product" is no longer active'],
      });
    });

    it('should detect removed products', async () => {
      // Given
      const userId = 1;
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      // When
      const result = await service.validateCartStock(userId, undefined);

      // Then
      expect(result).toEqual({
        isValid: false,
        issues: ['Product "Test Product" is no longer available'],
      });
    });
  });

  describe('mergeGuestCartWithUser', () => {
    beforeEach(() => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(mockPrismaService);
      });
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));
    });

    it('should merge guest cart items with user cart', async () => {
      // Given
      const sessionId = 'session-123';
      const userId = 1;
      mockPrismaService.cart.findFirst
        .mockResolvedValueOnce(mockGuestCart) // Guest cart
        .mockResolvedValueOnce(mockCart); // User cart
      mockPrismaService.cartItem.findUnique.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue(mockCartItem);
      mockPrismaService.cart.delete.mockResolvedValue(mockGuestCart);

      // When
      const result = await service.mergeGuestCartWithUser(sessionId, userId);

      // Then
      expect(mockPrismaService.cartItem.create).toHaveBeenCalledWith({
        data: {
          cartId: 'cart-123',
          productId: 1,
          quantity: 2,
        },
      });
      expect(mockPrismaService.cart.delete).toHaveBeenCalledWith({
        where: { id: 'guest-cart-456' },
      });
      expect(result).toBeInstanceOf(CartResponseDto);
    });

    it('should update existing items when merging', async () => {
      // Given
      const sessionId = 'session-123';
      const userId = 1;
      const guestCartWithHigherQuantity = {
        ...mockGuestCart,
        cartItems: [{ ...mockCartItem, quantity: 5 }],
      };
      mockPrismaService.cart.findFirst
        .mockResolvedValueOnce(guestCartWithHigherQuantity)
        .mockResolvedValueOnce(mockCart);
      mockPrismaService.cartItem.findUnique.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.update.mockResolvedValue({ ...mockCartItem, quantity: 5 });

      // When
      await service.mergeGuestCartWithUser(sessionId, userId);

      // Then
      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: mockCartItem.id },
        data: { quantity: 5 }, // Takes maximum of guest (5) and user (2)
      });
    });

    it('should return user cart when no guest cart exists', async () => {
      // Given
      const sessionId = 'session-123';
      const userId = 1;
      mockPrismaService.cart.findFirst.mockResolvedValueOnce(null);

      // When
      const result = await service.mergeGuestCartWithUser(sessionId, userId);

      // Then
      expect(mockPrismaService.cart.delete).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(CartResponseDto);
    });
  });

  describe('convertCartToOrder', () => {
    beforeEach(() => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(mockPrismaService);
      });
    });

    it('should convert cart to order successfully', async () => {
      // Given
      const userId = 1;
      const mockOrder = {
        id: 1,
        userId,
        total: 199.98,
        status: 'PENDING',
        notes: 'Order created from cart',
      };

      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));
      jest.spyOn(service, 'validateCartStock').mockResolvedValue({ isValid: true, issues: [] });
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({ ...mockProduct, stock: 48 });
      mockPrismaService.order.create.mockResolvedValue(mockOrder);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 1 });

      // When
      const result = await service.convertCartToOrder(userId);

      // Then
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { stock: 48 }, // 50 - 2
      });
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          userId,
          total: expect.any(Number),
          notes: 'Order created from cart',
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
      });
      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-123' },
      });
      expect(result).toEqual({
        orderId: 1,
        message: 'Order created successfully from cart',
      });
    });

    it('should throw BadRequestException for empty cart', async () => {
      // Given
      const userId = 1;
      const emptyCart = { ...mockCart, cartItems: [] };
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(emptyCart));

      // When & Then
      await expect(service.convertCartToOrder(userId)).rejects.toThrow(
        new BadRequestException('Cannot checkout with an empty cart')
      );
    });

    it('should throw BadRequestException for invalid cart stock', async () => {
      // Given
      const userId = 1;
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));
      jest.spyOn(service, 'validateCartStock').mockResolvedValue({
        isValid: false,
        issues: ['Insufficient stock'],
      });

      // When & Then
      await expect(service.convertCartToOrder(userId)).rejects.toThrow(
        new BadRequestException('Cart validation failed: Insufficient stock')
      );
    });

    it('should throw BadRequestException when product unavailable during checkout', async () => {
      // Given
      const userId = 1;
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));
      jest.spyOn(service, 'validateCartStock').mockResolvedValue({ isValid: true, issues: [] });
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.convertCartToOrder(userId)).rejects.toThrow(
        new BadRequestException('Product "Test Product" is no longer available')
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle database transaction failures', async () => {
      // Given
      const userId = 1;
      const transactionError = new Error('Transaction failed');
      mockPrismaService.$transaction.mockRejectedValue(transactionError);
      jest.spyOn(service, 'getCart').mockResolvedValue(new CartResponseDto(mockCart));
      jest.spyOn(service, 'validateCartStock').mockResolvedValue({ isValid: true, issues: [] });

      // When & Then
      await expect(service.convertCartToOrder(userId)).rejects.toThrow(transactionError);
    });

    it('should handle concurrent cart modifications', async () => {
      // Given
      const userId = 1;
      const concurrencyError = new Error('Cart was modified by another request');

      // Mock successful product validation
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      // Mock cart creation/retrieval success
      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);

      // Mock no existing cart item
      mockPrismaService.cartItem.findUnique.mockResolvedValue(null);

      // Mock concurrency error on cart item creation
      mockPrismaService.cartItem.create.mockRejectedValue(concurrencyError);

      // When & Then
      await expect(service.addItemToCart(mockAddCartItemDto, userId, undefined)).rejects.toThrow(
        'Cart was modified by another request'
      );
    });
  });
});