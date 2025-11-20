"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createPackageBooking,
  getAllPackageBookings,
  getPackageBookingById,
  updatePackageBooking,
  deletePackageBooking,
  getPackageBookingsByStatus,
} from "@/functions/packageBookingFunctions";
import { BookingStatus } from "@/models/PackageBooking";

// ================= SCHEMAS =================

const packageBookingSchema = z.object({
  packageId: z.string().trim().min(1, "Package ID is required"),
  customerName: z.string().trim().min(2, "Customer name is required"),
  customerEmail: z.string().trim().email("Valid email is required"),
  customerPhone: z.string().trim().min(5, "Phone is required"),
  customerNationality: z.string().trim().optional(),
  travelers: z.object({
    adults: z.number().int().min(1, "At least one adult is required"),
    children: z.number().int().min(0).optional(),
    childAges: z.array(z.number().int().min(0).max(16)).optional(),
  }),
  rooms: z.number().int().min(1, "At least one room is required"),
  checkInDate: z.string().or(z.date()).optional(),
  checkOutDate: z.string().or(z.date()).optional(),
  umrahVisa: z.boolean().optional(),
  transport: z.boolean().optional(),
  zaiarat: z.boolean().optional(),
  meals: z.boolean().optional(),
  esim: z.boolean().optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  notes: z.string().trim().optional(),
  totalAmount: z.number().optional(),
  paidAmount: z.number().optional(),
  paymentStatus: z.enum(["pending", "partial", "paid"]).optional(),
  paymentMethod: z.enum(["cash", "online"]).optional(),
});

// ================= UTILITY =================

export type PackageBookingFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parsePackageBookingFormData(formData: FormData) {
  // Parse child ages array
  const childAges: number[] = [];
  const childAgesStr = formData.getAll("childAges");
  childAgesStr.forEach((age) => {
    const num = Number(age);
    if (!isNaN(num)) childAges.push(num);
  });

  return {
    packageId: str(formData, "packageId"),
    customerName: str(formData, "customerName"),
    customerEmail: str(formData, "customerEmail"),
    customerPhone: str(formData, "customerPhone"),
    customerNationality: str(formData, "customerNationality") || undefined,
    travelers: {
      adults: Number(formData.get("adults") || 1),
      children: Number(formData.get("children") || 0),
      childAges: childAges.length > 0 ? childAges : undefined,
    },
    rooms: Number(formData.get("rooms") || 1),
    checkInDate: str(formData, "checkInDate") || undefined,
    checkOutDate: str(formData, "checkOutDate") || undefined,
    umrahVisa: formData.get("umrahVisa") === "true",
    transport: formData.get("transport") === "true",
    zaiarat: formData.get("zaiarat") === "true",
    meals: formData.get("meals") === "true",
    esim: formData.get("esim") === "true",
    status: str(formData, "status") || BookingStatus.Pending,
    notes: str(formData, "notes") || undefined,
    totalAmount: formData.get("totalAmount") ? Number(formData.get("totalAmount")) : undefined,
    paidAmount: formData.get("paidAmount") ? Number(formData.get("paidAmount") || 0) : undefined,
    paymentStatus: str(formData, "paymentStatus") || "pending",
    paymentMethod: str(formData, "paymentMethod") || undefined,
  };
}

// ================= PACKAGE BOOKING CRUD ACTIONS =================

export async function createPackageBookingAction(
  prevState: PackageBookingFormState,
  formData: FormData
): Promise<PackageBookingFormState> {
  await connectToDatabase();
  const parsed = parsePackageBookingFormData(formData);
  const result = packageBookingSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const booking = await createPackageBooking(result.data);
    return { data: booking };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create booking"] } };
  }
}

export async function updatePackageBookingAction(
  prevState: PackageBookingFormState,
  id: string,
  formData: FormData
): Promise<PackageBookingFormState> {
  await connectToDatabase();
  const parsed = parsePackageBookingFormData(formData);
  const result = packageBookingSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const booking = await updatePackageBooking(id, result.data);
    return { data: booking };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update booking"] } };
  }
}

export async function deletePackageBookingAction(id: string) {
  await connectToDatabase();
  try {
    const booking = await deletePackageBooking(id);
    return { data: booking };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete booking"] } };
  }
}

export async function fetchAllPackageBookingsAction() {
  await connectToDatabase();
  try {
    const bookings = await getAllPackageBookings();
    return { data: bookings };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch bookings"] } };
  }
}

export async function fetchPackageBookingByIdAction(id: string) {
  await connectToDatabase();
  try {
    const booking = await getPackageBookingById(id);
    if (!booking) return { error: { message: ["Booking not found"] } };
    return { data: booking };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch booking"] } };
  }
}

// ================= FILTER ACTIONS =================

export async function fetchPackageBookingsByStatusAction(status: string) {
  await connectToDatabase();
  try {
    const bookings = await getPackageBookingsByStatus(status);
    return { data: bookings };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch bookings by status"] } };
  }
}

