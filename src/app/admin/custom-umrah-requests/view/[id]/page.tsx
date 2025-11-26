import { fetchCustomUmrahRequestByIdAction } from "@/actions/customUmrahRequestActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CustomUmrahRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  airline: string;
  airlineClass: string;
  adults: number;
  children: number;
  childAges: number[];
  rooms: number;
  selectedServices?: {
    serviceId: string;
    serviceName: string;
    price: number;
  }[];
  // Legacy fields for backward compatibility
  umrahVisa?: boolean;
  transport?: boolean;
  zaiarat?: boolean;
  meals?: boolean;
  esim?: boolean;
  hotels: {
    hotelClass: string;
    hotel: string;
    stayDuration: string;
    bedType: string;
    city: string;
  }[];
  status: string;
  notes?: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};

export default async function CustomUmrahRequestViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchCustomUmrahRequestByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const requestData = result.data;
  
  // Debug: Check selectedServices structure
  const selectedServicesData = requestData.selectedServices;
  
  const request: CustomUmrahRequest = {
    _id: String(requestData._id),
    name: String(requestData.name || ""),
    email: String(requestData.email || ""),
    phone: String(requestData.phone || ""),
    nationality: String(requestData.nationality || ""),
    from: String(requestData.from || ""),
    to: String(requestData.to || ""),
    departDate: String(requestData.departDate || ""),
    returnDate: String(requestData.returnDate || ""),
    airline: String(requestData.airline || ""),
    airlineClass: String(requestData.airlineClass || ""),
    adults: Number(requestData.adults || 0),
    children: Number(requestData.children || 0),
    childAges: Array.isArray(requestData.childAges) ? requestData.childAges.map(Number) : [],
    rooms: Number(requestData.rooms || 0),
    selectedServices: Array.isArray(selectedServicesData) && selectedServicesData.length > 0
      ? selectedServicesData
          .filter((s: any) => s && (s.serviceId || s._id || s.serviceName || s.name))
          .map((s: any) => ({
            serviceId: String(s.serviceId || s._id || ""),
            serviceName: String(s.serviceName || s.name || "Unknown Service"),
            price: Number(s.price || 0),
          }))
      : undefined,
    // Legacy fields for backward compatibility
    umrahVisa: requestData.umrahVisa !== undefined ? Boolean(requestData.umrahVisa) : undefined,
    transport: requestData.transport !== undefined ? Boolean(requestData.transport) : undefined,
    zaiarat: requestData.zaiarat !== undefined ? Boolean(requestData.zaiarat) : undefined,
    meals: requestData.meals !== undefined ? Boolean(requestData.meals) : undefined,
    esim: requestData.esim !== undefined ? Boolean(requestData.esim) : undefined,
    hotels: Array.isArray(requestData.hotels) ? requestData.hotels : [],
    status: String(requestData.status || "pending"),
    notes: requestData.notes ? String(requestData.notes) : undefined,
    paymentMethod: requestData.paymentMethod ? String(requestData.paymentMethod) : undefined,
    createdAt: requestData.createdAt ? String(requestData.createdAt) : undefined,
    updatedAt: requestData.updatedAt ? String(requestData.updatedAt) : undefined,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Custom Umrah Request Details
        </h2>
        <Link href="/admin/custom-umrah-requests">
          <Button variant="secondary">Back to Requests</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Status Badge */}
        <div>
          <Badge className={getStatusColor(request.status)}>
            {request.status.toUpperCase()}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{request.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-gray-900 dark:text-gray-100">{request.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="text-gray-900 dark:text-gray-100">{request.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nationality</p>
              <p className="text-gray-900 dark:text-gray-100">{request.nationality}</p>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Flight Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
              <p className="text-gray-900 dark:text-gray-100">{request.from}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
              <p className="text-gray-900 dark:text-gray-100">{request.to}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Departure Date</p>
              <p className="text-gray-900 dark:text-gray-100">
                {request.departDate ? new Date(request.departDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Return Date</p>
              <p className="text-gray-900 dark:text-gray-100">
                {request.returnDate ? new Date(request.returnDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Airline</p>
              <p className="text-gray-900 dark:text-gray-100">{request.airline}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Class</p>
              <p className="text-gray-900 dark:text-gray-100">{request.airlineClass}</p>
            </div>
          </div>
        </div>

        {/* Travelers */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Travelers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Adults</p>
              <p className="text-gray-900 dark:text-gray-100">{request.adults}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Children</p>
              <p className="text-gray-900 dark:text-gray-100">{request.children}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rooms</p>
              <p className="text-gray-900 dark:text-gray-100">{request.rooms}</p>
            </div>
          </div>
          {request.childAges.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Child Ages</p>
              <div className="flex flex-wrap gap-2">
                {request.childAges.map((age, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full text-sm"
                  >
                    Child {index + 1}: {age} years
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Services */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Additional Services</h3>
          {request.selectedServices && Array.isArray(request.selectedServices) && request.selectedServices.length > 0 ? (
            <div className="space-y-2">
              {request.selectedServices.map((service, index) => (
                <div
                  key={service.serviceId || index}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {service.serviceName || `Service ${index + 1}`}
                    </p>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                      PKR {Number(service.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total Services Price:
                  </p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-300">
                    PKR {request.selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Fallback to legacy boolean fields for backward compatibility
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {request.umrahVisa && (
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-sm">
                  Umrah Visa
                </span>
              )}
              {request.transport && (
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-sm">
                  Transport
                </span>
              )}
              {request.zaiarat && (
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-sm">
                  Zaiarat
                </span>
              )}
              {request.meals && (
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-sm">
                  Meals
                </span>
              )}
              {request.esim && (
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-sm">
                  eSIM
                </span>
              )}
              {!request.umrahVisa && !request.transport && !request.zaiarat && !request.meals && !request.esim && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No additional services selected</p>
              )}
            </div>
          )}
        </div>

        {/* Hotels */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Hotel Selections</h3>
          <div className="space-y-4">
            {request.hotels.map((hotel, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{hotel.city} Hotel</h4>
                  <Badge variant="outline">{hotel.hotelClass}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Hotel: </span>
                    <span className="text-gray-900 dark:text-gray-100">{hotel.hotel}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Stay Duration: </span>
                    <span className="text-gray-900 dark:text-gray-100">{hotel.stayDuration} nights</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Bed Type: </span>
                    <span className="text-gray-900 dark:text-gray-100 capitalize">{hotel.bedType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        {request.paymentMethod && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
            <Badge variant="outline" className="capitalize">
              {request.paymentMethod}
            </Badge>
          </div>
        )}

        {/* Notes */}
        {request.notes && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            <p className="text-gray-900 dark:text-gray-100">{request.notes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {request.createdAt && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
          )}
          {request.updatedAt && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(request.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

