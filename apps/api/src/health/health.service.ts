import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HealthResponseDto } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}
  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      checks: {
        api: 'healthy'
      }
    };
  }

  async getReadiness(): Promise<HealthResponseDto> {
    // In a real application, you would check:
    // - Database connectivity
    // - Redis connectivity
    // - External service dependencies
    // - Required environment variables
    
    const checks = {
      database: await this.checkDatabase(),
      redis: 'healthy',    // TODO: Implement actual Redis check when needed
      api: 'healthy'
    };

    const allHealthy = Object.values(checks).every(status => status === 'healthy');

    return {
      status: allHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      checks
    };
  }

  private async checkDatabase(): Promise<string> {
    try {
      // Test database connection by performing a simple query
      await this.prisma.$queryRaw`SELECT 1`;
      return 'healthy';
    } catch (error) {
      console.error('Database health check failed:', error);
      return 'unhealthy';
    }
  }

  getLiveness(): HealthResponseDto {
    // Liveness probe should be simple - just check if the process is running
    // and basic functionality is working
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      checks: {
        process: 'alive',
        memory: this.getMemoryUsage()
      }
    };
  }

  private getMemoryUsage(): string {
    const used = process.memoryUsage();
    const usage = Math.round(used.heapUsed / 1024 / 1024);
    return `${usage}MB`;
  }
}