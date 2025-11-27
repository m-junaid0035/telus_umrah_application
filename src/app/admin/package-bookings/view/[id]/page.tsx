import { fetchPackageBookingByIdAction } from "@/actions/packageBookingActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail } from "lucide-react";
import { DownloadInvoiceButton } from "@/components/DownloadInvoiceButton";

interface PackageBooking {
  _id: string;
  packageId: string;
  packageName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality?: string;
  travelers: {
    adults: number;
    children: number;
    childAges?: number[];
  };
  rooms: number;
  checkInDate?: string;
  checkOutDate?: string;
  umrahVisa: boolean;
  transport: boolean;
  zaiarat: boolean;
  meals: boolean;
  esim: boolean;
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
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default async function PackageBookingViewPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const result = await fetchPackageBookingByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const bookingData = result.data;
  const booking: PackageBooking = {
    _id: String(bookingData._id),
    packageId: String(bookingData.packageId || ""),
    packageName: bookingData.packageName ? String(bookingData.packageName) : undefined,
    customerName: String(bookingData.customerName || ""),
    customerEmail: String(bookingData.customerEmail || ""),
    customerPhone: String(bookingData.customerPhone || ""),
    customerNationality: bookingData.customerNationality ? String(bookingData.customerNationality) : undefined,
    travelers: {
      adults: Number(bookingData.travelers?.adults || 0),
      children: Number(bookingData.travelers?.children || 0),
      childAges: Array.isArray(bookingData.travelers?.childAges)
        ? bookingData.travelers.childAges.map(Number)
        : undefined,
    },
    rooms: Number(bookingData.rooms || 0),
    checkInDate: bookingData.checkInDate ? String(bookingData.checkInDate) : undefined,
    checkOutDate: bookingData.checkOutDate ? String(bookingData.checkOutDate) : undefined,
    umrahVisa: Boolean(bookingData.umrahVisa),
    transport: Boolean(bookingData.transport),
    zaiarat: Boolean(bookingData.zaiarat),
    meals: Boolean(bookingData.meals),
    esim: Boolean(bookingData.esim),
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg text-black">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Package Booking Details</h2>
          <p className="text-sm text-black mt-1">Booking ID: {booking._id}</p>
        </div>
        <Link href="/admin/package-bookings">
          <Button variant="secondary">Back to Bookings</Button>
        </Link>
      </div>

      <div className="space-y-6 text-black">
        {/* Status Badge */}
        <div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.toUpperCase()}
          </Badge>
        </div>

        {/* Package Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Package Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-black">Package Name</p>
              <p className="text-black font-medium">
                {booking.packageName || booking.packageId || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-black">Package ID</p>
              <p className="text-black">{booking.packageId}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-black">Name</p>
              <p className="text-black font-medium">{booking.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-black">Email</p>
              <p className="text-black">{booking.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-black">Phone</p>
              <p className="text-black">{booking.customerPhone}</p>
            </div>
            {booking.customerNationality && (
              <div>
                <p className="text-sm text-black">Nationality</p>
                <p className="text-black">{booking.customerNationality}</p>
              </div>
            )}
          </div>
        </div>

        {/* Travel Details */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Travel Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-black">Adults</p>
              <p className="text-black">{booking.travelers.adults}</p>
            </div>
            <div>
              <p className="text-sm text-black">Children</p>
              <p className="text-black">{booking.travelers.children}</p>
            </div>
            <div>
              <p className="text-sm text-black">Rooms</p>
              <p className="text-black">{booking.rooms}</p>
            </div>
          </div>

          {booking.travelers.childAges && booking.travelers.childAges.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-black mb-2">Child Ages</p>
              <div className="flex flex-wrap gap-2">
                {booking.travelers.childAges.map((age, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    Child {index + 1}: {age} years
                  </span>
                ))}
              </div>
            </div>
          )}

          {(booking.checkInDate || booking.checkOutDate) && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {booking.checkInDate && (
                <div>
                  <p className="text-sm text-black">Check-in Date</p>
                  <p className="text-black">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {booking.checkOutDate && (
                <div>
                  <p className="text-sm text-black">Check-out Date</p>
                  <p className="text-black">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Services */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Additional Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {booking.umrahVisa && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">Umrah Visa</span>
            )}
            {booking.transport && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">Transport</span>
            )}
            {booking.zaiarat && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">Zaiarat</span>
            )}
            {booking.meals && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">Meals</span>
            )}
            {booking.esim && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">eSIM</span>
            )}
          </div>
        </div>

        {/* Payment Information */}
        {(booking.totalAmount || booking.paidAmount !== undefined || booking.paymentStatus) && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3 text-black">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {booking.totalAmount && (
                <div>
                  <p className="text-sm text-black">Total Amount</p>
                  <p className="text-black font-medium">PKR {booking.totalAmount.toLocaleString()}</p>
                </div>
              )}
              {typeof booking.paidAmount === "number" && (
                <div>
                  <p className="text-sm text-black">Paid Amount</p>
                  <p className="text-black font-medium">PKR {booking.paidAmount.toLocaleString()}</p>
                </div>
              )}
              {booking.paymentStatus && (
                <div>
                  <p className="text-sm text-black">Payment Status</p>
                  <Badge
                    className={
                      booking.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : booking.paymentStatus === "partial"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {booking.paymentStatus}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invoice */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Invoice Information</h3>

          {booking.invoiceGenerated ? (
            <>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Invoice Generated
                </Badge>
                {booking.invoiceSent && (
                  <Badge className="border border-blue-300 text-blue-700 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Sent to Customer
                  </Badge>
                )}
              </div>

              {booking.invoiceNumber && (
                <div className="mt-2">
                  <p className="text-sm text-black">Invoice Number</p>
                  <p className="text-black font-medium">{booking.invoiceNumber}</p>
                </div>
              )}

              <div className="mt-3">
                <DownloadInvoiceButton bookingId={booking._id} bookingType="package" />
              </div>
            </>
          ) : (
            <div>
              <Badge className="border text-black">Invoice Pending</Badge>
              <p className="text-sm text-black mt-2">
                Invoice will be generated when the booking is confirmed.
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        {booking.notes && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-black">Notes</h3>
            <p className="text-black">{booking.notes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {booking.createdAt && (
            <div>
              <p className="text-sm text-black">Created At</p>
              <p className="text-black">
                {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
          )}
          {booking.updatedAt && (
            <div>
              <p className="text-sm text-black">Last Updated</p>
              <p className="text-black">
                {new Date(booking.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
