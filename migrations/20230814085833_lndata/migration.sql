-- CreateTable
CREATE TABLE "LnData" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "loginUrl" TEXT NOT NULL,
    "k1Hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LnData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LnData_userId_key" ON "LnData"("userId");

-- AddForeignKey
ALTER TABLE "LnData" ADD CONSTRAINT "LnData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
