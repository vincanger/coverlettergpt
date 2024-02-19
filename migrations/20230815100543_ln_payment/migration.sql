-- CreateTable
CREATE TABLE "LnPayment" (
    "pr" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "LnPayment_pkey" PRIMARY KEY ("pr")
);

-- CreateIndex
CREATE UNIQUE INDEX "LnPayment_pr_key" ON "LnPayment"("pr");

-- AddForeignKey
ALTER TABLE "LnPayment" ADD CONSTRAINT "LnPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
