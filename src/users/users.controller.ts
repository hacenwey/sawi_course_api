import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { DriversService } from 'src/drivers/drivers.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService,private drivers: DriversService,private jwt: JwtService) {}

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
  async create(@Body() dto: { name: string; phone: string; password: string; role?: 'passenger' | 'driver' ,carModel: string, carPlate: string, carColor: string}, @UploadedFiles() files: Array<Express.Multer['File']> = []) {
      const fileMap: Record<string, string> = {};

    files.forEach((file) => {
      fileMap[file.fieldname] = `/uploads/drivers/${file.filename}`;
    });

    const userInDb = await this.users.findByPhone(dto.phone);
    if (userInDb) {
      throw new BadRequestException('The phone number already exists');
    }

    const user = await this.users.create(dto.name, dto.phone, dto.password, dto.role ?? 'passenger');

    if (!process.env.JWT_SECRET) {
      throw new Error('secretOrPrivateKey must have a value');
    }
    const token = await this.jwt.signAsync(
      { sub: user.id, role: user.role },
      { expiresIn: process.env.JWT_EXPIRES || '7d', secret: process.env.JWT_SECRET },
    )
    const driverData = {
      clientPhone: dto.phone,
      userId: user.id,
      carModel: dto.carModel,
      carPlate: dto.carPlate,
      carColor: dto.carColor,
      insuranceDocument: fileMap['insuranceDocument'] || undefined,
      licenseDocument: fileMap['licenseDocument'] || undefined,
      carImage: fileMap['carImage'] || undefined,
    };
    if (dto.role === 'driver') {
      const driverInDb = await this.drivers.findByPhone(dto.phone);
    if (driverInDb) {
      throw new BadRequestException('The phone number already exists');
    }
      const driver = await this.drivers.create(driverData);
      
      return { user, driver ,token};
    }
  
    return { user, token };
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.users.findById(+id);
  }
}
