import { Request, Response } from 'express';
import { AdminService } from './admin.service';

const getAllAdmin = async (req: Request, res: Response) => {
  //   console.log(req.query);
  try {
    const result = await AdminService.getAllAdminFromDB(req.query);
    res.status(200).json({
      success: true,
      message: 'Admin data retrive successfully.',
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error?.message || 'Failed to fetch admin data',
      error: error,
    });
  }
};

export const AdminController = {
  getAllAdmin,
};
