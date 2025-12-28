/*
  Warnings:

  - You are about to drop the `roulette_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "roulette_logs";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "roulette_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "rouletteId" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NOTHING',
    "rewardAmount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "roulette_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "roulette_history_rouletteId_fkey" FOREIGN KEY ("rouletteId") REFERENCES "roulettes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
