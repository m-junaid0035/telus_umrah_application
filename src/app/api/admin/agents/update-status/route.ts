import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Agent from "@/models/Agent";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { agentId, status, rejectionReason } = body;

    if (!agentId || !status) {
      return NextResponse.json(
        { success: false, message: "Agent ID and status are required" },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    if (status === 'rejected' && !rejectionReason) {
      return NextResponse.json(
        { success: false, message: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Update agent status
    const updateData: any = { status };
    if (status === 'rejected') {
      updateData.rejectionReason = rejectionReason;
    } else {
      updateData.rejectionReason = undefined;
    }

    const agent = await Agent.findByIdAndUpdate(
      agentId,
      updateData,
      { new: true }
    );

    if (!agent) {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        { status: 404 }
      );
    }

    // TODO: Send email notification to agent

    return NextResponse.json({
      success: true,
      message: `Agent ${status} successfully`,
      agent,
    });
  } catch (error: any) {
    console.error("Error updating agent status:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update agent status" },
      { status: 500 }
    );
  }
}
