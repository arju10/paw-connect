import { Request, Response } from 'express';
import { userServices } from './user.service';

// Create admin
const createAdmin = async (req: Request, res: Response) => {
  //   console.log('User Controllers!');
  // console.log(req.body)
  try {
    const result = await userServices.createAdminIntoDatabase(req.body);
    res.status(200).json({
      success: true,
      message: 'Admin created successfully!',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong',
      error: error,
    });
  }
};

export const userController = {
  createAdmin,
};
