import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as hpp from 'hpp';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private helmetMiddleware: any;
  private compressionMiddleware: any;
  private hppMiddleware: any;

  constructor(private configService: ConfigService) {
    // Configure Helmet for security headers
    this.helmetMiddleware = helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      dnsPrefetchControl: true,
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    });

    // Configure compression
    this.compressionMiddleware = compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
      level: 6,
      threshold: 1024,
    });

    // Configure HPP (HTTP Parameter Pollution) protection
    this.hppMiddleware = hpp({
      whitelist: ['sort', 'filter', 'page', 'limit'],
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Apply security headers
    this.helmetMiddleware(req, res, () => {
      // Apply compression
      this.compressionMiddleware(req, res, () => {
        // Apply HPP protection
        this.hppMiddleware(req, res, () => {
          // Add custom security headers
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-Frame-Options', 'DENY');
          res.setHeader('X-XSS-Protection', '1; mode=block');
          res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
          res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
          res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

          // Remove sensitive headers
          res.removeHeader('X-Powered-By');
          res.removeHeader('Server');

          // Add request ID for tracing
          const requestId = req.headers['x-request-id'] ||
                           `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          req['requestId'] = requestId;
          res.setHeader('X-Request-ID', requestId);

          // Add response time header
          const startTime = Date.now();
          res.on('finish', () => {
            const responseTime = Date.now() - startTime;
            res.setHeader('X-Response-Time', `${responseTime}ms`);
          });

          next();
        });
      });
    });
  }
}

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = this.configService.get<string>('CORS_ORIGIN', 'http://localhost:4200').split(',');
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
    } else {
      next();
    }
  }
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'] || 'Unknown';
    const requestId = req['requestId'] || 'no-id';

    // Log request
    console.log(JSON.stringify({
      type: 'REQUEST',
      timestamp: new Date().toISOString(),
      requestId,
      method,
      url: originalUrl,
      ip,
      userAgent,
    }));

    // Log response
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      console.log(JSON.stringify({
        type: 'RESPONSE',
        timestamp: new Date().toISOString(),
        requestId,
        method,
        url: originalUrl,
        statusCode,
        responseTime,
        ip,
      }));
    });

    next();
  }
}