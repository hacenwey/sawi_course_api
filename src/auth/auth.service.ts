import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async login(phone: string, password: string) {
    const user = await this.users.findByPhone(phone);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await user.comparePassword(password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.jwt.signAsync(
      { sub: user.id, role: user.role },
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );
    return { access_token: token, user: { id: user.id, phone: user.phone, role: user.role } };
  }
}
