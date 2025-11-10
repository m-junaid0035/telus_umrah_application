"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createFeature,
  getAllFeatures,
  getFeatureById,
  updateFeature,
  deleteFeature,
  getFeaturesByKeyword,
} from "@/functions/featuresFunctions";

// ================= SCHEMAS =================

const featureSchema = z.object({
  feature_text: z.string().trim().min(2, "Feature text is required"),
});

// ================= UTILITY =================

export type FeatureFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parseFeatureFormData(formData: FormData) {
  return {
    feature_text: str(formData, "feature_text"),
  };
}

// ================= FEATURE CRUD ACTIONS =================

export async function createFeatureAction(
  prevState: FeatureFormState,
  formData: FormData
): Promise<FeatureFormState> {
  await connectToDatabase();
  const parsed = parseFeatureFormData(formData);
  const result = featureSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const feature = await createFeature(result.data);
    return { data: feature };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create feature"] } };
  }
}

export async function updateFeatureAction(
  prevState: FeatureFormState,
  id: string,
  formData: FormData
): Promise<FeatureFormState> {
  await connectToDatabase();
  const parsed = parseFeatureFormData(formData);
  const result = featureSchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const feature = await updateFeature(id, result.data);
    return { data: feature };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update feature"] } };
  }
}

export async function deleteFeatureAction(id: string) {
  await connectToDatabase();
  try {
    const feature = await deleteFeature(id);
    return { data: feature };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete feature"] } };
  }
}

export async function fetchAllFeaturesAction() {
  await connectToDatabase();
  try {
    const features = await getAllFeatures();
    return { data: features };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch features"] } };
  }
}

export async function fetchFeatureByIdAction(id: string) {
  await connectToDatabase();
  try {
    const feature = await getFeatureById(id);
    if (!feature) return { error: { message: ["Feature not found"] } };
    return { data: feature };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch feature"] } };
  }
}

// ================= FILTER / SEARCH ACTIONS =================

export async function fetchFeaturesByKeywordAction(keyword: string) {
  await connectToDatabase();
  try {
    const features = await getFeaturesByKeyword(keyword);
    return { data: features };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch features by keyword"] } };
  }
}
