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
  star: z.number().int().min(1).max(5, "Star rating must be between 1 and 5"),
  description: z.string().trim().optional(),
  distance: z.string().trim().optional(),
  amenities: z.array(z.string().trim()).optional(),
  images: z.array(z.string().trim().url()).optional(),
  availableBedTypes: z.array(z.enum(["single", "double", "twin", "triple", "quad"])).optional(),
  contact: z.object({
    phone: z.string().trim().optional(),
    email: z.string().trim().email().optional().or(z.literal("")),
    address: z.string().trim().optional(),
  }).optional(),
});

// ================= UTILITY =================

export type HotelFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
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

  // Parse contact object
  const contactPhone = str(formData, "contact[phone]");
  const contactEmail = str(formData, "contact[email]");
  const contactAddress = str(formData, "contact[address]");

  const contact = contactPhone || contactEmail || contactAddress
    ? {
        phone: contactPhone || undefined,
        email: contactEmail || undefined,
        address: contactAddress || undefined,
      }
    : undefined;

  return {
    type: str(formData, "type") as HotelType,
    name: str(formData, "name"),
    location: str(formData, "location"),
    star: Number(formData.get("star") || 0),
    description: str(formData, "description") || undefined,
    distance: str(formData, "distance") || undefined,
    amenities: amenities.length > 0 ? amenities : undefined,
    images: images.length > 0 ? images : undefined,
    availableBedTypes: availableBedTypes.length > 0 ? availableBedTypes : undefined,
    contact,
  };
}

// ================= HOTEL CRUD ACTIONS =================

export async function createHotelAction(
  prevState: HotelFormState,
  formData: FormData
): Promise<HotelFormState> {
  await connectToDatabase();
  const parsed = parseHotelFormData(formData);
  const result = hotelSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const hotel = await createHotel(result.data);
    return { data: hotel };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create hotel"] } };
  }
}

export async function updateHotelAction(
  prevState: HotelFormState,
  id: string,
  formData: FormData
): Promise<HotelFormState> {
  await connectToDatabase();
  const parsed = parseHotelFormData(formData);
  const result = hotelSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const hotel = await updateHotel(id, result.data);
    return { data: hotel };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update hotel"] } };
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
