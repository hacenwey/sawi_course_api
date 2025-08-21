import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post()
  async create(@Body() dto: { phone: string; password: string; role?: 'passenger' | 'driver' }) {
    return this.users.create(dto.phone, dto.password, dto.role ?? 'passenger');
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.users.findById(+id);
  }
}
