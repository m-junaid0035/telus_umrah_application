"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUserPackageBookingsAction, fetchUserHotelBookingsAction, fetchUserCustomUmrahRequestsAction } from "@/actions/userBookingActions";
import { Loader2, Package, Hotel, Calendar, Users, ArrowLeft, RefreshCw, Plane, FileText, Mail, Download } from "lucide-react";
import Link from "next/link";

interface PackageBooking {
  _id: string;
  packageId: string;
  packageName?: string;
  status: string;
  travelers: {
    adults: number;
    children: number;
  };
  rooms: number;
  checkInDate?: string;
  checkOutDate?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  totalAmount?: number;
  invoiceGenerated?: boolean;
  invoiceSent?: boolean;
  invoiceUrl?: string;
  invoiceNumber?: string;
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
    
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const [packageRes, hotelRes, customRes] = await Promise.all([
        fetchUserPackageBookingsAction(user.email),
        fetchUserHotelBookingsAction(user.email),
        fetchUserCustomUmrahRequestsAction(user.email),
      ]);

      if (packageRes?.data && Array.isArray(packageRes.data)) {
        console.log("Package bookings loaded:", packageRes.data.length);
        console.log("Sample package booking:", packageRes.data[0]);
        console.log("Invoice fields in booking:", {
          invoiceGenerated: packageRes.data[0]?.invoiceGenerated,
          invoiceNumber: packageRes.data[0]?.invoiceNumber,
          invoiceUrl: packageRes.data[0]?.invoiceUrl,
        });
        setPackageBookings(packageRes.data);
      } else if (packageRes?.error) {
        console.error("Package bookings error:", packageRes.error);
        setPackageBookings([]);
      } else {
        setPackageBookings([]);
      }
      if (hotelRes?.data && Array.isArray(hotelRes.data)) {
        console.log("Hotel bookings loaded:", hotelRes.data.length);
        console.log("Sample hotel booking:", hotelRes.data[0]);
        console.log("Invoice fields in booking:", {
          invoiceGenerated: hotelRes.data[0]?.invoiceGenerated,
          invoiceNumber: hotelRes.data[0]?.invoiceNumber,
          invoiceUrl: hotelRes.data[0]?.invoiceUrl,
        });
        setHotelBookings(hotelRes.data);
      } else if (hotelRes?.error) {
        console.error("Hotel bookings error:", hotelRes.error);
        setHotelBookings([]);
      } else {
        setHotelBookings([]);
      }
      if (customRes?.data && Array.isArray(customRes.data)) {
        setCustomUmrahRequests(customRes.data);
      } else if (customRes?.error) {
        console.error("Custom Umrah requests error:", customRes.error);
        setCustomUmrahRequests([]);
      } else {
        setCustomUmrahRequests([]);
      }
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

