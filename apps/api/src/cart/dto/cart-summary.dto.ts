import { ApiProperty } from '@nestjs/swagger';

export class CartSummaryDto {
  @ApiProperty({ 
    description: 'Total number of individual items in cart (sum of all quantities)', 
    example: 5 
  })
  totalItems: number;

  @ApiProperty({ 
    description: 'Total amount for all items in cart', 
    example: 399.97 
  })
  totalAmount: number;

  @ApiProperty({ 
    description: 'Number of different products in cart', 
    example: 3 
  })
  itemCount: number;

  @ApiProperty({ 
    description: 'Whether the cart is empty', 
    example: false 
  })
  isEmpty: boolean;
}