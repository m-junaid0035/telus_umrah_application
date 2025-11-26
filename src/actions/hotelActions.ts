"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  getHotelsByType,
  getHotelsByStar,
} from "@/functions/hotelFunctions";
import { HotelType } from "@/models/Hotel";

// ================= SCHEMAS =================

const hotelSchema = z.object({
  type: z.nativeEnum(HotelType),
  name: z.string().trim().min(2, "Hotel name is required"),
  location: z.string().trim().min(2, "Hotel location is required"),
  star: z.number().int().min(3).max(5, "Star rating must be between 3 and 5"),
  description: z.string().trim().optional(),
  distance: z.string().trim().optional(),
  amenities: z.array(z.string().trim()).optional(),
  images: z.array(z.string().trim().url()).optional(),
  availableBedTypes: z.array(z.enum(["single", "double", "twin", "triple", "quad"])).optional(),
  standardRoomPrice: z.number().min(0, "Price must be non-negative").optional(),
  deluxeRoomPrice: z.number().min(0, "Price must be non-negative").optional(),
  familySuitPrice: z.number().min(0, "Price must be non-negative").optional(),
  transportPrice: z.number().min(0, "Transport price must be non-negative").optional(),
  mealsPrice: z.number().min(0, "Meals price must be non-negative").optional(),
  contact: z.object({
    phone: z.string()
      .refine((val) => {
        // Allow undefined, empty string, or valid phone (already cleaned in parsing)
        if (!val || val === "") return true;
        // Phone is already cleaned (digits only) from parsing, just check length
        return val.length >= 10 && val.length <= 15;
      }, {
        message: "Phone number must be 10-15 digits"
      })
      .optional()
      .or(z.literal("")),
    email: z.string().trim().email().optional().or(z.literal("")),
    address: z.string().trim().optional(),
  }).optional(),
});

// ================= UTILITY =================

export type HotelFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
  formData?: any; // Preserve form data when validation fails
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseHotelFormData(formData: FormData) {
  // Parse arrays from FormData
  const amenities = formData.getAll("amenities").filter((v) => v && String(v).trim()) as string[];
  const images = formData.getAll("images").filter((v) => v && String(v).trim()) as string[];
  const availableBedTypes = formData.getAll("availableBedTypes").filter((v) => v && String(v).trim()) as string[];

  // Parse contact object - keep phone as string, remove non-digits for validation
  const contactPhoneStr = str(formData, "contact[phone]");
  // Remove all non-digit characters for clean phone number storage
  // Only set phone if it has digits after cleaning (length > 0)
  const cleanedPhone = contactPhoneStr ? contactPhoneStr.replace(/\D/g, "") : "";
  const contactPhone = cleanedPhone.length > 0 ? cleanedPhone : undefined;
  const contactEmail = str(formData, "contact[email]");
  const contactAddress = str(formData, "contact[address]");

  const contact = contactPhone || contactEmail || contactAddress
    ? {
        phone: contactPhone,
        email: contactEmail || undefined,
        address: contactAddress || undefined,
      }
    : undefined;

  // Parse type - will be validated by schema
  const typeStr = str(formData, "type");
  const type = typeStr as HotelType;

  // Parse price fields - handle empty strings and convert to numbers
  const standardRoomPriceStr = str(formData, "standardRoomPrice");
  const standardRoomPrice = standardRoomPriceStr && standardRoomPriceStr.trim() !== "" 
    ? Number(standardRoomPriceStr) 
    : undefined;
  const deluxeRoomPriceStr = str(formData, "deluxeRoomPrice");
  const deluxeRoomPrice = deluxeRoomPriceStr && deluxeRoomPriceStr.trim() !== "" 
    ? Number(deluxeRoomPriceStr) 
    : undefined;
  const familySuitPriceStr = str(formData, "familySuitPrice");
  const familySuitPrice = familySuitPriceStr && familySuitPriceStr.trim() !== "" 
    ? Number(familySuitPriceStr) 
    : undefined;
  const transportPriceStr = str(formData, "transportPrice");
  const transportPrice = transportPriceStr && transportPriceStr.trim() !== "" 
    ? Number(transportPriceStr) 
    : undefined;
  const mealsPriceStr = str(formData, "mealsPrice");
  const mealsPrice = mealsPriceStr && mealsPriceStr.trim() !== "" 
    ? Number(mealsPriceStr) 
    : undefined;

  return {
    type: type,
    name: str(formData, "name"),
    location: str(formData, "location"),
    star: Number(formData.get("star") || 0),
    description: str(formData, "description") || undefined,
    distance: str(formData, "distance") || undefined,
    amenities: amenities.length > 0 ? amenities : undefined,
    images: images.length > 0 ? images : undefined,
    availableBedTypes: availableBedTypes.length > 0 ? availableBedTypes : undefined,
    standardRoomPrice: standardRoomPrice && standardRoomPrice > 0 ? standardRoomPrice : undefined,
    deluxeRoomPrice: deluxeRoomPrice && deluxeRoomPrice > 0 ? deluxeRoomPrice : undefined,
    familySuitPrice: familySuitPrice && familySuitPrice > 0 ? familySuitPrice : undefined,
    transportPrice: transportPrice && transportPrice > 0 ? transportPrice : undefined,
    mealsPrice: mealsPrice && mealsPrice > 0 ? mealsPrice : undefined,
    contact,
  };
}

