"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createExclude,
  getAllExcludes,
  getExcludeById,
  updateExclude,
  deleteExclude,
  getExcludesByKeyword,
} from "@/functions/excludesFunction"; // make sure this path is correct

// ================= SCHEMAS =================

const excludeSchema = z.object({
  exclude_text: z.string().trim().min(2, "Exclude text is required"),
});

// ================= UTILITY =================

export type ExcludeFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseExcludeFormData(formData: FormData) {
  return {
    exclude_text: str(formData, "exclude_text"),
  };
}

// ================= EXCLUDE CRUD ACTIONS =================

export async function createExcludeAction(
  prevState: ExcludeFormState,
  formData: FormData
): Promise<ExcludeFormState> {
  await connectToDatabase();
  const parsed = parseExcludeFormData(formData);
  const result = excludeSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const exclude = await createExclude(result.data);
    return { data: exclude };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create exclude"] } };
  }
}

export async function updateExcludeAction(
  prevState: ExcludeFormState,
  id: string,
  formData: FormData
): Promise<ExcludeFormState> {
  await connectToDatabase();
  const parsed = parseExcludeFormData(formData);
  const result = excludeSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const exclude = await updateExclude(id, result.data);
    return { data: exclude };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update exclude"] } };
  }
}

export async function deleteExcludeAction(id: string) {
  await connectToDatabase();
  try {
    const exclude = await deleteExclude(id);
    return { data: exclude };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete exclude"] } };
  }
}

export async function fetchAllExcludesAction() {
  await connectToDatabase();
  try {
    const excludes = await getAllExcludes();
    return { data: excludes };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch excludes"] } };
  }
}

export async function fetchExcludeByIdAction(id: string) {
  await connectToDatabase();
  try {
    const exclude = await getExcludeById(id);
    if (!exclude) return { error: { message: ["Exclude not found"] } };
    return { data: exclude };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch exclude"] } };
  }
}

// ================= FILTER / SEARCH ACTIONS =================

export async function fetchExcludesByKeywordAction(keyword: string) {
  await connectToDatabase();
  try {
    const excludes = await getExcludesByKeyword(keyword);
    return { data: excludes };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch excludes by keyword"] } };
  }
}
