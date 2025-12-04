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
  differentReturnCity?: boolean;
  returnFrom?: string;
  returnTo?: string;
  adults: number;
  children: number;
  childAges: number[];
  rooms: number;
  selectedServices?: {
    serviceId: string;
    serviceName: string;
    price: number;
  }[];
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
      return "bg-yellow-100 text-black dark:bg-yellow-800";
    case "in-progress":
      return "bg-blue-100 text-black dark:bg-blue-800";
    case "completed":
      return "bg-green-100 text-black dark:bg-green-800";
    case "cancelled":
      return "bg-red-100 text-black dark:bg-red-800";
    default:
      return "bg-gray-100 text-black dark:bg-gray-800";
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
    differentReturnCity:
      requestData.differentReturnCity !== undefined
        ? Boolean(requestData.differentReturnCity)
        : undefined,
    returnFrom: requestData.returnFrom ? String(requestData.returnFrom) : undefined,
    returnTo: requestData.returnTo ? String(requestData.returnTo) : undefined,
    adults: Number(requestData.adults || 0),
    children: Number(requestData.children || 0),
    childAges: Array.isArray(requestData.childAges)
      ? requestData.childAges.map(Number)
      : [],
    rooms: Number(requestData.rooms || 0),
    selectedServices:
      Array.isArray(selectedServicesData) && selectedServicesData.length > 0
        ? selectedServicesData
            .filter(
              (s: any) =>
                s && (s.serviceId || s._id || s.serviceName || s.name)
            )
            .map((s: any) => ({
              serviceId: String(s.serviceId || s._id || ""),
              serviceName: String(s.serviceName || s.name || "Unknown Service"),
              price: Number(s.price || 0),
            }))
        : undefined,
    umrahVisa:
      requestData.umrahVisa !== undefined
        ? Boolean(requestData.umrahVisa)
        : undefined,
    transport:
      requestData.transport !== undefined
        ? Boolean(requestData.transport)
        : undefined,
    zaiarat:
      requestData.zaiarat !== undefined
        ? Boolean(requestData.zaiarat)
        : undefined,
    meals:
      requestData.meals !== undefined ? Boolean(requestData.meals) : undefined,
    esim:
      requestData.esim !== undefined ? Boolean(requestData.esim) : undefined,
    hotels: Array.isArray(requestData.hotels) ? requestData.hotels : [],
    status: String(requestData.status || "pending"),
    notes: requestData.notes ? String(requestData.notes) : undefined,
    paymentMethod: requestData.paymentMethod
      ? String(requestData.paymentMethod)
      : undefined,
    createdAt: requestData.createdAt ? String(requestData.createdAt) : undefined,
    updatedAt: requestData.updatedAt ? String(requestData.updatedAt) : undefined,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">{/* Heading always black */}
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
          <h3 className="text-lg font-semibold mb-3 text-black">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-black">Name</p>
              <p className="text-black font-medium">{request.name}</p>
            </div>
            <div>
              <p className="text-sm text-black">Email</p>
              <p className="text-black">{request.email}</p>
            </div>
            <div>
              <p className="text-sm text-black">Phone</p>
              <p className="text-black">{request.phone}</p>
            </div>
            <div>
              <p className="text-sm text-black">Nationality</p>
              <p className="text-black">{request.nationality}</p>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Flight Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-black">From</p>
              <p className="text-black">{request.from}</p>
            </div>
            <div>
              <p className="text-sm text-black">To</p>
              <p className="text-black">{request.to}</p>
            </div>
            {request.differentReturnCity && (
              <>
                <div>
                  <p className="text-sm text-black">Return From</p>
                  <p className="text-black">{request.returnFrom || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-black">Return To</p>
                  <p className="text-black">{request.returnTo || "N/A"}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-black">Departure Date</p>
              <p className="text-black">
                {request.departDate
                  ? new Date(request.departDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-black">Return Date</p>
              <p className="text-black">
                {request.returnDate
                  ? new Date(request.returnDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-black">Airline</p>
              <p className="text-black">{request.airline}</p>
            </div>
            <div>
              <p className="text-sm text-black">Class</p>
              <p className="text-black">{request.airlineClass}</p>
            </div>
          </div>
        </div>

        {/* Travelers */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Travelers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-black">Adults</p>
              <p className="text-black">{request.adults}</p>
            </div>
            <div>
              <p className="text-sm text-black">Children</p>
              <p className="text-black">{request.children}</p>
            </div>
            <div>
              <p className="text-sm text-black">Rooms</p>
              <p className="text-black">{request.rooms}</p>
            </div>
          </div>
          {request.childAges.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-black mb-2">Child Ages</p>
              <div className="flex flex-wrap gap-2">
                {request.childAges.map((age, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-black rounded-full text-sm"
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
          <h3 className="text-lg font-semibold mb-3 text-black">Additional Services</h3>
          {request.selectedServices &&
          Array.isArray(request.selectedServices) &&
          request.selectedServices.length > 0 ? (
            <div className="space-y-2">
              {request.selectedServices.map((service, index) => (
                <div
                  key={service.serviceId || index}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex-1">
                    <p className="font-medium text-black">
                      {service.serviceName || `Service ${index + 1}`}
                    </p>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-black">
                      PKR {Number(service.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-black">Total Services Price:</p>
                  <p className="text-lg font-bold text-black">
                    PKR{" "}
                    {request.selectedServices
                      .reduce((sum, s) => sum + Number(s.price || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {request.umrahVisa && (
                <span className="px-3 py-1 bg-green-100 text-black rounded text-sm">
                  Umrah Visa
                </span>
              )}
              {request.transport && (
                <span className="px-3 py-1 bg-green-100 text-black rounded text-sm">
                  Transport
                </span>
              )}
              {request.zaiarat && (
                <span className="px-3 py-1 bg-green-100 text-black rounded text-sm">
                  Zaiarat
                </span>
              )}
              {request.meals && (
                <span className="px-3 py-1 bg-green-100 text-black rounded text-sm">
                  Meals
                </span>
              )}
              {request.esim && (
                <span className="px-3 py-1 bg-green-100 text-black rounded text-sm">
                  eSIM
                </span>
              )}
              {!request.umrahVisa &&
                !request.transport &&
                !request.zaiarat &&
                !request.meals &&
                !request.esim && (
                  <p className="text-sm text-black">No additional services selected</p>
                )}
            </div>
          )}
        </div>

        {/* Hotels */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Hotel Selections</h3>
          <div className="space-y-4">
            {request.hotels.map((hotel, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-black">{hotel.city} Hotel</h4>
                  <Badge className="text-black">{hotel.hotelClass}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-black">Hotel: </span>
                    <span className="text-black">{hotel.hotel}</span>
                  </div>
                  <div>
                    <span className="text-black">Stay Duration: </span>
                    <span className="text-black">{hotel.stayDuration} nights</span>
                  </div>
                  <div>
                    <span className="text-black">Bed Type: </span>
                    <span className="text-black capitalize">{hotel.bedType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        {request.paymentMethod && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3 text-black">Payment Method</h3>
            <Badge className="text-black capitalize">{request.paymentMethod}</Badge>
          </div>
        )}

        {/* Notes */}
        {request.notes && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-black">Notes</h3>
            <p className="text-black">{request.notes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {request.createdAt && (
            <div>
              <p className="text-sm text-black">Created At</p>
              <p className="text-black">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
          )}
          {request.updatedAt && (
            <div>
              <p className="text-sm text-black">Last Updated</p>
              <p className="text-black">
                {new Date(request.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
