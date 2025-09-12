# API Architecture Guide

## Overview

The Quality Platform API is built using NestJS with a modular, scalable architecture that follows enterprise best practices. The API demonstrates quality engineering principles through comprehensive documentation, robust authentication, and production-ready monitoring.

## Architecture Patterns

### 1. Modular Architecture

The API follows NestJS's modular pattern where each feature is encapsulated in its own module:

```
apps/api/src/
├── app/           # Main application module (entry point)
├── auth/          # Authentication module (JWT, Passport)
├── health/        # Health monitoring module  
├── prisma/        # Database service module
└── main.ts        # Application bootstrap
```

### 2. Layered Architecture

Each module follows a consistent layered structure:

```
module/
├── dto/           # Data Transfer Objects (validation & documentation)
├── guards/        # Route protection (authentication/authorization) 
├── strategies/    # Authentication strategies (Passport.js)
├── module.controller.ts  # HTTP request handling
├── module.service.ts     # Business logic
├── module.module.ts      # Module configuration
```

## Core Modules

### App Module (`apps/api/src/app/`)

The root module that orchestrates all other modules.

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Key Features:**
- Global configuration management
- Module dependency injection
- Environment variable loading
- Modular imports

### Authentication Module (`apps/api/src/auth/`)

Handles user authentication and authorization using JWT tokens.

```typescript
@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

**Components:**

#### Controllers
- **AuthController**: Handles authentication endpoints (`/auth/login`, `/auth/register`, `/auth/me`)

#### Services  
- **AuthService**: Business logic for user validation, registration, and token generation

#### Strategies
- **LocalStrategy**: Validates email/password during login
- **JwtStrategy**: Validates JWT tokens for protected routes

#### Guards
- **LocalAuthGuard**: Protects login endpoint
- **JwtAuthGuard**: Protects routes requiring authentication

#### DTOs
- **LoginDto**: Email and password validation
- **RegisterDto**: User registration with validation
- **AuthResponseDto**: Standardized authentication response

### Health Module (`apps/api/src/health/`)

Provides comprehensive health monitoring for production environments.

```typescript
@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService]
})
export class HealthModule {}
```

**Health Endpoints:**
- **Basic Health (`/health`)**: System status and uptime
- **Readiness (`/health/ready`)**: Database connectivity checks
- **Liveness (`/health/live`)**: Process health verification

### Prisma Module (`apps/api/src/prisma/`)

Manages database connectivity and provides Prisma client throughout the application.

```typescript
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

## Design Patterns

### 1. Dependency Injection

NestJS's built-in DI container manages all dependencies:

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
}
```

### 2. Strategy Pattern (Passport.js)

Authentication strategies are modular and interchangeable:

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
}
```

### 3. Guard Pattern

Route protection through reusable guards:

```typescript
@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }
}
```

### 4. DTO Pattern

Data validation and API documentation through DTOs:

```typescript
export class RegisterDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
```

## API Documentation

### OpenAPI/Swagger Integration

Comprehensive API documentation is generated automatically:

```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('Quality Platform API')
  .setDescription('Sample e-commerce API for demonstrating quality engineering practices')
  .setVersion('1.0')
  .addTag('health', 'Health check endpoints')
  .addTag('auth', 'Authentication endpoints')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  }, 'JWT-auth')
  .build();
```

### Documentation Features

1. **Interactive Testing**: Swagger UI at `/api/docs`
2. **Schema Validation**: Automatic request/response validation
3. **Authentication Support**: Bearer token authentication
4. **Tag Organization**: Endpoints grouped by functionality
5. **Type Safety**: TypeScript integration with OpenAPI

## Security Architecture

### 1. Authentication Flow

```
User Request → Local Strategy → JWT Generation → Protected Route Access
```

**Login Process:**
1. User submits email/password
2. LocalStrategy validates credentials
3. AuthService generates JWT token
4. Token returned to client

**Protected Route Access:**
1. Client includes JWT in Authorization header
2. JwtStrategy validates token
3. AuthService retrieves user data
4. User context available in route handler

### 2. Password Security

- **Hashing**: bcryptjs with 12 salt rounds
- **Validation**: Minimum 6 characters (configurable)
- **Storage**: Never store plain text passwords

```typescript
// Password hashing
const hashedPassword = await bcrypt.hash(registerDto.password, 12);

// Password validation
const isValid = await bcrypt.compare(password, user.password);
```

### 3. JWT Configuration

```typescript
{
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '7d' },
}
```

## Error Handling

### Global Exception Handling

NestJS provides built-in exception handling with custom error responses:

```typescript
// Validation errors (400)
throw new BadRequestException('Invalid input data');

// Authentication errors (401)  
throw new UnauthorizedException('Invalid credentials');

// Authorization errors (403)
throw new ForbiddenException('Insufficient permissions');
```

### Validation Pipeline

Automatic request validation using class-validator:

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

## Configuration Management

### Environment-Based Configuration

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
})
```

### Configuration Service Usage

```typescript
@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {}

  getJwtSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }
}
```

## Database Integration

### Prisma Service Pattern

The PrismaService is injected throughout the application:

```typescript
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
```

### Connection Management

- **Development**: SQLite with file-based storage
- **Production**: PostgreSQL with connection pooling
- **Health Checks**: Database connectivity monitoring

## Performance Optimizations

### 1. Selective Field Loading

```typescript
// Only load required fields
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
  },
});
```

### 2. Relationship Loading

```typescript
// Include relationships strategically
const orderWithItems = await prisma.order.findUnique({
  where: { id },
  include: {
    orderItems: {
      include: { product: true },
    },
  },
});
```

### 3. Caching Strategy (Future)

- Response caching for static data
- Database query result caching
- JWT token validation caching

## Testing Strategy

### Unit Testing Pattern

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should validate user credentials', async () => {
    // Test implementation
  });
});
```

### E2E Testing Pattern

```typescript
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(200);
  });
});
```

## Monitoring and Observability

### Health Checks

- **Database connectivity**: Prisma connection testing
- **Memory usage**: Process memory monitoring  
- **Uptime tracking**: Application start time tracking
- **Environment validation**: Configuration checks

### Logging Strategy (Planned)

- Structured logging with correlation IDs
- Request/response logging
- Error tracking and alerting
- Performance metrics collection

## Scalability Considerations

### Horizontal Scaling

- Stateless application design
- JWT tokens for session management
- Database connection pooling
- External configuration management

### Vertical Scaling

- Memory usage optimization
- Database query optimization
- Response time monitoring
- Resource utilization tracking

## Quality Engineering Integration

### 1. Contract Testing
- OpenAPI schema validation
- Request/response contract verification
- Breaking change detection

### 2. Security Testing
- Authentication flow validation
- Authorization boundary testing
- Input sanitization verification

### 3. Performance Testing
- Response time benchmarking
- Load testing integration
- Database performance monitoring

This architecture provides a solid foundation for demonstrating quality engineering practices while maintaining production-ready standards for security, performance, and maintainability.