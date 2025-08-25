// src/drivers/drivers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';


@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driversRepo: Repository<Driver>,
  ) {}
 async create(dto:{clientPhone?: string, userId?: string, carModel?: string, carPlate?: string, carColor?: string, insuranceDocument?: string, licenseDocument?: string, carImage?: string}) {
    const driver = this.driversRepo.create(dto);
    return this.driversRepo.save(driver);

 }
  async goOnline(dto:{clientPhone?: string, isOnline?: boolean, latitude?: number, longitude?: number}) {
    const { clientPhone, isOnline, latitude, longitude } = dto;
    let driver = await this.driversRepo.findOne({ where: { clientPhone } });
    if (!driver) {
      driver = await this.driversRepo.create({ clientPhone, isAvailable: isOnline, latitude: latitude ?? null, longitude: longitude ?? null });
    } else {
      driver.isAvailable = isOnline ?? false;
      driver.latitude = latitude ?? null;
      driver.longitude = longitude ?? null;
    }
    return this.driversRepo.save(driver);
  }

  async isDriverOnline(dto:{clientPhone?: string}) {
    const { clientPhone } = dto;
    const driver = await this.driversRepo.findOne({ where: { clientPhone } });
    if (!driver) return false;
    return { clientPhone: driver.clientPhone, isOnline: driver.isAvailable};
  }
}
