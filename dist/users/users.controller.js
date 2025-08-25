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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const drivers_service_1 = require("../drivers/drivers.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_1 = require("@nestjs/jwt");
let UsersController = class UsersController {
    constructor(users, drivers, jwt) {
        this.users = users;
        this.drivers = drivers;
        this.jwt = jwt;
    }
    async create(dto, files = []) {
        const fileMap = {};
        files.forEach((file) => {
            fileMap[file.fieldname] = `/uploads/drivers/${file.filename}`;
        });
        const userInDb = await this.users.findByPhone(dto.phone);
        if (userInDb) {
            throw new common_1.BadRequestException('The phone number already exists');
        }
        const user = await this.users.create(dto.phone, dto.password, dto.role ?? 'passenger');
        if (!process.env.JWT_SECRET) {
            throw new Error('secretOrPrivateKey must have a value');
        }
        const token = await this.jwt.signAsync({ sub: user.id, role: user.role }, { expiresIn: process.env.JWT_EXPIRES || '7d', secret: process.env.JWT_SECRET });
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
                throw new common_1.BadRequestException('The phone number already exists');
            }
            const driver = await this.drivers.create(driverData);
            return { user, driver, token };
        }
        return { user, token };
    }
    get(id) {
        return this.users.findById(+id);
    }
};
exports.UsersController = UsersController;
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
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "get", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService, drivers_service_1.DriversService, jwt_1.JwtService])
], UsersController);
//# sourceMappingURL=users.controller.js.map