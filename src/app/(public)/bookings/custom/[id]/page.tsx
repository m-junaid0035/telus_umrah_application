"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchCustomUmrahRequestByIdAction } from "@/actions/customUmrahRequestActions";
import { ArrowLeft, Sparkles, Users, Calendar, MapPin, DollarSign, Plane, Hotel, FileText, Loader2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function CustomUmrahRequestDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    loadRequestDetails();
  }, [requestId]);

  const loadRequestDetails = async () => {
    try {
      setLoading(true);
      const result = await fetchCustomUmrahRequestByIdAction(requestId);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Failed to load request details",
          variant: "destructive",
        });
        router.push("/profile");
        return;
      }

      setRequest(result.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load request details",
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
      case "approved":
        return "bg-emerald-500/15 text-emerald-600 border-emerald-300/25";
      case "pending":
        return "bg-yellow-500/15 text-yellow-600 border-yellow-300/25";
      case "cancelled":
      case "rejected":
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
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
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
              <h1 className="text-3xl font-bold text-gray-900">Custom Umrah Request</h1>
              <p className="text-gray-600 mt-1">Request ID: {request._id}</p>
            </div>
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Trip Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Departure City
                    </p>
                    <p className="font-semibold text-gray-900">{request.from || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Departure Date
                    </p>
                    <p className="font-semibold text-gray-900">
                      {request.departDate ? new Date(request.departDate).toLocaleDateString() : "Flexible"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Return Date</p>
                    <p className="font-semibold text-gray-900">
                      {request.returnDate ? new Date(request.returnDate).toLocaleDateString() : "Flexible"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Airline / Class</p>
                    <p className="font-semibold text-gray-900">{request.airline || "N/A"} / {request.airlineClass || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travelers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Travelers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Adults</p>
                    <p className="text-2xl font-bold text-gray-900">{request.adults || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Children</p>
                    <p className="text-2xl font-bold text-gray-900">{request.children || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Rooms</p>
                    <p className="text-2xl font-bold text-gray-900">{request.rooms || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accommodation Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-purple-600" />
                  Accommodation Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.isArray(request.hotels) && request.hotels.length > 0 ? (
                  <div className="space-y-3">
                    {request.hotels.map((h: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">City</p>
                            <p className="font-medium">{h.city}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Hotel</p>
                            <p className="font-medium">{h.hotel}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Class</p>
                            <p className="font-medium">{h.hotelClass}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Stay</p>
                            <p className="font-medium">{h.stayDuration}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Bed Type</p>
                            <p className="font-medium">{h.bedType}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No accommodation preferences provided</p>
                )}
              </CardContent>
            </Card>

            {/* Flight Preferences */}
            {(request.airline || request.airlineClass) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-blue-600" />
                    Flight Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {request.airlineClass && (
                      <div>
                        <p className="text-sm text-gray-600">Flight Class</p>
                        <p className="font-semibold text-gray-900">{request.airlineClass}</p>
                      </div>
                    )}
                    {request.airline && (
                      <div>
                        <p className="text-sm text-gray-600">Airline Preference</p>
                        <p className="font-semibold text-gray-900">{request.airline}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Services */}
            {request.additionalServices && request.additionalServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Additional Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {request.additionalServices.map((service: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Special Requests */}
            {request.specialRequests && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Special Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{request.specialRequests}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{request.name}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </p>
                  <p className="font-medium text-sm">{request.email}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </p>
                  <p className="font-medium">{request.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {request.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{request.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-medium text-sm">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium text-sm">
                    {new Date(request.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Need Assistance?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Our team will review your request and contact you shortly with a customized package.
                  </p>
                  <Link href="/contact">
                    <Button className="w-full" variant="outline">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
