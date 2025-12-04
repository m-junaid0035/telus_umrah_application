"use client";

import { Hotel, Building } from 'lucide-react';
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

export default function HotelReservationPage() {
  return (
    <ServicePageLayout
      title="Hotel Reservation"
      description="Luxury hotels at best prices"
      longDescription={
        <>
          <p>
            Find and book your perfect stay from our curated selection of luxury hotels in the holy cities of Makkah and Madina. We offer competitive prices and ensure your comfort and satisfaction during your travels. Our portfolio includes a wide range of accommodations, from 5-star hotels with views of the Haram to budget-friendly, yet comfortable, options.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Proximity to Haram:</strong> Many of our partner hotels are located just steps away from the Holy Mosques.</li>
            <li><strong>Variety of Options:</strong> From luxurious suites to family rooms, we have options for every pilgrim.</li>
            <li><strong>Best Price Guarantee:</strong> We work directly with hotels to secure the best possible rates for you.</li>
            <li><strong>Verified Reviews:</strong> Make informed decisions with access to genuine reviews from fellow travelers.</li>
          </ul>
          <p>
            Our dedicated team is ready to assist you in finding the perfect accommodation that fits your budget and preferences, making your spiritual journey as comfortable as possible.
          </p>
        </>
      }
      Icon={Hotel}
      ctaButtons={
        <>
          <Button asChild>
            <Link href="/hotels?city=Makkah">
              <Building className="w-4 h-4 mr-2" />
              Browse Makkah Hotels
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/hotels?city=Madina">
              <Building className="w-4 h-4 mr-2" />
              Browse Madina Hotels
            </Link>
          </Button>
        </>
      }
    />
  );
}
