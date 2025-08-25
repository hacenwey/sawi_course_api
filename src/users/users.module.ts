import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { DriversService } from 'src/drivers/drivers.service';
import { Driver } from 'src/drivers/driver.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Driver])],
  providers: [UsersService, DriversService,JwtService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
