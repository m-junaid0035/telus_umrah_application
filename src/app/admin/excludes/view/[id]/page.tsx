import { fetchExcludeByIdAction } from "@/actions/excludeActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Exclude {
  _id: string;
  exclude_text: string;
  createdAt?: string;
  updatedAt?: string;
}

export default async function ExcludeViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchExcludeByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const exclude: Exclude = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">
          View Exclude
        </h2>
        <Link href="/admin/excludes">
          <Button variant="secondary">Back to Excludes</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Exclude Text */}
        <div>
          <p className="text-sm text-black">Exclude Text</p>
          <p className="text-lg font-medium text-black">
            {exclude.exclude_text || "N/A"}
          </p>
        </div>

        {/* Created At */}
        {exclude.createdAt && (
          <div>
            <p className="text-sm text-black">Created At</p>
            <p className="text-black">
              {new Date(exclude.createdAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Updated At */}
        {exclude.updatedAt && (
          <div>
            <p className="text-sm text-black">Last Updated</p>
            <p className="text-black">
              {new Date(exclude.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
