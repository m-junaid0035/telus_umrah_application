import { PackageExclude, IPackageExclude } from "@/models/Excludes";

/**
 * ================= SANITIZER =================
 */
const sanitizeExcludeData = (data: { exclude_text: string }) => ({
  exclude_text: data.exclude_text.trim(),
});

/**
 * ================= SERIALIZER =================
 */
const serializeExclude = (exclude: any) => ({
  _id: exclude._id.toString(),
  exclude_text: exclude.exclude_text,
  createdAt: exclude.createdAt?.toISOString?.(),
  updatedAt: exclude.updatedAt?.toISOString?.(),
});

/**
 * ================= PACKAGE EXCLUDE CRUD =================
 */

/** Create a new exclude */
export const createExclude = async (data: any) => {
  const excludeData = sanitizeExcludeData(data);
  const exclude = await new PackageExclude(excludeData).save();
  return serializeExclude(exclude);
};

/** Get all excludes (sorted by creation date) */
export const getAllExcludes = async () => {
  const excludes = await PackageExclude.find().sort({ createdAt: -1 }).lean();
  return excludes.map(serializeExclude);
};

/** Get a single exclude by ID */
export const getExcludeById = async (id: string) => {
  const exclude = await PackageExclude.findById(id).lean();
  return exclude ? serializeExclude(exclude) : null;
};

/** Update exclude by ID */
export const updateExclude = async (id: string, data: any) => {
  const updatedData = sanitizeExcludeData(data);
  const exclude = await PackageExclude.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return exclude ? serializeExclude(exclude) : null;
};

/** Delete an exclude by ID */
export const deleteExclude = async (id: string) => {
  const exclude = await PackageExclude.findByIdAndDelete(id).lean();
  return exclude ? serializeExclude(exclude) : null;
};

/**
 * ================= ADDITIONAL HELPERS =================
 */

/** Search excludes by keyword */
export const getExcludesByKeyword = async (keyword: string) => {
  const excludes = await PackageExclude.find({
    exclude_text: { $regex: keyword, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .lean();
  return excludes.map(serializeExclude);
};
