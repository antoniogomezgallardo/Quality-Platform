import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ProductSortBy {
  NAME = 'name',
  PRICE = 'price',
  CATEGORY = 'category',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class QueryProductDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    description: 'Search term for product name or description',
    example: 'headphones',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Filter by category',
    example: 'Electronics',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Minimum price filter',
    example: 10,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price filter',
    example: 500,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({
    description: 'Filter by active status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Filter by in-stock status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  inStock?: boolean;

  @ApiProperty({
    description: 'Sort field',
    enum: ProductSortBy,
    example: ProductSortBy.NAME,
    required: false,
  })
  @IsEnum(ProductSortBy)
  @IsOptional()
  sortBy?: ProductSortBy = ProductSortBy.NAME;

  @ApiProperty({
    description: 'Sort order',
    enum: SortOrder,
    example: SortOrder.ASC,
    required: false,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.ASC;
}