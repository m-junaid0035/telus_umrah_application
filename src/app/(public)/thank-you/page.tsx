"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingType, setBookingType] = useState<string>("booking");

  useEffect(() => {
    const type = searchParams.get("type") || "booking";
    setBookingType(type);
  }, [searchParams]);

  const getBookingTypeText = () => {
    switch (bookingType) {
      case "hotel":
        return "Hotel Booking";
      case "package":
        return "Package Booking";
      case "custom":
        return "Custom Umrah Request";
      default:
        return "Booking";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center pt-20 px-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Thank You!
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Your {getBookingTypeText()} has been submitted successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-lg">
              We have received your {getBookingTypeText().toLowerCase()} request and will contact you soon.
            </p>
            {bookingType === "hotel" || bookingType === "package" ? (
              <p className="text-sm text-gray-500">
                An invoice has been sent to your email. You can also download it from your bookings section.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Our team will review your custom request and get back to you with the best package options.
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {bookingType === "hotel" || bookingType === "package" ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Check your email for the invoice and booking confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Visit our office to complete your payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>View your booking details in "My Bookings"</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Our team will review your custom requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>We'll contact you within 24 hours with package options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>You can track your request in "My Bookings"</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/my-bookings" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                <FileText className="w-5 h-5 mr-2" />
                View My Bookings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{" "}
              <a href="mailto:support@telusumrah.com" className="text-blue-600 hover:underline">
                support@telusumrah.com
              </a>{" "}
              or call{" "}
              <a href="tel:080033333" className="text-blue-600 hover:underline">
                080033333
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

