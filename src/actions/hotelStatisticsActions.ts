"use server";

import { connectToDatabase } from "@/lib/db";
import { getHotelStatistics } from "@/functions/hotelStatistics";

export async function fetchHotelStatisticsAction() {
  await connectToDatabase();
  try {
    const statistics = await getHotelStatistics();
    return { data: statistics };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch hotel statistics"] } };
  }
}

