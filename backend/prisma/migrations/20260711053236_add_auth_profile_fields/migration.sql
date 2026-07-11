-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "ResumeStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SuggestionType" AS ENUM ('SUMMARY', 'REWRITE', 'GRAMMAR', 'ACHIEVEMENT', 'BULLET');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('PENDING', 'GENERATING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "occupation" TEXT,
    "experience" TEXT,
    "skills" JSONB,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
    "googleId" TEXT,
    "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Resume',
    "status" "ResumeStatus" NOT NULL DEFAULT 'DRAFT',
    "templateId" TEXT DEFAULT 'classic',
    "professionalSummary" TEXT,
    "sectionOrder" JSONB,
    "personalInfo" JSONB,
    "experience" JSONB,
    "education" JSONB,
    "projects" JSONB,
    "skills" JSONB,
    "certifications" JSONB,
    "achievements" JSONB,
    "positions" JSONB,
    "languages" JSONB,
    "interests" JSONB,
    "custom" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ATSAnalysis" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "breakdown" JSONB NOT NULL,
    "issueCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ATSAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JDMatch" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "matchPercentage" INTEGER NOT NULL,
    "missingSkills" JSONB NOT NULL,
    "gaps" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JDMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AISuggestion" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "type" "SuggestionType" NOT NULL,
    "originalText" TEXT,
    "suggestedText" TEXT NOT NULL,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AISuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Export" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "status" "ExportStatus" NOT NULL DEFAULT 'PENDING',
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Export_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE INDEX "Resume_updatedAt_idx" ON "Resume"("updatedAt");

-- CreateIndex
CREATE INDEX "ATSAnalysis_resumeId_idx" ON "ATSAnalysis"("resumeId");

-- CreateIndex
CREATE INDEX "JDMatch_resumeId_idx" ON "JDMatch"("resumeId");

-- CreateIndex
CREATE INDEX "AISuggestion_resumeId_idx" ON "AISuggestion"("resumeId");

-- CreateIndex
CREATE INDEX "Export_resumeId_idx" ON "Export"("resumeId");

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ATSAnalysis" ADD CONSTRAINT "ATSAnalysis_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JDMatch" ADD CONSTRAINT "JDMatch_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AISuggestion" ADD CONSTRAINT "AISuggestion_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Export" ADD CONSTRAINT "Export_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
