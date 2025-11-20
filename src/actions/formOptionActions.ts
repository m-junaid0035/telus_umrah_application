"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createFormOption,
  getAllFormOptions,
  getFormOptionById,
  getFormOptionsByType,
  updateFormOption,
  deleteFormOption,
} from "@/functions/formOptionFunctions";
import { FormOptionType } from "@/models/FormOption";

// ================= SCHEMAS =================

const formOptionSchema = z.object({
  type: z.nativeEnum(FormOptionType),
  name: z.string().trim().min(1, "Name is required"),
  value: z.string().trim().min(1, "Value is required"),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  logo: z.string().trim().optional(),
});

// ================= UTILITY =================

export type FormOptionFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
  formData?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseFormOptionFormData(formData: FormData) {
  return {
    type: str(formData, "type") as FormOptionType,
    name: str(formData, "name"),
    value: str(formData, "value"),
    displayOrder: formData.get("displayOrder") ? Number(formData.get("displayOrder")) : undefined,
    isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    logo: str(formData, "logo") || undefined,
  };
}

// ================= FORM OPTION CRUD ACTIONS =================

export async function createFormOptionAction(
  prevState: FormOptionFormState,
  formData: FormData
): Promise<FormOptionFormState> {
  await connectToDatabase();
  const parsed = parseFormOptionFormData(formData);
  const result = formOptionSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, formData: parsed };
  }

  try {
    const option = await createFormOption(result.data);
    return { data: option };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create form option"] }, formData: parsed };
  }
}

export async function updateFormOptionAction(
  prevState: FormOptionFormState,
  id: string,
  formData: FormData
): Promise<FormOptionFormState> {
  await connectToDatabase();
  const parsed = parseFormOptionFormData(formData);
  const result = formOptionSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, formData: parsed };
  }

  try {
    const option = await updateFormOption(id, result.data);
    if (!option) return { error: { message: ["Form option not found"] }, formData: parsed };
    return { data: option };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update form option"] }, formData: parsed };
  }
}

export async function deleteFormOptionAction(id: string) {
  await connectToDatabase();
  try {
    const option = await deleteFormOption(id);
    if (!option) return { error: { message: ["Form option not found"] } };
    return { data: option };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete form option"] } };
  }
}

export async function fetchAllFormOptionsAction() {
  await connectToDatabase();
  try {
    const options = await getAllFormOptions();
    return { data: options };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch form options"] } };
  }
}

export async function fetchFormOptionsByTypeAction(type: FormOptionType) {
  await connectToDatabase();
  try {
    const options = await getFormOptionsByType(type);
    return { data: options };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch form options"] } };
  }
}

export async function fetchFormOptionByIdAction(id: string) {
  await connectToDatabase();
  try {
    const option = await getFormOptionById(id);
    if (!option) return { error: { message: ["Form option not found"] } };
    return { data: option };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch form option"] } };
  }
}

