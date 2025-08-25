"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const ioredis_1 = require("ioredis");
let LocationGateway = class LocationGateway {
    constructor() {
        this.redis = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: +(process.env.REDIS_PORT || 6379)
        });
    }
    async handleConnection(client, payload) {
        console.log('payload', payload);
        console.log('WS connected', client.id);
    }
    async handleDisconnect(client) {
        console.log('WS disconnected', client.id);
    }
    async handleDriverLocation(payload, client) {
        const { driverId, lat, lng, heading } = payload;
        if (!driverId || !lat || !lng)
            return;
        await this.redis.set(`driver:loc:${driverId}`, JSON.stringify({ lat, lng, heading, ts: Date.now() }), 'EX', 30);
        client.broadcast.emit('driver:loc', { driverId, lat, lng, heading });
    }
    joinRide(payload, client) {
        console.log("new join ==> ", payload.clientPhone);
        client.join(`ride:${payload.clientPhone}`);
    }
    joinDrivers(payload, client) {
        console.log("new join ==> ", payload.clientPhone);
        client.join('drivers');
    }
    leaveRide(payload, client) {
        console.log("new leave ==> ", payload.clientPhone);
        client.leave(`drivers:${payload.clientPhone}`);
    }
    isDriverOnline(payload, client) {
        const isOnline = this.server.sockets.adapter.rooms.get('drivers')?.has(payload.clientPhone) || false;
        console.log('isDriverOnline', payload.clientPhone, isOnline);
        client.emit('driver:online', { clientPhone: payload.clientPhone, isOnline });
    }
    relayToRide(payload, client) {
        client.to(`ride:${payload.clientPhone}`).emit('ride:loc', payload);
    }
    relayRequestToRide(payload, client) {
        console.log("new request ==> ", payload.clientPhone, payload);
        setTimeout(() => {
            this.server.to('drivers').emit('ride:request', payload);
        }, 5000);
    }
    handleRideAccept(payload, client) {
        console.log("Driver accepted:", payload);
        this.server.to(`ride:${payload.clientPhone}`).emit('ride:accepted', payload);
        client.to('drivers').emit('ride:declined', {
            driverId: payload.driverId,
            clientPhone: payload.clientPhone,
        });
    }
};
exports.LocationGateway = LocationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], LocationGateway.prototype, "server", void 0);
__decorate([
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], LocationGateway.prototype, "handleConnection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('driver:loc'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], LocationGateway.prototype, "handleDriverLocation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ride:join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "joinRide", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('drivers:join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "joinDrivers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('drivers:leave'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "leaveRide", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('drivers:online'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "isDriverOnline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ride:loc'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "relayToRide", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ride:request'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "relayRequestToRide", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ride:accept'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "handleRideAccept", null);
exports.LocationGateway = LocationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' }
    })
], LocationGateway);
//# sourceMappingURL=location.gateway.js.map