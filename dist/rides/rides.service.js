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
exports.RidesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const ride_entity_1 = require("./ride.entity");
let RidesService = class RidesService {
    constructor(repo) {
        this.repo = repo;
    }
    createRequest(riderId, origin, dest, price, clientPhone, originAddress, destAddress) {
        const [originLat, originLng] = origin;
        const [destLat, destLng] = dest;
        const ride = this.repo.create({
            riderId, driverId: null, status: 'requested',
            originLat, originLng, destLat, destLng, price: price || 0, clientPhone, originAddress, destAddress
        });
        return this.repo.save(ride);
    }
    async assignDriver(rideId, driverId) {
        const ride = await this.repo.findOne({ where: { id: rideId } });
        if (!ride)
            throw new common_1.NotFoundException('Ride not found');
        if (ride.status !== 'requested')
            throw new common_1.BadRequestException('Ride no longer available');
        ride.driverId = driverId;
        ride.status = 'accepted';
        return this.repo.save(ride);
    }
    async updateStatus(rideId, status) {
        const ride = await this.repo.findOne({ where: { id: rideId } });
        if (!ride)
            throw new common_1.NotFoundException('Ride not found');
        ride.status = status;
        return this.repo.save(ride);
    }
    findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    listMyRides(clientPhone) {
        console.log(`Fetching rides for client ${clientPhone}`);
        return this.repo.find({ where: [{ clientPhone }] });
    }
};
exports.RidesService = RidesService;
exports.RidesService = RidesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(ride_entity_1.Ride)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], RidesService);
//# sourceMappingURL=rides.service.js.map