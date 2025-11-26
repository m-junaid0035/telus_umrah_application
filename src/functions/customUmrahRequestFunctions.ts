import { CustomUmrahRequest, ICustomUmrahRequest } from "@/models/CustomUmrahRequest";

/**
 * ================= SANITIZER =================
 */
const sanitizeCustomUmrahRequestData = (data: any) => {
  // Validate required fields
  if (!data.name || typeof data.name !== 'string') {
    throw new Error("Name is required and must be a string");
  }
  if (!data.email || typeof data.email !== 'string') {
    throw new Error("Email is required and must be a string");
  }
  if (!data.phone || typeof data.phone !== 'string') {
    throw new Error("Phone is required and must be a string");
  }
  if (!data.nationality || typeof data.nationality !== 'string') {
    throw new Error("Nationality is required and must be a string");
  }
  if (!data.from || typeof data.from !== 'string') {
    throw new Error("Departure city is required");
  }
  if (!data.to || typeof data.to !== 'string') {
    throw new Error("Destination city is required");
  }
  if (!data.departDate) {
    throw new Error("Departure date is required");
  }
  if (!data.returnDate) {
    throw new Error("Return date is required");
  }
  if (!data.airline || typeof data.airline !== 'string') {
    throw new Error("Airline is required");
  }
  if (!data.airlineClass || typeof data.airlineClass !== 'string') {
    throw new Error("Airline class is required");
  }

  // Validate and parse dates
  let departDate: Date;
  let returnDate: Date;
  
  try {
    departDate = new Date(data.departDate);
    if (isNaN(departDate.getTime())) {
      throw new Error("Invalid departure date format");
    }
  } catch (error) {
    throw new Error("Invalid departure date format");
  }
  
  try {
    returnDate = new Date(data.returnDate);
    if (isNaN(returnDate.getTime())) {
      throw new Error("Invalid return date format");
    }
  } catch (error) {
    throw new Error("Invalid return date format");
  }

  // Validate date logic
  if (returnDate <= departDate) {
    throw new Error("Return date must be after departure date");
  }

  // Validate and sanitize hotels
  const hotels = Array.isArray(data.hotels)
    ? data.hotels
        .filter((h: any) => {
          // Filter out invalid hotels
          return (
            h &&
            h.hotelClass &&
            h.hotel &&
            h.stayDuration &&
            h.bedType &&
            h.city &&
            String(h.hotelClass).trim() &&
            String(h.hotel).trim() &&
            String(h.stayDuration).trim() &&
            String(h.bedType).trim() &&
            (String(h.city).trim() === "Makkah" || String(h.city).trim() === "Madina")
          );
        })
        .map((h: any) => ({
          hotelClass: String(h.hotelClass).trim(),
          hotel: String(h.hotel).trim(),
          stayDuration: String(h.stayDuration).trim(),
          bedType: String(h.bedType).trim(),
          city: String(h.city).trim() as "Makkah" | "Madina",
        }))
    : [];

  if (hotels.length === 0) {
    throw new Error("At least one valid hotel is required");
  }

  // Validate numbers
  const adults = Number(data.adults);
  if (isNaN(adults) || adults < 1) {
    throw new Error("At least one adult is required");
  }

  const children = Number(data.children || 0);
  if (isNaN(children) || children < 0) {
    throw new Error("Invalid children count");
  }

  const rooms = Number(data.rooms);
  if (isNaN(rooms) || rooms < 1) {
    throw new Error("At least one room is required");
  }

  return {
    name: String(data.name).trim(),
    email: String(data.email).trim().toLowerCase(),
    phone: String(data.phone).trim(),
    nationality: String(data.nationality).trim(),
    from: String(data.from).trim(),
    to: String(data.to).trim(),
    departDate,
    returnDate,
    airline: String(data.airline).trim(),
    airlineClass: String(data.airlineClass).trim(),
    adults,
    children,
    childAges: Array.isArray(data.childAges) ? data.childAges.map(Number).filter((age: number) => !isNaN(age) && age >= 0 && age <= 16) : [],
    rooms,
    selectedServices: Array.isArray(data.selectedServices) && data.selectedServices.length > 0
      ? data.selectedServices.filter((s: any) => s && s.serviceId && s.serviceName && typeof s.price === 'number')
      : [],
    // Legacy fields for backward compatibility
    umrahVisa: Boolean(data.umrahVisa),
    transport: Boolean(data.transport),
    zaiarat: Boolean(data.zaiarat),
    meals: Boolean(data.meals),
    esim: Boolean(data.esim),
    hotels,
    status: data.status || "pending",
    notes: data.notes ? String(data.notes).trim() : undefined,
  };
};

