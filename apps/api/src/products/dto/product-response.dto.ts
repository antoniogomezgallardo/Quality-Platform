import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Wireless Bluetooth Headphones' })
  name: string;

  @ApiProperty({ example: 'High-quality wireless headphones with noise cancellation' })
  description: string | null;

  @ApiProperty({ example: 99.99 })
  price: number;

  @ApiProperty({ example: 100 })
  stock: number;

  @ApiProperty({ example: 'Electronics' })
  category: string;

  @ApiProperty({ example: 'https://example.com/product-image.jpg' })
  imageUrl: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  updatedAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this.category = product.category;
    this.imageUrl = product.imageUrl;
    this.isActive = product.isActive;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}

export class PaginatedProductsDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNext: boolean;

  @ApiProperty({ example: false })
  hasPrevious: boolean;
}