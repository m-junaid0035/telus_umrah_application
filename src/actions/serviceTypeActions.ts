"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createServiceType,
  getAllServiceTypes,
  getActiveServiceTypes,
  getServiceTypeById,
  updateServiceType,
  deleteServiceType,
} from "@/functions/serviceTypeFunctions";

// ================= SCHEMAS =================

const serviceTypeSchema = z.object({
  name: z.string().trim().min(1, "Type name is required"),
  description: z.string().trim().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// ================= UTILITY =================

export type ServiceTypeFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
  formData?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseServiceTypeFormData(formData: FormData) {
  return {
    name: str(formData, "name"),
    description: str(formData, "description") || undefined,
    displayOrder: formData.get("displayOrder") ? Number(formData.get("displayOrder")) : undefined,
    isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
  };
}

// ================= SERVICE TYPE CRUD ACTIONS =================

export async function createServiceTypeAction(
  prevState: ServiceTypeFormState,
  formData: FormData
): Promise<ServiceTypeFormState> {
  await connectToDatabase();
  const parsed = parseServiceTypeFormData(formData);
  const result = serviceTypeSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, formData: parsed };
  }

  try {
    const type = await createServiceType(result.data);
    return { data: type };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create service type"] }, formData: parsed };
  }
}

export async function updateServiceTypeAction(
  prevState: ServiceTypeFormState,
  id: string,
  formData: FormData
): Promise<ServiceTypeFormState> {
  await connectToDatabase();
  const parsed = parseServiceTypeFormData(formData);
  const result = serviceTypeSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, formData: parsed };
  }

  try {
    const type = await updateServiceType(id, result.data);
    if (!type) return { error: { message: ["Service type not found"] }, formData: parsed };
    return { data: type };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update service type"] }, formData: parsed };
  }
}

export async function deleteServiceTypeAction(id: string) {
  await connectToDatabase();
  try {
    const type = await deleteServiceType(id);
    if (!type) return { error: { message: ["Service type not found"] } };
    return { data: type };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete service type"] } };
  }
}

export async function fetchAllServiceTypesAction() {
  await connectToDatabase();
  try {
    const types = await getAllServiceTypes();
    return { data: types };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch service types"] } };
  }
}

export async function fetchActiveServiceTypesAction() {
  await connectToDatabase();
  try {
    const types = await getActiveServiceTypes();
    return { data: types };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch active service types"] } };
  }
}

export async function fetchServiceTypeByIdAction(id: string) {
  await connectToDatabase();
  try {
    const type = await getServiceTypeById(id);
    if (!type) return { error: { message: ["Service type not found"] } };
    return { data: type };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch service type"] } };
  }
}

