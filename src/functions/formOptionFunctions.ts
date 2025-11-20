"use server";

import { connectToDatabase } from "@/lib/db";
import { FormOption, IFormOption, FormOptionType } from "@/models/FormOption";

/**
 * Serialize form option for client usage
 */
const serializeFormOption = (option: any) => ({
  _id: option._id.toString(),
  type: option.type,
  name: option.name,
  value: option.value,
  displayOrder: option.displayOrder || 0,
  isActive: option.isActive !== false,
  logo: option.logo || undefined,
  createdAt: option.createdAt?.toISOString() || "",
  updatedAt: option.updatedAt?.toISOString() || "",
});

/**
 * Create a new form option
 */
export const createFormOption = async (data: {
  type: FormOptionType;
  name: string;
  value: string;
  displayOrder?: number;
  isActive?: boolean;
  logo?: string;
}) => {
  await connectToDatabase();
  const option = await new FormOption(data).save();
  return serializeFormOption(option);
};

/**
 * Get all form options by type
 */
export const getFormOptionsByType = async (type: FormOptionType) => {
  await connectToDatabase();
  const options = await FormOption.find({ type, isActive: { $ne: false } })
    .sort({ displayOrder: 1, name: 1 })
    .lean();
  return options.map(serializeFormOption);
};

/**
 * Get all form options
 */
export const getAllFormOptions = async () => {
  await connectToDatabase();
  const options = await FormOption.find()
    .sort({ type: 1, displayOrder: 1, name: 1 })
    .lean();
  return options.map(serializeFormOption);
};

/**
 * Get form option by ID
 */
export const getFormOptionById = async (id: string) => {
  await connectToDatabase();
  const option = await FormOption.findById(id).lean();
  return option ? serializeFormOption(option) : null;
};

/**
 * Update form option by ID
 */
export const updateFormOption = async (id: string, data: Partial<IFormOption>) => {
  await connectToDatabase();
  const option = await FormOption.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
  return option ? serializeFormOption(option) : null;
};

/**
 * Delete form option by ID
 */
export const deleteFormOption = async (id: string) => {
  await connectToDatabase();
  const option = await FormOption.findByIdAndDelete(id).lean();
  return option ? serializeFormOption(option) : null;
};

