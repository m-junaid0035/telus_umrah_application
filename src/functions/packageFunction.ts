  import { UmrahPackage, IUmrahPackage } from "@/models/UmrahPackage";
  import { Hotel } from "@/models/Hotel";
  import { PackageFeature } from "@/models/PackageFeatures";
  import { Itinerary } from "@/models/Itineraries";
  import { PackageInclude } from "@/models/Includes";
  import { PackageExclude } from "@/models/Excludes";
  import { PackagePolicy } from "@/models/Policies";

  const cleanFlightSegment = (segment?: any) => {
    if (!segment) return {};
    return {
      flight: segment.flight?.trim() || "",
      sector: segment.sector?.trim() || "",
      departureTime: segment.departureTime?.trim() || "",
      arrivalTime: segment.arrivalTime?.trim() || "",
    };
  };

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
    flights: {
      departure: cleanFlightSegment(data.flights?.departure),
      arrival: cleanFlightSegment(data.flights?.arrival),
    },
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
    flights: pkg.flights || { departure: {}, arrival: {} },
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

/** Get all Umrah packages (sorted by creation date) with populated data */
export const getAllUmrahPackages = async () => {
  const packages = await UmrahPackage.find().sort({ createdAt: -1 }).lean();
  
  // Populate hotels and features for all packages
  const packagesWithData = await Promise.all(
    packages.map(async (pkg) => {
      const makkahHotel = pkg.hotels?.makkah ? await Hotel.findById(pkg.hotels.makkah).lean() : null;
      const madinahHotel = pkg.hotels?.madinah ? await Hotel.findById(pkg.hotels.madinah).lean() : null;
      const features = pkg.features && pkg.features.length > 0
        ? await PackageFeature.find({ _id: { $in: pkg.features } }).lean()
        : [];

      return {
        ...pkg,
        hotels: {
          makkah: makkahHotel ? {
            _id: makkahHotel._id.toString(),
            name: makkahHotel.name,
            type: makkahHotel.type,
            star: makkahHotel.star,
            distance: makkahHotel.distance,
          } : null,
          madinah: madinahHotel ? {
            _id: madinahHotel._id.toString(),
            name: madinahHotel.name,
            type: madinahHotel.type,
            star: madinahHotel.star,
            distance: madinahHotel.distance,
          } : null,
        },
        features: features.map((f: any) => ({
          _id: f._id.toString(),
          feature_text: f.feature_text,
        })),
      };
    })
  );

  return packagesWithData.map((pkg) => ({
    _id: pkg._id.toString(),
    name: pkg.name,
    price: pkg.price,
    duration: pkg.duration,
    badge: pkg.badge,
    airline: pkg.airline,
    departureCity: pkg.departureCity,
    image: pkg.image,
    popular: pkg.popular,
    hotels: pkg.hotels,
    features: pkg.features,
    travelers: pkg.travelers,
    rating: pkg.rating,
    reviews: pkg.reviews,
    flights: pkg.flights || { departure: {}, arrival: {} },
    createdAt: pkg.createdAt?.toISOString(),
    updatedAt: pkg.updatedAt?.toISOString(),
  }));
};

  /** Get a single Umrah package by ID with populated data */
  export const getUmrahPackageById = async (id: string) => {
    const pkg = await UmrahPackage.findById(id).lean();
    if (!pkg) return null;

    // Populate hotels
    const makkahHotel = pkg.hotels?.makkah ? await Hotel.findById(pkg.hotels.makkah).lean() : null;
    const madinahHotel = pkg.hotels?.madinah ? await Hotel.findById(pkg.hotels.madinah).lean() : null;

    // Populate features
    const features = pkg.features && pkg.features.length > 0
      ? await PackageFeature.find({ _id: { $in: pkg.features } }).lean()
      : [];

    // Populate itineraries
    const itineraries = pkg.itinerary && pkg.itinerary.length > 0
      ? await Itinerary.find({ _id: { $in: pkg.itinerary } }).lean()
      : [];

    // Populate includes
    const includes = pkg.includes && pkg.includes.length > 0
      ? await PackageInclude.find({ _id: { $in: pkg.includes } }).lean()
      : [];

    // Populate excludes
    const excludes = pkg.excludes && pkg.excludes.length > 0
      ? await PackageExclude.find({ _id: { $in: pkg.excludes } }).lean()
      : [];

    // Populate policies
    const policies = pkg.policies && pkg.policies.length > 0
      ? await PackagePolicy.find({ _id: { $in: pkg.policies } }).lean()
      : [];

    return {
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
        makkah: makkahHotel ? {
          _id: makkahHotel._id.toString(),
          name: makkahHotel.name,
          type: makkahHotel.type,
        } : pkg.hotels?.makkah?.toString(),
        madinah: madinahHotel ? {
          _id: madinahHotel._id.toString(),
          name: madinahHotel.name,
          type: madinahHotel.type,
        } : pkg.hotels?.madinah?.toString(),
      },
      features: features.map((f: any) => ({
        _id: f._id.toString(),
        feature_text: f.feature_text,
      })),
      itinerary: itineraries.map((i: any) => ({
        _id: i._id.toString(),
        title: i.title,
      })),
      includes: includes.map((i: any) => ({
        _id: i._id.toString(),
        include_text: i.include_text,
      })),
      excludes: excludes.map((e: any) => ({
        _id: e._id.toString(),
        exclude_text: e.exclude_text,
      })),
      policies: policies.map((p: any) => ({
        _id: p._id.toString(),
        heading: p.heading,
      })),
      travelers: pkg.travelers,
      rating: pkg.rating,
      reviews: pkg.reviews,
      flights: pkg.flights || { departure: {}, arrival: {} },
      createdAt: pkg.createdAt?.toISOString(),
      updatedAt: pkg.updatedAt?.toISOString(),
    };
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
