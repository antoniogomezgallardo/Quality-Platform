import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested, IsInt, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'Quantity to order',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array of order items',
    type: [CreateOrderItemDto],
    example: [
      { productId: 1, quantity: 2 },
      { productId: 3, quantity: 1 }
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    description: 'Optional order notes',
    example: 'Please deliver after 2 PM',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}