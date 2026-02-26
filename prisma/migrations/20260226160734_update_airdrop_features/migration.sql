-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'RUGGED';

-- AlterTable
ALTER TABLE "Airdrop" ADD COLUMN     "landedValue" DOUBLE PRECISION,
ADD COLUMN     "tokenTicker" TEXT;
