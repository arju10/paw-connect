import express, { Request, Response } from 'express';
import { userController } from './user.controller';

const router = express.Router();

// Test Route

// router.get('/', (req: Request, res: Response) => {
// //    console.log("I am working yaaaaaaaaaaaa!")
//   res.send({
//     message: 'User router is working perfectly!',
//   });
// });

router.get('/', userController.createAdmin);

// console.log(`Routes is running on http://localhost:3000/api/v1/user`);

export const userRoutes = router;
