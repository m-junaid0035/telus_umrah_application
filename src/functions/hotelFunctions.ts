import { Hotel, HotelType, IHotel } from "@/models/Hotel";

/**
 * ================= SANITIZER =================
 */
const sanitizeHotelData = (data: {
  type: HotelType;
  name: string;
  location: string;
  star: number;
  description?: string;
  distance?: string;
  amenities?: string[];
  images?: string[];
  availableBedTypes?: string[];
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}) => ({
  type: data.type,
  name: data.name.trim(),
  location: data.location.trim(),
  star: data.star,
  description: data.description?.trim(),
  distance: data.distance?.trim(),
  amenities: Array.isArray(data.amenities) ? data.amenities.filter(a => a.trim()).map(a => a.trim()) : [],
  images: Array.isArray(data.images) ? data.images.filter(img => img.trim()).map(img => img.trim()) : [],
  availableBedTypes: Array.isArray(data.availableBedTypes) ? data.availableBedTypes.filter(b => b.trim()).map(b => b.trim()) : [],
  contact: data.contact ? {
    phone: data.contact.phone?.trim(),
    email: data.contact.email?.trim(),
    address: data.contact.address?.trim(),
  } : undefined,
});

/**
 * ================= SERIALIZER =================
 */
const serializeHotel = (hotel: any) => {
  // Ensure contact is a plain object
  const contact = hotel.contact ? {
    phone: hotel.contact.phone && String(hotel.contact.phone).trim() ? String(hotel.contact.phone).trim() : undefined,
    email: hotel.contact.email && String(hotel.contact.email).trim() ? String(hotel.contact.email).trim() : undefined,
    address: hotel.contact.address && String(hotel.contact.address).trim() ? String(hotel.contact.address).trim() : undefined,
  } : {};

  return {
    _id: hotel._id?.toString() || hotel._id,
    type: hotel.type,
    name: hotel.name,
    location: hotel.location,
    star: hotel.star,
    description: hotel.description || undefined,
    distance: hotel.distance || undefined,
    amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
    images: Array.isArray(hotel.images) ? hotel.images : [],
    availableBedTypes: Array.isArray(hotel.availableBedTypes) ? hotel.availableBedTypes : [],
    contact: Object.keys(contact).length > 0 ? contact : undefined,
    createdAt: hotel.createdAt?.toISOString?.() || (hotel.createdAt instanceof Date ? hotel.createdAt.toISOString() : hotel.createdAt),
    updatedAt: hotel.updatedAt?.toISOString?.() || (hotel.updatedAt instanceof Date ? hotel.updatedAt.toISOString() : hotel.updatedAt),
  };
};

/**
 * ================= HOTEL CRUD =================
 */

/** Create a new hotel */
export const createHotel = async (data: any) => {
  const hotelData = sanitizeHotelData(data);
  const hotel = await new Hotel(hotelData).save();
  return serializeHotel(hotel);
};

/** Get all hotels (sorted by creation date) */
export const getAllHotels = async () => {
  const hotels = await Hotel.find().sort({ createdAt: -1 }).lean();
  return hotels.map(serializeHotel);
};

/** Get a single hotel by ID */
export const getHotelById = async (id: string) => {
  const hotel = await Hotel.findById(id).lean();
  return hotel ? serializeHotel(hotel) : null;
};

/** Update hotel by ID */
export const updateHotel = async (id: string, data: any) => {
  const updatedData = sanitizeHotelData(data);
  const hotel = await Hotel.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return hotel ? serializeHotel(hotel) : null;
};

/** Delete a hotel by ID */
export const deleteHotel = async (id: string) => {
  const hotel = await Hotel.findByIdAndDelete(id).lean();
  return hotel ? serializeHotel(hotel) : null;
};

/**
 * ================= ADDITIONAL HELPERS =================
 */

/** Get hotels by type (Makkah or Madina) */
export const getHotelsByType = async (type: HotelType) => {
  const hotels = await Hotel.find({ type }).sort({ star: -1 }).lean();
  return hotels.map(serializeHotel);
};

/** Get hotels by minimum star rating */
export const getHotelsByStar = async (minStar: number) => {
  const hotels = await Hotel.find({ star: { $gte: minStar } }).sort({ star: -1 }).lean();
  return hotels.map(serializeHotel);
};
