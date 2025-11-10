"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createItinerary,
  getAllItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  getItinerariesByKeyword,
} from "@/functions/itinerariesFunctions";

// ================= SCHEMAS =================

const itinerarySchema = z.object({
  day_start: z.number().int().min(1, "Day start is required"),
  day_end: z.number().int().optional(),
  title: z.string().trim().min(2, "Title is required"),
  description: z.string().trim().min(2, "Description is required"),
});

// ================= UTILITY =================

export type ItineraryFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function num(formData: FormData, key: string) {
  const v = formData.get(key);
  return v != null ? Number(v) : undefined;
}

function parseItineraryFormData(formData: FormData) {
  return {
    day_start: num(formData, "day_start") || 1,
    day_end: num(formData, "day_end"),
    title: str(formData, "title"),
    description: str(formData, "description"),
  };
}

// ================= ITINERARY CRUD ACTIONS =================

export async function createItineraryAction(
  prevState: ItineraryFormState,
  formData: FormData
): Promise<ItineraryFormState> {
  await connectToDatabase();
  const parsed = parseItineraryFormData(formData);
  const result = itinerarySchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const itinerary = await createItinerary(result.data);
    return { data: itinerary };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create itinerary"] } };
  }
}

export async function updateItineraryAction(
  prevState: ItineraryFormState,
  id: string,
  formData: FormData
): Promise<ItineraryFormState> {
  await connectToDatabase();
  const parsed = parseItineraryFormData(formData);
  const result = itinerarySchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const itinerary = await updateItinerary(id, result.data);
    return { data: itinerary };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update itinerary"] } };
  }
}

export async function deleteItineraryAction(id: string) {
  await connectToDatabase();
  try {
    const itinerary = await deleteItinerary(id);
    return { data: itinerary };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete itinerary"] } };
  }
}

export async function fetchAllItinerariesAction() {
  await connectToDatabase();
  try {
    const itineraries = await getAllItineraries();
    return { data: itineraries };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch itineraries"] } };
  }
}

export async function fetchItineraryByIdAction(id: string) {
  await connectToDatabase();
  try {
    const itinerary = await getItineraryById(id);
    if (!itinerary) return { error: { message: ["Itinerary not found"] } };
    return { data: itinerary };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch itinerary"] } };
  }
}

// ================= FILTER / SEARCH ACTIONS =================

export async function fetchItinerariesByKeywordAction(keyword: string) {
  await connectToDatabase();
  try {
    const itineraries = await getItinerariesByKeyword(keyword);
    return { data: itineraries };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch itineraries by keyword"] } };
  }
}
