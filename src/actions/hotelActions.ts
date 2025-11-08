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
  return {
    type: str(formData, "type") as HotelType,
    name: str(formData, "name"),
    location: str(formData, "location"),
    star: Number(formData.get("star") || 0),
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
