import { Itinerary, IItinerary } from "@/models/Itineraries";

/**
 * ================= SANITIZER =================
 */
const sanitizeItineraryData = (data: {
  day_start: number;
  day_end?: number;
  title: string;
  description: string;
}) => ({
  day_start: data.day_start,
  day_end: data.day_end,
  title: data.title.trim(),
  description: data.description.trim(),
});

/**
 * ================= SERIALIZER =================
 */
const serializeItinerary = (itinerary: any) => ({
  _id: itinerary._id.toString(),
  day_start: itinerary.day_start,
  day_end: itinerary.day_end,
  title: itinerary.title,
  description: itinerary.description,
  createdAt: itinerary.createdAt?.toISOString?.(),
  updatedAt: itinerary.updatedAt?.toISOString?.(),
});

/**
 * ================= ITINERARY CRUD =================
 */

/** Create a new itinerary */
export const createItinerary = async (data: any) => {
  const itineraryData = sanitizeItineraryData(data);
  const itinerary = await new Itinerary(itineraryData).save();
  return serializeItinerary(itinerary);
};

/** Get all itineraries (sorted by creation date) */
export const getAllItineraries = async () => {
  const itineraries = await Itinerary.find().sort({ createdAt: -1 }).lean();
  return itineraries.map(serializeItinerary);
};

/** Get a single itinerary by ID */
export const getItineraryById = async (id: string) => {
  const itinerary = await Itinerary.findById(id).lean();
  return itinerary ? serializeItinerary(itinerary) : null;
};

/** Update itinerary by ID */
export const updateItinerary = async (id: string, data: any) => {
  const updatedData = sanitizeItineraryData(data);
  const itinerary = await Itinerary.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return itinerary ? serializeItinerary(itinerary) : null;
};

/** Delete an itinerary by ID */
export const deleteItinerary = async (id: string) => {
  const itinerary = await Itinerary.findByIdAndDelete(id).lean();
  return itinerary ? serializeItinerary(itinerary) : null;
};

/**
 * ================= ADDITIONAL HELPERS =================
 */

/** Search itineraries by title keyword */
export const getItinerariesByKeyword = async (keyword: string) => {
  const itineraries = await Itinerary.find({
    title: { $regex: keyword, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .lean();
  return itineraries.map(serializeItinerary);
};
