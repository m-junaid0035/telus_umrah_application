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
    
    // Generate invoice for ALL bookings
    if (booking?._id) {
      try {
        const { generateInvoiceNumber, generateInvoicePDF } = await import('@/lib/generateInvoice');
        const { UmrahPackage } = await import('@/models/UmrahPackage');
        const { sendInvoiceEmail } = await import('@/lib/sendInvoiceEmail');
        
        // Get package details
        await connectToDatabase(); // Ensure DB connection
        const pkg = await UmrahPackage.findById(result.data.packageId).lean();
        const itemName = pkg?.name || 'Umrah Package';
        
        // Generate invoice number
        const invoiceNumber = generateInvoiceNumber(booking._id.toString(), 'package');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const invoiceUrl = `${baseUrl}/api/invoice/${booking._id}?type=package`;
        
        // Prepare invoice data - handle dates properly
        const checkInDate = result.data.checkInDate 
          ? (result.data.checkInDate instanceof Date ? result.data.checkInDate : new Date(result.data.checkInDate))
          : undefined;
        const checkOutDate = result.data.checkOutDate 
          ? (result.data.checkOutDate instanceof Date ? result.data.checkOutDate : new Date(result.data.checkOutDate))
          : undefined;
        
        const invoiceData = {
          invoiceNumber,
          bookingId: booking._id.toString(),
          bookingType: 'package' as const,
          customerName: result.data.customerName,
          customerEmail: result.data.customerEmail,
          customerPhone: result.data.customerPhone,
          customerNationality: result.data.customerNationality,
          bookingDate: booking.createdAt ? new Date(booking.createdAt) : new Date(),
          checkInDate,
          checkOutDate,
          itemName,
          totalAmount: result.data.totalAmount || 0,
          paymentMethod: result.data.paymentMethod || 'cash',
          travelers: result.data.travelers,
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
            customerName: result.data.customerName,
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

