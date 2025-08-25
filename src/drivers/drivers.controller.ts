import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
@Controller('drivers')
export class DriversController {
    constructor(
        private drivers: DriversService
    ) {}
@Post('create')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads/drivers',
        filename: (req: Express.Request, file: Express.Multer['File'], callback: (error: Error | null, filename: string) => void) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async createDriver(
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer['File']> = [],
  ) {
    const fileMap: Record<string, string> = {};

    files.forEach((file) => {
      fileMap[file.fieldname] = `/uploads/drivers/${file.filename}`;
    });

    const driverData = {
      clientPhone: body.clientPhone,
      userId: body.userId,
      carModel: body.carModel,
      carPlate: body.carPlate,
      carColor: body.carColor,
      insuranceDocument: fileMap['insuranceDocument'] || undefined,
      licenseDocument: fileMap['licenseDocument'] || undefined,
      carImage: fileMap['carImage'] || undefined,
    };

    const driver = await this.drivers.create(driverData);
    return { message: 'Driver created successfully', driver };
  }
  
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

