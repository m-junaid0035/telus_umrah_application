"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createAdditionalService,
  getAllAdditionalServices,
  getActiveAdditionalServices,
  getAdditionalServiceById,
  updateAdditionalService,
  deleteAdditionalService,
} from "@/functions/additionalServiceFunctions";

// ================= SCHEMAS =================

const additionalServiceSchema = z.object({
  name: z.string().trim().min(1, "Service name is required"),
  description: z.string().trim().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  serviceType: z.enum(["umrahVisa", "transport", "zaiarat", "meals", "esim"]),
  isActive: z.boolean().optional(),
  icon: z.string().trim().optional(),
});

// ================= UTILITY =================

export type AdditionalServiceFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
  formData?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseAdditionalServiceFormData(formData: FormData) {
  const serviceType = str(formData, "serviceType");
  if (!serviceType || !["umrahVisa", "transport", "zaiarat", "meals", "esim"].includes(serviceType)) {
    throw new Error("Service type is required and must be one of: umrahVisa, transport, zaiarat, meals, esim");
  }

  const icon = str(formData, "icon") || serviceType || undefined;

  return {
    name: str(formData, "name"),
    description: str(formData, "description") || undefined,
    price: formData.get("price") ? Number(formData.get("price")) : 0,
    serviceType: serviceType as "umrahVisa" | "transport" | "zaiarat" | "meals" | "esim",
    isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    icon: icon,
  };
}

// ================= ADDITIONAL SERVICE CRUD ACTIONS =================

export async function createAdditionalServiceAction(
  prevState: AdditionalServiceFormState,
  formData: FormData
): Promise<AdditionalServiceFormState> {
  await connectToDatabase();
  const parsed = parseAdditionalServiceFormData(formData);
  const result = additionalServiceSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, formData: parsed };
  }

  try {
    const service = await createAdditionalService(result.data);
    return { data: service };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create additional service"] }, formData: parsed };
  }
}

export async function updateAdditionalServiceAction(
  prevState: AdditionalServiceFormState,
  id: string,
  formData: FormData
): Promise<AdditionalServiceFormState> {
  await connectToDatabase();
  const parsed = parseAdditionalServiceFormData(formData);
  const result = additionalServiceSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, formData: parsed };
  }

  try {
    const service = await updateAdditionalService(id, result.data);
    if (!service) return { error: { message: ["Additional service not found"] }, formData: parsed };
    return { data: service };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update additional service"] }, formData: parsed };
  }
}

export async function deleteAdditionalServiceAction(id: string) {
  await connectToDatabase();
  try {
    const service = await deleteAdditionalService(id);
    if (!service) return { error: { message: ["Additional service not found"] } };
    return { data: service };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete additional service"] } };
  }
}

export async function fetchAllAdditionalServicesAction() {
  await connectToDatabase();
  try {
    const services = await getAllAdditionalServices();
    return { data: services };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch additional services"] } };
  }
}

export async function fetchActiveAdditionalServicesAction() {
  await connectToDatabase();
  try {
    const services = await getActiveAdditionalServices();
    return { data: services };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch active additional services"] } };
  }
}

export async function fetchAdditionalServiceByIdAction(id: string) {
  await connectToDatabase();
  try {
    const service = await getAdditionalServiceById(id);
    if (!service) return { error: { message: ["Additional service not found"] } };
    return { data: service };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch additional service"] } };
  }
}
