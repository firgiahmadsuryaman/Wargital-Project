-- DropIndex
DROP INDEX "Favorite_userId_restaurantId_key";

-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "menuItemId" TEXT,
ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
