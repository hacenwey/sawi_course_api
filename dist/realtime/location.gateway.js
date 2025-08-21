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
    async handleConnection(client) {
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
        client.join(`ride:${payload.rideId}`);
    }
    relayToRide(payload, client) {
        client.to(`ride:${payload.rideId}`).emit('ride:loc', payload);
    }
};
exports.LocationGateway = LocationGateway;
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
    (0, websockets_1.SubscribeMessage)('ride:loc'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "relayToRide", null);
exports.LocationGateway = LocationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' }
    })
], LocationGateway);
//# sourceMappingURL=location.gateway.js.map