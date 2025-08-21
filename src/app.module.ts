import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RidesModule } from './rides/rides.module';
import { User } from './users/user.entity';
import { Ride } from './rides/ride.entity';
import { PaymentsModule } from './payments/payments.module';
import { LocationGateway } from './realtime/location.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
   TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,   // WAMP default host
      port: +(process.env.DB_PORT || 3306),          // MySQL default port
      username: process.env.DB_USER,    // default user in WAMP (you can change if you set a password)
      password: process.env.DB_PASSWORD,        // leave empty if no password set
      database: process.env.DB_NAME,  // replace with your database name
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,   // auto-create tables (disable in production!)
    }),
    UsersModule,
    AuthModule,
    RidesModule,
    PaymentsModule
  ],
  providers: [LocationGateway]
})
export class AppModule {}
