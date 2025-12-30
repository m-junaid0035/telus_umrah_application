"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUserPackageBookingsAction, fetchUserHotelBookingsAction, fetchUserCustomUmrahRequestsAction } from "@/actions/userBookingActions";
import { Loader2, Package, Hotel, Calendar, Users, ArrowLeft, RefreshCw, Plane, FileText, Mail, Download, Building, BedDouble, Wallet, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// --- INTERFACES ---
interface PackageBooking {
  _id: string;
  packageId: string;
  packageName?: string;
  status: string;
  adults?: Array<{ name?: string; age?: number }>;
  children?: Array<{ name?: string; age?: number }>;
  infants?: Array<{ name?: string; age?: number }>;
  rooms: number;
  // dates removed for package bookings per new design
  checkInDate?: string;
  checkOutDate?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  totalAmount?: number;
  invoiceGenerated?: boolean;
  invoiceSent?: boolean;
  invoiceUrl?: string;
  invoiceNumber?: string;
  // additional services removed in new design
  umrahVisa?: boolean;
  transport?: boolean;
  zaiarat?: boolean;
  meals?: boolean;
  esim?: boolean;
  createdAt: string;
}

interface HotelBooking {
  _id: string;
  hotelId: string;
  hotelName?: string;
  status: string;
  adults: number;
  children: number;
  rooms: number;
  checkInDate: string;
  checkOutDate: string;
  bedType?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  totalAmount?: number;
  meals?: boolean;
  transport?: boolean;
  invoiceGenerated?: boolean;
  invoiceSent?: boolean;
  invoiceUrl?: string;
  invoiceNumber?: string;
  createdAt: string;
}

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
  rooms: number;
  hotels: Array<{
    hotelClass: string;
    hotel: string;
    stayDuration: string;
    bedType: string;
    city: string;
  }>;
  status: string;
  paymentMethod?: string;
  createdAt: string;
}

// --- HELPER COMPONENTS & FUNCTIONS ---

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusAppearance = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending": return { icon: <Info className="w-4 h-4 text-yellow-600" />, color: "border-yellow-500 bg-yellow-50 text-yellow-700" };
    case "confirmed": return { icon: <Package className="w-4 h-4 text-green-600" />, color: "border-green-500 bg-green-50 text-green-700" };
    case "in-progress": return { icon: <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />, color: "border-blue-500 bg-blue-50 text-blue-700" };
    case "cancelled": return { icon: <Info className="w-4 h-4 text-red-600" />, color: "border-red-500 bg-red-50 text-red-700" };
    case "completed": return { icon: <Package className="w-4 h-4 text-green-600" />, color: "border-green-500 bg-green-50 text-green-700" };
    default: return { icon: <Info className="w-4 h-4 text-gray-600" />, color: "border-gray-500 bg-gray-50 text-gray-700" };
  }
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <div className="text-slate-500 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ icon, title, description, action }: { icon: React.ReactNode, title: string, description: string, action: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-12 bg-white rounded-xl shadow-sm border border-dashed">
    <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    <p className="text-slate-500 mt-1 mb-4">{description}</p>
    {action}
  </motion.div>
);

// --- BOOKING CARD COMPONENTS ---

