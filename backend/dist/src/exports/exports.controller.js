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
exports.ExportsController = void 0;
const common_1 = require("@nestjs/common");
const exports_service_1 = require("./exports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let ExportsController = class ExportsController {
    exportsService;
    constructor(exportsService) {
        this.exportsService = exportsService;
    }
    exportPdf(resumeId, user) {
        return this.exportsService.generatePdf(resumeId, user.userId);
    }
    getExportStatus(exportId, user) {
        return this.exportsService.getExportStatus(exportId, user.userId);
    }
    async downloadExport(exportId, user, res) {
        await this.exportsService.getExportStatus(exportId, user.userId);
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'exports-temp', `${exportId}.pdf`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=resume-${exportId}.pdf`);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
};
exports.ExportsController = ExportsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('resumeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExportsController.prototype, "exportPdf", null);
__decorate([
    (0, common_1.Get)(':exportId'),
    __param(0, (0, common_1.Param)('exportId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExportsController.prototype, "getExportStatus", null);
__decorate([
    (0, common_1.Get)(':exportId/download'),
    __param(0, (0, common_1.Param)('exportId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ExportsController.prototype, "downloadExport", null);
exports.ExportsController = ExportsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('resumes/:resumeId/export'),
    __metadata("design:paramtypes", [exports_service_1.ExportsService])
], ExportsController);
//# sourceMappingURL=exports.controller.js.map