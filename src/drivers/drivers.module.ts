// src/drivers/drivers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './driver.entity';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { LocationGateway } from '../realtime/location.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],
  controllers: [DriversController],
  providers: [DriversService, LocationGateway],
  exports: [DriversService],
})
export class DriversModule {}
