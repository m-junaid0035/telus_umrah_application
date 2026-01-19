"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchHotelBookingByIdAction } from "@/actions/hotelBookingActions";
import { ArrowLeft, Hotel, Users, Calendar, CreditCard, MapPin, FileText, Download, Loader2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function HotelBookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const result = await fetchHotelBookingByIdAction(bookingId);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Failed to load booking details",
          variant: "destructive",
        });
        router.push("/profile");
        return;
      }

      setBooking(result.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load booking details",
        variant: "destructive",
      });
      router.push("/profile");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-500/15 text-emerald-600 border-emerald-300/25";
      case "pending":
        return "bg-yellow-500/15 text-yellow-600 border-yellow-300/25";
      case "cancelled":
        return "bg-rose-500/15 text-rose-600 border-rose-300/25";
      case "completed":
        return "bg-blue-500/15 text-blue-600 border-blue-300/25";
      default:
        return "bg-slate-500/15 text-slate-600 border-slate-300/25";
    }
  };

  const calculateNights = () => {
    if (!booking?.checkInDate || !booking?.checkOutDate) return 0;
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile">
            <Button variant="ghost" className="mb-4 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hotel Booking Details</h1>
              <p className="text-gray-600 mt-1">Booking ID: {booking._id}</p>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-purple-600" />
                  Hotel Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Hotel Name</p>
                  <p className="font-semibold text-gray-900 text-lg">{booking.hotelName || "Hotel"}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {booking.city || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Room Type</p>
                    <p className="font-semibold text-gray-900">{booking.roomType || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Stay Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Check-in Date</p>
                    <p className="font-semibold text-gray-900">
                      {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out Date</p>
                    <p className="font-semibold text-gray-900">
                      {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Total Nights</p>
                  <p className="font-semibold text-gray-900 text-lg">{nights} {nights === 1 ? "Night" : "Nights"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Guests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Adults</p>
                    <p className="font-semibold text-gray-900 text-2xl">{booking.adults || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Children</p>
                    <p className="font-semibold text-gray-900 text-2xl">{booking.children || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rooms</p>
                    <p className="font-semibold text-gray-900 text-2xl">{booking.rooms || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Requests */}
            {booking.specialRequests && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Special Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{booking.specialRequests}</p>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {booking.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{booking.customerName}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </p>
                  <p className="font-medium text-sm">{booking.customerEmail}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </p>
                  <p className="font-medium">{booking.customerPhone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {booking.pricePerNight && (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">Price per Night</p>
                      <p className="font-semibold">PKR {booking.pricePerNight?.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">Nights</p>
                      <p className="font-semibold">× {nights}</p>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-900">Total Amount</p>
                  <p className="text-xl font-bold text-purple-600">
                    PKR {booking.totalAmount?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Download */}
            {booking.invoiceUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="w-5 h-5 text-purple-600" />
                    Invoice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={booking.invoiceUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Booked On</p>
                  <p className="font-medium text-sm">
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium text-sm">
                    {new Date(booking.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
