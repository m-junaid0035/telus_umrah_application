import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Agent from "@/models/Agent";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all agents
    const agents = await Agent.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      agents,
    });
  } catch (error: any) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
