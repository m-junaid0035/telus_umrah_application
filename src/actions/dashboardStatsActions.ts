"use server";

import { connectToDatabase } from "@/lib/db";
import { getDashboardStats } from "@/functions/dashboardStatsFunctions";

export async function fetchDashboardStatsAction() {
  await connectToDatabase();
  try {
    const stats = await getDashboardStats();
    return { data: stats };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch dashboard stats"] } };
  }
}

