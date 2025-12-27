-- CreateTable
CREATE TABLE "roulettes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "freeLimitPerDay" INTEGER NOT NULL DEFAULT 1,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "roulette_slots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rouletteId" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NOTHING',
    "displayName" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "rewardAmount" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "totalQuota" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "roulette_slots_rouletteId_fkey" FOREIGN KEY ("rouletteId") REFERENCES "roulettes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