/**
 * ================= SERIALIZER =================
 */
export const serializeCustomUmrahRequest = (request: any) => {
  // Handle ObjectId conversion - check if it's an ObjectId object with buffer
  let idString: string;
  if (request._id) {
    if (typeof request._id === 'object' && request._id.toString) {
      idString = request._id.toString();
    } else if (typeof request._id === 'string') {
      idString = request._id;
    } else {
      idString = String(request._id);
    }
  } else {
    idString = String(request._id || '');
  }
  
  return {
    _id: idString,
    name: request.name,
    email: request.email,
    phone: request.phone,
    nationality: request.nationality,
    from: request.from,
    to: request.to,
    departDate: request.departDate instanceof Date ? request.departDate.toISOString() : (request.departDate?.toISOString?.() || request.departDate),
    returnDate: request.returnDate instanceof Date ? request.returnDate.toISOString() : (request.returnDate?.toISOString?.() || request.returnDate),
    airline: request.airline,
    airlineClass: request.airlineClass,
    adults: request.adults,
    children: request.children,
    childAges: Array.isArray(request.childAges) ? request.childAges : [],
    rooms: request.rooms,
    selectedServices: Array.isArray(request.selectedServices)
      ? request.selectedServices.length > 0
        ? request.selectedServices.map((s: any) => ({
            serviceId: String(s.serviceId),
            serviceName: String(s.serviceName),
            price: Number(s.price || 0),
          }))
        : []
      : [],
    // Legacy fields for backward compatibility
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
    paymentMethod: request.paymentMethod,
    createdAt: request.createdAt instanceof Date ? request.createdAt.toISOString() : (request.createdAt?.toISOString?.() || request.createdAt),
    updatedAt: request.updatedAt instanceof Date ? request.updatedAt.toISOString() : (request.updatedAt?.toISOString?.() || request.updatedAt),
  };
};

/**
 * ================= CUSTOM UMRAH REQUEST CRUD =================
 */

/** Create a new custom umrah request */
export const createCustomUmrahRequest = async (data: any) => {
  try {
    console.log("Creating custom Umrah request with data:", {
      name: data.name,
      email: data.email,
      hotelsCount: data.hotels?.length || 0,
    });
    
    // Sanitize and validate data
    let requestData;
    try {
      requestData = sanitizeCustomUmrahRequestData(data);
    } catch (sanitizeError: any) {
      console.error("Data sanitization error:", sanitizeError);
      throw new Error(sanitizeError?.message || "Invalid data provided");
    }
    
    console.log("Sanitized data:", {
      name: requestData.name,
      email: requestData.email,
      hotelsCount: requestData.hotels?.length || 0,
      hotels: requestData.hotels,
      selectedServicesCount: Array.isArray(requestData.selectedServices) ? requestData.selectedServices.length : 0,
      selectedServices: requestData.selectedServices,
      selectedServicesType: typeof requestData.selectedServices,
      selectedServicesIsArray: Array.isArray(requestData.selectedServices),
    });
    
    // Create and save request
    let request;
    try {
      // Ensure selectedServices is always an array, even if empty
      const dataToSave = {
        ...requestData,
        selectedServices: Array.isArray(requestData.selectedServices) ? requestData.selectedServices : [],
      };
      console.log("Data being saved to MongoDB:", {
        selectedServices: dataToSave.selectedServices,
        selectedServicesLength: dataToSave.selectedServices.length,
        selectedServicesType: typeof dataToSave.selectedServices,
        selectedServicesIsArray: Array.isArray(dataToSave.selectedServices),
      });
      request = await new CustomUmrahRequest(dataToSave).save();
      console.log("Request saved successfully with ID:", request._id);
      console.log("Saved request selectedServices:", request.selectedServices);
    } catch (saveError: any) {
      console.error("MongoDB save error:", saveError);
      // Check for specific MongoDB errors
      if (saveError?.code === 11000) {
        throw new Error("A request with this information already exists");
      }
      if (saveError?.errors) {
        const validationErrors = Object.values(saveError.errors)
          .map((err: any) => err.message)
          .join(", ");
        throw new Error(`Validation error: ${validationErrors}`);
      }
      throw new Error(saveError?.message || "Failed to save request to database");
    }
    
    // Serialize response
    try {
      return serializeCustomUmrahRequest(request);
    } catch (serializeError: any) {
      console.error("Serialization error:", serializeError);
      throw new Error("Failed to process request data");
    }
  } catch (error: any) {
    console.error("Error in createCustomUmrahRequest:", error);
    // Re-throw with proper error message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error?.message || "Failed to create custom Umrah request");
  }
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

