import { fetchItineraryByIdAction } from "@/actions/itinerariesActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Itinerary {
  _id: string;
  day_start: number;
  day_end?: number;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export default async function ItineraryViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchItineraryByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const itinerary: Itinerary = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">
          View Itinerary
        </h2>
        <Link href="/admin/itineraries">
          <Button variant="secondary">Back to Itineraries</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Day Start */}
        <div>
          <p className="text-sm text-black">Start Day</p>
          <p className="text-lg font-medium text-black">{itinerary.day_start}</p>
        </div>

        {/* Day End */}
        {itinerary.day_end && (
          <div>
            <p className="text-sm text-black">End Day</p>
            <p className="text-lg font-medium text-black">{itinerary.day_end}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <p className="text-sm text-black">Title</p>
          <p className="text-lg font-medium text-black">{itinerary.title || "N/A"}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-black">Description</p>
          <p className="text-black">{itinerary.description || "N/A"}</p>
        </div>

        {/* Created At */}
        {itinerary.createdAt && (
          <div>
            <p className="text-sm text-black">Created At</p>
            <p className="text-black">{new Date(itinerary.createdAt).toLocaleString()}</p>
          </div>
        )}

        {/* Updated At */}
        {itinerary.updatedAt && (
          <div>
            <p className="text-sm text-black">Last Updated</p>
            <p className="text-black">{new Date(itinerary.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