const PackageBookingCard = ({ booking }: { booking: PackageBooking }) => {
  const status = useMemo(() => getStatusAppearance(booking.status), [booking.status]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-4 bg-slate-50/50 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">{booking.packageName || `Package #${booking.packageId.slice(-8)}`}</CardTitle>
              <CardDescription className="text-xs">ID: {booking._id.slice(-8)} &bull; Booked: {formatDate(booking.createdAt)}</CardDescription>
            </div>
            <Badge className={`flex items-center gap-1.5 text-xs ${status.color}`}>{status.icon} {booking.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
            <InfoItem icon={<Users size={16} />} label="Travelers" value={`${booking.adults ? booking.adults.length : 0} Adults, ${booking.children ? booking.children.length : 0} Children`} />
            <InfoItem icon={<Hotel size={16} />} label="Rooms" value={booking.rooms} />
            <InfoItem icon={<Calendar size={16} />} label="Booked On" value={formatDate(booking.createdAt)} />
          </div>
          <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <InfoItem icon={<Wallet size={16} />} label="Payment" value={`${booking.paymentMethod || 'N/A'} (${booking.paymentStatus || 'N/A'})`} />
              {booking.totalAmount && <InfoItem icon={<FileText size={16} />} label="Total" value={`PKR ${booking.totalAmount.toLocaleString()}`} />}
            </div>
            {booking.invoiceGenerated && booking.invoiceUrl &&
              <Button size="sm" onClick={() => window.open(booking.invoiceUrl, '_blank')}><Download size={16} className="mr-2" /> Download Invoice</Button>
            }
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HotelBookingCard = ({ booking }: { booking: HotelBooking }) => {
  const status = useMemo(() => getStatusAppearance(booking.status), [booking.status]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-4 bg-slate-50/50 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">{booking.hotelName || `Hotel #${booking.hotelId.slice(-8)}`}</CardTitle>
              <CardDescription className="text-xs">ID: {booking._id.slice(-8)} &bull; Booked: {formatDate(booking.createdAt)}</CardDescription>
            </div>
            <Badge className={`flex items-center gap-1.5 text-xs ${status.color}`}>{status.icon} {booking.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
            <InfoItem icon={<Users size={16} />} label="Guests" value={`${booking.adults} Adults, ${booking.children} Children`} />
            <InfoItem icon={<Building size={16} />} label="Rooms" value={booking.rooms} />
            <InfoItem icon={<BedDouble size={16} />} label="Bed Type" value={booking.bedType || 'N/A'} />
            <InfoItem icon={<Calendar size={16} />} label="Dates" value={`${formatDate(booking.checkInDate)} - ${formatDate(booking.checkOutDate)}`} />
          </div>
           <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <InfoItem icon={<Wallet size={16} />} label="Payment" value={`${booking.paymentMethod || 'N/A'} (${booking.paymentStatus || 'N/A'})`} />
              {booking.totalAmount && <InfoItem icon={<FileText size={16} />} label="Total" value={`PKR ${booking.totalAmount.toLocaleString()}`} />}
            </div>
            {booking.invoiceGenerated && booking.invoiceUrl &&
              <Button size="sm" onClick={() => window.open(booking.invoiceUrl, '_blank')}><Download size={16} className="mr-2" /> Download Invoice</Button>
            }
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CustomUmrahRequestCard = ({ request }: { request: CustomUmrahRequest }) => {
  const status = useMemo(() => getStatusAppearance(request.status), [request.status]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-4 bg-slate-50/50 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">Custom Umrah Request</CardTitle>
              <CardDescription className="text-xs">ID: {request._id.slice(-8)} &bull; Requested: {formatDate(request.createdAt)}</CardDescription>
            </div>
            <Badge className={`flex items-center gap-1.5 text-xs ${status.color}`}>{status.icon} {request.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
            <InfoItem icon={<Users size={16} />} label="Travelers" value={`${request.adults} Adults, ${request.children} Children`} />
            <InfoItem icon={<Plane size={16} />} label="Departure" value={`${request.from} → ${request.to}`} />
            <InfoItem icon={<Calendar size={16} />} label="Dates" value={`${formatDate(request.departDate)} - ${formatDate(request.returnDate)}`} />
            
            {request.differentReturnCity && request.returnFrom && (
              <InfoItem icon={<Plane size={16} />} label="Return" value={`${request.returnFrom} → ${request.returnTo}`} />
            )}
            <InfoItem icon={<Building size={16} />} label="Airline" value={`${request.airline} (${request.airlineClass})`} />
          </div>
          {request.hotels && request.hotels.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-xs font-semibold text-slate-600 mb-2">Hotel Preferences</h4>
              <div className="space-y-2">
                {request.hotels.map((hotel, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded-md">
                    <Building size={14} className="text-slate-500" />
                    <span className="font-semibold">{hotel.city}:</span>
                    <span className="text-slate-700">{hotel.hotel} ({hotel.hotelClass}) for {hotel.stayDuration} nights</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};


// --- MAIN PAGE COMPONENT ---

export default function MyBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [packageBookings, setPackageBookings] = useState<PackageBooking[]>([]);
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [customUmrahRequests, setCustomUmrahRequests] = useState<CustomUmrahRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async (showRefreshing = false) => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    
    if (showRefreshing) setRefreshing(true); else setLoading(true);
    
    try {
      const [packageRes, hotelRes, customRes] = await Promise.all([
        fetchUserPackageBookingsAction(user.email),
        fetchUserHotelBookingsAction(user.email),
        fetchUserCustomUmrahRequestsAction(user.email),
      ]);

      setPackageBookings(packageRes?.data || []);
      setHotelBookings(hotelRes?.data || []);
      setCustomUmrahRequests(customRes?.data || []);

    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadBookings();
    const refreshInterval = setInterval(() => loadBookings(true), 30000);
    return () => clearInterval(refreshInterval);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Bookings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your package, hotel, and custom Umrah bookings.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
            </Button>
            <Button 
              variant="outline" size="sm" 
              onClick={() => loadBookings(true)}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </header>

        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-200/60 p-1 h-auto">
            <TabsTrigger value="packages" className="py-2.5"><Package className="w-4 h-4 mr-2" /> Packages ({packageBookings.length})</TabsTrigger>
            <TabsTrigger value="hotels"><Hotel className="w-4 h-4 mr-2" /> Hotels ({hotelBookings.length})</TabsTrigger>
            <TabsTrigger value="custom"><Plane className="w-4 h-4 mr-2" /> Custom ({customUmrahRequests.length})</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="packages">
              {packageBookings.length > 0 ? (
                <div className="space-y-4">
                  {packageBookings.map((b) => <PackageBookingCard key={b._id} booking={b} />)}
                </div>
              ) : (
                <EmptyState 
                  icon={<Package size={32} className="text-slate-400" />}
                  title="No Package Bookings Yet"
                  description="Your booked packages will appear here once you've made a reservation."
                  action={<Button asChild><Link href="/umrah-packages">Browse Packages</Link></Button>}
                />
              )}
            </TabsContent>
            <TabsContent value="hotels">
              {hotelBookings.length > 0 ? (
                <div className="space-y-4">
                  {hotelBookings.map((b) => <HotelBookingCard key={b._id} booking={b} />)}
                </div>
              ) : (
                <EmptyState 
                  icon={<Hotel size={32} className="text-slate-400" />}
                  title="No Hotel Bookings Yet"
                  description="Your hotel reservations will be displayed here."
                  action={<Button asChild><Link href="/hotels">Browse Hotels</Link></Button>}
                />
              )}
            </TabsContent>
            <TabsContent value="custom">
              {customUmrahRequests.length > 0 ? (
                <div className="space-y-4">
                  {customUmrahRequests.map((r) => <CustomUmrahRequestCard key={r._id} request={r} />)}
                </div>
              ) : (
                <EmptyState 
                  icon={<Plane size={32} className="text-slate-400" />}
                  title="No Custom Requests"
                  description="Create a personalized Umrah package and your request will show up here."
                  action={<Button asChild><Link href="/customize-umrah">Create a Package</Link></Button>}
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
