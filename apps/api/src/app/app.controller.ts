import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get API information',
    description: 'Returns basic information about the Quality Platform API' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Welcome to Quality Platform API!' },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'development' }
      }
    }
  })
  getData() {
    return this.appService.getData();
  }
}
