import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService = new JwtService({ secret: process.env.JWT_SECRET || 'secret' })) {}

  canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.cookies?.[process.env.COOKIE_NAME || 'auth_token'] || (req.headers.authorization?.split(' ')[1]);
    if (!token) throw new UnauthorizedException('No token provided');
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'secret' });
      (req as any).user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
