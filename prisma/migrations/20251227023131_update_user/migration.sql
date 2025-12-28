/*
  Warnings:

  - You are about to drop the `Point` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `totalQuota` on the `roulette_slots` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Point_userId_remaining_idx";

-- DropIndex
DROP INDEX "Point_userId_expiresAt_idx";

-- DropIndex
DROP INDEX "SocialAccount_provider_providerId_key";

-- DropIndex
DROP INDEX "SocialAccount_userId_idx";

-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Point";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SocialAccount";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Wallet";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "profileImage" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "social_accounts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "social_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "wallets" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cash" INTEGER NOT NULL DEFAULT 0,
    "point" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "points" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "points_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PointUsage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transactionId" INTEGER NOT NULL,
    "pointId" INTEGER NOT NULL,
    "usedAmount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PointUsage_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "WalletTransaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PointUsage_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "points" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PointUsage" ("createdAt", "id", "pointId", "transactionId", "usedAmount") SELECT "createdAt", "id", "pointId", "transactionId", "usedAmount" FROM "PointUsage";
DROP TABLE "PointUsage";
ALTER TABLE "new_PointUsage" RENAME TO "PointUsage";
CREATE TABLE "new_WalletTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "currencyType" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WalletTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WalletTransaction" ("amount", "balanceAfter", "changeType", "createdAt", "currencyType", "id", "metadata", "sourceId", "sourceType", "userId") SELECT "amount", "balanceAfter", "changeType", "createdAt", "currencyType", "id", "metadata", "sourceId", "sourceType", "userId" FROM "WalletTransaction";
DROP TABLE "WalletTransaction";
ALTER TABLE "new_WalletTransaction" RENAME TO "WalletTransaction";
CREATE INDEX "WalletTransaction_sourceType_sourceId_idx" ON "WalletTransaction"("sourceType", "sourceId");
CREATE INDEX "WalletTransaction_userId_createdAt_idx" ON "WalletTransaction"("userId", "createdAt");
CREATE TABLE "new_roulette_slots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rouletteId" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NOTHING',
    "displayName" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "rewardAmount" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "roulette_slots_rouletteId_fkey" FOREIGN KEY ("rouletteId") REFERENCES "roulettes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_roulette_slots" ("displayName", "id", "rate", "rewardAmount", "rouletteId", "sortOrder", "type") SELECT "displayName", "id", "rate", "rewardAmount", "rouletteId", "sortOrder", "type" FROM "roulette_slots";
DROP TABLE "roulette_slots";
ALTER TABLE "new_roulette_slots" RENAME TO "roulette_slots";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "social_accounts_userId_idx" ON "social_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_provider_providerId_key" ON "social_accounts"("provider", "providerId");

-- CreateIndex
CREATE INDEX "points_userId_expiresAt_idx" ON "points"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "points_userId_remaining_idx" ON "points"("userId", "remaining");
