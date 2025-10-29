import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { JwtGuard } from '../security/jwt.guard';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User]), 
  ],
  providers: [AuthService, UserService, JwtGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtGuard, JwtModule],
})
export class AuthModule {}
