import { Controller, Post, Body, Res, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body, @Res() res: Response) {
    const result = await this.authService.register(body.email, body.password);
    return res.json(result);
  }

  @Post('login')
  async login(@Body() body, @Res() res: Response) {
    const { token, user } = await this.authService.login(body.email, body.password);
    res.cookie(process.env.COOKIE_NAME || 'auth_token', token, { httpOnly: true });
    return res.json({ token, user });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: Request, @Res() res: Response) {
    // Jwt guard attaches user to request
    return res.json((req as any).user);
  }
}
