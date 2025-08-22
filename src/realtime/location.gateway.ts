import {
  WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import Redis from 'ioredis';

@WebSocketGateway({
  cors: { origin: '*' }
})
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379)
  });

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
    client.join(`ride:${payload.clientPhone}`);
  }

  @SubscribeMessage('ride:loc')
  relayToRide(@MessageBody() payload: { clientPhone: number; lat: number; lng: number }, @ConnectedSocket() client: Socket) {
    client.to(`ride:${payload.clientPhone}`).emit('ride:loc', payload);
  }

  @SubscribeMessage('ride:request')
  relayRequestToRide(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    console.log("new request ==> ", payload.clientPhone,payload);
    client.to(`ride:${payload.clientPhone}`).emit('ride:request', payload);
  }
}
