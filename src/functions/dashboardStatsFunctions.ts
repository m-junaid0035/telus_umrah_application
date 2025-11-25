"use server";

import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { UmrahPackage } from "@/models/UmrahPackage";
import { Hotel } from "@/models/Hotel";
import { PackageBooking } from "@/models/PackageBooking";
import { HotelBooking } from "@/models/HotelBooking";
import { CustomUmrahRequest } from "@/models/CustomUmrahRequest";

/**
 * Get lightweight dashboard statistics (only counts, no full data)
 */
export const getDashboardStats = async () => {
  await connectToDatabase();
  
  // Use countDocuments for fast queries (no data fetching)
  const [
    totalUsers,
    totalPackages,
    totalHotels,
    totalPackageBookings,
    totalHotelBookings,
    totalCustomRequests,
  ] = await Promise.all([
    User.countDocuments(),
    UmrahPackage.countDocuments(),
    Hotel.countDocuments(),
    PackageBooking.countDocuments(),
    HotelBooking.countDocuments(),
    CustomUmrahRequest.countDocuments(),
  ]);

  return {
    totalUsers,
    totalPackages,
    totalHotels,
    totalPackageBookings,
    totalHotelBookings,
    totalCustomRequests,
  };
};

