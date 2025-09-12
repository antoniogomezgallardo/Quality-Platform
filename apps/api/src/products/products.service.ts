import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto, ProductResponseDto, PaginatedProductsDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    try {
      const product = await this.prisma.product.create({
        data: createProductDto,
      });
      return new ProductResponseDto(product);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Failed to create product');
      }
      throw error;
    }
  }

  async findAll(query: QueryProductDto): Promise<PaginatedProductsDto> {
    const { page = 1, limit = 10, search, category, minPrice, maxPrice, isActive, inStock, sortBy = 'name', sortOrder = 'asc' } = query;
    
    const skip = (page - 1) * limit;
    
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      where.category = { equals: category };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (inStock === true) {
      where.stock = { gt: 0 };
    } else if (inStock === false) {
      where.stock = { equals: 0 };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map(product => new ProductResponseDto(product)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return new ProductResponseDto(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
      return new ProductResponseDto(product);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return { message: `Product with ID ${id} has been successfully deleted` };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getCategories(): Promise<{ categories: string[], count: number }> {
    const result = await this.prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    });

    const categories = result.map(item => item.category);
    return {
      categories,
      count: categories.length,
    };
  }

  async getByCategory(category: string): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          equals: category,
        },
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return products.map(product => new ProductResponseDto(product));
  }

  async updateStock(id: number, quantity: number): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });

    return new ProductResponseDto(updatedProduct);
  }

  async searchProducts(searchTerm: string): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { category: { contains: searchTerm } },
        ],
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 20,
    });

    return products.map(product => new ProductResponseDto(product));
  }
}