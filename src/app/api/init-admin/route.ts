import { NextResponse } from "next/server";
import { initAdminUser } from "@/scripts/initAdmin";

export async function GET() {
  try {
    const result = await initAdminUser();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to initialize admin" },
      { status: 500 }
    );
  }
}

