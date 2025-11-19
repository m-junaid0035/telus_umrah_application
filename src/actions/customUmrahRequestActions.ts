"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createCustomUmrahRequest,
  getAllCustomUmrahRequests,
  getCustomUmrahRequestById,
  updateCustomUmrahRequest,
  deleteCustomUmrahRequest,
  getCustomUmrahRequestsByStatus,
} from "@/functions/customUmrahRequestFunctions";

// ================= SCHEMAS =================

const customUmrahRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(5, "Phone is required"),
  nationality: z.string().trim().min(2, "Nationality is required"),
  from: z.string().trim().min(2, "Departure city is required"),
  to: z.string().trim().min(2, "Destination is required"),
  departDate: z.string().or(z.date()),
  returnDate: z.string().or(z.date()),
  airline: z.string().trim().min(2, "Airline is required"),
  airlineClass: z.string().trim().min(1, "Airline class is required"),
  adults: z.number().int().min(1, "At least one adult is required"),
  children: z.number().int().min(0).optional(),
  childAges: z.array(z.number().int().min(0).max(16)).optional(),
  rooms: z.number().int().min(1, "At least one room is required"),
  umrahVisa: z.boolean().optional(),
  transport: z.boolean().optional(),
  zaiarat: z.boolean().optional(),
  meals: z.boolean().optional(),
  esim: z.boolean().optional(),
  hotels: z.array(
    z.object({
      hotelClass: z.string().trim().min(1),
      hotel: z.string().trim().min(1),
      stayDuration: z.string().trim().min(1),
      bedType: z.string().trim().min(1),
      city: z.enum(["Makkah", "Madina"]),
    })
  ).min(1, "At least one hotel is required"),
  status: z.enum(["pending", "in-progress", "completed", "cancelled"]).optional(),
  notes: z.string().trim().optional(),
});

// ================= UTILITY =================

export type CustomUmrahRequestFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseCustomUmrahRequestFormData(formData: FormData) {
  // Parse dates
  const departDateStr = str(formData, "departDate");
  const returnDateStr = str(formData, "returnDate");

  // Parse child ages array
  const childAges: number[] = [];
  const childAgesStr = formData.getAll("childAges");
  childAgesStr.forEach((age) => {
    const num = Number(age);
    if (!isNaN(num)) childAges.push(num);
  });

  // Parse hotels array
  const hotels: any[] = [];
  const hotelCount = Number(formData.get("hotelCount") || 0);
  for (let i = 0; i < hotelCount; i++) {
    const hotel = {
      hotelClass: str(formData, `hotels[${i}][hotelClass]`),
      hotel: str(formData, `hotels[${i}][hotel]`),
      stayDuration: str(formData, `hotels[${i}][stayDuration]`),
      bedType: str(formData, `hotels[${i}][bedType]`),
      city: str(formData, `hotels[${i}][city]`),
    };
    if (hotel.hotelClass && hotel.hotel && hotel.stayDuration && hotel.bedType && hotel.city) {
      hotels.push(hotel);
    }
  }

  return {
    name: str(formData, "name"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    nationality: str(formData, "nationality"),
    from: str(formData, "from"),
    to: str(formData, "to"),
    departDate: departDateStr || undefined,
    returnDate: returnDateStr || undefined,
    airline: str(formData, "airline"),
    airlineClass: str(formData, "airlineClass"),
    adults: Number(formData.get("adults") || 1),
    children: Number(formData.get("children") || 0),
    childAges,
    rooms: Number(formData.get("rooms") || 1),
    umrahVisa: formData.get("umrahVisa") === "true",
    transport: formData.get("transport") === "true",
    zaiarat: formData.get("zaiarat") === "true",
    meals: formData.get("meals") === "true",
    esim: formData.get("esim") === "true",
    hotels,
    status: str(formData, "status") || "pending",
    notes: str(formData, "notes") || undefined,
  };
}

// ================= CUSTOM UMRAH REQUEST CRUD ACTIONS =================

export async function createCustomUmrahRequestAction(
  prevState: CustomUmrahRequestFormState,
  formData: FormData
): Promise<CustomUmrahRequestFormState> {
  await connectToDatabase();
  const parsed = parseCustomUmrahRequestFormData(formData);
  const result = customUmrahRequestSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const request = await createCustomUmrahRequest(result.data);
    return { data: request };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create request"] } };
  }
}

export async function updateCustomUmrahRequestAction(
  prevState: CustomUmrahRequestFormState,
  id: string,
  formData: FormData
): Promise<CustomUmrahRequestFormState> {
  await connectToDatabase();
  const parsed = parseCustomUmrahRequestFormData(formData);
  const result = customUmrahRequestSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const request = await updateCustomUmrahRequest(id, result.data);
    return { data: request };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update request"] } };
  }
}

export async function deleteCustomUmrahRequestAction(id: string) {
  await connectToDatabase();
  try {
    const request = await deleteCustomUmrahRequest(id);
    return { data: request };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete request"] } };
  }
}

export async function fetchAllCustomUmrahRequestsAction() {
  await connectToDatabase();
  try {
    const requests = await getAllCustomUmrahRequests();
    return { data: requests };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch requests"] } };
  }
}

export async function fetchCustomUmrahRequestByIdAction(id: string) {
  await connectToDatabase();
  try {
    const request = await getCustomUmrahRequestById(id);
    if (!request) return { error: { message: ["Request not found"] } };
    return { data: request };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch request"] } };
  }
}

// ================= FILTER ACTIONS =================

export async function fetchCustomUmrahRequestsByStatusAction(status: string) {
  await connectToDatabase();
  try {
    const requests = await getCustomUmrahRequestsByStatus(status);
    return { data: requests };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch requests by status"] } };
  }
}

