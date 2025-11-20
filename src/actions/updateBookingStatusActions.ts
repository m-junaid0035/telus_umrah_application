"use server";

import { connectToDatabase } from "@/lib/db";
import { PackageBooking, BookingStatus } from "@/models/PackageBooking";
import { HotelBooking, HotelBookingStatus } from "@/models/HotelBooking";
import { CustomUmrahRequest } from "@/models/CustomUmrahRequest";
import { serializePackageBooking } from "@/functions/packageBookingFunctions";
import { serializeHotelBooking } from "@/functions/hotelBookingFunctions";

export async function updatePackageBookingStatusAction(
  id: string,
  status: string
) {
  await connectToDatabase();
  try {
    if (!Object.values(BookingStatus).includes(status as BookingStatus)) {
      return { error: { message: "Invalid status" } };
    }
    const booking = await PackageBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    if (!booking) return { error: { message: ["Booking not found"] } };
    return { data: serializePackageBooking(booking) };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update booking status"] } };
  }
}

export async function updateHotelBookingStatusAction(
  id: string,
  status: string
) {
  await connectToDatabase();
  try {
    if (!Object.values(HotelBookingStatus).includes(status as HotelBookingStatus)) {
      return { error: { message: "Invalid status" } };
    }
    const booking = await HotelBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    if (!booking) return { error: { message: ["Booking not found"] } };
    return { data: serializeHotelBooking(booking) };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update booking status"] } };
  }
}

export async function updateCustomUmrahRequestStatusAction(
  id: string,
  status: string
) {
  await connectToDatabase();
  try {
    const validStatuses = ["pending", "in-progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return { error: { message: "Invalid status" } };
    }
    const request = await CustomUmrahRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    if (!request) return { error: { message: ["Request not found"] } };
    
    // Serialize the request to convert ObjectId and Date objects to plain values
    const serialized = {
      _id: String(request._id),
      name: request.name,
      email: request.email,
      phone: request.phone,
      nationality: request.nationality,
      from: request.from,
      to: request.to,
      departDate: request.departDate instanceof Date ? request.departDate.toISOString() : request.departDate,
      returnDate: request.returnDate instanceof Date ? request.returnDate.toISOString() : request.returnDate,
      airline: request.airline,
      airlineClass: request.airlineClass,
      adults: request.adults,
      children: request.children,
      childAges: Array.isArray(request.childAges) ? request.childAges : [],
      rooms: request.rooms,
      umrahVisa: request.umrahVisa,
      transport: request.transport,
      zaiarat: request.zaiarat,
      meals: request.meals,
      esim: request.esim,
      hotels: Array.isArray(request.hotels) ? request.hotels.map((h: any) => ({
        hotelClass: String(h.hotelClass),
        hotel: String(h.hotel),
        stayDuration: String(h.stayDuration),
        bedType: String(h.bedType),
        city: String(h.city),
      })) : [],
      status: request.status || "pending",
      notes: request.notes || undefined,
      paymentMethod: request.paymentMethod,
      createdAt: request.createdAt instanceof Date ? request.createdAt.toISOString() : request.createdAt,
      updatedAt: request.updatedAt instanceof Date ? request.updatedAt.toISOString() : request.updatedAt,
    };
    
    return { data: serialized };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update request status"] } };
  }
}

