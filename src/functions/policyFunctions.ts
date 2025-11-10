import { PackagePolicy, IPackagePolicy } from "@/models/Policies";

/**
 * ================= SANITIZER =================
 */
const sanitizePolicyData = (data: { heading: string; description: string }) => ({
  heading: data.heading.trim(),
  description: data.description.trim(),
});

/**
 * ================= SERIALIZER =================
 */
const serializePolicy = (policy: any) => ({
  _id: policy._id.toString(),
  heading: policy.heading,
  description: policy.description,
  createdAt: policy.createdAt?.toISOString?.(),
  updatedAt: policy.updatedAt?.toISOString?.(),
});

/**
 * ================= PACKAGE POLICY CRUD =================
 */

/** Create a new policy */
export const createPolicy = async (data: any) => {
  const policyData = sanitizePolicyData(data);
  const policy = await new PackagePolicy(policyData).save();
  return serializePolicy(policy);
};

/** Get all policies (sorted by creation date) */
export const getAllPolicies = async () => {
  const policies = await PackagePolicy.find().sort({ createdAt: -1 }).lean();
  return policies.map(serializePolicy);
};

/** Get a single policy by ID */
export const getPolicyById = async (id: string) => {
  const policy = await PackagePolicy.findById(id).lean();
  return policy ? serializePolicy(policy) : null;
};

/** Update policy by ID */
export const updatePolicy = async (id: string, data: any) => {
  const updatedData = sanitizePolicyData(data);
  const policy = await PackagePolicy.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return policy ? serializePolicy(policy) : null;
};

/** Delete a policy by ID */
export const deletePolicy = async (id: string) => {
  const policy = await PackagePolicy.findByIdAndDelete(id).lean();
  return policy ? serializePolicy(policy) : null;
};

/**
 * ================= ADDITIONAL HELPERS =================
 */

/** Search policies by keyword (matches heading or description) */
export const getPoliciesByKeyword = async (keyword: string) => {
  const policies = await PackagePolicy.find({
    $or: [
      { heading: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  return policies.map(serializePolicy);
};
