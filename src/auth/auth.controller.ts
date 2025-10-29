// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    const token = await this.authService.login(user as any);
    return { 
      success: true, 
      access_token: token.access_token, 
      user 
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      return { success: false, message: 'Credenciales inválidas' };
    }
    const token = await this.authService.login(user as any);
    return { 
      success: true, 
      access_token: token.access_token, 
      user 
    };
  }
}