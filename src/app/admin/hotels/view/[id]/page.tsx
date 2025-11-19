import { fetchHotelByIdAction } from "@/actions/hotelActions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HotelType } from "@/types/hotel"
import { HotelImageViewer } from "@/components/HotelImageViewer"

interface Hotel {
  _id: string
  name: string
  type: HotelType
  location: string
  star: number
  description?: string
  distance?: string
  amenities?: string[]
  images?: string[]
  availableBedTypes?: string[]
  contact?: {
    phone?: string
    email?: string
    address?: string
  }
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

  // Ensure data is properly serialized to plain object
  const hotelData = result.data
  const hotel: Hotel = {
    _id: String(hotelData._id),
    name: String(hotelData.name || ''),
    type: hotelData.type as HotelType,
    location: String(hotelData.location || ''),
    star: Number(hotelData.star || 0),
    description: hotelData.description ? String(hotelData.description) : undefined,
    distance: hotelData.distance ? String(hotelData.distance) : undefined,
    amenities: Array.isArray(hotelData.amenities) ? hotelData.amenities.map(String) : undefined,
    images: Array.isArray(hotelData.images) ? hotelData.images.map(String) : undefined,
    availableBedTypes: Array.isArray(hotelData.availableBedTypes) ? hotelData.availableBedTypes.map(String) : undefined,
    contact: hotelData.contact ? {
      phone: hotelData.contact.phone ? String(hotelData.contact.phone) : undefined,
      email: hotelData.contact.email ? String(hotelData.contact.email) : undefined,
      address: hotelData.contact.address ? String(hotelData.contact.address) : undefined,
    } : undefined,
    createdAt: hotelData.createdAt ? String(hotelData.createdAt) : undefined,
    updatedAt: hotelData.updatedAt ? String(hotelData.updatedAt) : undefined,
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {hotel.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Hotel Details
          </p>
        </div>
        <Link href="/admin/hotels">
          <Button variant="secondary">Back to Hotels</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hotel Name</p>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {hotel.name || "N/A"}
              </p>
            </div>
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
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
              <p className="text-gray-900 dark:text-gray-100">
                {hotel.location || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Star Rating</p>
              <p className="text-gray-900 dark:text-gray-100 text-lg">
                {hotel.star ? `${hotel.star} ★` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Description & Distance */}
        {(hotel.description || hotel.distance) && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
            {hotel.description && (
              <div className="mb-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
                <p className="text-gray-900 dark:text-gray-100">{hotel.description}</p>
              </div>
            )}
            {hotel.distance && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Distance from Haram/Masjid</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">{hotel.distance}</p>
              </div>
            )}
          </div>
        )}

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {hotel.images && hotel.images.length > 0 && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Images</h3>
            <HotelImageViewer images={hotel.images} hotelName={hotel.name} />
          </div>
        )}

        {/* Available Bed Types */}
        {hotel.availableBedTypes && hotel.availableBedTypes.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Available Bed Types</p>
            <div className="flex flex-wrap gap-2">
              {hotel.availableBedTypes.map((bedType, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full text-sm capitalize"
                >
                  {bedType.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {hotel.contact && (hotel.contact.phone || hotel.contact.email || hotel.contact.address) && (
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Contact Information</p>
            {hotel.contact.phone && (
              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-gray-700 dark:text-gray-300">{hotel.contact.phone}</p>
              </div>
            )}
            {hotel.contact.email && (
              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-700 dark:text-gray-300">{hotel.contact.email}</p>
              </div>
            )}
            {hotel.contact.address && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-gray-700 dark:text-gray-300">{hotel.contact.address}</p>
              </div>
            )}
          </div>
        )}

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
