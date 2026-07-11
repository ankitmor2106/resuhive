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
exports.AnalysisController = void 0;
const common_1 = require("@nestjs/common");
const analysis_service_1 = require("./analysis.service");
const analysis_dto_1 = require("./dto/analysis.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let AnalysisController = class AnalysisController {
    analysisService;
    constructor(analysisService) {
        this.analysisService = analysisService;
    }
    analyzeAts(resumeId, user) {
        return this.analysisService.analyzeResume(resumeId, user.userId);
    }
    matchJd(resumeId, user, dto) {
        return this.analysisService.matchJobDescription(resumeId, user.userId, dto);
    }
};
exports.AnalysisController = AnalysisController;
__decorate([
    (0, common_1.Post)('ats'),
    __param(0, (0, common_1.Param)('resumeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AnalysisController.prototype, "analyzeAts", null);
__decorate([
    (0, common_1.Post)('jd-match'),
    __param(0, (0, common_1.Param)('resumeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, analysis_dto_1.MatchJDDto]),
    __metadata("design:returntype", void 0)
], AnalysisController.prototype, "matchJd", null);
exports.AnalysisController = AnalysisController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('resumes/:resumeId/analysis'),
    __metadata("design:paramtypes", [analysis_service_1.AnalysisService])
], AnalysisController);
//# sourceMappingURL=analysis.controller.js.map