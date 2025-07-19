import { Request, Response } from 'express';
import { userServices } from './user.service';

// Create admin
const createAdmin = async (req: Request, res: Response) => {
//   console.log('User Controllers!');
  const result = await userServices.createAdmin();
  res.send(result);
};

export const userController = {
  createAdmin,
};
