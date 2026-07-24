-- AlterTable
ALTER TABLE "_TagToTicket" ADD CONSTRAINT "_TagToTicket_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_TagToTicket_AB_unique";
