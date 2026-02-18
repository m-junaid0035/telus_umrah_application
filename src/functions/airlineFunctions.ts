"use server";

import { connectToDatabase } from "@/lib/db";
import { Airline, IAirline } from "@/models/Airline";

const serializeAirline = (airline: any) => ({
  _id: airline._id.toString(),
  name: airline.name,
  logo: airline.logo || undefined,
  displayOrder: airline.displayOrder || 0,
  isActive: airline.isActive !== false,
  createdAt: airline.createdAt?.toISOString() || "",
  updatedAt: airline.updatedAt?.toISOString() || "",
});

export const createAirline = async (data: {
  name: string;
  logo?: string;
  displayOrder?: number;
  isActive?: boolean;
}) => {
  await connectToDatabase();
  const airline = await new Airline(data).save();
  return serializeAirline(airline);
};

export const getAllAirlines = async () => {
  await connectToDatabase();
  const airlines = await Airline.find()
    .sort({ displayOrder: 1, name: 1 })
    .lean();
  return airlines.map(serializeAirline);
};

export const getActiveAirlines = async () => {
  await connectToDatabase();
  const airlines = await Airline.find({ isActive: { $ne: false } })
    .sort({ displayOrder: 1, name: 1 })
    .lean();
  return airlines.map(serializeAirline);
};

export const getAirlineById = async (id: string) => {
  await connectToDatabase();
  const airline = await Airline.findById(id).lean();
  return airline ? serializeAirline(airline) : null;
};

export const updateAirline = async (id: string, data: Partial<IAirline>) => {
  await connectToDatabase();
  const airline = await Airline.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  ).lean();

  return airline ? serializeAirline(airline) : null;
};

export const deleteAirline = async (id: string) => {
  await connectToDatabase();
  const airline = await Airline.findByIdAndDelete(id).lean();
  return airline ? serializeAirline(airline) : null;
};
