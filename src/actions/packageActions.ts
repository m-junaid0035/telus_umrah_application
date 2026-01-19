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
  price: z.number().min(1, "Price must be greater than 0").refine(n => !isNaN(n), "Price must be a valid number"),
  adultPrice: z.number().min(1, "Adult price must be greater than 0").refine(n => !isNaN(n), "Adult price must be a valid number"),
  childPrice: z.number().min(0, "Child price must be 0 or greater").refine(n => !isNaN(n), "Child price must be a valid number"),
  infantPrice: z.number().min(0, "Infant price must be 0 or greater").refine(n => !isNaN(n), "Infant price must be a valid number"),
  duration: z.number().min(1, "Duration must be greater than 0"),
  badge: z.string().trim().optional(),
  airline: z.string().trim().min(2, "Airline is required"),
  departureCity: z.string().trim().min(2, "Departure City is required"),
  image: z.string().trim().refine(
    (val) => {
      if (!val || val === "") return true; // Empty is allowed
      // Accept full URLs (http://, https://) or relative paths starting with /
      return val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/");
    },
    {
      message: "Image must be a valid URL or relative path starting with /",
    }
  ).optional(),
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
  flights: z.object({
    departure: z.object({
      flight: z.string().optional(),
      sector: z.string().optional(),
      departureTime: z.string().optional(),
      arrivalTime: z.string().optional(),
    }),
    arrival: z.object({
      flight: z.string().optional(),
      sector: z.string().optional(),
      departureTime: z.string().optional(),
      arrivalTime: z.string().optional(),
    }),
  }),
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
  const imageStr = str(formData, "image");
  const departureFlight = {
    flight: str(formData, "flights[departure][flight]"),
    sector: str(formData, "flights[departure][sector]"),
    departureTime: str(formData, "flights[departure][departureTime]"),
    arrivalTime: str(formData, "flights[departure][arrivalTime]"),
  };
  const arrivalFlight = {
    flight: str(formData, "flights[arrival][flight]"),
    sector: str(formData, "flights[arrival][sector]"),
    departureTime: str(formData, "flights[arrival][departureTime]"),
    arrivalTime: str(formData, "flights[arrival][arrivalTime]"),
  };
  
  // Parse prices carefully - they must be numbers and required
  const adultPriceValue = formData.get("adultPrice") || formData.get("price");
  const childPriceValue = formData.get("childPrice");
  const infantPriceValue = formData.get("infantPrice");
  
  const adultPrice = adultPriceValue ? Number(adultPriceValue) : NaN;
  const childPrice = childPriceValue ? Number(childPriceValue) : NaN;
  const infantPrice = infantPriceValue ? Number(infantPriceValue) : NaN;
  
  console.log("=== PACKAGE PARSING ===");
  console.log("Raw form values - adult:", adultPriceValue, "(type:", typeof adultPriceValue + ")");
  console.log("Raw form values - child:", childPriceValue, "(type:", typeof childPriceValue + ")");
  console.log("Raw form values - infant:", infantPriceValue, "(type:", typeof infantPriceValue + ")");
  console.log("Parsed values - adult:", adultPrice, "isNaN:", isNaN(adultPrice));
  console.log("Parsed values - child:", childPrice, "isNaN:", isNaN(childPrice));
  console.log("Parsed values - infant:", infantPrice, "isNaN:", isNaN(infantPrice));
  
  const parsed = {
    name: str(formData, "name"),
    price: adultPrice, // Use adultPrice for backward compatibility
    adultPrice: adultPrice,
    childPrice: childPrice,
    infantPrice: infantPrice,
    duration: Number(formData.get("duration") || 0),
    badge: str(formData, "badge"),
    airline: str(formData, "airline"),
    departureCity: str(formData, "departureCity"),
    image: imageStr || undefined,
    popular: (formData.get("popular") || "").toString() === "true",
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
    flights: {
      departure: departureFlight,
      arrival: arrivalFlight,
    },
  };
  
  console.log("Final parsed object:", parsed);
  return parsed;
}

// ================= UMRAH PACKAGE CRUD ACTIONS =================

export async function createUmrahPackageAction(
  prevState: UmrahPackageFormState,
  formData: FormData
): Promise<UmrahPackageFormState> {
  await connectToDatabase();
  const parsed = parseUmrahPackageFormData(formData);
  console.log("Parsed package data:", parsed);
  
  const result = umrahPackageSchema.safeParse(parsed);
  console.log("Validation result:", result);

  if (!result.success) {
    // Return errors along with parsed form data to preserve user input
    console.error("Package validation errors:", result.error.flatten().fieldErrors);
    return { 
      error: result.error.flatten().fieldErrors,
      formData: parsed 
    };
  }

  try {
    const pkg = await createUmrahPackage(result.data);
    console.log("Package created successfully:", pkg._id);
    return { data: pkg };
  } catch (error: any) {
    // On database error, also preserve form data
    console.error("Database error creating package:", error);
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
