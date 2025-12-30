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
  customerEmail: z.string().trim().email("Valid email is required"),
  customerNationality: z.string().trim().optional(),
  adults: z.array(z.object({
    name: z.string().trim().min(1),
    gender: z.enum(["male", "female", ""]).optional(),
    nationality: z.string().trim().optional(),
    passportNumber: z.string().trim().optional(),
    age: z.number().int().min(0).optional(),
    phone: z.string().trim().optional(),
    isHead: z.boolean().optional(),
  })).optional(),
  children: z.array(z.object({
    name: z.string().trim().min(1),
    gender: z.enum(["male", "female", ""]).optional(),
    nationality: z.string().trim().optional(),
    passportNumber: z.string().trim().optional(),
    age: z.number().int().min(0).max(16).optional(),
  })).optional(),
  infants: z.array(z.object({
    name: z.string().trim().min(1),
    gender: z.enum(["male", "female", ""]).optional(),
    nationality: z.string().trim().optional(),
    passportNumber: z.string().trim().optional(),
    age: z.number().int().min(0).max(2).optional(),
  })).optional(),
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
  // Prefer structured JSON arrays if provided, otherwise look for travelerDetails JSON fallback
  const parseJsonArray = (key: string) => {
    const v = formData.get(key);
    if (!v) return null;
    try {
      const parsed = JSON.parse(String(v));
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  };

  const adults = parseJsonArray("adultsJson") || null;
  const children = parseJsonArray("childrenJson") || null;
  const infants = parseJsonArray("infantsJson") || null;

  // travelerDetails fallback (used by client) may contain adults/children/infants
  const travelerDetailsRaw = formData.get("travelerDetails");
  let travelerDetailsObj: any = null;
  if (travelerDetailsRaw) {
    try {
      travelerDetailsObj = JSON.parse(String(travelerDetailsRaw));
    } catch (e) {
      travelerDetailsObj = null;
    }
  }

  // Determine adults array and set isHead based on travelerDetails.familyHeadIndex if provided
  let adultsArr: any = adults || (travelerDetailsObj?.adults || undefined);
  if (Array.isArray(adultsArr)) {
    const rawHead = travelerDetailsObj?.familyHeadIndex;
    const headIndex = typeof rawHead === "number" ? rawHead : (rawHead != null ? Number(rawHead) : NaN);
    if (!isNaN(headIndex) && headIndex >= 0 && headIndex < adultsArr.length) {
      adultsArr = adultsArr.map((a: any, i: number) => ({ ...(a || {}), isHead: i === headIndex }));
    } else if (!adultsArr.some((a: any) => a && a.isHead)) {
      adultsArr = adultsArr.map((a: any, i: number) => ({ ...(a || {}), isHead: i === 0 }));
    }
  } else {
    adultsArr = undefined;
  }

  const childrenArr = children || (travelerDetailsObj?.children || undefined);
  const infantsArr = infants || (travelerDetailsObj?.infants || undefined);

  return {
    packageId: str(formData, "packageId"),
    customerEmail: str(formData, "customerEmail"),
    customerNationality: str(formData, "customerNationality") || undefined,
    adults: adultsArr,
    children: childrenArr,
    infants: infantsArr,
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
  console.log("Creating package booking...");
  const parsed = parsePackageBookingFormData(formData);
  console.log(parsed);
  const result = packageBookingSchema.safeParse(parsed);
  console.log(result);
  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    console.log("Inserting package booking into database...");
    const booking = await createPackageBooking(result.data);
    console.log(`Package booking created: ${booking._id}`);
    
    // Generate invoice for ALL bookings
    if (booking?._id) {
      try {
        const { generateBookingNumber } = await import('@/lib/utils');
        const { UmrahPackage } = await import('@/models/UmrahPackage');
        const { sendInvoiceEmail } = await import('@/lib/sendInvoiceEmail');

        // Get package details
        await connectToDatabase(); // Ensure DB connection
        const pkg = await UmrahPackage.findById(result.data.packageId).lean();
        const itemName = pkg?.name || 'Umrah Package';

        // Generate invoice number
        const invoiceNumber = generateBookingNumber(booking._id.toString(), 'package');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const invoiceUrl = `${baseUrl}/api/invoice/${booking._id}?type=package`;
        
        // Prepare invoice data - handle dates properly
        const checkInDate = result.data.checkInDate 
          ? (result.data.checkInDate instanceof Date ? result.data.checkInDate : new Date(result.data.checkInDate))
          : undefined;
        const checkOutDate = result.data.checkOutDate 
          ? (result.data.checkOutDate instanceof Date ? result.data.checkOutDate : new Date(result.data.checkOutDate))
          : undefined;
        
        // Determine family head from adults array (if provided)
        const adultsArr = Array.isArray(result.data.adults) ? result.data.adults : [];
        const headAdult = adultsArr.find((a: any) => a.isHead) || adultsArr[0] || null;
        const customerNameForInvoice = headAdult?.name || "";
        const customerPhoneForInvoice = headAdult?.phone || "";

        const invoiceData = {
          invoiceNumber,
          bookingId: booking._id.toString(),
          bookingType: 'package' as const,
          customerName: customerNameForInvoice,
          customerEmail: result.data.customerEmail,
          customerPhone: customerPhoneForInvoice,
          customerNationality: result.data.customerNationality,
          bookingDate: booking.createdAt ? new Date(booking.createdAt) : new Date(),
          checkInDate,
          checkOutDate,
          itemName,
          totalAmount: result.data.totalAmount || 0,
          paymentMethod: result.data.paymentMethod || 'cash',
          adults: result.data.adults || [],
          children: result.data.children || [],
          infants: result.data.infants || [],
          rooms: result.data.rooms,
          additionalServices: [
            ...(result.data.umrahVisa ? ['Umrah Visa'] : []),
            ...(result.data.transport ? ['Transport'] : []),
            ...(result.data.zaiarat ? ['Zaiarat Tours'] : []),
            ...(result.data.meals ? ['Meals'] : []),
            ...(result.data.esim ? ['eSIM'] : []),
          ],
        };
        
        // Update booking with invoice info
        // PDF will be generated on-demand when user clicks download (avoids font errors during booking)
        await updatePackageBooking(booking._id.toString(), {
          invoiceGenerated: true,
          invoiceNumber,
          invoiceUrl,
        });
        
        console.log(`Invoice generated for package booking ${booking._id}: ${invoiceNumber}`);
        
        // Send invoice email to ALL bookings (with PDF attached)
        try {
          console.log(`Attempting to send invoice email to ${result.data.customerEmail}...`);
          const emailResult = await sendInvoiceEmail({
            to: result.data.customerEmail,
            customerName: customerNameForInvoice,
            invoiceNumber,
            bookingType: 'package',
            invoiceUrl,
            bookingId: booking._id.toString(),
          });
          
          // Update booking with invoice sent status if email was sent successfully
          if (emailResult.success) {
            await updatePackageBooking(booking._id.toString(), {
              invoiceSent: true,
            });
            console.log(`✅ Invoice email sent successfully to ${result.data.customerEmail}`);
          } else {
            console.error('❌ Failed to send invoice email:', emailResult.error);
          }
        } catch (emailError: any) {
          console.error('❌ Error sending invoice email:', emailError);
          // Don't fail the booking if email fails
        }
      } catch (invoiceError: any) {
        console.error('Error generating/sending invoice:', invoiceError);
        // Don't fail the booking if invoice generation fails
      }
    }
    
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
    console.log(`Fetched package booking: ${booking}`);
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

