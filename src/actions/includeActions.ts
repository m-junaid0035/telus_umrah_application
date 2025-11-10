"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createInclude,
  getAllIncludes,
  getIncludeById,
  updateInclude,
  deleteInclude,
  getIncludesByKeyword,
} from "@/functions/includeFunctions"; // make sure this path is correct

// ================= SCHEMAS =================

const includeSchema = z.object({
  include_text: z.string().trim().min(2, "Include text is required"),
});

// ================= UTILITY =================

export type IncludeFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseIncludeFormData(formData: FormData) {
  return {
    include_text: str(formData, "include_text"),
  };
}

// ================= INCLUDE CRUD ACTIONS =================

export async function createIncludeAction(
  prevState: IncludeFormState,
  formData: FormData
): Promise<IncludeFormState> {
  await connectToDatabase();
  const parsed = parseIncludeFormData(formData);
  const result = includeSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const include = await createInclude(result.data);
    return { data: include };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create include"] } };
  }
}

export async function updateIncludeAction(
  prevState: IncludeFormState,
  id: string,
  formData: FormData
): Promise<IncludeFormState> {
  await connectToDatabase();
  const parsed = parseIncludeFormData(formData);
  const result = includeSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const include = await updateInclude(id, result.data);
    return { data: include };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update include"] } };
  }
}

export async function deleteIncludeAction(id: string) {
  await connectToDatabase();
  try {
    const include = await deleteInclude(id);
    return { data: include };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete include"] } };
  }
}

export async function fetchAllIncludesAction() {
  await connectToDatabase();
  try {
    const includes = await getAllIncludes();
    return { data: includes };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch includes"] } };
  }
}

export async function fetchIncludeByIdAction(id: string) {
  await connectToDatabase();
  try {
    const include = await getIncludeById(id);
    if (!include) return { error: { message: ["Include not found"] } };
    return { data: include };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch include"] } };
  }
}

// ================= FILTER / SEARCH ACTIONS =================

export async function fetchIncludesByKeywordAction(keyword: string) {
  await connectToDatabase();
  try {
    const includes = await getIncludesByKeyword(keyword);
    return { data: includes };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch includes by keyword"] } };
  }
}
