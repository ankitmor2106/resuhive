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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateResumeDto = exports.CreateResumeDto = exports.ResumeStatus = void 0;
const class_validator_1 = require("class-validator");
var ResumeStatus;
(function (ResumeStatus) {
    ResumeStatus["DRAFT"] = "DRAFT";
    ResumeStatus["ACTIVE"] = "ACTIVE";
    ResumeStatus["ARCHIVED"] = "ARCHIVED";
})(ResumeStatus || (exports.ResumeStatus = ResumeStatus = {}));
class CreateResumeDto {
    title;
}
exports.CreateResumeDto = CreateResumeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateResumeDto.prototype, "title", void 0);
class UpdateResumeDto {
    title;
    status;
    templateId;
    professionalSummary;
    sectionOrder;
    personalInfo;
    experience;
    education;
    projects;
    skills;
    certifications;
    achievements;
    positions;
    languages;
    interests;
    custom;
    theme;
}
exports.UpdateResumeDto = UpdateResumeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResumeDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ResumeStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResumeDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResumeDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResumeDto.prototype, "professionalSummary", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateResumeDto.prototype, "sectionOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "personalInfo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "experience", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "education", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "projects", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "skills", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "certifications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "achievements", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "positions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "languages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "interests", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "custom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateResumeDto.prototype, "theme", void 0);
//# sourceMappingURL=resume.dto.js.map