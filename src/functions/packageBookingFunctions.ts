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
});

/**
 * ================= SERIALIZER =================
 */
const serializePackageBooking = (booking: any) => {
  // Populate package name if available
  const packageName = booking.packageName || undefined;

  return {
    _id: booking._id?.toString() || booking._id,
    packageId: booking.packageId,
    packageName,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    customerNationality: booking.customerNationality || undefined,
    travelers: {
      adults: booking.travelers?.adults || booking.adults || 0,
      children: booking.travelers?.children || booking.children || 0,
      childAges: Array.isArray(booking.travelers?.childAges || booking.childAges)
        ? (booking.travelers?.childAges || booking.childAges).map(Number)
        : [],
    },
    rooms: booking.rooms,
    checkInDate: booking.checkInDate?.toISOString?.() || (booking.checkInDate instanceof Date ? booking.checkInDate.toISOString() : booking.checkInDate),
    checkOutDate: booking.checkOutDate?.toISOString?.() || (booking.checkOutDate instanceof Date ? booking.checkOutDate.toISOString() : booking.checkOutDate),
    umrahVisa: booking.umrahVisa || false,
    transport: booking.transport || false,
    zaiarat: booking.zaiarat || false,
    meals: booking.meals || false,
    esim: booking.esim || false,
    status: booking.status || BookingStatus.Pending,
    notes: booking.notes || undefined,
    totalAmount: booking.totalAmount || undefined,
    paidAmount: booking.paidAmount || 0,
    paymentStatus: booking.paymentStatus || "pending",
    createdAt: booking.createdAt?.toISOString?.() || (booking.createdAt instanceof Date ? booking.createdAt.toISOString() : booking.createdAt),
    updatedAt: booking.updatedAt?.toISOString?.() || (booking.updatedAt instanceof Date ? booking.updatedAt.toISOString() : booking.updatedAt),
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
  const updatedData = sanitizePackageBookingData(data);
  const booking = await PackageBooking.findByIdAndUpdate(
    id,
    { $set: updatedData },
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

