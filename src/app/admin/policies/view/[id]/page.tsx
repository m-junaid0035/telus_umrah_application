import { fetchPolicyByIdAction } from "@/actions/policyActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Policy {
  _id: string;
  heading: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export default async function PolicyViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchPolicyByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const policy: Policy = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">
          View Policy
        </h2>
        <Link href="/admin/policies">
          <Button variant="secondary">Back to Policies</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Heading */}
        <div>
          <p className="text-sm text-black">Heading</p>
          <p className="text-lg font-medium text-black">
            {policy.heading || "N/A"}
          </p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-black">Description</p>
          <p className="text-black">
            {policy.description || "N/A"}
          </p>
        </div>

        {/* Created At */}
        {policy.createdAt && (
          <div>
            <p className="text-sm text-black">Created At</p>
            <p className="text-black">
              {new Date(policy.createdAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Updated At */}
        {policy.updatedAt && (
          <div>
            <p className="text-sm text-black">Last Updated</p>
            <p className="text-black">
              {new Date(policy.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
