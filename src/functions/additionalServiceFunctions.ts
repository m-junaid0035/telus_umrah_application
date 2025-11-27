"use server";

import { connectToDatabase } from "@/lib/db";
import { AdditionalService, IAdditionalService } from "@/models/AdditionalService";

// Serialize additional service for client usage
const serializeAdditionalService = (service: any) => ({
  _id: service._id.toString(),
  name: service.name,
  description: service.description,
  price: service.price,
  serviceType: service.serviceType,
  isActive: service.isActive,
  icon: service.icon,
  createdAt: service.createdAt ? new Date(service.createdAt).toISOString() : null,
  updatedAt: service.updatedAt ? new Date(service.updatedAt).toISOString() : null,
});

// Create a new additional service
export const createAdditionalService = async (data: {
  name: string;
  description?: string;
  price: number;
  serviceType: "umrahVisa" | "transport" | "zaiarat" | "meals" | "esim";
  isActive?: boolean;
  icon?: string;
}) => {
  await connectToDatabase();
  const service = await new AdditionalService(data).save();
  return serializeAdditionalService(service);
};

// Get all additional services
export const getAllAdditionalServices = async () => {
  await connectToDatabase();
  const services = await AdditionalService.find().sort({ createdAt: -1 }).lean();
  return services.map(serializeAdditionalService);
};

// Get active additional services only
export const getActiveAdditionalServices = async () => {
  await connectToDatabase();
  const services = await AdditionalService.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();
  return services.map(serializeAdditionalService);
};

// Get additional service by ID
export const getAdditionalServiceById = async (id: string) => {
  await connectToDatabase();
  const service = await AdditionalService.findById(id).lean();
  if (!service) return null;
  return serializeAdditionalService(service);
};

// Update additional service
export const updateAdditionalService = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    serviceType?: "umrahVisa" | "transport" | "zaiarat" | "meals" | "esim";
    isActive?: boolean;
    icon?: string;
  }
) => {
  await connectToDatabase();
  const service = await AdditionalService.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!service) return null;
  return serializeAdditionalService(service);
};

// Delete additional service
export const deleteAdditionalService = async (id: string) => {
  await connectToDatabase();
  const service = await AdditionalService.findByIdAndDelete(id).lean();
  if (!service) return null;
  return serializeAdditionalService(service);
};
