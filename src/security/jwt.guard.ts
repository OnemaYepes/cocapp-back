// src/security/jwt.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = parts[1];

    if (this.authService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token invalidado (logout)');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      (req as any).user = { id: payload.sub, email: payload.email, name: payload.name };
      return true;
    } catch (err) {
      console.error('JWT verify error:', err);
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido: ' + err.message + ' ' + token);
      }
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
