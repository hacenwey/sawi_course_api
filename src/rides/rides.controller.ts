import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RidesService } from './rides.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

// @UseGuards(JwtAuthGuard)
@Controller('rides')
export class RidesController {
  constructor(private rides: RidesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: { origin: [number, number]; dest: [number, number], price: number , clientPhone: number ,originAddress: string, destAddress: string}) {
    return this.rides.createRequest(null, dto.origin, dto.dest, dto.price, dto.clientPhone, dto.originAddress, dto.destAddress);
  }

  @Patch(':id/assign')
  assign(@CurrentUser() user: any, @Param('id') id: number, @Body() dto: { driverId?: number }) {
    const driverId = dto.driverId ?? user.userId;
    return this.rides.assignDriver(+id, driverId);
  }

  @Patch(':id/status')
  status(@Param('id') id: number, @Body() dto: { status: 'accepted' | 'in_progress' | 'completed' | 'cancelled' }) {
    return this.rides.updateStatus(+id, dto.status);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.rides.findById(+id);
  }

  @Get()
  my(@Param('clientPhone') clientPhone: any) {
    return this.rides.listMyRides(clientPhone);
  }
}
