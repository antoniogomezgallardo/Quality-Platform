import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string; version: string; environment: string } {
    return { 
      message: 'Welcome to Quality Platform API!',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }
}
