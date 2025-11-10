"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createPolicy,
  getAllPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
  getPoliciesByKeyword,
} from "@/functions/policyFunctions"; // ✅ make sure path is correct

// ================= SCHEMAS =================

const policySchema = z.object({
  heading: z.string().trim().min(2, "Heading is required"),
  description: z.string().trim().min(2, "Description is required"),
});

// ================= UTILITY =================

export type PolicyFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return (v == null ? "" : String(v)).trim();
}

function parsePolicyFormData(formData: FormData) {
  return {
    heading: str(formData, "heading"),
    description: str(formData, "description"),
  };
}

// ================= POLICY CRUD ACTIONS =================

export async function createPolicyAction(
  prevState: PolicyFormState,
  formData: FormData
): Promise<PolicyFormState> {
  await connectToDatabase();
  const parsed = parsePolicyFormData(formData);
  const result = policySchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const policy = await createPolicy(result.data);
    return { data: policy };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to create policy"] } };
  }
}

export async function updatePolicyAction(
  prevState: PolicyFormState,
  id: string,
  formData: FormData
): Promise<PolicyFormState> {
  await connectToDatabase();
  const parsed = parsePolicyFormData(formData);
  const result = policySchema.safeParse(parsed);

  if (!result.success) return { error: result.error.flatten().fieldErrors };

  try {
    const policy = await updatePolicy(id, result.data);
    return { data: policy };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to update policy"] } };
  }
}

export async function deletePolicyAction(id: string) {
  await connectToDatabase();
  try {
    const policy = await deletePolicy(id);
    return { data: policy };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to delete policy"] } };
  }
}

export async function fetchAllPoliciesAction() {
  await connectToDatabase();
  try {
    const policies = await getAllPolicies();
    return { data: policies };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch policies"] } };
  }
}

export async function fetchPolicyByIdAction(id: string) {
  await connectToDatabase();
  try {
    const policy = await getPolicyById(id);
    if (!policy) return { error: { message: ["Policy not found"] } };
    return { data: policy };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch policy"] } };
  }
}

// ================= FILTER / SEARCH ACTIONS =================

export async function fetchPoliciesByKeywordAction(keyword: string) {
  await connectToDatabase();
  try {
    const policies = await getPoliciesByKeyword(keyword);
    return { data: policies };
  } catch (error: any) {
    return { error: { message: [error?.message || "Failed to fetch policies by keyword"] } };
  }
}
