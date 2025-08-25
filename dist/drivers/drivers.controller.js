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
exports.DriversController = void 0;
const common_1 = require("@nestjs/common");
const drivers_service_1 = require("./drivers.service");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const multer_1 = require("multer");
let DriversController = class DriversController {
    constructor(drivers) {
        this.drivers = drivers;
    }
    async createDriver(body, files = []) {
        const fileMap = {};
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
    goOnline(dto) {
        return this.drivers.goOnline(dto);
    }
    isDriverOnline(dto) {
        return this.drivers.isDriverOnline(dto);
    }
};
exports.DriversController = DriversController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)({
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/drivers',
            filename: (req, file, callback) => {
                const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, uniqueName + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "createDriver", null);
__decorate([
    (0, common_1.Post)('changeOnlineStatus'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "goOnline", null);
__decorate([
    (0, common_1.Post)('isDriverOnline'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "isDriverOnline", null);
exports.DriversController = DriversController = __decorate([
    (0, common_1.Controller)('drivers'),
    __metadata("design:paramtypes", [drivers_service_1.DriversService])
], DriversController);
//# sourceMappingURL=drivers.controller.js.map