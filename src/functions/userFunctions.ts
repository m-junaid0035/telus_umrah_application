"use server";

import { connectToDatabase } from "@/lib/db";
import { User, IUser } from "@/models/User";

/**
 * Serialize user object for client usage
 */
const serializeUser = (user: IUser) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
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

