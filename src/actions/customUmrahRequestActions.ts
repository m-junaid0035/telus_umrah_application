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
  differentReturnCity: z.boolean().optional(),
  returnFrom: z.string().trim().optional(),
  returnTo: z.string().trim().optional(),
  airline: z.string().trim().min(2, "Airline is required"),
  airlineClass: z.string().trim().min(1, "Airline class is required"),
  adults: z.number().int().min(1, "At least one adult is required"),
  children: z.number().int().min(0).optional(),
  childAges: z.array(z.number().int().min(0).max(16)).optional(),
  rooms: z.number().int().min(1, "At least one room is required"),
  selectedServices: z.array(
    z.object({
      serviceId: z.string().min(1),
      serviceName: z.string().min(1),
      price: z.number().min(0),
    })
  ).default([]),
  // Legacy fields for backward compatibility
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

async function parseCustomUmrahRequestFormData(formData: FormData) {
  // Parse dates
  const departDateStr = str(formData, "departDate");
  const returnDateStr = str(formData, "returnDate");

  // Debug: log raw values for return city fields
  console.log("[DEBUG] FormData differentReturnCity:", formData.get("differentReturnCity"));
  console.log("[DEBUG] FormData returnFrom:", formData.get("returnFrom"));
  console.log("[DEBUG] FormData returnTo:", formData.get("returnTo"));

  // Parse child ages array
  const childAges: number[] = [];
  const childAgesStr = formData.getAll("childAges");
  childAgesStr.forEach((age) => {
    const num = Number(age);
    if (!isNaN(num) && num >= 0 && num <= 16) childAges.push(num);
  });

  // Parse hotels array
  const hotels: any[] = [];
  const hotelCount = Number(formData.get("hotelCount") || 0);
  console.log(`Parsing ${hotelCount} hotels from FormData`);
  
  for (let i = 0; i < hotelCount; i++) {
    const hotelClass = str(formData, `hotels[${i}][hotelClass]`);
    const hotel = str(formData, `hotels[${i}][hotel]`);
    const stayDuration = str(formData, `hotels[${i}][stayDuration]`);
    const bedType = str(formData, `hotels[${i}][bedType]`);
    const city = str(formData, `hotels[${i}][city]`);
    
    console.log(`Hotel ${i}:`, { hotelClass, hotel, stayDuration, bedType, city });
    
    const hotelObj = {
      hotelClass,
      hotel,
      stayDuration,
      bedType,
      city,
    };
    
    if (hotelObj.hotelClass && hotelObj.hotel && hotelObj.stayDuration && hotelObj.bedType && hotelObj.city) {
      hotels.push(hotelObj);
    } else {
      console.warn(`Hotel ${i} is missing required fields:`, hotelObj);
    }
  }

  console.log(`Successfully parsed ${hotels.length} valid hotels`);

  return {
    name: str(formData, "name"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    nationality: str(formData, "nationality"),
    from: str(formData, "from"),
    to: str(formData, "to"),
    departDate: departDateStr || undefined,
    returnDate: returnDateStr || undefined,
      differentReturnCity: (str(formData, "differentReturnCity") === "true") || false,
      returnFrom: str(formData, "returnFrom") || undefined,
      returnTo: str(formData, "returnTo") || undefined,
    airline: str(formData, "airline"),
    airlineClass: str(formData, "airlineClass"),
    adults: Number(formData.get("adults") || 1),
    children: Number(formData.get("children") || 0),
    childAges,
    rooms: Number(formData.get("rooms") || 1),
    selectedServices: await (async () => {
      const selectedServicesStr = str(formData, "selectedServices");
      if (selectedServicesStr) {
        try {
          const serviceIds = JSON.parse(selectedServicesStr) as string[];
          if (Array.isArray(serviceIds) && serviceIds.length > 0) {
            // Fetch service details from database to get names and prices
            const { getAdditionalServiceById } = await import("@/functions/additionalServiceFunctions");
            
            const servicesWithDetails = await Promise.all(
              serviceIds.map(async (id) => {
                const service = await getAdditionalServiceById(id);
                if (service) {
                  return {
                    serviceId: id,
                    serviceName: service.name,
                    price: service.price,
                  };
                }
                return null;
              })
            );
            
            const validServices = servicesWithDetails.filter((s): s is { serviceId: string; serviceName: string; price: number } => s !== null);
            return validServices.length > 0 ? validServices : [];
          }
        } catch (error) {
          // If parsing fails, return empty array
          return [];
        }
      }
      // Always return an array, even if empty
      return [];
    })(),
    // Legacy fields for backward compatibility
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
  try {
    // Connect to database
    await connectToDatabase();
    
    // Parse form data
    let parsed;
    try {
      parsed = await parseCustomUmrahRequestFormData(formData);
    } catch (parseError: any) {
      console.error("Error parsing form data:", parseError);
      return { error: { message: [parseError?.message || "Invalid form data"] } };
    }
    
    console.log("Parsed form data:", {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      from: parsed.from,
      to: parsed.to,
      departDate: parsed.departDate,
      returnDate: parsed.returnDate,
      airline: parsed.airline,
      airlineClass: parsed.airlineClass,
      adults: parsed.adults,
      children: parsed.children,
      rooms: parsed.rooms,
      selectedServicesCount: parsed.selectedServices?.length || 0,
      selectedServices: parsed.selectedServices,
      hotelsCount: parsed.hotels?.length || 0,
      hotels: parsed.hotels,
    });
    
    // Validate with Zod schema
    const result = customUmrahRequestSchema.safeParse(parsed);

    if (!result.success) {
      console.error("Validation errors:", result.error.flatten().fieldErrors);
      return { error: result.error.flatten().fieldErrors };
    }

    // Create request in database
    console.log("Validation passed, creating request...");
    let request;
    try {
      request = await createCustomUmrahRequest(result.data);
      console.log("Request created successfully:", request._id);
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      return { error: { message: [dbError?.message || "Failed to save request to database"] } };
    }
    
    return { data: request };
  } catch (error: any) {
    console.error("Unexpected error creating custom Umrah request:", error);
    // Log full error for debugging
    if (error?.stack) {
      console.error("Error stack:", error.stack);
    }
    return { error: { message: [error?.message || "An unexpected error occurred. Please try again."] } };
  }
}

export async function updateCustomUmrahRequestAction(
  prevState: CustomUmrahRequestFormState,
  id: string,
  formData: FormData
): Promise<CustomUmrahRequestFormState> {
  await connectToDatabase();
  const parsed = await parseCustomUmrahRequestFormData(formData);
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

