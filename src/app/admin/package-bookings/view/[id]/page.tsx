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
  customerEmail: string;
  customerNationality?: string;
  adults?: Array<{ name: string; gender?: string; nationality?: string; passportNumber?: string; age?: number; phone?: string; isHead?: boolean }>;
  children?: Array<{ name: string; gender?: string; nationality?: string; passportNumber?: string; age?: number }>;
  infants?: Array<{ name: string; gender?: string; nationality?: string; passportNumber?: string; age?: number }>;
  rooms: number;
  // dates and additional services removed in new design
  checkInDate?: string;
  checkOutDate?: string;
  umrahVisa?: boolean;
  transport?: boolean;
  zaiarat?: boolean;
  meals?: boolean;
  esim?: boolean;
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
  const { id } = await params;
  const result = await fetchPackageBookingByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const bookingData = result.data;
  const booking: PackageBooking = {
    _id: String(bookingData._id),
    packageId: String(bookingData.packageId || ""),
    packageName: bookingData.packageName ? String(bookingData.packageName) : undefined,
    customerEmail: String(bookingData.customerEmail || ""),
    customerNationality: bookingData.customerNationality ? String(bookingData.customerNationality) : undefined,
    adults: Array.isArray(bookingData.adults) ? bookingData.adults : [],
    children: Array.isArray(bookingData.children) ? bookingData.children : [],
    infants: Array.isArray(bookingData.infants) ? bookingData.infants : [],
    rooms: Number(bookingData.rooms || 0),
    checkInDate: undefined,
    checkOutDate: undefined,
    umrahVisa: undefined,
    transport: undefined,
    zaiarat: undefined,
    meals: undefined,
    esim: undefined,
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
            {(() => {
              const head = (booking.adults && booking.adults.find((a) => a.isHead)) || (booking.adults && booking.adults[0]);
              const headName = head ? String(head.name || "") : "";
              const headPhone = head ? String(head.phone || "") : "";
              return (
                <>
                  <div>
                    <p className="text-sm text-black">Name</p>
                    <p className="text-black font-medium">{headName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-black">Email</p>
                    <p className="text-black">{booking.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-black">Phone</p>
                    <p className="text-black">{headPhone}</p>
                  </div>
                  {booking.customerNationality && (
                    <div>
                      <p className="text-sm text-black">Nationality</p>
                      <p className="text-black">{booking.customerNationality}</p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Travel Details */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Travel Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-black">Adults</p>
              <p className="text-black">{booking.adults ? booking.adults.length : 0}</p>
            </div>
            <div>
              <p className="text-sm text-black">Children</p>
              <p className="text-black">{booking.children ? booking.children.length : 0}</p>
            </div>
            <div>
              <p className="text-sm text-black">Infants</p>
              <p className="text-black">{booking.infants ? booking.infants.length : 0}</p>
            </div>
            <div>
              <p className="text-sm text-black">Rooms</p>
              <p className="text-black">{booking.rooms}</p>
            </div>
            {booking.checkInDate && (
              <div>
                <p className="text-sm text-black">Check-in</p>
                <p className="text-black">{new Date(booking.checkInDate).toLocaleString()}</p>
              </div>
            )}
            {booking.checkOutDate && (
              <div>
                <p className="text-sm text-black">Check-out</p>
                <p className="text-black">{new Date(booking.checkOutDate).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Adults detail list */}
          {booking.adults && booking.adults.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-black mb-2">Adults Details</p>
              <div className="grid gap-3">
                {booking.adults.map((a, idx) => (
                  <div key={idx} className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{a.name || `Adult ${idx + 1}`}</div>
                      {a.isHead && <Badge className="bg-blue-100 text-blue-800">Family Head</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>Nationality: <span className="text-black">{a.nationality || 'N/A'}</span></div>
                      <div>Passport: <span className="text-black">{a.passportNumber || 'N/A'}</span></div>
                      <div>Age: <span className="text-black">{a.age ?? 'N/A'}</span></div>
                      <div>Gender: <span className="text-black">{a.gender || 'N/A'}</span></div>
                      <div>Phone: <span className="text-black">{a.phone || 'N/A'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Children details */}
          {booking.children && booking.children.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-black mb-2">Children Details</p>
              <div className="grid gap-3">
                {booking.children.map((c, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="font-medium">{c.name || `Child ${index + 1}`}</div>
                    <div className="text-sm text-muted-foreground mt-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>Age: <span className="text-black">{c.age ?? 'N/A'}</span></div>
                      <div>Nationality: <span className="text-black">{c.nationality || 'N/A'}</span></div>
                      <div>Passport: <span className="text-black">{c.passportNumber || 'N/A'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Infants details */}
          {booking.infants && booking.infants.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-black mb-2">Infants Details</p>
              <div className="grid gap-3">
                {booking.infants.map((c, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="font-medium">{c.name || `Infant ${index + 1}`}</div>
                    <div className="text-sm text-muted-foreground mt-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>Age: <span className="text-black">{c.age ?? 'N/A'}</span></div>
                      <div>Nationality: <span className="text-black">{c.nationality || 'N/A'}</span></div>
                      <div>Passport: <span className="text-black">{c.passportNumber || 'N/A'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dates (if any) */}
          {/* Additional Services */}
          <div className="mt-4">
            <p className="text-sm text-black mb-2">Additional Services</p>
            <div className="flex flex-wrap gap-2">
              {booking.umrahVisa ? <Badge className="bg-blue-100 text-blue-800">Umrah Visa</Badge> : null}
              {booking.transport ? <Badge className="bg-blue-100 text-blue-800">Transport</Badge> : null}
              {booking.zaiarat ? <Badge className="bg-blue-100 text-blue-800">Zaiarat Tours</Badge> : null}
              {booking.meals ? <Badge className="bg-blue-100 text-blue-800">Meals</Badge> : null}
              {booking.esim ? <Badge className="bg-blue-100 text-blue-800">eSIM</Badge> : null}
              {!booking.umrahVisa && !booking.transport && !booking.zaiarat && !booking.meals && !booking.esim && (
                <span className="text-muted-foreground">No additional services</span>
              )}
            </div>
          </div>
        </div>

        {/* Additional Services removed per new booking flow */}

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