// ================= HOTEL CRUD ACTIONS =================

export async function createHotelAction(
  prevState: HotelFormState,
  formData: FormData
): Promise<HotelFormState> {
  await connectToDatabase();
  // Parse form data (phone is already cleaned as string)
  const parsed = parseHotelFormData(formData);
  const result = hotelSchema.safeParse(parsed);

  if (!result.success) {
    // Return errors along with parsed form data to preserve user input
    return { 
      error: result.error.flatten().fieldErrors,
      formData: parsed 
    };
  }

  try {
    const hotel = await createHotel(result.data);
    return { data: hotel };
  } catch (error: any) {
    // On database error, also preserve form data
    return { 
      error: { message: [error?.message || "Failed to create hotel"] },
      formData: parsed 
    };
  }
}

export async function updateHotelAction(
  prevState: HotelFormState,
  id: string,
  formData: FormData
): Promise<HotelFormState> {
  await connectToDatabase();
  // Parse form data (phone is already cleaned as string)
  const parsed = parseHotelFormData(formData);
  const result = hotelSchema.safeParse(parsed);

  if (!result.success) {
    // Return errors along with parsed form data to preserve user input
    return { 
      error: result.error.flatten().fieldErrors,
      formData: parsed 
    };
  }

  try {
    const hotel = await updateHotel(id, result.data);
    return { data: hotel };
  } catch (error: any) {
    // On database error, also preserve form data
    return { 
      error: { message: [error?.message || "Failed to update hotel"] },
      formData: parsed 
    };
  }
}

export async function deleteHotelAction(id: string) {
  await connectToDatabase();
  try {
    const hotel = await deleteHotel(id);
    return { data: hotel };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete hotel"] } };
  }
}

export async function fetchAllHotelsAction() {
  await connectToDatabase();
  try {
    const hotels = await getAllHotels();
    return { data: hotels };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch hotels"] } };
  }
}

export async function fetchHotelByIdAction(id: string) {
  await connectToDatabase();
  try {
    const hotel = await getHotelById(id);
    if (!hotel) return { error: { message: ["Hotel not found"] } };
    return { data: hotel };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch hotel"] } };
  }
}

// ================= FILTER ACTIONS =================

export async function fetchHotelsByTypeAction(type: HotelType) {
  await connectToDatabase();
  try {
    const hotels = await getHotelsByType(type);
    return { data: hotels };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch hotels by type"] } };
  }
}

export async function fetchHotelsByStarAction(minStar: number) {
  await connectToDatabase();
  try {
    const hotels = await getHotelsByStar(minStar);
    return { data: hotels };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch hotels by star rating"] } };
  }
}
