import { fetchFeatureByIdAction } from "@/actions/featureActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Feature {
  _id: string;
  feature_text: string;
  createdAt?: string;
  updatedAt?: string;
}

export default async function FeatureViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchFeatureByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const feature: Feature = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">
          View Feature
        </h2>
        <Link href="/admin/features">
          <Button variant="secondary">Back to Features</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Feature Text */}
        <div>
          <p className="text-sm text-black">Feature Text</p>
          <p className="text-lg font-medium text-black">
            {feature.feature_text || "N/A"}
          </p>
        </div>

        {/* Created At */}
        {feature.createdAt && (
          <div>
            <p className="text-sm text-black">
              Created At
            </p>
            <p className="text-black">
              {new Date(feature.createdAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Updated At */}
        {feature.updatedAt && (
          <div>
            <p className="text-sm text-black">
              Last Updated
            </p>
            <p className="text-black">
              {new Date(feature.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
