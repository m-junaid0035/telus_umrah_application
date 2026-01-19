"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchPackageBookingByIdAction } from "@/actions/packageBookingActions";
import { ArrowLeft, Package, Users, Calendar, CreditCard, MapPin, FileText, Download, Loader2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function PackageBookingDetailsPage() {
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
      const result = await fetchPackageBookingByIdAction(bookingId);
      
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
              <h1 className="text-3xl font-bold text-gray-900">Package Booking Details</h1>
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
            {/* Package Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Package Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Package Name</p>
                  <p className="font-semibold text-gray-900">{booking.packageName || "Umrah Package"}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Rooms</p>
                    <p className="font-semibold text-gray-900">{booking.rooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booked On</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travelers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Travelers Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Adults */}
                {booking.adults && booking.adults.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Adults ({booking.adults.length})</h4>
                    <div className="space-y-3">
                      {booking.adults.map((adult: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Name</p>
                              <p className="font-medium">{adult.name || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Passport Number</p>
                              <p className="font-medium">{adult.passportNumber || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Gender</p>
                              <p className="font-medium">{adult.gender || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Age</p>
                              <p className="font-medium">{typeof adult.age === 'number' ? adult.age : adult.age || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Children */}
                {booking.children && booking.children.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Children ({booking.children.length})</h4>
                    <div className="space-y-3">
                      {booking.children.map((child: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Name</p>
                              <p className="font-medium">{child.name || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Passport Number</p>
                              <p className="font-medium">{child.passportNumber || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Gender</p>
                              <p className="font-medium">{child.gender || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Age</p>
                              <p className="font-medium">{typeof child.age === 'number' ? child.age : child.age || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Infants */}
                {booking.infants && booking.infants.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Infants ({booking.infants.length})</h4>
                    <div className="space-y-3">
                      {booking.infants.map((infant: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Name</p>
                              <p className="font-medium">{infant.name || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Passport Number</p>
                              <p className="font-medium">{infant.passportNumber || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Gender</p>
                              <p className="font-medium">{infant.gender || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Age</p>
                              <p className="font-medium">{typeof infant.age === 'number' ? infant.age : infant.age || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

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
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="font-semibold">PKR {booking.subtotalAmount?.toLocaleString() || "N/A"}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Tax ({booking.taxRate || 0}%)</p>
                  <p className="font-semibold">PKR {booking.taxAmount?.toLocaleString() || "N/A"}</p>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-900">Total Amount</p>
                  <p className="text-xl font-bold text-blue-600">
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
                  <p className="text-sm text-gray-600">Created</p>
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
