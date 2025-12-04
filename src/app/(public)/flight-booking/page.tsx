"use client";

import { Plane, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface ServicePageProps {
  title: string;
  description: string;
  longDescription: React.ReactNode;
  Icon: React.ElementType;
  ctaButtons?: React.ReactNode;
}

const ServicePageLayout = ({ title, description, longDescription, Icon, ctaButtons }: ServicePageProps) => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-slate-100 p-6 flex flex-row items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-slate-800">{title}</CardTitle>
              <p className="text-slate-600">{description}</p>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 text-slate-700 leading-relaxed space-y-4">
            {longDescription}
          </CardContent>
          {ctaButtons && (
            <CardFooter className="bg-slate-50/50 p-6 flex flex-col sm:flex-row items-center justify-center gap-4 border-t">
              {ctaButtons}
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
};

export default function FlightBookingPage() {
  return (
    <ServicePageLayout
      title="Flight Booking"
      description="Book flights to worldwide destinations"
      longDescription={
        <>
          <p>
            Our flight booking service offers a seamless and efficient way to find and book flights to any destination around the globe. We partner with leading airlines to provide you with the best prices and a wide range of options to suit your travel needs. Whether you're planning a spiritual journey for Umrah or a worldwide vacation, our platform is designed to make your booking experience as smooth as possible.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Competitive Pricing:</strong> Access to the best fares from a wide network of airlines.</li>
            <li><strong>Flexible Options:</strong> Choose from various classes, layovers, and travel dates.</li>
            <li><strong>Easy Management:</strong> Manage your bookings, check-in online, and receive updates all in one place.</li>
            <li><strong>24/7 Support:</strong> Our dedicated team is always available to assist you with any queries.</li>
          </ul>
          <p>
            For pilgrims, we specialize in flights to Jeddah (JED) and Madinah (MED), ensuring your travel aligns perfectly with your Umrah itinerary.
          </p>
        </>
      }
      Icon={Plane}
      ctaButtons={
        <>
          <Button asChild>
            <Link href="/umrah-packages">
              <Package className="w-4 h-4 mr-2" />
              View Umrah Packages
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/customize-umrah">
              <Sparkles className="w-4 h-4 mr-2" />
              Create a Custom Package
            </Link>
          </Button>
        </>
      }
    />
  );
}
