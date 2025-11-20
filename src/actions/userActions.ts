"use server";

import { connectToDatabase } from "@/lib/db";
import { getAllUsers, getUserById, getUserStatistics } from "@/functions/userFunctions";

export type UserFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

export async function fetchAllUsersAction() {
  await connectToDatabase();
  try {
    const users = await getAllUsers();
    return { data: users };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch users"] } };
  }
}

export async function fetchUserByIdAction(id: string) {
  await connectToDatabase();
  try {
    const user = await getUserById(id);
    if (!user) return { error: { message: ["User not found"] } };
    return { data: user };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch user"] } };
  }
}

export async function fetchUserStatisticsAction() {
  await connectToDatabase();
  try {
    const statistics = await getUserStatistics();
    return { data: statistics };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch user statistics"] } };
  }
}

