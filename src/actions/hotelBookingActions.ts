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
  roomType: z.enum(["standard", "deluxe", "family"]).optional(),
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
    roomType: str(formData, "roomType") || "standard", // Default to standard if not provided
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
    
    const result = hotelBookingSchema.safeParse(parsed);

    if (!result.success) {
      return { error: result.error.flatten().fieldErrors };
    }

    // Calculate total amount based on room type, dates, and services
    let calculatedTotal = 0;
    if (result.data.checkInDate && result.data.checkOutDate) {
      const { Hotel } = await import('@/models/Hotel');
      const hotel = await Hotel.findById(result.data.hotelId).lean();
      
      if (hotel) {
        const checkIn = new Date(result.data.checkInDate);
        const checkOut = new Date(result.data.checkOutDate);
        const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
        
        // Get room price based on roomType (default to standard if not provided)
        const roomType = result.data.roomType || 'standard';
        let roomPricePerNight = 0;
        if (roomType === 'deluxe' && hotel.deluxeRoomPrice && hotel.deluxeRoomPrice > 0) {
          roomPricePerNight = hotel.deluxeRoomPrice;
        } else if (roomType === 'family' && hotel.familySuitPrice && hotel.familySuitPrice > 0) {
          roomPricePerNight = hotel.familySuitPrice;
        } else if (hotel.standardRoomPrice && hotel.standardRoomPrice > 0) {
          roomPricePerNight = hotel.standardRoomPrice;
        }
        
        calculatedTotal = roomPricePerNight * nights * (result.data.rooms || 1);
        
        // Add meals - use hotel price or default 5000 PKR per room per night
        if (result.data.meals) {
          const mealsPrice = hotel.mealsPrice || 5000; // Default 5000 PKR if not set
          const mealsCost = mealsPrice * nights * (result.data.rooms || 1);
          calculatedTotal += mealsCost;
        }
        
        // Add transport - use hotel price or default 10000 PKR
        if (result.data.transport) {
          const transportPrice = hotel.transportPrice || 10000; // Default 10000 PKR if not set
          calculatedTotal += transportPrice;
        }
      }
    }
    
    // Add calculated total to booking data
    result.data.totalAmount = calculatedTotal > 0 ? calculatedTotal : result.data.totalAmount;
    
    const booking = await createHotelBooking(result.data);
    
    // Generate invoice for ALL bookings
    if (booking?._id) {
      try {
        const { generateInvoiceNumber, generateInvoicePDF } = await import('@/lib/generateInvoice');
        const { Hotel } = await import('@/models/Hotel');
        const { sendInvoiceEmail } = await import('@/lib/sendInvoiceEmail');
        
        // Get hotel details
        await connectToDatabase(); // Ensure DB connection
        const hotel = await Hotel.findById(result.data.hotelId).lean();
        const itemName = hotel?.name || result.data.hotelName || 'Hotel Booking';
        
        // Generate invoice number
        const invoiceNumber = generateInvoiceNumber(booking._id.toString(), 'hotel');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const invoiceUrl = `${baseUrl}/api/invoice/${booking._id}?type=hotel`;
        
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
          bookingType: 'hotel' as const,
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
          rooms: result.data.rooms,
          additionalServices: [
            ...(result.data.meals ? ['Meals'] : []),
            ...(result.data.transport ? ['Transport'] : []),
          ],
        };
        
        // Update booking with invoice info
        // PDF will be generated on-demand when user clicks download (avoids font errors during booking)
        await updateHotelBooking(booking._id.toString(), {
          invoiceGenerated: true,
          invoiceNumber,
          invoiceUrl,
        });
        
        // Send invoice email to ALL bookings (with PDF attached)
        try {
          const emailResult = await sendInvoiceEmail({
            to: result.data.customerEmail,
            customerName: result.data.customerName,
            invoiceNumber,
            bookingType: 'hotel',
            invoiceUrl,
            bookingId: booking._id.toString(),
          });
          
          // Update booking with invoice sent status if email was sent successfully
          if (emailResult.success) {
            await updateHotelBooking(booking._id.toString(), {
              invoiceSent: true,
            });
          }
        } catch (emailError: any) {
          // Don't fail the booking if email fails
        }
      } catch (invoiceError: any) {
        // Don't fail the booking if invoice generation fails
      }
    }
    
    return { data: booking };
  } catch (error: any) {
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
    const bookings = await getAllHotelBookings();
    return { data: bookings };
  } catch (error: any) {
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

