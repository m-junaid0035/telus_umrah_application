"use server";

import { connectToDatabase } from "@/lib/db";
import { User, IUser } from "@/models/User";

/**
 * Serialize user object for client usage
 */
const serializeUser = (user: any) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  countryCode: user.countryCode,
  avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
  createdAt: user.createdAt?.toISOString() || null,
  updatedAt: user.updatedAt?.toISOString() || null,
});

/**
 * Get all users (sorted by creation date)
 */
export const getAllUsers = async () => {
  await connectToDatabase();
  const users = await User.find().sort({ createdAt: -1 }).lean();
  return users.map(serializeUser);
};

/**
 * Get recent users (limited for dashboard)
 */
export const getRecentUsers = async (limit: number = 20) => {
  await connectToDatabase();
  const users = await User.find().sort({ createdAt: -1 }).limit(limit).lean();
  return users.map(serializeUser);
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string) => {
  await connectToDatabase();
  const user = await User.findById(id).lean();
  return user ? serializeUser(user) : null;
};

/**
 * Get user statistics
 */
export const getUserStatistics = async () => {
  await connectToDatabase();
  
  const totalUsers = await User.countDocuments();
  
  // Users created in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  
  // Users created in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const monthlyUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
  
  // Users by month (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - i);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    
    const count = await User.countDocuments({
      createdAt: { $gte: monthStart, $lt: monthEnd }
    });
    
    monthlyData.push({
      month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
      count
    });
  }
  
  return {
    totalUsers,
    recentUsers,
    monthlyUsers,
    monthlyData,
  };
};

/**
 * Delete user by ID
 */
export const deleteUser = async (id: string) => {
  await connectToDatabase();
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error("User not found");
  }
  return { message: "User deleted successfully" };
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (userId: string, data: { name?: string; phone?: string; countryCode?: string }) => {
  await connectToDatabase();
  
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if phone is being changed and already exists
  if (data.phone && data.phone !== user.phone) {
    const existingUser = await User.findOne({ phone: data.phone });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error("Phone number already in use");
    }
  }

  // Update fields
  if (data.name !== undefined) user.name = data.name;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.countryCode !== undefined) user.countryCode = data.countryCode;

  await user.save();
  
  return serializeUser(user);
};

/**
 * Change user password
 */
export const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  await connectToDatabase();
  
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password is correct
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Validate minimum password length
  if (!newPassword || newPassword.trim().length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  // Prevent reusing the same password
  const isSame = await user.comparePassword(newPassword);
  if (isSame) {
    throw new Error("New password must be different from the current password");
  }

  // Update password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

