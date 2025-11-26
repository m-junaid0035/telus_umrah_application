import { PackageBooking, IPackageBooking, BookingStatus } from "@/models/PackageBooking";
import { UmrahPackage } from "@/models/UmrahPackage";

/**
 * ================= SANITIZER =================
 */
const sanitizePackageBookingData = (data: any) => ({
  packageId: data.packageId.trim(),
  customerName: data.customerName.trim(),
  customerEmail: data.customerEmail.trim().toLowerCase(),
  customerPhone: data.customerPhone.trim(),
  customerNationality: data.customerNationality?.trim(),
  travelers: {
    adults: Number(data.travelers?.adults || data.adults || 1),
    children: Number(data.travelers?.children || data.children || 0),
    childAges: Array.isArray(data.travelers?.childAges || data.childAges)
      ? (data.travelers?.childAges || data.childAges).map(Number)
      : [],
  },
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
});

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
    customerName: String(booking.customerName || ""),
    customerEmail: String(booking.customerEmail || ""),
    customerPhone: String(booking.customerPhone || ""),
    customerNationality: booking.customerNationality ? String(booking.customerNationality) : undefined,
    travelers: {
      adults: Number(booking.travelers?.adults || booking.adults || 0),
      children: Number(booking.travelers?.children || booking.children || 0),
      childAges: Array.isArray(booking.travelers?.childAges || booking.childAges)
        ? (booking.travelers?.childAges || booking.childAges).map(Number)
        : [],
    },
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
  const booking = await new PackageBooking(bookingData).save();
  return serializePackageBooking(booking);
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

