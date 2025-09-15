import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto, ProductResponseDto, ProductSortBy, SortOrder } from './dto';
import { Prisma } from '@prisma/client';

// Create a mock PrismaService
const mockPrismaService = {
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
};

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: typeof mockPrismaService;

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

  const mockCreateProductDto: CreateProductDto = {
    name: 'New Product',
    description: 'New product description',
    price: 199.99,
    stock: 25,
    category: 'Electronics',
    imageUrl: 'https://example.com/new-product.jpg',
    isActive: true,
  };

  const mockUpdateProductDto: UpdateProductDto = {
    name: 'Updated Product',
    price: 249.99,
    stock: 30,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get(PrismaService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new product successfully', async () => {
      // Given
      const newProduct = { ...mockProduct, ...mockCreateProductDto };
      prismaService.product.create.mockResolvedValue(newProduct);

      // When
      const result = await service.create(mockCreateProductDto);

      // Then
      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: mockCreateProductDto,
      });
      expect(result).toBeInstanceOf(ProductResponseDto);
      expect(result.name).toBe(mockCreateProductDto.name);
      expect(result.price).toBe(mockCreateProductDto.price);
    });

    it('should throw BadRequestException when Prisma error occurs', async () => {
      // Given
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: '5.0.0' }
      );
      prismaService.product.create.mockRejectedValue(prismaError);

      // When & Then
      await expect(service.create(mockCreateProductDto)).rejects.toThrow(
        new BadRequestException('Failed to create product')
      );
    });

    it('should re-throw unknown errors', async () => {
      // Given
      const unknownError = new Error('Unknown error');
      prismaService.product.create.mockRejectedValue(unknownError);

      // When & Then
      await expect(service.create(mockCreateProductDto)).rejects.toThrow(unknownError);
    });
  });

  describe('findAll', () => {
    const mockProducts = [mockProduct, { ...mockProduct, id: 2, name: 'Product 2' }];
    const mockQueryDto: QueryProductDto = {
      page: 1,
      limit: 10,
      search: 'test',
      category: 'Electronics',
      minPrice: 50,
      maxPrice: 200,
      isActive: true,
      inStock: true,
      sortBy: ProductSortBy.NAME,
      sortOrder: SortOrder.ASC,
    };

    it('should return paginated products with filters', async () => {
      // Given
      prismaService.product.findMany.mockResolvedValue(mockProducts);
      prismaService.product.count.mockResolvedValue(2);

      // When
      const result = await service.findAll(mockQueryDto);

      // Then
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'test' } },
            { description: { contains: 'test' } },
          ],
          category: { equals: 'Electronics' },
          price: {
            gte: 50,
            lte: 200,
          },
          isActive: true,
          stock: { gt: 0 },
        },
        skip: 0,
        take: 10,
        orderBy: { name: 'asc' },
      });

      expect(prismaService.product.count).toHaveBeenCalledWith({
        where: expect.any(Object),
      });

      expect(result).toEqual({
        data: expect.arrayContaining([expect.any(ProductResponseDto)]),
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      });
    });

    it('should handle pagination correctly', async () => {
      // Given
      const page2Query = { ...mockQueryDto, page: 2, limit: 5 };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(10);

      // When
      const result = await service.findAll(page2Query);

      // Then
      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5, // (page - 1) * limit = (2 - 1) * 5
          take: 5,
        })
      );

      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(2);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrevious).toBe(true);
    });

    it('should handle inStock filter for out of stock products', async () => {
      // Given
      const queryWithOutOfStock = { ...mockQueryDto, inStock: false };
      prismaService.product.findMany.mockResolvedValue([]);
      prismaService.product.count.mockResolvedValue(0);

      // When
      await service.findAll(queryWithOutOfStock);

      // Then
      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            stock: { equals: 0 },
          }),
        })
      );
    });

    it('should return results with default pagination when no query provided', async () => {
      // Given
      const emptyQuery: QueryProductDto = {};
      prismaService.product.findMany.mockResolvedValue(mockProducts);
      prismaService.product.count.mockResolvedValue(2);

      // When
      const result = await service.findAll(emptyQuery);

      // Then
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { name: 'asc' },
      });

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      // Given
      const productId = 1;
      prismaService.product.findUnique.mockResolvedValue(mockProduct);

      // When
      const result = await service.findOne(productId);

      // Then
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result).toBeInstanceOf(ProductResponseDto);
      expect(result.id).toBe(productId);
    });

    it('should throw NotFoundException when product not found', async () => {
      // Given
      const productId = 999;
      prismaService.product.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.findOne(productId)).rejects.toThrow(
        new NotFoundException(`Product with ID ${productId} not found`)
      );
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      // Given
      const productId = 1;
      const updatedProduct = { ...mockProduct, ...mockUpdateProductDto };
      prismaService.product.update.mockResolvedValue(updatedProduct);

      // When
      const result = await service.update(productId, mockUpdateProductDto);

      // Then
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: mockUpdateProductDto,
      });
      expect(result).toBeInstanceOf(ProductResponseDto);
      expect(result.name).toBe(mockUpdateProductDto.name);
    });

    it('should throw NotFoundException when product not found', async () => {
      // Given
      const productId = 999;
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '5.0.0' }
      );
      prismaService.product.update.mockRejectedValue(prismaError);

      // When & Then
      await expect(service.update(productId, mockUpdateProductDto)).rejects.toThrow(
        new NotFoundException(`Product with ID ${productId} not found`)
      );
    });

    it('should re-throw unknown errors', async () => {
      // Given
      const productId = 1;
      const unknownError = new Error('Database connection failed');
      prismaService.product.update.mockRejectedValue(unknownError);

      // When & Then
      await expect(service.update(productId, mockUpdateProductDto)).rejects.toThrow(unknownError);
    });
  });

  describe('remove', () => {
    it('should delete a product successfully', async () => {
      // Given
      const productId = 1;
      prismaService.product.delete.mockResolvedValue(mockProduct);

      // When
      const result = await service.remove(productId);

      // Then
      expect(prismaService.product.delete).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result).toEqual({
        message: `Product with ID ${productId} has been successfully deleted`,
      });
    });

    it('should throw NotFoundException when product not found', async () => {
      // Given
      const productId = 999;
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '5.0.0' }
      );
      prismaService.product.delete.mockRejectedValue(prismaError);

      // When & Then
      await expect(service.remove(productId)).rejects.toThrow(
        new NotFoundException(`Product with ID ${productId} not found`)
      );
    });
  });

  describe('getCategories', () => {
    it('should return categories with count', async () => {
      // Given
      const mockGroupByResult = [
        { category: 'Electronics', _count: { category: 5 } },
        { category: 'Clothing', _count: { category: 3 } },
      ];
      prismaService.product.groupBy.mockResolvedValue(mockGroupByResult);

      // When
      const result = await service.getCategories();

      // Then
      expect(prismaService.product.groupBy).toHaveBeenCalledWith({
        by: ['category'],
        _count: { category: true },
        where: { isActive: true },
        orderBy: { _count: { category: 'desc' } },
      });
      expect(result).toEqual({
        categories: ['Electronics', 'Clothing'],
        count: 2,
      });
    });
  });

  describe('getByCategory', () => {
    it('should return products by category', async () => {
      // Given
      const category = 'Electronics';
      const categoryProducts = [mockProduct, { ...mockProduct, id: 2 }];
      prismaService.product.findMany.mockResolvedValue(categoryProducts);

      // When
      const result = await service.getByCategory(category);

      // Then
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          category: { equals: category },
          isActive: true,
        },
        orderBy: { name: 'asc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ProductResponseDto);
    });
  });

  describe('updateStock', () => {
    it('should update stock successfully', async () => {
      // Given
      const productId = 1;
      const quantity = 10;
      const updatedProduct = { ...mockProduct, stock: 60 };

      prismaService.product.findUnique.mockResolvedValue(mockProduct);
      prismaService.product.update.mockResolvedValue(updatedProduct);

      // When
      const result = await service.updateStock(productId, quantity);

      // Then
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: { stock: 60 }, // 50 + 10
      });
      expect(result.stock).toBe(60);
    });

    it('should throw NotFoundException when product not found', async () => {
      // Given
      const productId = 999;
      const quantity = 10;
      prismaService.product.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.updateStock(productId, quantity)).rejects.toThrow(
        new NotFoundException(`Product with ID ${productId} not found`)
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      // Given
      const productId = 1;
      const quantity = -100; // More than current stock (50)
      prismaService.product.findUnique.mockResolvedValue(mockProduct);

      // When & Then
      await expect(service.updateStock(productId, quantity)).rejects.toThrow(
        new BadRequestException('Insufficient stock')
      );
    });
  });

  describe('searchProducts', () => {
    it('should search products by name, description, and category', async () => {
      // Given
      const searchTerm = 'electronics';
      const searchResults = [mockProduct];
      prismaService.product.findMany.mockResolvedValue(searchResults);

      // When
      const result = await service.searchProducts(searchTerm);

      // Then
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
            { category: { contains: searchTerm } },
          ],
          isActive: true,
        },
        orderBy: { name: 'asc' },
        take: 20,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ProductResponseDto);
    });

    it('should return empty array when no products match search term', async () => {
      // Given
      const searchTerm = 'nonexistent';
      prismaService.product.findMany.mockResolvedValue([]);

      // When
      const result = await service.searchProducts(searchTerm);

      // Then
      expect(result).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Given
      const connectionError = new Error('Connection timeout');
      prismaService.product.findMany.mockRejectedValue(connectionError);

      // When & Then
      await expect(service.findAll({})).rejects.toThrow(connectionError);
    });

    it('should handle concurrent modification errors', async () => {
      // Given
      const concurrencyError = new Prisma.PrismaClientKnownRequestError(
        'The record was modified by another user',
        { code: 'P2034', clientVersion: '5.0.0' }
      );
      prismaService.product.update.mockRejectedValue(concurrencyError);

      // When & Then
      await expect(service.update(1, mockUpdateProductDto)).rejects.toThrow(concurrencyError);
    });
  });
});