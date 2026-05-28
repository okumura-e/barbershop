-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'OWNER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'CLIENT';

-- Rename Barbershop -> Establishment (preserves existing data)
ALTER TABLE "Barbershop" RENAME TO "Establishment";

-- AlterTable
ALTER TABLE "Establishment" ADD COLUMN "ownerId" TEXT;

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "establishmentID" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- Default employee per establishment (for existing bookings)
INSERT INTO "Employee" ("id", "name", "establishmentID")
SELECT gen_random_uuid()::text, 'Profissional', "id" FROM "Establishment";

-- System owner when no user exists yet
INSERT INTO "User" ("id", "name", "email", "role")
SELECT 'cl0000000000000000000000001', 'Dono Sistema', 'owner@system.local', 'OWNER'
WHERE NOT EXISTS (SELECT 1 FROM "User");

UPDATE "Establishment"
SET "ownerId" = COALESCE(
  (SELECT "id" FROM "User" WHERE "role" = 'OWNER' ORDER BY "id" LIMIT 1),
  (SELECT "id" FROM "User" ORDER BY "id" LIMIT 1)
)
WHERE "ownerId" IS NULL;

ALTER TABLE "Establishment" ALTER COLUMN "ownerId" SET NOT NULL;

-- Service: rename FK column
ALTER TABLE "Service" DROP CONSTRAINT "Service_barbershopID_fkey";
ALTER TABLE "Service" RENAME COLUMN "barbershopID" TO "establishmentID";

-- Booking: rename establishment FK + add employee
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_barbershopId_fkey";
ALTER TABLE "Booking" RENAME COLUMN "barbershopId" TO "establishmentId";
ALTER TABLE "Booking" ADD COLUMN "employeeId" TEXT;

UPDATE "Booking" b
SET "employeeId" = (
  SELECT e."id"
  FROM "Employee" e
  WHERE e."establishmentID" = b."establishmentId"
  LIMIT 1
)
WHERE "employeeId" IS NULL;

ALTER TABLE "Booking" ALTER COLUMN "employeeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Establishment" ADD CONSTRAINT "Establishment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Employee" ADD CONSTRAINT "Employee_establishmentID_fkey" FOREIGN KEY ("establishmentID") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Service" ADD CONSTRAINT "Service_establishmentID_fkey" FOREIGN KEY ("establishmentID") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
