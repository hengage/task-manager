import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

/**
 * The `AuthGuard` class is a custom guard to protect routes by validating JWT tokens.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Determines if the current request is authorized by validating the JWT token.
   *
   * @param context - The execution context, which provides details about the current request.
   * @returns A promise that resolves to a boolean indicating whether the request is authorized.
   * @throws UnauthorizedException - If the JWT token is missing or invalid.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<'string'>('JWT_SECRET'),
      });
      // Assigns the payload to the request object so it can be accessed in route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Extracts the JWT token from the request header.
   *
   * @param request - The request object from which to extract the token.
   * @returns The extracted token if present, otherwise undefined.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
