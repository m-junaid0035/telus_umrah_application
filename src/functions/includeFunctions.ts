import { PackageInclude, IPackageInclude } from "@/models/Includes";

/**
 * ================= SANITIZER =================
 */
const sanitizeIncludeData = (data: { include_text: string }) => ({
  include_text: data.include_text.trim(),
});

/**
 * ================= SERIALIZER =================
 */
const serializeInclude = (include: any) => ({
  _id: include._id.toString(),
  include_text: include.include_text,
  createdAt: include.createdAt?.toISOString?.(),
  updatedAt: include.updatedAt?.toISOString?.(),
});

/**
 * ================= PACKAGE INCLUDE CRUD =================
 */

/** Create a new include */
export const createInclude = async (data: any) => {
  const includeData = sanitizeIncludeData(data);
  const include = await new PackageInclude(includeData).save();
  return serializeInclude(include);
};

/** Get all includes (sorted by creation date) */
export const getAllIncludes = async () => {
  const includes = await PackageInclude.find().sort({ createdAt: -1 }).lean();
  return includes.map(serializeInclude);
};

/** Get a single include by ID */
export const getIncludeById = async (id: string) => {
  const include = await PackageInclude.findById(id).lean();
  return include ? serializeInclude(include) : null;
};

/** Update include by ID */
export const updateInclude = async (id: string, data: any) => {
  const updatedData = sanitizeIncludeData(data);
  const include = await PackageInclude.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return include ? serializeInclude(include) : null;
};

/** Delete an include by ID */
export const deleteInclude = async (id: string) => {
  const include = await PackageInclude.findByIdAndDelete(id).lean();
  return include ? serializeInclude(include) : null;
};

/**
 * ================= ADDITIONAL HELPERS =================
 */

/** Search includes by keyword */
export const getIncludesByKeyword = async (keyword: string) => {
  const includes = await PackageInclude.find({
    include_text: { $regex: keyword, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .lean();
  return includes.map(serializeInclude);
};
