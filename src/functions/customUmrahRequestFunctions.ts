import { CustomUmrahRequest, ICustomUmrahRequest } from "@/models/CustomUmrahRequest";

/**
 * ================= SANITIZER =================
 */
const sanitizeCustomUmrahRequestData = (data: any) => ({
  name: data.name.trim(),
  email: data.email.trim().toLowerCase(),
  phone: data.phone.trim(),
  nationality: data.nationality.trim(),
  from: data.from.trim(),
  to: data.to.trim(),
  departDate: new Date(data.departDate),
  returnDate: new Date(data.returnDate),
  airline: data.airline.trim(),
  airlineClass: data.airlineClass.trim(),
  adults: Number(data.adults),
  children: Number(data.children || 0),
  childAges: Array.isArray(data.childAges) ? data.childAges.map(Number) : [],
  rooms: Number(data.rooms),
  umrahVisa: Boolean(data.umrahVisa),
  transport: Boolean(data.transport),
  zaiarat: Boolean(data.zaiarat),
  meals: Boolean(data.meals),
  esim: Boolean(data.esim),
  hotels: Array.isArray(data.hotels)
    ? data.hotels.map((h: any) => ({
        hotelClass: String(h.hotelClass).trim(),
        hotel: String(h.hotel).trim(),
        stayDuration: String(h.stayDuration).trim(),
        bedType: String(h.bedType).trim(),
        city: String(h.city).trim(),
      }))
    : [],
  status: data.status || "pending",
  notes: data.notes?.trim() || undefined,
});

/**
 * ================= SERIALIZER =================
 */
const serializeCustomUmrahRequest = (request: any) => ({
  _id: request._id?.toString() || request._id,
  name: request.name,
  email: request.email,
  phone: request.phone,
  nationality: request.nationality,
  from: request.from,
  to: request.to,
  departDate: request.departDate?.toISOString?.() || (request.departDate instanceof Date ? request.departDate.toISOString() : request.departDate),
  returnDate: request.returnDate?.toISOString?.() || (request.returnDate instanceof Date ? request.returnDate.toISOString() : request.returnDate),
  airline: request.airline,
  airlineClass: request.airlineClass,
  adults: request.adults,
  children: request.children,
  childAges: Array.isArray(request.childAges) ? request.childAges : [],
  rooms: request.rooms,
  umrahVisa: request.umrahVisa,
  transport: request.transport,
  zaiarat: request.zaiarat,
  meals: request.meals,
  esim: request.esim,
  hotels: Array.isArray(request.hotels)
    ? request.hotels.map((h: any) => ({
        hotelClass: String(h.hotelClass),
        hotel: String(h.hotel),
        stayDuration: String(h.stayDuration),
        bedType: String(h.bedType),
        city: String(h.city),
      }))
    : [],
  status: request.status || "pending",
  notes: request.notes || undefined,
  createdAt: request.createdAt?.toISOString?.() || (request.createdAt instanceof Date ? request.createdAt.toISOString() : request.createdAt),
  updatedAt: request.updatedAt?.toISOString?.() || (request.updatedAt instanceof Date ? request.updatedAt.toISOString() : request.updatedAt),
});

/**
 * ================= CUSTOM UMRAH REQUEST CRUD =================
 */

/** Create a new custom umrah request */
export const createCustomUmrahRequest = async (data: any) => {
  const requestData = sanitizeCustomUmrahRequestData(data);
  const request = await new CustomUmrahRequest(requestData).save();
  return serializeCustomUmrahRequest(request);
};

/** Get all custom umrah requests (sorted by creation date) */
export const getAllCustomUmrahRequests = async () => {
  const requests = await CustomUmrahRequest.find().sort({ createdAt: -1 }).lean();
  return requests.map(serializeCustomUmrahRequest);
};

/** Get a single custom umrah request by ID */
export const getCustomUmrahRequestById = async (id: string) => {
  const request = await CustomUmrahRequest.findById(id).lean();
  return request ? serializeCustomUmrahRequest(request) : null;
};

/** Update custom umrah request by ID */
export const updateCustomUmrahRequest = async (id: string, data: any) => {
  const updatedData = sanitizeCustomUmrahRequestData(data);
  const request = await CustomUmrahRequest.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return request ? serializeCustomUmrahRequest(request) : null;
};

/** Delete a custom umrah request by ID */
export const deleteCustomUmrahRequest = async (id: string) => {
  const request = await CustomUmrahRequest.findByIdAndDelete(id).lean();
  return request ? serializeCustomUmrahRequest(request) : null;
};

/**
 * ================= ADDITIONAL HELPERS =================
 */

/** Get requests by status */
export const getCustomUmrahRequestsByStatus = async (status: string) => {
  const requests = await CustomUmrahRequest.find({ status }).sort({ createdAt: -1 }).lean();
  return requests.map(serializeCustomUmrahRequest);
};

