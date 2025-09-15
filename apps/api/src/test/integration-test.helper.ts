import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { Role } from '@prisma/client';

export class IntegrationTestHelper {
  private app: INestApplication;
  private prismaService: PrismaService;
  private authToken: string;

  async setupTestApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();

    // Apply the same validation pipe as in production
    this.app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    this.prismaService = this.app.get<PrismaService>(PrismaService);

    await this.app.init();
    return this.app;
  }

  async cleanupTestApp(): Promise<void> {
    if (this.app) {
      await this.app.close();
    }
  }

  async clearDatabase(): Promise<void> {
    // Clear all tables in reverse order to avoid foreign key constraints
    // Use try-catch to handle cases where tables might not exist in test environment
    try {
      await this.prismaService.cartItem.deleteMany();
    } catch (error) {
      // Ignore if table doesn't exist
    }

    try {
      await this.prismaService.cart.deleteMany();
    } catch (error) {
      // Ignore if table doesn't exist
    }

    try {
      await this.prismaService.orderItem.deleteMany();
    } catch (error) {
      // Ignore if table doesn't exist
    }

    try {
      await this.prismaService.order.deleteMany();
    } catch (error) {
      // Ignore if table doesn't exist
    }

    try {
      await this.prismaService.product.deleteMany();
    } catch (error) {
      // Ignore if table doesn't exist
    }

    try {
      await this.prismaService.user.deleteMany();
    } catch (error) {
      // Ignore if table doesn't exist
    }
  }

  async createTestUser(userData = {}) {
    const defaultUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      ...userData,
    };

    const response = await request(this.app.getHttpServer())
      .post('/auth/register')
      .send(defaultUser)
      .expect(201);

    this.authToken = response.body.accessToken;
    return response.body;
  }

  async createAdminUser(userData = {}) {
    const adminUser = {
      email: 'admin@example.com',
      username: 'admin',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      ...userData,
    };

    // Create admin user directly in database since role assignment
    // is typically not available through public API
    const hashedPassword = await this.hashPassword(adminUser.password);
    return await this.prismaService.user.create({
      data: {
        ...adminUser,
        password: hashedPassword,
      },
    });
  }

  async loginUser(email = 'test@example.com', password = 'Test123!') {
    const response = await request(this.app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    this.authToken = response.body.accessToken;
    return response.body;
  }

  async createTestProduct(productData = {}) {
    const defaultProduct = {
      name: 'Test Product',
      description: 'A test product for integration testing',
      price: 99.99,
      stock: 10,
      category: 'Electronics',
      imageUrl: 'https://example.com/image.jpg',
      isActive: true,
      ...productData,
    };

    return await this.prismaService.product.create({
      data: defaultProduct,
    });
  }

  getAuthToken(): string {
    return this.authToken;
  }

  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  getApp(): INestApplication {
    return this.app;
  }

  getPrismaService(): PrismaService {
    return this.prismaService;
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcryptjs');
    return await bcrypt.hash(password, 10);
  }
}