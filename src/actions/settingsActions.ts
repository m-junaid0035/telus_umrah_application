"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { getSettings, updateAgentDiscount } from "@/functions/settingsFunctions";

const agentDiscountSchema = z.object({
  agentDiscountPercent: z.number().min(0).max(100),
});

export type SettingsFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

function parseDiscountFormData(formData: FormData) {
  const value = formData.get("agentDiscountPercent");
  return {
    agentDiscountPercent: value === null || value === "" ? NaN : Number(value),
  };
}

export async function fetchSettingsAction() {
  await connectToDatabase();
  try {
    const settings = await getSettings();
    return { data: settings };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch settings"] } };
  }
}

export async function updateAgentDiscountAction(formData: FormData): Promise<SettingsFormState> {
  await connectToDatabase();
  const parsed = parseDiscountFormData(formData);
  const result = agentDiscountSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const settings = await updateAgentDiscount(result.data.agentDiscountPercent);
    if (!settings) {
      return { error: { message: ["Failed to update agent discount"] } };
    }
    return { data: settings };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update agent discount"] } };
  }
}
