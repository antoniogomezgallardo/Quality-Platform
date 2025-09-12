import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Overall health status',
    example: 'ok',
    enum: ['ok', 'error']
  })
  status: string;

  @ApiProperty({
    description: 'Current timestamp',
    example: '2024-09-12T18:45:00.000Z'
  })
  timestamp: string;

  @ApiProperty({
    description: 'Application uptime in seconds',
    example: 3600.5
  })
  uptime: number;

  @ApiProperty({
    description: 'Current environment',
    example: 'development'
  })
  environment: string;

  @ApiProperty({
    description: 'Application version',
    example: '1.0.0'
  })
  version: string;

  @ApiProperty({
    description: 'Detailed health checks',
    example: {
      database: 'healthy',
      redis: 'healthy',
      api: 'healthy'
    }
  })
  checks: Record<string, any>;
}