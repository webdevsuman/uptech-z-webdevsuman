import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import dbConnect from "../config/dbConnect.js";
import Permission from "../models/permissions.model.js";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import PERMISSIONS from "../constants/permissions.constant.js";
import ROLES from "../constants/roles.constant.js";
import { ROLE_PERMISSIONS } from "../constants/rolePermissions.constant.js";
import logger from "../utils/logger.js";

const seedRbac = async () => {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!superAdminEmail || !superAdminPassword) {
    logger.error(
      "SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD is not defined in .env"
    );
    process.exit(1);
  }

  try {
    await dbConnect();
    logger.info("Starting RBAC seeding process...");

    // 1. Clear previous Permissions and Roles
    await Permission.deleteMany({});
    await Role.deleteMany({});
    logger.info("Cleared existing Permission and Role collections.");

    // 2. Insert Permissions using insertMany
    const permissionDocs = Object.values(PERMISSIONS).map((name) => ({
      name,
      description: `Permission to ${name.replace(":", " ")}`,
    }));

    const insertedPermissions = await Permission.insertMany(permissionDocs);
    logger.info(
      `Successfully inserted ${insertedPermissions.length} permissions.`
    );

    // 3. Create a lookup map for Permission IDs
    const permissionMap = new Map(
      insertedPermissions.map((p) => [p.name, p._id])
    );

    // 4. Build Roles array with respective permission IDs
    const rolesToInsert = [
      {
        name: ROLES.SUPER_ADMIN,
        permissions: insertedPermissions.map((p) => p._id),
      },
      {
        name: ROLES.INSTRUCTOR,
        permissions: (ROLE_PERMISSIONS[ROLES.INSTRUCTOR] || [])
          .map((name) => permissionMap.get(name))
          .filter(Boolean),
      },
      {
        name: ROLES.STUDENT,
        permissions: (ROLE_PERMISSIONS[ROLES.STUDENT] || [])
          .map((name) => permissionMap.get(name))
          .filter(Boolean),
      },
    ];

    // 5. Insert Roles using insertMany
    const insertedRoles = await Role.insertMany(rolesToInsert);
    logger.info(`Successfully inserted ${insertedRoles.length} roles.`);

    const superAdminRole = insertedRoles.find(
      (r) => r.name === ROLES.SUPER_ADMIN
    );

    if (!superAdminRole) {
      throw new Error("Super Admin role was not created properly.");
    }

    // 6. Seed Super Admin User
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    const existingSuperAdmin = await User.findOne({ email: superAdminEmail });

    if (existingSuperAdmin) {
      existingSuperAdmin.name = "Super Admin";
      existingSuperAdmin.password = hashedPassword;
      existingSuperAdmin.role = superAdminRole._id;
      existingSuperAdmin.isVerified = true;
      existingSuperAdmin.isActive = true;
      await existingSuperAdmin.save();
      logger.info(`Updated existing Super Admin user: ${superAdminEmail}`);
    } else {
      await User.create({
        name: "Super Admin",
        email: superAdminEmail,
        password: hashedPassword,
        role: superAdminRole._id,
        isVerified: true,
        isActive: true,
      });
      logger.info(`Created new Super Admin user: ${superAdminEmail}`);
    }

    logger.info("RBAC and Super Admin seeding completed successfully!");
  } catch (error) {
    logger.error("Error during RBAC seeding:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed.");
    process.exit(process.exitCode || 0);
  }
};

seedRbac();
