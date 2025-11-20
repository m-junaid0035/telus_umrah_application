"use server";

import { connectToDatabase } from "@/lib/db";
import { initializeAdmin } from "@/functions/authFunctions";

/**
 * Script to initialize admin user
 * Run this once to create the default admin user
 */
export async function initAdminUser() {
  try {
    await connectToDatabase();
    const result = await initializeAdmin();
    console.log(result.message);
    return result;
  } catch (error: any) {
    console.error("Failed to initialize admin:", error);
    throw error;
  }
}

