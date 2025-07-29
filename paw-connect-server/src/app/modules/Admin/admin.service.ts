import { PrismaClient } from '@prisma/client';
import { constants } from 'buffer';

const prisma = new PrismaClient();

const getAllAdminFromDB = async (params: any) => {
  // console.log(params);
  const addConditions = [];
  if (params.searchTerm) {
    addConditions.push({
      OR: [
        {
          name: {
            contains: params.searchTerm,
            mode: 'insensitive',
          },
        },
        {
          email: {
            constants: params.searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    });
  }
  console.log(addConditions,{depth:'infinity'})


  // const result = await prisma.admin.findMany({
  //   where:{}
  // });
  // return result;
};

export const AdminService = {
  getAllAdminFromDB,
};
