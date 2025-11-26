"use server";

import { connectToDatabase } from "@/lib/db";
import { ServiceType, IServiceType } from "@/models/ServiceType";

// Serialize service type for client usage
const serializeServiceType = (type: IServiceType) => ({
  _id: type._id.toString(),
  name: type.name,
  description: type.description,
  displayOrder: type.displayOrder,
  isActive: type.isActive,
  createdAt: type.createdAt?.toISOString() || null,
  updatedAt: type.updatedAt?.toISOString() || null,
});

// Create a new service type
export const createServiceType = async (data: {
  name: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}) => {
  await connectToDatabase();
  const serviceType = await new ServiceType(data).save();
  return serializeServiceType(serviceType);
};

// Get all service types
export const getAllServiceTypes = async () => {
  await connectToDatabase();
  const types = await ServiceType.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
  return types.map((type) => serializeServiceType(type as IServiceType));
};

// Get active service types only
export const getActiveServiceTypes = async () => {
  await connectToDatabase();
  const types = await ServiceType.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
  return types.map((type) => serializeServiceType(type as IServiceType));
};

// Get service type by ID
export const getServiceTypeById = async (id: string) => {
  await connectToDatabase();
  const type = await ServiceType.findById(id).lean();
  if (!type) return null;
  return serializeServiceType(type as IServiceType);
};

// Update service type
export const updateServiceType = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    displayOrder?: number;
    isActive?: boolean;
  }
) => {
  await connectToDatabase();
  const type = await ServiceType.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  ).lean();
  if (!type) return null;
  return serializeServiceType(type as IServiceType);
};

// Delete service type
export const deleteServiceType = async (id: string) => {
  await connectToDatabase();
  const type = await ServiceType.findByIdAndDelete(id).lean();
  if (!type) return null;
  return serializeServiceType(type as IServiceType);
};

