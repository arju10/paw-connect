import { Prisma, PrismaClient } from '@prisma/client';
import { constants } from 'buffer';

const prisma = new PrismaClient();

const getAllAdminFromDB = async (params: any) => {
  // console.log(params);
  const addConditions: Prisma.AdminWhereInput[] = [];
  if (params.searchTerm) {
    addConditions.push({
      OR: ['name','email'].map(field => ({
        [field]:{
          contains:params.searchTerm,
          mode:'insensitive'
        }
          
        
      }))
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
