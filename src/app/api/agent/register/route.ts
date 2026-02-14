import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Agent from "@/models/Agent";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      countryCode,
      companyName,
      registrationType,
      ptsNumber,
      street,
      city,
      state,
      country,
      postalCode,
    } = body;

    // Validate required fields
    if (!name || !email || !password || !phone || !companyName || !ptsNumber || !street || !city || !country) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email: email.toLowerCase() });
    if (existingAgent) {
      return NextResponse.json(
        { success: false, message: "Agent with this email already exists" },
        { status: 409 }
      );
    }

    // Create new agent
    const agent = await Agent.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      countryCode,
      companyName,
      registrationType,
      ptsNumber,
      businessAddress: {
        street,
        city,
        state,
        country,
        postalCode,
      },
      status: 'pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: "Agent registration submitted successfully. Awaiting admin approval.",
        agent: {
          id: agent._id,
          email: agent.email,
          name: agent.name,
          status: agent.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Agent registration error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
