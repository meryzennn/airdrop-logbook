-- AlterTable
ALTER TABLE "Airdrop" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "landedAt" TIMESTAMP(3),
ADD COLUMN     "ruggedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Airdrop_userId_idx" ON "Airdrop"("userId");

-- CreateIndex
CREATE INDEX "Airdrop_userId_status_idx" ON "Airdrop"("userId", "status");

-- CreateIndex
CREATE INDEX "Airdrop_userId_createdAt_idx" ON "Airdrop"("userId", "createdAt");
