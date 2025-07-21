import { Request, Response } from 'express';
import { userServices } from './user.service';

// Create admin
const createAdmin = async (req: Request, res: Response) => {
  //   console.log('User Controllers!');
  // console.log(req.body)
  const result = await userServices.createAdminIntoDatabase(req.body);
  res.send(result);
};

export const userController = {
  createAdmin,
};
