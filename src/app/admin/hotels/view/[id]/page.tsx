import { fetchHotelByIdAction } from "@/actions/hotelActions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HotelType } from "@/types/hotel"

interface Hotel {
  _id: string
  name: string
  type: HotelType
  location: string
  star: number
  createdAt?: string
  updatedAt?: string
}

export default async function HotelViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await fetchHotelByIdAction(id)

  if (!result || result.error || !result.data) return notFound()

  const hotel: Hotel = result.data

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          View Hotel
        </h2>
        <Link href="/admin/hotels">
          <Button variant="secondary">Back to Hotels</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Hotel Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hotel Name</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {hotel.name || "N/A"}
          </p>
        </div>

        {/* Hotel Type */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
          <span
            className={`inline-block px-3 py-1 rounded text-sm font-medium ${
              hotel.type === HotelType.Makkah
                ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                : "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
            }`}
          >
            {hotel.type || "N/A"}
          </span>
        </div>

        {/* Location */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
          <p className="text-gray-700 dark:text-gray-300">
            {hotel.location || "N/A"}
          </p>
        </div>

        {/* Star Rating */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Star Rating</p>
          <p className="text-gray-700 dark:text-gray-300">
            {hotel.star ? `${hotel.star} ★` : "N/A"}
          </p>
        </div>

        {/* Created At */}
        {hotel.createdAt && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created At
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {new Date(hotel.createdAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Updated At */}
        {hotel.updatedAt && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {new Date(hotel.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
