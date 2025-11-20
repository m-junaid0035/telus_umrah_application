import { HotelBooking, IHotelBooking, HotelBookingStatus } from "@/models/HotelBooking";
import { Hotel } from "@/models/Hotel";

/**
 * ================= SANITIZER =================
 */
const sanitizeHotelBookingData = (data: any) => ({
  hotelId: data.hotelId.trim(),
  hotelName: data.hotelName?.trim(),
  customerName: data.customerName.trim(),
  customerEmail: data.customerEmail.trim().toLowerCase(),
  customerPhone: data.customerPhone.trim(),
  customerNationality: data.customerNationality?.trim(),
  checkInDate: new Date(data.checkInDate),
  checkOutDate: new Date(data.checkOutDate),
  rooms: Number(data.rooms || 1),
  adults: Number(data.adults || 1),
  children: Number(data.children || 0),
  childAges: Array.isArray(data.childAges)
    ? data.childAges.map(Number)
    : [],
  bedType: data.bedType?.trim(),
  meals: Boolean(data.meals),
  transport: Boolean(data.transport),
  status: data.status || HotelBookingStatus.Pending,
  notes: data.notes?.trim(),
  totalAmount: data.totalAmount ? Number(data.totalAmount) : undefined,
  paidAmount: data.paidAmount ? Number(data.paidAmount) : 0,
  paymentStatus: data.paymentStatus || "pending",
});

/**
 * ================= SERIALIZER =================
 */
export const serializeHotelBooking = (booking: any) => {
  if (!booking || !booking._id) {
    console.warn("serializeHotelBooking - Invalid booking data:", booking);
    return null;
  }

  try {
    // Populate hotel name if available
    const hotelName = booking.hotelName || undefined;

    // Ensure _id is always a string
    let bookingId = booking._id;
    if (bookingId && typeof bookingId === 'object') {
      // Handle MongoDB ObjectId
      if ('toString' in bookingId) {
        bookingId = bookingId.toString();
      } else if ('buffer' in bookingId) {
        // Handle ObjectId buffer
        bookingId = String(bookingId);
      }
    }
    if (!bookingId) {
      bookingId = String(booking._id || '');
    }

    const serialized = {
      _id: String(bookingId),
      hotelId: String(booking.hotelId || ""),
      hotelName: hotelName ? String(hotelName) : undefined,
      customerName: String(booking.customerName || ""),
      customerEmail: String(booking.customerEmail || ""),
      customerPhone: String(booking.customerPhone || ""),
      customerNationality: booking.customerNationality ? String(booking.customerNationality) : undefined,
      checkInDate: booking.checkInDate?.toISOString?.() || (booking.checkInDate instanceof Date ? booking.checkInDate.toISOString() : booking.checkInDate) || "",
      checkOutDate: booking.checkOutDate?.toISOString?.() || (booking.checkOutDate instanceof Date ? booking.checkOutDate.toISOString() : booking.checkOutDate) || "",
      rooms: Number(booking.rooms) || 1,
      adults: Number(booking.adults) || 1,
      children: Number(booking.children) || 0,
      childAges: Array.isArray(booking.childAges) ? booking.childAges.map(Number) : [],
      bedType: booking.bedType ? String(booking.bedType) : undefined,
      meals: Boolean(booking.meals),
      transport: Boolean(booking.transport),
      status: String(booking.status || HotelBookingStatus.Pending),
      notes: booking.notes ? String(booking.notes) : undefined,
      totalAmount: booking.totalAmount ? Number(booking.totalAmount) : undefined,
      paidAmount: Number(booking.paidAmount || 0),
      paymentStatus: String(booking.paymentStatus || "pending"),
      paymentMethod: booking.paymentMethod ? String(booking.paymentMethod) : undefined,
      createdAt: booking.createdAt?.toISOString?.() || (booking.createdAt instanceof Date ? booking.createdAt.toISOString() : booking.createdAt) || "",
      updatedAt: booking.updatedAt?.toISOString?.() || (booking.updatedAt instanceof Date ? booking.updatedAt.toISOString() : booking.updatedAt) || "",
    };

    return serialized;
  } catch (error: any) {
    console.error("serializeHotelBooking - Error serializing booking:", error, booking);
    return null;
  }
};

/**
 * ================= HOTEL BOOKING CRUD =================
 */

