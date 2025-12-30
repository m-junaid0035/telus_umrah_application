import { PackageBooking, IPackageBooking, BookingStatus } from "@/models/PackageBooking";
import { UmrahPackage } from "@/models/UmrahPackage";

/**
 * ================= SANITIZER =================
 */
const sanitizePerson = (p: any) => ({
  name: p?.name ? String(p.name).trim() : "",
  gender: p?.gender || "",
  nationality: p?.nationality ? String(p.nationality).trim() : undefined,
  passportNumber: p?.passportNumber ? String(p.passportNumber).trim() : undefined,
  age: p?.age !== undefined && p?.age !== null && p !== "" ? Number(p.age) : undefined,
  phone: p?.phone ? String(p.phone).trim() : undefined,
  isHead: p?.isHead ? Boolean(p.isHead) : false,
});

const sanitizePackageBookingData = (data: any) => {
  // prefer structured arrays (adults/children/infants) or fall back to travelerDetails payload
  const rawAdults = Array.isArray(data.adults)
    ? data.adults
    : Array.isArray(data.travelerDetails?.adults)
    ? data.travelerDetails.adults
    : [];

  const rawChildren = Array.isArray(data.children)
    ? data.children
    : Array.isArray(data.travelerDetails?.children)
    ? data.travelerDetails.children
    : [];

  const rawInfants = Array.isArray(data.infants)
    ? data.infants
    : Array.isArray(data.travelerDetails?.infants)
    ? data.travelerDetails.infants
    : [];
  // Prepare sanitized arrays
  const adultsSanitized = rawAdults.map(sanitizePerson);
  const childrenSanitized = rawChildren.map(sanitizePerson);
  const infantsSanitized = rawInfants.map(sanitizePerson);

  // Derive family head for backward compatibility
  const head = adultsSanitized.find((a: any) => a.isHead) || adultsSanitized[0] || null;

  // Build a travelers object compatible with older schema versions
  const travelersObj: any = {
    adults: adultsSanitized.length || (typeof data.adults === 'number' ? data.adults : undefined) || 1,
    children: childrenSanitized.length || (typeof data.children === 'number' ? data.children : undefined) || 0,
  };
  if (childrenSanitized.length > 0) travelersObj.childAges = childrenSanitized.map((c: any) => (c.age !== undefined ? Number(c.age) : 0));

  return {
    packageId: data.packageId?.trim(),
    // Keep canonical customer email
    customerEmail: data.customerEmail?.trim().toLowerCase(),
    // Backwards-compatible fields (some deployments may still expect these)
    customerName: head?.name || data.customerName || undefined,
    customerPhone: head?.phone || data.customerPhone || undefined,
    travelers: travelersObj,
    // New canonical arrays
    adults: adultsSanitized,
    children: childrenSanitized,
    infants: infantsSanitized,
    rooms: Number(data.rooms || 1),
    checkInDate: data.checkInDate ? new Date(data.checkInDate) : undefined,
    checkOutDate: data.checkOutDate ? new Date(data.checkOutDate) : undefined,
    umrahVisa: Boolean(data.umrahVisa),
    transport: Boolean(data.transport),
    zaiarat: Boolean(data.zaiarat),
    meals: Boolean(data.meals),
    esim: Boolean(data.esim),
    status: data.status || BookingStatus.Pending,
    notes: data.notes?.trim(),
    totalAmount: data.totalAmount ? Number(data.totalAmount) : undefined,
    paidAmount: data.paidAmount ? Number(data.paidAmount) : 0,
    paymentStatus: data.paymentStatus || "pending",
    paymentMethod: data.paymentMethod,
    invoiceGenerated: data.invoiceGenerated,
    invoiceSent: data.invoiceSent,
    invoiceUrl: data.invoiceUrl?.trim(),
    invoiceNumber: data.invoiceNumber?.trim(),
  };
};

/**
 * ================= SERIALIZER =================
 */
