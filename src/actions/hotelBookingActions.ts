"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createHotelBooking,
  getAllHotelBookings,
  getHotelBookingById,
  updateHotelBooking,
  deleteHotelBooking,
  getHotelBookingsByStatus,
} from "@/functions/hotelBookingFunctions";
import { HotelBookingStatus } from "@/models/HotelBooking";

// ================= SCHEMAS =================

const hotelBookingSchema = z.object({
  hotelId: z.string().trim().min(1, "Hotel ID is required"),
  hotelName: z.string().trim().optional(),
  customerName: z.string().trim().min(2, "Customer name is required"),
  customerEmail: z.string().trim().email("Valid email is required"),
  customerPhone: z.string().trim().min(5, "Phone is required"),
  customerNationality: z.string().trim().optional(),
  checkInDate: z.string().or(z.date()),
  checkOutDate: z.string().or(z.date()),
  rooms: z.number().int().min(1, "At least one room is required"),
  adults: z.number().int().min(1, "At least one adult is required"),
  children: z.number().int().min(0).optional(),
  childAges: z.array(z.number().int().min(0).max(16)).optional(),
  bedType: z.enum(["single", "double", "twin", "triple", "quad"]).optional(),
  meals: z.boolean().optional(),
  transport: z.boolean().optional(),
  status: z.nativeEnum(HotelBookingStatus).optional(),
  notes: z.string().trim().optional(),
  totalAmount: z.number().optional(),
  paidAmount: z.number().optional(),
  paymentStatus: z.enum(["pending", "partial", "paid"]).optional(),
});

// ================= UTILITY =================

export type HotelBookingFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseHotelBookingFormData(formData: FormData) {
  // Parse child ages array
  const childAges: number[] = [];
  const childAgesStr = formData.getAll("childAges");
  childAgesStr.forEach((age) => {
    const num = Number(age);
    if (!isNaN(num)) childAges.push(num);
  });

  return {
    hotelId: str(formData, "hotelId"),
    hotelName: str(formData, "hotelName"),
    customerName: str(formData, "customerName"),
    customerEmail: str(formData, "customerEmail"),
    customerPhone: str(formData, "customerPhone"),
    customerNationality: str(formData, "customerNationality") || undefined,
    checkInDate: str(formData, "checkInDate"),
    checkOutDate: str(formData, "checkOutDate"),
    rooms: Number(formData.get("rooms") || 1),
    adults: Number(formData.get("adults") || 1),
    children: Number(formData.get("children") || 0),
    childAges: childAges.length > 0 ? childAges : undefined,
    bedType: str(formData, "bedType") || undefined,
    meals: formData.get("meals") === "true",
    transport: formData.get("transport") === "true",
    status: str(formData, "status") || HotelBookingStatus.Pending,
    notes: str(formData, "notes") || undefined,
    totalAmount: formData.get("totalAmount") ? Number(formData.get("totalAmount")) : undefined,
    paidAmount: formData.get("paidAmount") ? Number(formData.get("paidAmount") || 0) : undefined,
    paymentStatus: str(formData, "paymentStatus") || "pending",
  };
}

// ================= HOTEL BOOKING CRUD ACTIONS =================

export async function createHotelBookingAction(
  prevState: HotelBookingFormState,
  formData: FormData
): Promise<HotelBookingFormState> {
  try {
    await connectToDatabase();
    const parsed = parseHotelBookingFormData(formData);
    console.log("Parsed hotel booking data:", parsed);
    
    const result = hotelBookingSchema.safeParse(parsed);

    if (!result.success) {
      console.error("Hotel booking validation error:", result.error.flatten().fieldErrors);
      return { error: result.error.flatten().fieldErrors };
    }

    console.log("Creating hotel booking with data:", result.data);
    const booking = await createHotelBooking(result.data);
    console.log("Hotel booking created successfully:", booking);
    return { data: booking };
  } catch (error: any) {
    console.error("Hotel booking creation error:", error);
    return { error: { message: [error?.message || "Failed to create booking"] } };
  }
}

export async function updateHotelBookingAction(
  prevState: HotelBookingFormState,
  id: string,
  formData: FormData
): Promise<HotelBookingFormState> {
  await connectToDatabase();
  const parsed = parseHotelBookingFormData(formData);
  const result = hotelBookingSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const booking = await updateHotelBooking(id, result.data);
    return { data: booking };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update booking"] } };
  }
}

export async function deleteHotelBookingAction(id: string) {
  await connectToDatabase();
  try {
    const booking = await deleteHotelBooking(id);
    return { data: booking };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete booking"] } };
  }
}

export async function fetchAllHotelBookingsAction() {
  try {
    await connectToDatabase();
    console.log("fetchAllHotelBookingsAction - Fetching bookings...");
    const bookings = await getAllHotelBookings();
    console.log("fetchAllHotelBookingsAction - Fetched bookings count:", bookings?.length || 0);
    console.log("fetchAllHotelBookingsAction - Sample booking:", bookings?.[0]);
    return { data: bookings };
  } catch (error: any) {
    console.error("fetchAllHotelBookingsAction - Error:", error);
    return { error: { message: [error?.message || "Failed to fetch bookings"] } };
  }
}

export async function fetchHotelBookingByIdAction(id: string) {
  await connectToDatabase();
  try {
    const booking = await getHotelBookingById(id);
    if (!booking) return { error: { message: ["Booking not found"] } };
    return { data: booking };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch booking"] } };
  }
}

// ================= FILTER ACTIONS =================

export async function fetchHotelBookingsByStatusAction(status: string) {
  await connectToDatabase();
  try {
    const bookings = await getHotelBookingsByStatus(status);
    return { data: bookings };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch bookings by status"] } };
  }
}

