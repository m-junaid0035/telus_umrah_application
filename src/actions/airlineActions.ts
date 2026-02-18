"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createAirline,
  getAllAirlines,
  getActiveAirlines,
  getAirlineById,
  updateAirline,
  deleteAirline,
} from "@/functions/airlineFunctions";

const airlineSchema = z.object({
  name: z.string().trim().min(1, "Airline name is required"),
  logo: z.string().trim().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export type AirlineFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
  formData?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseAirlineFormData(formData: FormData) {
  return {
    name: str(formData, "name"),
    logo: str(formData, "logo") || undefined,
    displayOrder: formData.get("displayOrder") ? Number(formData.get("displayOrder")) : undefined,
    isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
  };
}

export async function createAirlineAction(
  prevState: AirlineFormState,
  formData: FormData
): Promise<AirlineFormState> {
  await connectToDatabase();
  const parsed = parseAirlineFormData(formData);
  const result = airlineSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, formData: parsed };
  }

  try {
    const airline = await createAirline(result.data);
    return { data: airline };
  } catch (error: any) {
    return {
      error: { message: [error?.message || "Failed to create airline"] },
      formData: parsed,
    };
  }
}

export async function updateAirlineAction(
  prevState: AirlineFormState,
  id: string,
  formData: FormData
): Promise<AirlineFormState> {
  await connectToDatabase();
  const parsed = parseAirlineFormData(formData);
  const result = airlineSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, formData: parsed };
  }

  try {
    const airline = await updateAirline(id, result.data);
    if (!airline) {
      return { error: { message: ["Airline not found"] }, formData: parsed };
    }
    return { data: airline };
  } catch (error: any) {
    return {
      error: { message: [error?.message || "Failed to update airline"] },
      formData: parsed,
    };
  }
}

export async function deleteAirlineAction(id: string) {
  await connectToDatabase();
  try {
    const airline = await deleteAirline(id);
    if (!airline) return { error: { message: ["Airline not found"] } };
    return { data: airline };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete airline"] } };
  }
}

export async function fetchAllAirlinesAction() {
  await connectToDatabase();
  try {
    const airlines = await getAllAirlines();
    return { data: airlines };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch airlines"] } };
  }
}

export async function fetchActiveAirlinesAction() {
  await connectToDatabase();
  try {
    const airlines = await getActiveAirlines();
    return { data: airlines };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch active airlines"] } };
  }
}

export async function fetchAirlineByIdAction(id: string) {
  await connectToDatabase();
  try {
    const airline = await getAirlineById(id);
    if (!airline) return { error: { message: ["Airline not found"] } };
    return { data: airline };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch airline"] } };
  }
}
