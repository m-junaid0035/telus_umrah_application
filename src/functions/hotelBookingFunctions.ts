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
  bedType: data.bedType?.trim() || undefined,
  roomType: (data.roomType && data.roomType.trim()) ? data.roomType.trim() : "standard", // Always set roomType, default to standard
  meals: Boolean(data.meals),
  transport: Boolean(data.transport),
  status: data.status || HotelBookingStatus.Pending,
  notes: data.notes?.trim(),
  totalAmount: data.totalAmount ? Number(data.totalAmount) : undefined,
  paidAmount: data.paidAmount ? Number(data.paidAmount) : 0,
  paymentStatus: data.paymentStatus || "pending",
  paymentMethod: data.paymentMethod,
  invoiceGenerated: data.invoiceGenerated,
  invoiceSent: data.invoiceSent,
  invoiceUrl: data.invoiceUrl?.trim(),
  invoiceNumber: data.invoiceNumber?.trim(),
});

/**
 * ================= SERIALIZER =================
 */
export const serializeHotelBooking = (booking: any) => {
  if (!booking || !booking._id) {
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
      roomType: booking.roomType ? String(booking.roomType) : undefined,
      meals: Boolean(booking.meals),
      transport: Boolean(booking.transport),
      status: String(booking.status || HotelBookingStatus.Pending),
      notes: booking.notes ? String(booking.notes) : undefined,
      totalAmount: booking.totalAmount ? Number(booking.totalAmount) : undefined,
      paidAmount: Number(booking.paidAmount || 0),
      paymentStatus: String(booking.paymentStatus || "pending"),
      paymentMethod: booking.paymentMethod ? String(booking.paymentMethod) : undefined,
      invoiceGenerated: Boolean(booking.invoiceGenerated || false),
      invoiceSent: Boolean(booking.invoiceSent || false),
      invoiceUrl: booking.invoiceUrl ? String(booking.invoiceUrl) : undefined,
      invoiceNumber: booking.invoiceNumber ? String(booking.invoiceNumber) : undefined,
      createdAt: booking.createdAt?.toISOString?.() || (booking.createdAt instanceof Date ? booking.createdAt.toISOString() : booking.createdAt) || "",
      updatedAt: booking.updatedAt?.toISOString?.() || (booking.updatedAt instanceof Date ? booking.updatedAt.toISOString() : booking.updatedAt) || "",
    };

    return serialized;
  } catch (error: any) {
    return null;
  }
};

/**
 * ================= HOTEL BOOKING CRUD =================
 */

/** Create a new hotel booking */
export const createHotelBooking = async (data: any) => {
  try {
    const bookingData = sanitizeHotelBookingData(data);
    const booking = await new HotelBooking(bookingData).save();
    const serialized = serializeHotelBooking(booking);
    return serialized;
  } catch (error: any) {
    throw error;
  }
};

/** Get all hotel bookings (sorted by creation date) */
export const getAllHotelBookings = async () => {
  try {
    const bookings = await HotelBooking.find().sort({ createdAt: -1 }).lean();
    
    if (bookings.length === 0) {
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
    
    return serialized;
  } catch (error: any) {
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
  // Handle partial updates - only include fields that are provided
  const updateData: any = {};
  if (data.invoiceGenerated !== undefined) updateData.invoiceGenerated = data.invoiceGenerated;
  if (data.invoiceSent !== undefined) updateData.invoiceSent = data.invoiceSent;
  if (data.invoiceUrl !== undefined) updateData.invoiceUrl = data.invoiceUrl;
  if (data.invoiceNumber !== undefined) updateData.invoiceNumber = data.invoiceNumber;
  
  // If other fields are provided, sanitize and include them
  const hasOtherFields = Object.keys(data).some(key => 
    !['invoiceGenerated', 'invoiceSent', 'invoiceUrl', 'invoiceNumber'].includes(key)
  );
  
  if (hasOtherFields) {
    const sanitized = sanitizeHotelBookingData(data);
    Object.assign(updateData, sanitized);
  }
  
  const booking = await HotelBooking.findByIdAndUpdate(
    id,
    { $set: updateData },
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

