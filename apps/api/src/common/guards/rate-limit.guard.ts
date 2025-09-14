import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  constructor(
    private reflector: Reflector,
  ) {
    super(
      {
        ttl: 60,
        limit: 10,
      },
      {
        ignoreUserAgents: [/googlebot/gi, /bingbot/gi],
      },
      reflector,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Skip rate limiting for health checks
    if (request.path === '/api/health') {
      return true;
    }

    // Get custom rate limit from decorator if exists
    const customLimit = this.reflector.get<number>('rateLimit', context.getHandler());
    const customTtl = this.reflector.get<number>('rateTtl', context.getHandler());

    if (customLimit || customTtl) {
      this.options = {
        ...this.options,
        ttl: customTtl || this.options.ttl,
        limit: customLimit || this.options.limit,
      };
    }

    try {
      const result = await super.canActivate(context);

      // Add rate limit headers to response
      const limit = this.options.limit;
      const ttl = this.options.ttl;
      const key = this.generateKey(context, request.ip);

      response.setHeader('X-RateLimit-Limit', limit);
      response.setHeader('X-RateLimit-TTL', ttl);
      response.setHeader('X-RateLimit-Key', key);

      return result;
    } catch (error) {
      if (error instanceof ThrottlerException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Too many requests. Please try again later.',
            error: 'Too Many Requests',
            retryAfter: this.options.ttl,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw error;
    }
  }

  protected generateKey(context: ExecutionContext, suffix: string): string {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Use user ID for authenticated requests, IP for anonymous
    const identifier = user?.id || suffix;
    const prefix = `${context.getClass().name}-${context.getHandler().name}`;

    return `${prefix}-${identifier}`;
  }

  protected errorMessage(context: ExecutionContext): string {
    return 'You have exceeded the request rate limit. Please wait before making another request.';
  }
}