    // Auto-refresh every 30 seconds to get status updates from admin
    const refreshInterval = setInterval(() => {
      loadBookings(true);
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, [user, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => loadBookings(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">View all your package and hotel bookings</p>
          <p className="text-xs text-gray-500 mt-1">Status updates automatically every 30 seconds</p>
        </div>

        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="packages">
              <Package className="w-4 h-4 mr-2" />
              Package Bookings ({packageBookings.length})
            </TabsTrigger>
            <TabsTrigger value="hotels">
              <Hotel className="w-4 h-4 mr-2" />
              Hotel Bookings ({hotelBookings.length})
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Plane className="w-4 h-4 mr-2" />
              Custom Packages ({customUmrahRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-4">
            {packageBookings.length > 0 ? (
              packageBookings.map((booking) => (
                <Card 
                  key={booking._id}
                  className={`hover:shadow-md transition-shadow ${
                    booking.invoiceGenerated && booking.invoiceSent
                      ? "ring-2 ring-green-200 bg-green-50/30"
                      : booking.invoiceGenerated
                      ? "ring-2 ring-blue-200 bg-blue-50/30"
                      : ""
                  }`} 
                  className={`hover:shadow-md transition-shadow ${
                    booking.invoiceGenerated && booking.invoiceSent
                      ? "ring-2 ring-green-200 bg-green-50/30"
                      : booking.invoiceGenerated
                      ? "ring-2 ring-blue-200 bg-blue-50/30"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {booking.packageName || `Package #${booking.packageId.slice(-8)}`}
                        </CardTitle>
                        <CardDescription>
                          Booking ID: {booking._id.slice(-8)}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Travelers</p>
                          <p className="font-medium">
                            {booking.travelers.adults} Adult{booking.travelers.adults > 1 ? "s" : ""}
                            {booking.travelers.children > 0 && `, ${booking.travelers.children} Child${booking.travelers.children > 1 ? "ren" : ""}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Rooms</p>
                          <p className="font-medium">{booking.rooms}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                          {booking.checkOutDate && (
                            <>
                              <p className="text-sm text-gray-500 mt-1">Check-out</p>
                              <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="font-medium">
                          {booking.paymentMethod === "online" ? "Online" : booking.paymentMethod === "cash" ? "Cash" : "Not specified"}
                        </p>
                        {booking.paymentStatus && (
                          <Badge variant="outline" className="mt-1">
                            {booking.paymentStatus}
                          </Badge>
                        )}
                        {booking.totalAmount && (
                          <p className="text-sm font-semibold text-gray-700 mt-1">
                            Total: PKR {booking.totalAmount.toLocaleString()}
                          </p>
                        )}
                        {booking.invoiceGenerated && (
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <FileText className="w-3 h-3 mr-1" />
                              Invoice Ready
                            </Badge>
                            {booking.invoiceSent && (
                              <Badge variant="outline" className="border-blue-300 text-blue-700">
                                <Mail className="w-3 h-3 mr-1" />
                                Sent
                              </Badge>
                            )}
                          </div>
                        )}
                        {booking.invoiceNumber && (
                          <p className="text-xs text-gray-500 mt-1">
                            Invoice: {booking.invoiceNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    {(booking.umrahVisa || booking.transport || booking.zaiarat || booking.meals || booking.esim) && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-1">Additional Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.umrahVisa && <Badge variant="outline">Umrah Visa</Badge>}
                          {booking.transport && <Badge variant="outline">Transport</Badge>}
                          {booking.zaiarat && <Badge variant="outline">Zaiarat Tours</Badge>}
                          {booking.meals && <Badge variant="outline">Meals</Badge>}
                          {booking.esim && <Badge variant="outline">eSIM</Badge>}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Booked on: {formatDate(booking.createdAt)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open(`/api/invoice/${booking._id}?type=package`, '_blank');
                        }}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Invoice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No package bookings found</p>
                  <Link href="/umrah-packages">
                    <Button className="mt-4">Browse Packages</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="hotels" className="space-y-4">
            {hotelBookings.length > 0 ? (
              hotelBookings.map((booking) => (
                <Card 
                  key={booking._id} 
                  className={`hover:shadow-md transition-shadow ${
                    booking.invoiceGenerated && booking.invoiceSent
                      ? "ring-2 ring-green-200 bg-green-50/30"
                      : booking.invoiceGenerated
                      ? "ring-2 ring-blue-200 bg-blue-50/30"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {booking.hotelName || `Hotel #${booking.hotelId.slice(-8)}`}
                        </CardTitle>
                        <CardDescription>
                          Booking ID: {booking._id.slice(-8)}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Guests</p>
                          <p className="font-medium">
                            {booking.adults} Adult{booking.adults > 1 ? "s" : ""}
                            {booking.children > 0 && `, ${booking.children} Child${booking.children > 1 ? "ren" : ""}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Rooms</p>
                          <p className="font-medium">{booking.rooms}</p>
                          {booking.bedType && (
                            <p className="text-xs text-gray-500 mt-1 capitalize">
                              Bed: {booking.bedType}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                          <p className="text-sm text-gray-500 mt-1">Check-out</p>
                          <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="font-medium">
                          {booking.paymentMethod === "online" ? "Online" : booking.paymentMethod === "cash" ? "Cash" : "Not specified"}
                        </p>
                        {booking.paymentStatus && (
                          <Badge variant="outline" className="mt-1">
                            {booking.paymentStatus}
                          </Badge>
                        )}
                        {booking.totalAmount && (
                          <p className="text-sm font-semibold text-gray-700 mt-1">
                            Total: PKR {booking.totalAmount.toLocaleString()}
                          </p>
                        )}
                        {booking.invoiceGenerated && (
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <FileText className="w-3 h-3 mr-1" />
                              Invoice Ready
                            </Badge>
                            {booking.invoiceSent && (
                              <Badge variant="outline" className="border-blue-300 text-blue-700">
                                <Mail className="w-3 h-3 mr-1" />
                                Sent
                              </Badge>
                            )}
                          </div>
                        )}
                        {booking.invoiceNumber && (
                          <p className="text-xs text-gray-500 mt-1">
                            Invoice: {booking.invoiceNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    {(booking.meals || booking.transport) && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-1">Additional Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.meals && <Badge variant="outline">Meals</Badge>}
                          {booking.transport && <Badge variant="outline">Transport</Badge>}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Booked on: {formatDate(booking.createdAt)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open(`/api/invoice/${booking._id}?type=hotel`, '_blank');
                        }}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Invoice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hotel bookings found</p>
                  <Link href="/makkah-hotels">
                    <Button className="mt-4">Browse Hotels</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            {customUmrahRequests.length > 0 ? (
              customUmrahRequests.map((request) => (
                <Card key={request._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          Custom Umrah Package
                        </CardTitle>
                        <CardDescription>
                          Request ID: {request._id.slice(-8)}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Travelers</p>
                          <p className="font-medium">
                            {request.adults} Adult{request.adults > 1 ? "s" : ""}
                            {request.children > 0 && `, ${request.children} Child${request.children > 1 ? "ren" : ""}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Flight</p>
                          <p className="font-medium">
                            {request.from} → {request.to}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {request.airline} ({request.airlineClass})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-medium">{formatDate(request.departDate)}</p>
                          <p className="text-sm text-gray-500 mt-1">Return</p>
                          <p className="font-medium">{formatDate(request.returnDate)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="font-medium">
                          {request.paymentMethod === "online" ? "Online" : request.paymentMethod === "cash" ? "Cash" : "Not specified"}
                        </p>
                        {request.hotels && request.hotels.length > 0 && (
                          <p className="text-xs text-gray-500 mt-2">
                            {request.hotels.length} Hotel{request.hotels.length > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    {request.hotels && request.hotels.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">Hotels:</p>
                        <div className="space-y-1">
                          {request.hotels.map((hotel, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              {hotel.city}: {hotel.hotel} ({hotel.hotelClass}) - {hotel.stayDuration} night{Number(hotel.stayDuration) > 1 ? "s" : ""}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500">
                        Requested on: {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No custom Umrah requests found</p>
                  <Link href="/custom-umrah">
                    <Button className="mt-4">Create Custom Package</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

