import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CartItemResponseDto {
  @ApiProperty({ description: 'Cart item ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Product ID', example: 1 })
  productId: number;

  @ApiProperty({ description: 'Quantity in cart', example: 2 })
  quantity: number;

  @ApiProperty({ description: 'Date when item was added to cart', example: '2024-01-15T10:30:00Z' })
  addedAt: Date;

  @ApiProperty({
    description: 'Product details',
    type: Object,
    example: {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones',
      price: 199.99,
      stock: 50,
      category: 'Electronics',
      imageUrl: 'https://example.com/image.jpg',
      isActive: true,
    },
  })
  product: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    category: string;
    imageUrl: string | null;
    isActive: boolean;
  };

  constructor(cartItem: any) {
    this.id = cartItem.id;
    this.productId = cartItem.productId;
    this.quantity = cartItem.quantity;
    this.addedAt = cartItem.addedAt;
    this.product = {
      id: cartItem.product.id,
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      stock: cartItem.product.stock,
      category: cartItem.product.category,
      imageUrl: cartItem.product.imageUrl,
      isActive: cartItem.product.isActive,
    };
  }
}

export class CartUserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Username', example: 'johndoe' })
  username: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName: string | null;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName: string | null;
}

export class CartResponseDto {
  @ApiProperty({ description: 'Cart ID', example: 'cart_123abc' })
  id: string;

  @ApiProperty({ description: 'User ID (null for guest carts)', example: 1, nullable: true })
  userId: number | null;

  @ApiProperty({ description: 'Session ID (null for user carts)', example: 'session_456def', nullable: true })
  sessionId: string | null;

  @ApiProperty({ description: 'Cart creation date', example: '2024-01-15T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Cart last update date', example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;

  @ApiProperty({ 
    description: 'User information (only for authenticated carts)', 
    type: CartUserDto,
    nullable: true,
  })
  user: CartUserDto | null;

  @ApiProperty({ 
    description: 'Items in the cart',
    type: [CartItemResponseDto],
  })
  @Type(() => CartItemResponseDto)
  cartItems: CartItemResponseDto[];

  constructor(cart: any) {
    this.id = cart.id;
    this.userId = cart.userId;
    this.sessionId = cart.sessionId;
    this.createdAt = cart.createdAt;
    this.updatedAt = cart.updatedAt;
    this.user = cart.user ? {
      id: cart.user.id,
      email: cart.user.email,
      username: cart.user.username,
      firstName: cart.user.firstName,
      lastName: cart.user.lastName,
    } : null;
    this.cartItems = cart.cartItems ? cart.cartItems.map((item: any) => new CartItemResponseDto(item)) : [];
  }
}