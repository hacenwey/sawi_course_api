import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ride } from './ride.entity';

@Injectable()
export class RidesService {
  constructor(@InjectRepository(Ride) private repo: Repository<Ride>) {}

  createRequest(riderId: any, origin: [number, number], dest: [number, number], price?: number,clientPhone?: number, originAddress?: string, destAddress?: string) {
    const [originLat, originLng] = origin;
    const [destLat, destLng] = dest;
    const ride = this.repo.create({
      riderId, driverId: null, status: 'requested',
      originLat, originLng, destLat, destLng, price: price || 0,clientPhone, originAddress, destAddress
    });
    return this.repo.save(ride);
  }

  async assignDriver(rideId: number, driverId: number) {
    const ride = await this.repo.findOne({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');
    if (ride.status !== 'requested') throw new BadRequestException('Ride no longer available');
    ride.driverId = driverId;
    ride.status = 'accepted';
    return this.repo.save(ride);
  }

  async updateStatus(rideId: number, status: Ride['status']) {
    const ride = await this.repo.findOne({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');
    ride.status = status;
    return this.repo.save(ride);
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  listMyRides(clientPhone: number) {
    console.log(`Fetching rides for client ${clientPhone}`);
    return this.repo.find({ where: [{ clientPhone }] });
  }
}
