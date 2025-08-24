import {
  WebSocketGateway, WebSocketServer,SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';

@WebSocketGateway({
  cors: { origin: '*' }
})
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379)
  });

  @WebSocketServer() server!: Server;
  async handleConnection(client: Socket,@MessageBody() payload: any) {
    console.log('payload', payload);
    console.log('WS connected', client.id);
  }
  async handleDisconnect(client: Socket) {
    console.log('WS disconnected', client.id);
  }

  // Driver sends: { driverId, lat, lng, heading? }
  @SubscribeMessage('driver:loc')
  async handleDriverLocation(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    const { driverId, lat, lng, heading } = payload;
    if (!driverId || !lat || !lng) return;
    await this.redis.set(`driver:loc:${driverId}`, JSON.stringify({ lat, lng, heading, ts: Date.now() }), 'EX', 30);
    client.broadcast.emit('driver:loc', { driverId, lat, lng, heading });
  }

  @SubscribeMessage('ride:join')
  joinRide(@MessageBody() payload: { clientPhone: number }, @ConnectedSocket() client: Socket) {
    console.log("new join ==> ", payload.clientPhone);
    client.join(`ride:${payload.clientPhone}`);
  }
  @SubscribeMessage('drivers:join')
  joinDrivers(@MessageBody() payload: { clientPhone: number }, @ConnectedSocket() client: Socket) {
    console.log("new join ==> ", payload.clientPhone);
    client.join('drivers');
  }

  @SubscribeMessage('drivers:leave')
  leaveRide(@MessageBody() payload: { clientPhone: number }, @ConnectedSocket() client: Socket) {
    console.log("new leave ==> ", payload.clientPhone);
    client.leave(`drivers:${payload.clientPhone}`);
  }
  @SubscribeMessage('drivers:online')
  isDriverOnline(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    const isOnline = this.server.sockets.adapter.rooms.get('drivers')?.has(payload.clientPhone) || false;
    client.to('drivers').emit('drivers:online', { clientPhone: payload.clientPhone, isOnline });
    console.log("isDriverOnline ==> ", payload.clientPhone, isOnline);
   }

  @SubscribeMessage('ride:loc')
  relayToRide(@MessageBody() payload: { clientPhone: number; lat: number; lng: number }, @ConnectedSocket() client: Socket) {
    client.to(`ride:${payload.clientPhone}`).emit('ride:loc', payload);
  }

  @SubscribeMessage('ride:request')
  relayRequestToRide(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    console.log("new request ==> ", payload.clientPhone,payload);
    setTimeout(() => {
      this.server.to('drivers').emit('ride:request', payload);
    }, 5000);
  }

  @SubscribeMessage('ride:accept')
  handleRideAccept(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    console.log("Driver accepted:", payload);

    // Notify the rider only
    this.server.to(`ride:${payload.clientPhone}`).emit('ride:accepted', payload);

    // Optionally, notify all other drivers that ride was accepted
    client.to('drivers').emit('ride:declined', {
      driverId: payload.driverId,
      clientPhone: payload.clientPhone,
    });
   }
}
