"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createUmrahPackage,
  getAllUmrahPackages,
  getUmrahPackageById,
  updateUmrahPackage,
  deleteUmrahPackage,
  getUmrahPackagesByKeyword,
} from "@/functions/packageFunction"; // ✅ make sure path is correct

// ================= SCHEMAS =================

const umrahPackageSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  duration: z.number().min(1, "Duration must be greater than 0"),
  badge: z.string().trim().optional(),
  airline: z.string().trim().min(2, "Airline is required"),
  departureCity: z.string().trim().min(2, "Departure City is required"),
  image: z.string().trim().url().optional(),
  popular: z.boolean().optional(),
  hotels: z.object({
    makkah: z.string().trim().min(1, "Makkah hotel is required"),
    madinah: z.string().trim().min(1, "Madinah hotel is required"),
  }),
  features: z.array(z.string()).optional(),
  travelers: z.string().trim().optional(),
  rating: z.number().optional(),
  reviews: z.number().optional(),
  itinerary: z.array(z.string()).optional(),
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),
  policies: z.array(z.string()).optional(),
});

// ================= UTILITY =================

export type UmrahPackageFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
  formData?: any; // Preserve form data when validation fails
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseUmrahPackageFormData(formData: FormData) {
  return {
    name: str(formData, "name"),
    price: Number(formData.get("price") || 0),
    duration: Number(formData.get("duration") || 0),
    badge: str(formData, "badge"),
    airline: str(formData, "airline"),
    departureCity: str(formData, "departureCity"),
    image: str(formData, "image"),
    popular: formData.get("popular") !== null,
    hotels: {
      makkah: str(formData, "hotels[makkah]"),
      madinah: str(formData, "hotels[madinah]"),
    },

    features: formData.getAll("features") as string[],
    travelers: str(formData, "travelers"),
    rating: Number(formData.get("rating") || 0),
    reviews: Number(formData.get("reviews") || 0),
    itinerary: formData.getAll("itinerary") as string[],
    includes: formData.getAll("includes") as string[],
    excludes: formData.getAll("excludes") as string[],
    policies: formData.getAll("policies") as string[],
  };
}

// ================= UMRAH PACKAGE CRUD ACTIONS =================

export async function createUmrahPackageAction(
  prevState: UmrahPackageFormState,
  formData: FormData
): Promise<UmrahPackageFormState> {
  await connectToDatabase();
  const parsed = parseUmrahPackageFormData(formData);
  const result = umrahPackageSchema.safeParse(parsed);

  if (!result.success) {
    // Return errors along with parsed form data to preserve user input
    return { 
      error: result.error.flatten().fieldErrors,
      formData: parsed 
    };
  }

  try {
    const pkg = await createUmrahPackage(result.data);
    return { data: pkg };
  } catch (error: any) {
    // On database error, also preserve form data
    return { 
      error: { message: [error?.message || "Failed to create package"] },
      formData: parsed 
    };
  }
}

export async function updateUmrahPackageAction(
  prevState: UmrahPackageFormState,
  id: string,
  formData: FormData
): Promise<UmrahPackageFormState> {
  await connectToDatabase();
  const parsed = parseUmrahPackageFormData(formData);
  const result = umrahPackageSchema.safeParse(parsed);

  if (!result.success) {
    // Return errors along with parsed form data to preserve user input
    return { 
      error: result.error.flatten().fieldErrors,
      formData: parsed 
    };
  }

  try {
    const pkg = await updateUmrahPackage(id, result.data);
    return { data: pkg };
  } catch (error: any) {
    // On database error, also preserve form data
    return { 
      error: { message: [error?.message || "Failed to update package"] },
      formData: parsed 
    };
  }
}

export async function deleteUmrahPackageAction(id: string) {
  await connectToDatabase();
  try {
    const pkg = await deleteUmrahPackage(id);
    return { data: pkg };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete package"] } };
  }
}

export async function fetchAllUmrahPackagesAction() {
  await connectToDatabase();
  try {
    const packages = await getAllUmrahPackages();
    return { data: packages };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch packages"] } };
  }
}

export async function fetchUmrahPackageByIdAction(id: string) {
  await connectToDatabase();
  try {
    const pkg = await getUmrahPackageById(id);
    if (!pkg) return { error: { message: ["Package not found"] } };
    return { data: pkg };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch package"] } };
  }
}

// ================= FILTER / SEARCH ACTIONS =================

export async function fetchUmrahPackagesByKeywordAction(keyword: string) {
  await connectToDatabase();
  try {
    const packages = await getUmrahPackagesByKeyword(keyword);
    return { data: packages };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch packages by keyword"] } };
  }
}
