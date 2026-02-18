import { Settings } from "@/models/Settings";

const serializeSettings = (settings: any) => ({
  _id: settings._id.toString(),
  agentDiscountPercent: settings.agentDiscountPercent ?? 0,
});

export const getSettings = async () => {
  const existing = await Settings.findOne({ key: "global" }).lean();
  if (existing) return serializeSettings(existing);

  const created = await Settings.create({ key: "global", agentDiscountPercent: 0 });
  return serializeSettings(created);
};

export const updateAgentDiscount = async (agentDiscountPercent: number) => {
  const normalized = Math.min(Math.max(agentDiscountPercent, 0), 100);
  const updated = await Settings.findOneAndUpdate(
    { key: "global" },
    { $set: { agentDiscountPercent: normalized } },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  return updated ? serializeSettings(updated) : null;
};
