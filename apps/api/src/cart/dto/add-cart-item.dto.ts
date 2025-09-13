import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({
    description: 'Product ID to add to cart',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'Product ID must be an integer' })
  @IsPositive({ message: 'Product ID must be a positive number' })
  productId: number;

  @ApiProperty({
    description: 'Quantity of the product to add',
    example: 2,
    minimum: 1,
    maximum: 999,
  })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}