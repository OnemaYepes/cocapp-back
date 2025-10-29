// src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class AuthService {
  // Blacklist en memoria (ejemplo). En prod usar Redis con TTL.
  private tokenBlacklist = new Set<string>();

  constructor(
    private readonly users: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Omit<User, 'password'>> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new BadRequestException('El email ya está registrado');

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.users.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      avatarUrl: dto.avatarUrl,
    });

    const { password, ...safeUser } = created;
    return safeUser;
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    const { password: _, ...safe } = user;
    return safe;
  }

  async login(user: { id: string; email: string; name: string }) {
    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  logout(token: string) {
    if (!token) return;
    this.tokenBlacklist.add(token);
  }

  isBlacklisted(token: string) {
    return this.tokenBlacklist.has(token);
  }
}
