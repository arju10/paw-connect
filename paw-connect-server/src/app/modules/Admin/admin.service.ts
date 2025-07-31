import { Prisma, PrismaClient } from '@prisma/client';
import { constants } from 'buffer';

const prisma = new PrismaClient();

const getAllAdminFromDB = async (params: any) => {
  const { searchTerm, ...filterData } = params;
  // console.log(params);
  console.log(filterData);
  const addConditions: Prisma.AdminWhereInput[] = [];
  const adminSearchAbleFields = ['name', 'email'];

  if (params.searchTerm) {
    addConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    addConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }
  console.dir(addConditions, { depth: 'infinity' });

  const whereConditions: Prisma.AdminWhereInput = { AND: addConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
  });
  return result;
};

export const AdminService = {
  getAllAdminFromDB,
};
