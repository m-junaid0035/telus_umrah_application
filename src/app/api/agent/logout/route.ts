import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("agentToken");

    return NextResponse.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error: any) {
    console.error("Agent logout error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Logout failed" },
      { status: 500 }
    );
  }
}
