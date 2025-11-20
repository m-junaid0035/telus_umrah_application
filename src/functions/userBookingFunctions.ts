"use server";

import { connectToDatabase } from "@/lib/db";
import { PackageBooking } from "@/models/PackageBooking";
import { HotelBooking } from "@/models/HotelBooking";
import { CustomUmrahRequest } from "@/models/CustomUmrahRequest";
import { UmrahPackage } from "@/models/UmrahPackage";
import { Hotel } from "@/models/Hotel";
import { serializePackageBooking } from "./packageBookingFunctions";
import { serializeHotelBooking } from "./hotelBookingFunctions";
import { serializeCustomUmrahRequest } from "./customUmrahRequestFunctions";

/**
 * Get all package bookings for a user by email
 */
export const getUserPackageBookings = async (email: string) => {
  try {
    await connectToDatabase();
    if (!email || typeof email !== 'string') {
      console.error("Invalid email provided:", email);
      return [];
    }
    const bookings = await PackageBooking.find({ customerEmail: email.toLowerCase().trim() })
      .sort({ createdAt: -1 })
      .lean();
    
    if (!bookings || bookings.length === 0) {
      return [];
    }
    
    // Populate package names
    const bookingsWithPackageNames = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const pkg = await UmrahPackage.findById(booking.packageId).lean();
          return {
            ...booking,
            packageName: pkg?.name,
          };
        } catch (error) {
          console.error("Error fetching package:", error);
          return {
            ...booking,
            packageName: undefined,
          };
        }
      })
    );
    
    return bookingsWithPackageNames
      .map(serializePackageBooking)
      .filter((booking) => booking !== null);
  } catch (error: any) {
    console.error("Error in getUserPackageBookings:", error);
    return [];
  }
};

/**
 * Get all hotel bookings for a user by email
 */
export const getUserHotelBookings = async (email: string) => {
  try {
    await connectToDatabase();
    if (!email || typeof email !== 'string') {
      console.error("Invalid email provided:", email);
      return [];
    }
    const bookings = await HotelBooking.find({ customerEmail: email.toLowerCase().trim() })
      .sort({ createdAt: -1 })
      .lean();
    
    if (!bookings || bookings.length === 0) {
      return [];
    }
    
    // Populate hotel names
    const bookingsWithHotelNames = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const hotel = await Hotel.findById(booking.hotelId).lean();
          return {
            ...booking,
            hotelName: hotel?.name || booking.hotelName,
          };
        } catch (error) {
          console.error("Error fetching hotel:", error);
          return {
            ...booking,
            hotelName: booking.hotelName,
          };
        }
      })
    );
    
    return bookingsWithHotelNames
      .map(serializeHotelBooking)
      .filter((booking) => booking !== null);
  } catch (error: any) {
    console.error("Error in getUserHotelBookings:", error);
    return [];
  }
};

/**
 * Get all custom Umrah requests for a user by email
 */
export const getUserCustomUmrahRequests = async (email: string) => {
  try {
    await connectToDatabase();
    if (!email || typeof email !== 'string') {
      console.error("Invalid email provided:", email);
      return [];
    }
    const requests = await CustomUmrahRequest.find({ email: email.toLowerCase().trim() })
      .sort({ createdAt: -1 })
      .lean();
    
    if (!requests || requests.length === 0) {
      return [];
    }
    
    return requests
      .map(serializeCustomUmrahRequest)
      .filter((request) => request !== null);
  } catch (error: any) {
    console.error("Error in getUserCustomUmrahRequests:", error);
    return [];
  }
};

