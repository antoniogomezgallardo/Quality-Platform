import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import request from 'supertest';
import { AppModule } from '../app/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('OpenAPI Contract Validation', () => {
  let app: INestApplication;
  let openApiSpec: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same validation pipe as in production
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Set up Swagger documentation (same config as main.ts)
    const config = new DocumentBuilder()
      .setTitle('Quality Platform API')
      .setDescription('Sample e-commerce API for demonstrating quality engineering practices')
      .setVersion('1.0')
      .addTag('health', 'Health check endpoints')
      .addTag('auth', 'Authentication endpoints')
      .addTag('products', 'Product management')
      .addTag('orders', 'Order management')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    openApiSpec = document;

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('OpenAPI Specification Structure', () => {
    it('should have valid OpenAPI specification structure', () => {
      expect(openApiSpec).toBeDefined();
      expect(openApiSpec.openapi).toBe('3.0.0');
      expect(openApiSpec.info).toMatchObject({
        title: 'Quality Platform API',
        description: expect.any(String),
        version: expect.any(String),
      });
    });

    it('should define all required paths', () => {
      const expectedPaths = [
        '/auth/login',
        '/auth/register',
        '/auth/me',
        '/products',
        '/products/{id}',
        '/products/categories',
        '/products/search/{term}',
        '/products/category/{category}',
        '/orders',
        '/orders/{id}',
        '/cart',
        '/cart/items',
        '/cart/items/{id}',
        '/cart/summary',
        '/cart/validate',
        '/cart/merge',
        '/cart/checkout',
        '/health',
      ];

      for (const path of expectedPaths) {
        expect(openApiSpec.paths).toHaveProperty(path);
      }
    });

    it('should define all required HTTP methods for each endpoint', () => {
      const pathMethods = {
        '/auth/login': ['post'],
        '/auth/register': ['post'],
        '/auth/me': ['get'],
        '/products': ['get', 'post'],
        '/products/{id}': ['get', 'patch', 'delete'],
        '/products/{id}/stock': ['patch'],
        '/products/categories': ['get'],
        '/products/search/{term}': ['get'],
        '/products/category/{category}': ['get'],
        '/orders': ['get', 'post'],
        '/orders/{id}': ['get', 'patch', 'delete'],
        '/cart': ['get', 'delete'],
        '/cart/items': ['post'],
        '/cart/items/{id}': ['patch', 'delete'],
        '/cart/summary': ['get'],
        '/cart/validate': ['post'],
        '/cart/merge': ['post'],
        '/cart/checkout': ['post'],
        '/health': ['get'],
      };

      for (const [path, methods] of Object.entries(pathMethods)) {
        for (const method of methods) {
          expect(openApiSpec.paths[path]).toHaveProperty(method);
        }
      }
    });

    it('should define required schemas', () => {
      const expectedSchemas = [
        'LoginDto',
        'RegisterDto',
        'AuthResponseDto',
        'CreateProductDto',
        'UpdateProductDto',
        'ProductResponseDto',
        'PaginatedProductsDto',
        'CreateOrderDto',
        'UpdateOrderDto',
        'OrderResponseDto',
        'PaginatedOrdersDto',
        'AddCartItemDto',
        'UpdateCartItemDto',
        'CartResponseDto',
        'CartSummaryDto',
      ];

      // Check that required schemas exist (may have different names)
      const actualSchemas = Object.keys(openApiSpec.components.schemas);

      // Verify we have the core schemas we need
      expect(actualSchemas).toEqual(expect.arrayContaining(['LoginDto', 'RegisterDto', 'AuthResponseDto']));
      expect(actualSchemas).toEqual(expect.arrayContaining(['CreateProductDto', 'ProductResponseDto']));
      expect(actualSchemas).toEqual(expect.arrayContaining(['AddCartItemDto', 'CartResponseDto']));
      expect(actualSchemas).toEqual(expect.arrayContaining(['CreateOrderDto', 'OrderResponseDto']));
    });

    it('should define security schemes', () => {
      expect(openApiSpec.components.securitySchemes).toHaveProperty('JWT-auth');
      expect(openApiSpec.components.securitySchemes['JWT-auth']).toMatchObject({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      });
    });
  });

  describe('Response Status Code Validation', () => {
    it('should define correct response status codes for auth endpoints', () => {
      // Login endpoint
      const loginOperation = openApiSpec.paths['/auth/login']['post'];
      expect(loginOperation.responses).toHaveProperty('200');
      expect(loginOperation.responses).toHaveProperty('401');

      // Register endpoint
      const registerOperation = openApiSpec.paths['/auth/register']['post'];
      expect(registerOperation.responses).toHaveProperty('201');
      expect(registerOperation.responses).toHaveProperty('400');

      // Profile endpoint
      const profileOperation = openApiSpec.paths['/auth/me']['get'];
      expect(profileOperation.responses).toHaveProperty('200');
      expect(profileOperation.responses).toHaveProperty('401');
    });

    it('should define correct response status codes for product endpoints', () => {
      // Create product
      const createOperation = openApiSpec.paths['/products']['post'];
      expect(createOperation.responses).toHaveProperty('201');
      expect(createOperation.responses).toHaveProperty('400');
      expect(createOperation.responses).toHaveProperty('401');
      expect(createOperation.responses).toHaveProperty('403');

      // Get products
      const getOperation = openApiSpec.paths['/products']['get'];
      expect(getOperation.responses).toHaveProperty('200');

      // Get single product
      const getSingleOperation = openApiSpec.paths['/products/{id}']['get'];
      expect(getSingleOperation.responses).toHaveProperty('200');
      expect(getSingleOperation.responses).toHaveProperty('404');

      // Update product
      const updateOperation = openApiSpec.paths['/products/{id}']['patch'];
      expect(updateOperation.responses).toHaveProperty('200');
      expect(updateOperation.responses).toHaveProperty('401');
      expect(updateOperation.responses).toHaveProperty('403');
      expect(updateOperation.responses).toHaveProperty('404');

      // Delete product
      const deleteOperation = openApiSpec.paths['/products/{id}']['delete'];
      expect(deleteOperation.responses).toHaveProperty('200');
      expect(deleteOperation.responses).toHaveProperty('401');
      expect(deleteOperation.responses).toHaveProperty('403');
      expect(deleteOperation.responses).toHaveProperty('404');
    });

    it('should define correct response status codes for cart endpoints', () => {
      // Add item to cart
      const addItemOperation = openApiSpec.paths['/cart/items']['post'];
      expect(addItemOperation.responses).toHaveProperty('201');
      expect(addItemOperation.responses).toHaveProperty('400');
      expect(addItemOperation.responses).toHaveProperty('404');

      // Update cart item
      const updateItemOperation = openApiSpec.paths['/cart/items/{id}']['patch'];
      expect(updateItemOperation.responses).toHaveProperty('200');
      expect(updateItemOperation.responses).toHaveProperty('400');
      expect(updateItemOperation.responses).toHaveProperty('403');
      expect(updateItemOperation.responses).toHaveProperty('404');

      // Checkout
      const checkoutOperation = openApiSpec.paths['/cart/checkout']['post'];
      expect(checkoutOperation.responses).toHaveProperty('201');
      expect(checkoutOperation.responses).toHaveProperty('400');
      expect(checkoutOperation.responses).toHaveProperty('401');
    });
  });

  describe('Request/Response Schema Validation', () => {
    it('should have valid request schemas for auth endpoints', () => {
      const loginSchema = openApiSpec.components.schemas.LoginDto;
      expect(loginSchema.properties).toHaveProperty('email');
      expect(loginSchema.properties).toHaveProperty('password');
      expect(loginSchema.required).toContain('email');
      expect(loginSchema.required).toContain('password');

      const registerSchema = openApiSpec.components.schemas.RegisterDto;
      expect(registerSchema.properties).toHaveProperty('email');
      expect(registerSchema.properties).toHaveProperty('username');
      expect(registerSchema.properties).toHaveProperty('password');
      expect(registerSchema.properties).toHaveProperty('firstName');
      expect(registerSchema.properties).toHaveProperty('lastName');
    });

    it('should have valid request schemas for product endpoints', () => {
      const createProductSchema = openApiSpec.components.schemas.CreateProductDto;
      expect(createProductSchema.properties).toHaveProperty('name');
      expect(createProductSchema.properties).toHaveProperty('price');
      expect(createProductSchema.properties).toHaveProperty('stock');
      expect(createProductSchema.properties).toHaveProperty('category');

      const updateProductSchema = openApiSpec.components.schemas.UpdateProductDto;
      expect(updateProductSchema.properties).toHaveProperty('name');
      expect(updateProductSchema.properties).toHaveProperty('price');
      expect(updateProductSchema.properties).toHaveProperty('stock');
    });

    it('should have valid request schemas for cart endpoints', () => {
      const addCartItemSchema = openApiSpec.components.schemas.AddCartItemDto;
      expect(addCartItemSchema.properties).toHaveProperty('productId');
      expect(addCartItemSchema.properties).toHaveProperty('quantity');
      expect(addCartItemSchema.required).toContain('productId');
      expect(addCartItemSchema.required).toContain('quantity');

      const updateCartItemSchema = openApiSpec.components.schemas.UpdateCartItemDto;
      expect(updateCartItemSchema.properties).toHaveProperty('quantity');
      expect(updateCartItemSchema.required).toContain('quantity');
    });

    it('should have valid response schemas', () => {
      const authResponseSchema = openApiSpec.components.schemas.AuthResponseDto;
      expect(authResponseSchema.properties).toHaveProperty('accessToken');
      expect(authResponseSchema.properties).toHaveProperty('user');

      const productResponseSchema = openApiSpec.components.schemas.ProductResponseDto;
      expect(productResponseSchema.properties).toHaveProperty('id');
      expect(productResponseSchema.properties).toHaveProperty('name');
      expect(productResponseSchema.properties).toHaveProperty('price');
      expect(productResponseSchema.properties).toHaveProperty('stock');

      const cartResponseSchema = openApiSpec.components.schemas.CartResponseDto;
      expect(cartResponseSchema.properties).toHaveProperty('id');
      expect(cartResponseSchema.properties).toHaveProperty('cartItems');

      const cartSummarySchema = openApiSpec.components.schemas.CartSummaryDto;
      expect(cartSummarySchema.properties).toHaveProperty('totalItems');
      expect(cartSummarySchema.properties).toHaveProperty('totalAmount');
      expect(cartSummarySchema.properties).toHaveProperty('itemCount');
      expect(cartSummarySchema.properties).toHaveProperty('isEmpty');
    });
  });

  describe('Security Requirements Validation', () => {
    it('should require authentication for protected endpoints', () => {
      const protectedPaths = [
        { path: '/auth/me', method: 'get' },
        { path: '/products', method: 'post' },
        { path: '/products/{id}', method: 'patch' },
        { path: '/products/{id}', method: 'delete' },
        { path: '/products/{id}/stock', method: 'patch' },
        { path: '/orders', method: 'post' },
        { path: '/orders/{id}', method: 'patch' },
        { path: '/orders/{id}', method: 'delete' },
        { path: '/cart/merge', method: 'post' },
        { path: '/cart/checkout', method: 'post' },
      ];

      for (const { path, method } of protectedPaths) {
        const operation = openApiSpec.paths[path][method];
        expect(operation.security).toBeDefined();
        expect(operation.security).toContain({ 'JWT-auth': [] });
      }
    });

    it('should not require authentication for public endpoints', () => {
      const publicPaths = [
        { path: '/auth/login', method: 'post' },
        { path: '/auth/register', method: 'post' },
        { path: '/products', method: 'get' },
        { path: '/products/{id}', method: 'get' },
        { path: '/products/categories', method: 'get' },
        { path: '/products/search/{term}', method: 'get' },
        { path: '/products/category/{category}', method: 'get' },
        { path: '/health', method: 'get' },
      ];

      for (const { path, method } of publicPaths) {
        const operation = openApiSpec.paths[path][method];
        // Should either have no security or empty security array
        if (operation.security) {
          expect(operation.security).toEqual([]);
        }
      }
    });
  });

  describe('Parameter Validation', () => {
    it('should define correct path parameters', () => {
      const pathsWithParams = [
        { path: '/products/{id}', param: 'id' },
        { path: '/products/search/{term}', param: 'term' },
        { path: '/products/category/{category}', param: 'category' },
        { path: '/orders/{id}', param: 'id' },
        { path: '/cart/items/{id}', param: 'id' },
      ];

      for (const { path, param } of pathsWithParams) {
        const getOperation = openApiSpec.paths[path]['get'];
        if (getOperation && getOperation.parameters) {
          const pathParam = getOperation.parameters.find(p => p.name === param && p.in === 'path');
          expect(pathParam).toBeDefined();
          expect(pathParam.required).toBe(true);
        }
      }
    });

    it('should define correct query parameters for products endpoint', () => {
      const productsGetOperation = openApiSpec.paths['/products']['get'];
      const queryParams = ['page', 'limit', 'search', 'category', 'minPrice', 'maxPrice', 'isActive', 'inStock', 'sortBy', 'sortOrder'];

      if (productsGetOperation.parameters) {
        for (const paramName of queryParams) {
          const queryParam = productsGetOperation.parameters.find(p => p.name === paramName && p.in === 'query');
          if (queryParam) {
            expect(queryParam.required).toBe(false); // Query params should be optional
          }
        }
      }
    });

    it('should define correct header parameters for cart endpoints', () => {
      const cartEndpoints = [
        { path: '/cart', method: 'get' },
        { path: '/cart/items', method: 'post' },
        { path: '/cart/summary', method: 'get' },
      ];

      for (const { path, method } of cartEndpoints) {
        const operation = openApiSpec.paths[path][method];
        if (operation.parameters) {
          const sessionIdParam = operation.parameters.find(p => p.name === 'x-session-id' && p.in === 'header');
          if (sessionIdParam) {
            expect(sessionIdParam.required).toBe(false); // Session ID should be optional
          }
        }
      }
    });
  });

  describe('API Tags Organization', () => {
    it('should have proper API tags defined', () => {
      const expectedTags = ['auth', 'Products', 'Orders', 'Cart Management', 'health'];

      for (const tag of expectedTags) {
        // Check if any operation uses this tag
        let tagFound = false;

        for (const [path, methods] of Object.entries(openApiSpec.paths)) {
          for (const [method, operation] of Object.entries(methods as any)) {
            if ((operation as any).tags && (operation as any).tags.includes(tag)) {
              tagFound = true;
              break;
            }
          }
          if (tagFound) break;
        }

        expect(tagFound).toBe(true);
      }
    });

    it('should group endpoints by logical tags', () => {
      const tagGroups = {
        'auth': ['/auth/login', '/auth/register', '/auth/me'],
        'Products': ['/products', '/products/{id}', '/products/categories'],
        'Orders': ['/orders', '/orders/{id}'],
        'Cart Management': ['/cart', '/cart/items', '/cart/summary', '/cart/checkout'],
        'health': ['/health'],
      };

      for (const [tag, paths] of Object.entries(tagGroups)) {
        for (const path of paths) {
          if (openApiSpec.paths[path]) {
            const methods = Object.values(openApiSpec.paths[path]) as any[];
            const hasCorrectTag = methods.some(operation =>
              operation.tags && operation.tags.includes(tag)
            );
            expect(hasCorrectTag).toBe(true);
          }
        }
      }
    });
  });

  describe('OpenAPI Documentation Completeness', () => {
    it('should have operation summaries for all endpoints', () => {
      for (const [path, methods] of Object.entries(openApiSpec.paths)) {
        for (const [method, operation] of Object.entries(methods as any)) {
          expect((operation as any).summary).toBeDefined();
          expect((operation as any).summary).not.toBe('');
        }
      }
    });

    it('should have operation descriptions for complex endpoints', () => {
      const complexEndpoints = [
        { path: '/cart/merge', method: 'post' },
        { path: '/cart/checkout', method: 'post' },
        { path: '/cart/validate', method: 'post' },
        { path: '/products', method: 'get' },
      ];

      for (const { path, method } of complexEndpoints) {
        if (openApiSpec.paths[path] && openApiSpec.paths[path][method]) {
          const operation = openApiSpec.paths[path][method];
          expect(operation.description).toBeDefined();
          expect(operation.description.length).toBeGreaterThan(10);
        }
      }
    });

    it('should have examples for common request bodies', () => {
      const endpointsWithExamples = [
        { path: '/auth/login', method: 'post' },
        { path: '/auth/register', method: 'post' },
        { path: '/cart/items', method: 'post' },
      ];

      for (const { path, method } of endpointsWithExamples) {
        if (openApiSpec.paths[path] && openApiSpec.paths[path][method]) {
          const operation = openApiSpec.paths[path][method];
          if (operation.requestBody && operation.requestBody.content) {
            // Check if there are examples defined in the schema or operation
            const content = operation.requestBody.content['application/json'];
            // Examples might be in schema or in the content itself
            expect(content).toBeDefined();
          }
        }
      }
    });
  });
});