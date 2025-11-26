import { fetchHotelBookingByIdAction } from "@/actions/hotelBookingActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail } from "lucide-react";
import { DownloadInvoiceButton } from "@/components/DownloadInvoiceButton";

interface HotelBooking {
  _id: string;
  hotelId: string;
  hotelName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality?: string;
  checkInDate: string;
  checkOutDate: string;
  rooms: number;
  adults: number;
  children: number;
  childAges?: number[];
  bedType?: string;
  meals: boolean;
  transport: boolean;
  status: string;
  notes?: string;
  totalAmount?: number;
  paidAmount?: number;
  paymentStatus?: string;
  invoiceGenerated?: boolean;
  invoiceSent?: boolean;
  invoiceNumber?: string;
  invoiceUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "confirmed":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "completed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};

export default async function HotelBookingViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchHotelBookingByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const bookingData = result.data;
  const booking: HotelBooking = {
    _id: String(bookingData._id),
    hotelId: String(bookingData.hotelId || ""),
    hotelName: bookingData.hotelName ? String(bookingData.hotelName) : undefined,
    customerName: String(bookingData.customerName || ""),
    customerEmail: String(bookingData.customerEmail || ""),
    customerPhone: String(bookingData.customerPhone || ""),
    customerNationality: bookingData.customerNationality ? String(bookingData.customerNationality) : undefined,
    checkInDate: String(bookingData.checkInDate || ""),
    checkOutDate: String(bookingData.checkOutDate || ""),
    rooms: Number(bookingData.rooms || 0),
    adults: Number(bookingData.adults || 0),
    children: Number(bookingData.children || 0),
    childAges: Array.isArray(bookingData.childAges) ? bookingData.childAges.map(Number) : undefined,
    bedType: bookingData.bedType ? String(bookingData.bedType) : undefined,
    meals: Boolean(bookingData.meals),
    transport: Boolean(bookingData.transport),
    status: String(bookingData.status || "pending"),
    notes: bookingData.notes ? String(bookingData.notes) : undefined,
    totalAmount: bookingData.totalAmount ? Number(bookingData.totalAmount) : undefined,
    paidAmount: bookingData.paidAmount ? Number(bookingData.paidAmount) : undefined,
    paymentStatus: bookingData.paymentStatus ? String(bookingData.paymentStatus) : undefined,
    invoiceGenerated: bookingData.invoiceGenerated ? Boolean(bookingData.invoiceGenerated) : undefined,
    invoiceSent: bookingData.invoiceSent ? Boolean(bookingData.invoiceSent) : undefined,
    invoiceNumber: bookingData.invoiceNumber ? String(bookingData.invoiceNumber) : undefined,
    invoiceUrl: bookingData.invoiceUrl ? String(bookingData.invoiceUrl) : undefined,
    createdAt: bookingData.createdAt ? String(bookingData.createdAt) : undefined,
    updatedAt: bookingData.updatedAt ? String(bookingData.updatedAt) : undefined,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Hotel Booking Details
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Booking ID: {booking._id}
          </p>
        </div>
        <Link href="/admin/hotel-bookings">
          <Button variant="secondary">Back to Bookings</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Status Badge */}
        <div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.toUpperCase()}
          </Badge>
        </div>

        {/* Hotel Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Hotel Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hotel Name</p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {booking.hotelName || booking.hotelId || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hotel ID</p>
              <p className="text-gray-900 dark:text-gray-100">{booking.hotelId}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{booking.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-gray-900 dark:text-gray-100">{booking.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="text-gray-900 dark:text-gray-100">{booking.customerPhone}</p>
            </div>
            {booking.customerNationality && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nationality</p>
                <p className="text-gray-900 dark:text-gray-100">{booking.customerNationality}</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check-in Date</p>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(booking.checkInDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check-out Date</p>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rooms</p>
              <p className="text-gray-900 dark:text-gray-100">{booking.rooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Adults</p>
              <p className="text-gray-900 dark:text-gray-100">{booking.adults}</p>
            </div>
            {booking.children > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Children</p>
                <p className="text-gray-900 dark:text-gray-100">{booking.children}</p>
              </div>
            )}
            {booking.bedType && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bed Type</p>
                <p className="text-gray-900 dark:text-gray-100 capitalize">{booking.bedType}</p>
              </div>
            )}
          </div>
          {booking.childAges && booking.childAges.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Child Ages</p>
              <div className="flex flex-wrap gap-2">
                {booking.childAges.map((age, index) => (
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
        {(booking.meals || booking.transport) && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Additional Services</h3>
            <div className="flex flex-wrap gap-2">
              {booking.meals && (
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-sm">
                  Meals
                </span>
              )}
              {booking.transport && (
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-sm">
                  Transport
                </span>
              )}
            </div>
          </div>
        )}

        {/* Payment Information */}
        {(booking.totalAmount || booking.paidAmount !== undefined || booking.paymentStatus) && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {booking.totalAmount && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    PKR {booking.totalAmount.toLocaleString()}
                  </p>
                </div>
              )}
              {booking.paidAmount !== undefined && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Paid Amount</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    PKR {booking.paidAmount.toLocaleString()}
                  </p>
                </div>
              )}
              {booking.paymentStatus && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                  <Badge
                    className={
                      booking.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : booking.paymentStatus === "partial"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                    }
                  >
                    {booking.paymentStatus}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invoice Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Invoice Information</h3>
          <div className="space-y-3">
            {booking.invoiceGenerated ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    <FileText className="w-3 h-3 mr-1" />
                    Invoice Generated
                  </Badge>
                  {booking.invoiceSent && (
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      <Mail className="w-3 h-3 mr-1" />
                      Sent to Customer
                    </Badge>
                  )}
                </div>
                {booking.invoiceNumber && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Number</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{booking.invoiceNumber}</p>
                  </div>
                )}
                <div>
                  <DownloadInvoiceButton bookingId={booking._id} bookingType="hotel" />
                </div>
              </>
            ) : (
              <div>
                <Badge variant="outline" className="text-gray-500">
                  Invoice Pending
                </Badge>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Invoice will be generated when the booking is confirmed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            <p className="text-gray-900 dark:text-gray-100">{booking.notes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {booking.createdAt && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
          )}
          {booking.updatedAt && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(booking.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

