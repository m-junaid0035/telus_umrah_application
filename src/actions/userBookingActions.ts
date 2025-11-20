"use server";

import { connectToDatabase } from "@/lib/db";
import { getUserPackageBookings, getUserHotelBookings, getUserCustomUmrahRequests } from "@/functions/userBookingFunctions";

export async function fetchUserPackageBookingsAction(email: string) {
  try {
    if (!email || typeof email !== 'string') {
      return { error: { message: ["Invalid email address"] } };
    }
    await connectToDatabase();
    const bookings = await getUserPackageBookings(email);
    return { data: bookings || [] };
  } catch (error: any) {
    console.error("fetchUserPackageBookingsAction error:", error);
    return { error: { message: [error?.message || "Failed to fetch package bookings"] } };
  }
}

export async function fetchUserHotelBookingsAction(email: string) {
  try {
    if (!email || typeof email !== 'string') {
      return { error: { message: ["Invalid email address"] } };
    }
    await connectToDatabase();
    const bookings = await getUserHotelBookings(email);
    return { data: bookings || [] };
  } catch (error: any) {
    console.error("fetchUserHotelBookingsAction error:", error);
    return { error: { message: [error?.message || "Failed to fetch hotel bookings"] } };
  }
}

export async function fetchUserCustomUmrahRequestsAction(email: string) {
  try {
    if (!email || typeof email !== 'string') {
      return { error: { message: ["Invalid email address"] } };
    }
    await connectToDatabase();
    const requests = await getUserCustomUmrahRequests(email);
    return { data: requests || [] };
  } catch (error: any) {
    console.error("fetchUserCustomUmrahRequestsAction error:", error);
    return { error: { message: [error?.message || "Failed to fetch custom Umrah requests"] } };
  }
}

