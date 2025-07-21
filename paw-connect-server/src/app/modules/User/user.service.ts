// Import PrismaClient (the auto-generated Prisma client) and UserRole enum from the Prisma schema.
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Instantiate a new Prisma client instance.
// This provides access to all your database models (User, Admin, etc.).
const prisma = new PrismaClient();

/**
 * Create an admin user and its related User record in the database.
 * This function runs inside a single transaction to ensure both records are created atomically.
 *
 * @param data - The input data object containing `password` and `admin` fields.
 * @returns The created admin record.
 *
 * Example input:
 * {
 *   password: 'securePassword123',
 *   admin: {
 *     name: 'Jane Doe',
 *     email: 'jane@example.com',
 *     contactNumber: '01700000000',
 *     isDeleted: false
 *   }
 * }
 */
const createAdminIntoDatabase = async (data: any) => {
  /**
   * Hash the admin’s plain-text password securely and prepare the User data object.
   *
   * 1️⃣ The plain password is hashed using bcrypt with 12 salt rounds.
   *     - Bcrypt is a robust hashing algorithm that automatically adds a salt.
   *     - `12` is a reasonable cost factor balancing security and performance.
   *
   * 2️⃣ The hashed password is then used to build the `userData` object.
   *     - `email` is taken from the nested `admin` object in the input.
   *     - `password` stores the securely hashed password, **never the plain text**.
   *     - `role` is explicitly set to `ADMIN` using the Prisma `UserRole` enum,
   *        ensuring only valid roles are saved.
   *
   * This `userData` object is passed to Prisma to create the related `User` record.
   */
  const hashedPassword: string = await bcrypt.hash(data.password, 12);
  console.log('hashed Password: ', { hashedPassword });
  // Prepare user data for the `User` table.
  // This includes email, hashed password and the role as ADMIN.
  const userData = {
    email: data.admin.email, // Take the email from the nested admin object.
    password: hashedPassword, // Store the securely hashed password.
    role: UserRole.ADMIN, // Use the Prisma enum for strict role control.
  };

  // Execute both `User` and `Admin` record creations inside a single transaction.
  // If one fails, both operations roll back automatically.
  const result = await prisma.$transaction(async (transactionClient) => {
    // Create the User record.
    const createdUser = await transactionClient.user.create({
      data: userData,
    });

    // Create the Admin record, using the admin sub-object from input.
    const createdAdminData = await transactionClient.admin.create({
      data: data.admin,
    });

    // Return the created Admin record as the result.
    return createdAdminData;
  });

  // Return the final result of the transaction.
  return result;
};

// Export all user-related services as an object.
// This allows you to easily import all service functions together.
export const userServices = {
  createAdminIntoDatabase,
};
