import { fetchIncludeByIdAction } from "@/actions/includeActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Include {
  _id: string;
  include_text: string;
  createdAt?: string;
  updatedAt?: string;
}

export default async function IncludeViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchIncludeByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const include: Include = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">
          View Include
        </h2>
        <Link href="/admin/includes">
          <Button variant="secondary">Back to Includes</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Include Text */}
        <div>
          <p className="text-sm text-black">Include Text</p>
          <p className="text-lg font-medium text-black">
            {include.include_text || "N/A"}
          </p>
        </div>

        {/* Created At */}
        {include.createdAt && (
          <div>
            <p className="text-sm text-black">Created At</p>
            <p className="text-black">
              {new Date(include.createdAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Updated At */}
        {include.updatedAt && (
          <div>
            <p className="text-sm text-black">Last Updated</p>
            <p className="text-black">
              {new Date(include.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
