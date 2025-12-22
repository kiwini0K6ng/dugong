/*
  Warnings:

  - You are about to drop the `TransactionReasonMaster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `reasonCode` on the `WalletTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `walletType` on the `WalletTransaction` table. All the data in the column will be lost.
  - Added the required column `currencyType` to the `WalletTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TransactionReasonMaster";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "WalletTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WalletTransaction" ("amount", "balanceAfter", "changeType", "createdAt", "id", "metadata", "sourceId", "sourceType", "userId") SELECT "amount", "balanceAfter", "changeType", "createdAt", "id", "metadata", "sourceId", "sourceType", "userId" FROM "WalletTransaction";
DROP TABLE "WalletTransaction";
ALTER TABLE "new_WalletTransaction" RENAME TO "WalletTransaction";
CREATE INDEX "WalletTransaction_sourceType_sourceId_idx" ON "WalletTransaction"("sourceType", "sourceId");
CREATE INDEX "WalletTransaction_userId_createdAt_idx" ON "WalletTransaction"("userId", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
