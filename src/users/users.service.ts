import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByPhone(phone: string) {
    return this.repo.findOne({ where: { phone } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(name: string, phone: string, password: string, role: 'passenger' | 'driver' = 'passenger') {
    const passwordHash = await User.hashPassword(password);
    const user = this.repo.create({ name, phone, passwordHash, role });
    return this.repo.save(user);
  }

  async ensure(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
