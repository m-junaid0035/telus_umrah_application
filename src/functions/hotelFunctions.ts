import { Hotel, HotelType, IHotel } from "@/models/Hotel";

/**
 * ================= SANITIZER =================
 */
const sanitizeHotelData = (data: {
  type: HotelType;
  name: string;
  location: string;
  star: number;
}) => ({
  type: data.type,
  name: data.name.trim(),
  location: data.location.trim(),
  star: data.star,
});

/**
 * ================= SERIALIZER =================
 */
const serializeHotel = (hotel: any) => ({
  _id: hotel._id.toString(),
  type: hotel.type,
  name: hotel.name,
  location: hotel.location,
  star: hotel.star,
  createdAt: hotel.createdAt?.toISOString?.(),
  updatedAt: hotel.updatedAt?.toISOString?.(),
});

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
