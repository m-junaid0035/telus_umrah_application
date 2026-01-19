import { fetchPackageBookingByIdAction } from "@/actions/packageBookingActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
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

const getStatusClasses = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-300/25";
    case "confirmed":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-300/25";
    case "cancelled":
      return "bg-rose-500/15 text-rose-300 border border-rose-300/25";
    case "completed":
      return "bg-blue-500/15 text-blue-200 border border-blue-300/25";
    default:
      return "bg-slate-500/15 text-slate-300 border border-slate-300/25";
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
    <div className="mx-auto max-w-6xl space-y-6 text-white">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/package-bookings">Package Bookings</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>View</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Package Booking</CardTitle>
            <CardDescription>Booking ID: {booking._id}</CardDescription>
            <div data-slot="card-action" className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
              <Link href="/admin/package-bookings">
                <Button size="sm" variant="secondary">Back to Bookings</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Badge className={getStatusClasses(booking.status)}>
                {booking.status.toUpperCase()}
              </Badge>
              {booking.paymentStatus && (
                <Badge className={
                  booking.paymentStatus === "paid"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-300/25"
                    : booking.paymentStatus === "partial"
                    ? "bg-yellow-500/15 text-yellow-300 border border-yellow-300/25"
                    : "bg-rose-500/15 text-rose-300 border border-rose-300/25"
                }>
                  {booking.paymentStatus}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Customer & Package</CardTitle>
              <CardDescription>Primary booking and contact details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-sm text-white/70">Package Name</p>
                  <p className="font-medium">
                    {booking.packageName || booking.packageId || "N/A"}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-white/70">Package ID</p>
                  <p className="font-medium">{booking.packageId}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(() => {
                  const head = (booking.adults && booking.adults.find((a) => a.isHead)) || (booking.adults && booking.adults[0]);
                  const headName = head ? String(head.name || "") : "";
                  const headPhone = head ? String(head.phone || "") : "";
                  return (
                    <>
                      <div className="space-y-3">
                        <p className="text-sm text-white/70">Name</p>
                        <p className="font-medium">{headName}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm text-white/70">Email</p>
                        <p className="font-medium">{booking.customerEmail}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm text-white/70">Phone</p>
                        <p className="font-medium">{headPhone}</p>
                      </div>
                      {booking.customerNationality && (
                        <div className="space-y-3">
                          <p className="text-sm text-white/70">Nationality</p>
                          <p className="font-medium">{booking.customerNationality}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Travelers</CardTitle>
              <CardDescription>Counts and detailed traveler information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-white/70">Adults</p>
                  <p className="font-medium">{booking.adults ? booking.adults.length : 0}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Children</p>
                  <p className="font-medium">{booking.children ? booking.children.length : 0}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Infants</p>
                  <p className="font-medium">{booking.infants ? booking.infants.length : 0}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Rooms</p>
                  <p className="font-medium">{booking.rooms}</p>
                </div>
              </div>

              {(booking.checkInDate || booking.checkOutDate) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {booking.checkInDate && (
                    <div>
                      <p className="text-sm text-white/70">Check-in</p>
                      <p className="font-medium">{new Date(booking.checkInDate).toLocaleString()}</p>
                    </div>
                  )}
                  {booking.checkOutDate && (
                    <div>
                      <p className="text-sm text-white/70">Check-out</p>
                      <p className="font-medium">{new Date(booking.checkOutDate).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}

              {booking.adults && booking.adults.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-white/70 mb-3">Adults</p>
                  <div className="grid gap-3">
                    {booking.adults.map((a, idx) => (
                      <div key={idx} className="rounded-lg border border-white/10 p-4">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{a.name || `Adult ${idx + 1}`}</div>
                          {a.isHead && (
                            <Badge className="bg-blue-500/15 text-blue-200 border border-blue-300/25">Family Head</Badge>
                          )}
                        </div>
                        <div className="text-sm text-white/70 mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>Nationality: <span className="text-white">{a.nationality || 'N/A'}</span></div>
                          <div>Passport: <span className="text-white">{a.passportNumber || 'N/A'}</span></div>
                          <div>Age: <span className="text-white">{a.age ?? 'N/A'}</span></div>
                          <div>Gender: <span className="text-white">{a.gender || 'N/A'}</span></div>
                          <div>Phone: <span className="text-white">{a.phone || 'N/A'}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {booking.children && booking.children.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-white/70 mb-3">Children</p>
                  <div className="grid gap-3">
                    {booking.children.map((c, index) => (
                      <div key={index} className="rounded-lg border border-white/10 p-4">
                        <div className="font-medium">{c.name || `Child ${index + 1}`}</div>
                        <div className="text-sm text-white/70 mt-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>Age: <span className="text-white">{c.age ?? 'N/A'}</span></div>
                          <div>Gender: <span className="text-white">{c.gender || 'N/A'}</span></div>
                          <div>Nationality: <span className="text-white">{c.nationality || 'N/A'}</span></div>
                          <div>Passport: <span className="text-white">{c.passportNumber || 'N/A'}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {booking.infants && booking.infants.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-white/70 mb-3">Infants</p>
                  <div className="grid gap-3">
                    {booking.infants.map((c, index) => (
                      <div key={index} className="rounded-lg border border-white/10 p-4">
                        <div className="font-medium">{c.name || `Infant ${index + 1}`}</div>
                        <div className="text-sm text-white/70 mt-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>Age: <span className="text-white">{c.age ?? 'N/A'}</span></div>
                          <div>Gender: <span className="text-white">{c.gender || 'N/A'}</span></div>
                          <div>Nationality: <span className="text-white">{c.nationality || 'N/A'}</span></div>
                          <div>Passport: <span className="text-white">{c.passportNumber || 'N/A'}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-sm text-white/70 mb-2">Additional Services</p>
                <div className="flex flex-wrap gap-2">
                  {booking.umrahVisa ? <Badge className="bg-blue-500/15 text-blue-200 border border-blue-300/25">Umrah Visa</Badge> : null}
                  {booking.transport ? <Badge className="bg-blue-500/15 text-blue-200 border border-blue-300/25">Transport</Badge> : null}
                  {booking.zaiarat ? <Badge className="bg-blue-500/15 text-blue-200 border border-blue-300/25">Zaiarat Tours</Badge> : null}
                  {booking.meals ? <Badge className="bg-blue-500/15 text-blue-200 border border-blue-300/25">Meals</Badge> : null}
                  {booking.esim ? <Badge className="bg-blue-500/15 text-blue-200 border border-blue-300/25">eSIM</Badge> : null}
                  {!booking.umrahVisa && !booking.transport && !booking.zaiarat && !booking.meals && !booking.esim && (
                    <span className="text-white/60">No additional services</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {(booking.totalAmount || booking.paidAmount !== undefined || booking.paymentStatus) && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Payment</CardTitle>
                <CardDescription>Amounts and status</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 gap-4">
                {booking.totalAmount && (
                  <div>
                    <p className="text-sm text-white/70">Total Amount</p>
                    <p className="font-medium">PKR {booking.totalAmount.toLocaleString()}</p>
                  </div>
                )}
                {typeof booking.paidAmount === "number" && (
                  <div>
                    <p className="text-sm text-white/70">Paid Amount</p>
                    <p className="font-medium">PKR {booking.paidAmount.toLocaleString()}</p>
                  </div>
                )}
                {booking.paymentStatus && (
                  <div>
                    <p className="text-sm text-white/70">Payment Status</p>
                    <Badge className={
                      booking.paymentStatus === "paid"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-300/25"
                        : booking.paymentStatus === "partial"
                        ? "bg-yellow-500/15 text-yellow-300 border border-yellow-300/25"
                        : "bg-rose-500/15 text-rose-300 border border-rose-300/25"
                    }>
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Invoice</CardTitle>
              <CardDescription>Generation and delivery</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {booking.invoiceGenerated ? (
                <>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-300/25 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Invoice Generated
                    </Badge>
                    {booking.invoiceSent && (
                      <Badge className="bg-blue-500/15 text-blue-200 border border-blue-300/25 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Sent to Customer
                      </Badge>
                    )}
                  </div>

                  {booking.invoiceNumber && (
                    <div className="mt-3">
                      <p className="text-sm text-white/70">Invoice Number</p>
                      <p className="font-medium">{booking.invoiceNumber}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <DownloadInvoiceButton bookingId={booking._id} bookingType="package" />
                  </div>
                </>
              ) : (
                <div>
                  <Badge className="bg-slate-500/15 text-slate-300 border border-slate-300/25">Invoice Pending</Badge>
                  <p className="text-sm text-white/70 mt-2">
                    Invoice will be generated when the booking is confirmed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {booking.notes && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-white/85">{booking.notes}</p>
              </CardContent>
            </Card>
          )}

          {(booking.createdAt || booking.updatedAt) && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Timestamps</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 gap-4">
                {booking.createdAt && (
                  <div>
                    <p className="text-sm text-white/70">Created At</p>
                    <p className="font-medium">{new Date(booking.createdAt).toLocaleString()}</p>
                  </div>
                )}
                {booking.updatedAt && (
                  <div>
                    <p className="text-sm text-white/70">Last Updated</p>
                    <p className="font-medium">{new Date(booking.updatedAt).toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
