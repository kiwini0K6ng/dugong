-- CreateTable
CREATE TABLE "roulette_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "rouletteId" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NOTHING',
    "rewardAmount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "roulette_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "roulette_logs_rouletteId_fkey" FOREIGN KEY ("rouletteId") REFERENCES "roulettes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