export const serializePackageBooking = (booking: any) => {
  // Populate package name if available
  const packageName = booking.packageName || undefined;

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

  return {
    _id: String(bookingId),
    packageId: String(booking.packageId || ""),
    packageName: packageName ? String(packageName) : undefined,
    // Derive customer name/phone from adults array (family head) for package bookings
    customerName: ((): string => {
      try {
        const head = Array.isArray(booking.adults) ? (booking.adults.find((a: any) => a.isHead) || booking.adults[0]) : null;
        return String((head && head.name) || booking.customerName || "");
      } catch (e) {
        return String(booking.customerName || "");
      }
    })(),
    customerEmail: String(booking.customerEmail || ""),
    customerPhone: ((): string => {
      try {
        const head = Array.isArray(booking.adults) ? (booking.adults.find((a: any) => a.isHead) || booking.adults[0]) : null;
        return String((head && head.phone) || booking.customerPhone || "");
      } catch (e) {
        return String(booking.customerPhone || "");
      }
    })(),
    customerNationality: booking.customerNationality ? String(booking.customerNationality) : undefined,
    adults: Array.isArray(booking.adults) ? booking.adults.map((a: any) => ({
      name: String(a.name || ""),
      gender: a.gender || "",
      nationality: a.nationality ? String(a.nationality) : undefined,
      passportNumber: a.passportNumber ? String(a.passportNumber) : undefined,
      age: a.age !== undefined && a.age !== null ? Number(a.age) : undefined,
      phone: a.phone ? String(a.phone) : undefined,
      isHead: Boolean(a.isHead || false),
    })) : [],
    children: Array.isArray(booking.children) ? booking.children.map((c: any) => ({
      name: String(c.name || ""),
      gender: c.gender || "",
      nationality: c.nationality ? String(c.nationality) : undefined,
      passportNumber: c.passportNumber ? String(c.passportNumber) : undefined,
      age: c.age !== undefined && c.age !== null ? Number(c.age) : undefined,
    })) : [],
    infants: Array.isArray(booking.infants) ? booking.infants.map((c: any) => ({
      name: String(c.name || ""),
      gender: c.gender || "",
      nationality: c.nationality ? String(c.nationality) : undefined,
      passportNumber: c.passportNumber ? String(c.passportNumber) : undefined,
      age: c.age !== undefined && c.age !== null ? Number(c.age) : undefined,
    })) : [],
    rooms: Number(booking.rooms || 1),
    checkInDate: booking.checkInDate?.toISOString?.() || (booking.checkInDate instanceof Date ? booking.checkInDate.toISOString() : booking.checkInDate) || undefined,
    checkOutDate: booking.checkOutDate?.toISOString?.() || (booking.checkOutDate instanceof Date ? booking.checkOutDate.toISOString() : booking.checkOutDate) || undefined,
    umrahVisa: Boolean(booking.umrahVisa),
    transport: Boolean(booking.transport),
    zaiarat: Boolean(booking.zaiarat),
    meals: Boolean(booking.meals),
    esim: Boolean(booking.esim),
    status: String(booking.status || BookingStatus.Pending),
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
};

/**
 * ================= PACKAGE BOOKING CRUD =================
 */

/** Create a new package booking */
export const createPackageBooking = async (data: any) => {
  const bookingData = sanitizePackageBookingData(data);
  try {
    console.log("[packageBookingFunctions] creating booking with data:", bookingData);
    const booking = await new PackageBooking(bookingData).save();
    console.log("[packageBookingFunctions] booking saved with id:", booking._id?.toString?.() || booking._id);
    return serializePackageBooking(booking);
  } catch (err: any) {
    console.error("[packageBookingFunctions] error saving booking:", err?.message || err);
    throw err;
  }
};

/** Get all package bookings (sorted by creation date) */
export const getAllPackageBookings = async () => {
  const bookings = await PackageBooking.find().sort({ createdAt: -1 }).lean();
  
  // Populate package names
  const bookingsWithPackageNames = await Promise.all(
    bookings.map(async (booking) => {
      const pkg = await UmrahPackage.findById(booking.packageId).lean();
      return {
        ...booking,
        packageName: pkg?.name,
      };
    })
  );
  
  return bookingsWithPackageNames.map(serializePackageBooking);
};

/** Get a single package booking by ID */
export const getPackageBookingById = async (id: string) => {
  const booking = await PackageBooking.findById(id).lean();
  if (!booking) return null;

  // Populate package name
  const pkg = await UmrahPackage.findById(booking.packageId).lean();
  return serializePackageBooking({
    ...booking,
    packageName: pkg?.name,
  });
};

/** Update package booking by ID */
export const updatePackageBooking = async (id: string, data: any) => {
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
    const sanitized = sanitizePackageBookingData(data);
    Object.assign(updateData, sanitized);
  }
  
  const booking = await PackageBooking.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
  
  if (!booking) return null;

  // Populate package name
  const pkg = await UmrahPackage.findById(booking.packageId).lean();
  return serializePackageBooking({
    ...booking,
    packageName: pkg?.name,
  });
};

/** Delete a package booking by ID */
export const deletePackageBooking = async (id: string) => {
  const booking = await PackageBooking.findByIdAndDelete(id).lean();
  return booking ? serializePackageBooking(booking) : null;
};

/**
 * ================= ADDITIONAL HELPERS =================
 */

/** Get bookings by status */
export const getPackageBookingsByStatus = async (status: string) => {
  const bookings = await PackageBooking.find({ status }).sort({ createdAt: -1 }).lean();
  
  // Populate package names
  const bookingsWithPackageNames = await Promise.all(
    bookings.map(async (booking) => {
      const pkg = await UmrahPackage.findById(booking.packageId).lean();
      return {
        ...booking,
        packageName: pkg?.name,
      };
    })
  );
  
  return bookingsWithPackageNames.map(serializePackageBooking);
};

