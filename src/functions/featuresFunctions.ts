import { PackageFeature, IPackageFeature } from "@/models/PackageFeatures";

/**
 * ================= SANITIZER =================
 */
const sanitizeFeatureData = (data: { feature_text: string }) => ({
  feature_text: data.feature_text.trim(),
});

/**
 * ================= SERIALIZER =================
 */
const serializeFeature = (feature: any) => ({
  _id: feature._id.toString(),
  feature_text: feature.feature_text,
  createdAt: feature.createdAt?.toISOString?.(),
  updatedAt: feature.updatedAt?.toISOString?.(),
});

/**
 * ================= PACKAGE FEATURE CRUD =================
 */

/** Create a new feature */
export const createFeature = async (data: any) => {
  const featureData = sanitizeFeatureData(data);
  const feature = await new PackageFeature(featureData).save();
  return serializeFeature(feature);
};

/** Get all features (sorted by creation date) */
export const getAllFeatures = async () => {
  const features = await PackageFeature.find().sort({ createdAt: -1 }).lean();
  return features.map(serializeFeature);
};

/** Get a single feature by ID */
export const getFeatureById = async (id: string) => {
  const feature = await PackageFeature.findById(id).lean();
  return feature ? serializeFeature(feature) : null;
};

/** Update feature by ID */
export const updateFeature = async (id: string, data: any) => {
  const updatedData = sanitizeFeatureData(data);
  const feature = await PackageFeature.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return feature ? serializeFeature(feature) : null;
};

/** Delete a feature by ID */
export const deleteFeature = async (id: string) => {
  const feature = await PackageFeature.findByIdAndDelete(id).lean();
  return feature ? serializeFeature(feature) : null;
};

/**
 * ================= ADDITIONAL HELPERS =================
 */

/** Search features by keyword */
export const getFeaturesByKeyword = async (keyword: string) => {
  const features = await PackageFeature.find({
    feature_text: { $regex: keyword, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .lean();
  return features.map(serializeFeature);
};
