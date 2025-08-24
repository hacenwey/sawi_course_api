import { Body, Controller, Post } from '@nestjs/common';
import { DriversService } from './drivers.service';

@Controller('drivers')
export class DriversController {
    constructor(
        private drivers: DriversService
    ) {}

@Post('changeOnlineStatus')
goOnline(@Body() dto:{
    clientPhone?: string,
    isOnline?: boolean,
    latitude?: number,
    longitude?: number
}) {
    return this.drivers.goOnline(dto);
}    

@Post('isDriverOnline')
isDriverOnline(@Body() dto:{clientPhone?: string}) {
    return this.drivers.isDriverOnline(dto);
}
}
