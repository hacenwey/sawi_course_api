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
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const driver_entity_1 = require("./driver.entity");
let DriversService = class DriversService {
    constructor(driversRepo) {
        this.driversRepo = driversRepo;
    }
    async create(dto) {
        const driver = this.driversRepo.create(dto);
        return this.driversRepo.save(driver);
    }
    findByPhone(clientPhone) {
        return this.driversRepo.findOne({ where: { clientPhone } });
    }
    async goOnline(dto) {
        const { clientPhone, isOnline, latitude, longitude } = dto;
        let driver = await this.driversRepo.findOne({ where: { clientPhone } });
        if (!driver) {
            driver = await this.driversRepo.create({ clientPhone, isAvailable: isOnline, latitude: latitude ?? null, longitude: longitude ?? null });
        }
        else {
            driver.isAvailable = isOnline ?? false;
            driver.latitude = latitude ?? null;
            driver.longitude = longitude ?? null;
        }
        return this.driversRepo.save(driver);
    }
    async isDriverOnline(dto) {
        const { clientPhone } = dto;
        const driver = await this.driversRepo.findOne({ where: { clientPhone } });
        if (!driver)
            return false;
        return { clientPhone: driver.clientPhone, isOnline: driver.isAvailable };
    }
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DriversService);
//# sourceMappingURL=drivers.service.js.map