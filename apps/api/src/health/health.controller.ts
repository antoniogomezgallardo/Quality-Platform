import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Basic health check',
    description: 'Returns the basic health status of the API' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API is healthy',
    type: HealthResponseDto 
  })
  getHealth(): HealthResponseDto {
    return this.healthService.getHealth();
  }

  @Get('ready')
  @ApiOperation({ 
    summary: 'Readiness probe',
    description: 'Checks if the API is ready to receive traffic (database connections, etc.)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API is ready',
    type: HealthResponseDto 
  })
  @ApiResponse({ 
    status: 503, 
    description: 'API is not ready' 
  })
  getReadiness(): HealthResponseDto {
    return this.healthService.getReadiness();
  }

  @Get('live')
  @ApiOperation({ 
    summary: 'Liveness probe',
    description: 'Checks if the API is alive (basic functionality check)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API is alive',
    type: HealthResponseDto 
  })
  getLiveness(): HealthResponseDto {
    return this.healthService.getLiveness();
  }
}