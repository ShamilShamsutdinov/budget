/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "serialNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_serialNumber_key" ON "Transaction"("serialNumber");