/** Create a new hotel booking */
export const createHotelBooking = async (data: any) => {
  try {
    console.log("createHotelBooking - Input data:", data);
    const bookingData = sanitizeHotelBookingData(data);
    console.log("createHotelBooking - Sanitized data:", bookingData);
    
    const booking = await new HotelBooking(bookingData).save();
    console.log("createHotelBooking - Saved booking:", booking);
    
    const serialized = serializeHotelBooking(booking);
    console.log("createHotelBooking - Serialized booking:", serialized);
    return serialized;
  } catch (error: any) {
    console.error("createHotelBooking - Error:", error);
    throw error;
  }
};

/** Get all hotel bookings (sorted by creation date) */
export const getAllHotelBookings = async () => {
  try {
    console.log("getAllHotelBookings - Starting fetch...");
    const bookings = await HotelBooking.find().sort({ createdAt: -1 }).lean();
    console.log("getAllHotelBookings - Raw bookings count from DB:", bookings.length);
    
    if (bookings.length === 0) {
      console.log("getAllHotelBookings - No bookings found in database");
      return [];
    }
    
    // Populate hotel names (use saved hotelName if available, otherwise fetch from Hotel model)
    const bookingsWithHotelNames = await Promise.all(
      bookings.map(async (booking) => {
        // Use saved hotelName if available
        if (booking.hotelName) {
          return {
            ...booking,
            hotelName: booking.hotelName,
          };
        }
        // Otherwise, fetch from Hotel model
        try {
          const hotel = await Hotel.findById(booking.hotelId).lean();
          return {
            ...booking,
            hotelName: hotel?.name || booking.hotelId,
          };
        } catch (err) {
          console.warn(`getAllHotelBookings - Could not fetch hotel for ID ${booking.hotelId}:`, err);
          return {
            ...booking,
            hotelName: booking.hotelId,
          };
        }
      })
    );
    
    const serialized = bookingsWithHotelNames
      .map(serializeHotelBooking)
      .filter((booking) => booking && booking._id); // Filter out any null/undefined bookings
    
    console.log("getAllHotelBookings - Serialized bookings count:", serialized.length);
    if (serialized.length > 0) {
      console.log("getAllHotelBookings - Sample serialized booking:", serialized[0]);
    }
    return serialized;
  } catch (error: any) {
    console.error("getAllHotelBookings - Error:", error);
    throw error;
  }
};

/** Get a single hotel booking by ID */
export const getHotelBookingById = async (id: string) => {
  const booking = await HotelBooking.findById(id).lean();
  if (!booking) return null;

  // Use saved hotelName if available, otherwise fetch from Hotel model
  let hotelName = booking.hotelName;
  if (!hotelName) {
    const hotel = await Hotel.findById(booking.hotelId).lean();
    hotelName = hotel?.name || booking.hotelId;
  }
  
  return serializeHotelBooking({
    ...booking,
    hotelName,
  });
};

/** Update hotel booking by ID */
export const updateHotelBooking = async (id: string, data: any) => {
  const updatedData = sanitizeHotelBookingData(data);
  const booking = await HotelBooking.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  
  if (!booking) return null;

  // Use saved hotelName if available, otherwise fetch from Hotel model
  let hotelName = booking.hotelName;
  if (!hotelName) {
    const hotel = await Hotel.findById(booking.hotelId).lean();
    hotelName = hotel?.name || booking.hotelId;
  }
  
  return serializeHotelBooking({
    ...booking,
    hotelName,
  });
};

/** Delete a hotel booking by ID */
export const deleteHotelBooking = async (id: string) => {
  const booking = await HotelBooking.findByIdAndDelete(id).lean();
  return booking ? serializeHotelBooking(booking) : null;
};

/**
 * ================= ADDITIONAL HELPERS =================
 */

/** Get bookings by status */
export const getHotelBookingsByStatus = async (status: string) => {
  const bookings = await HotelBooking.find({ status }).sort({ createdAt: -1 }).lean();
  
  // Populate hotel names (use saved hotelName if available, otherwise fetch from Hotel model)
  const bookingsWithHotelNames = await Promise.all(
    bookings.map(async (booking) => {
      // Use saved hotelName if available
      if (booking.hotelName) {
        return {
          ...booking,
          hotelName: booking.hotelName,
        };
      }
      // Otherwise, fetch from Hotel model
      const hotel = await Hotel.findById(booking.hotelId).lean();
      return {
        ...booking,
        hotelName: hotel?.name || booking.hotelId,
      };
    })
  );
  
  return bookingsWithHotelNames.map(serializeHotelBooking);
};

