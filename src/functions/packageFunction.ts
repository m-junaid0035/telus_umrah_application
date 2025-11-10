import { UmrahPackage, IUmrahPackage } from "@/models/UmrahPackage";

/**
 * ================= SANITIZER =================
 */
const sanitizeUmrahPackageData = (data: any) => ({
  name: data.name.trim(),
  price: Number(data.price),
  duration: Number(data.duration),
  badge: data.badge?.trim(),
  airline: data.airline.trim(),
  departureCity: data.departureCity.trim(),
  image: data.image?.trim(),
  popular: Boolean(data.popular),
  hotels: {
    makkah: data.hotels?.makkah?.trim(),
    madinah: data.hotels?.madinah?.trim(),
  },
  features: Array.isArray(data.features) ? data.features : [],
  travelers: data.travelers?.trim(),
  rating: data.rating ? Number(data.rating) : undefined,
  reviews: data.reviews ? Number(data.reviews) : undefined,
  itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
  includes: Array.isArray(data.includes) ? data.includes : [],
  excludes: Array.isArray(data.excludes) ? data.excludes : [],
  policies: Array.isArray(data.policies) ? data.policies : [],
});

/**
 * ================= SERIALIZER =================
 */
const serializeUmrahPackage = (pkg: any) => ({
  _id: pkg._id.toString(),
  name: pkg.name,
  price: pkg.price,
  duration: pkg.duration,
  badge: pkg.badge,
  airline: pkg.airline,
  departureCity: pkg.departureCity,
  image: pkg.image,
  popular: pkg.popular,
  hotels: {
    makkah: pkg.hotels?.makkah?.toString(),
    madinah: pkg.hotels?.madinah?.toString(),
  },
  features: pkg.features?.map((f: any) => f.toString()) || [],
  itinerary: pkg.itinerary?.map((i: any) => i.toString()) || [],
  includes: pkg.includes?.map((i: any) => i.toString()) || [],
  excludes: pkg.excludes?.map((e: any) => e.toString()) || [],
  policies: pkg.policies?.map((p: any) => p.toString()) || [],
  travelers: pkg.travelers,
  rating: pkg.rating,
  reviews: pkg.reviews,
  createdAt: pkg.createdAt?.toISOString(),
  updatedAt: pkg.updatedAt?.toISOString(),
});


/**
 * ================= UMRAH PACKAGE CRUD =================
 */

/** Create a new Umrah package */
export const createUmrahPackage = async (data: any) => {
  const pkgData = sanitizeUmrahPackageData(data);
  const pkg = await new UmrahPackage(pkgData).save();
  return serializeUmrahPackage(pkg);
};

/** Get all Umrah packages (sorted by creation date) */
export const getAllUmrahPackages = async () => {
  const packages = await UmrahPackage.find().sort({ createdAt: -1 }).lean();
  return packages.map(serializeUmrahPackage);
};

/** Get a single Umrah package by ID */
export const getUmrahPackageById = async (id: string) => {
  const pkg = await UmrahPackage.findById(id).lean();
  return pkg ? serializeUmrahPackage(pkg) : null;
};

/** Update Umrah package by ID */
export const updateUmrahPackage = async (id: string, data: any) => {
  const updatedData = sanitizeUmrahPackageData(data);
  const pkg = await UmrahPackage.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return pkg ? serializeUmrahPackage(pkg) : null;
};

/** Delete Umrah package by ID */
export const deleteUmrahPackage = async (id: string) => {
  const pkg = await UmrahPackage.findByIdAndDelete(id).lean();
  return pkg ? serializeUmrahPackage(pkg) : null;
};

/**
 * ================= ADDITIONAL HELPERS =================
 */

/** Search Umrah packages by keyword (matches name or airline) */
export const getUmrahPackagesByKeyword = async (keyword: string) => {
  const packages = await UmrahPackage.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { airline: { $regex: keyword, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  return packages.map(serializeUmrahPackage);
};
