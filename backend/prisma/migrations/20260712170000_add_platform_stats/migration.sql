-- CreateTable
CREATE TABLE "PlatformStats" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformStats_pkey" PRIMARY KEY ("id")
);
