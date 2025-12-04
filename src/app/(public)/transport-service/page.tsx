"use client";

import { Bus, Phone, Sparkles } from 'lucide-react';
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

export default function TransportServicePage() {
  return (
    <ServicePageLayout
      title="Transport Service"
      description="Comfortable and reliable transportation"
      longDescription={
        <>
          <p>
            Travel between cities and holy sites with our comfortable, reliable, and safe transportation services. We offer a modern fleet of vehicles to ensure your journey is smooth, whether you're traveling from the airport to your hotel, between Makkah and Madinah, or for Zaiarat tours.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Modern Fleet:</strong> Our vehicles are well-maintained, air-conditioned, and spacious.</li>
            <li><strong>Variety of Options:</strong> Choose from private cars for families, vans for small groups, or large buses for bigger groups.</li>
            <li><strong>Professional Drivers:</strong> Our drivers are experienced, courteous, and knowledgeable about the local routes.</li>
            <li><strong>Punctual Service:</strong> We pride ourselves on our punctuality, ensuring you are always on time for your prayers and flights.</li>
          </ul>
          <p>
            Let us take care of your transportation needs so you can travel with peace of mind and focus on the spiritual purpose of your visit.
          </p>
        </>
      }
      Icon={Bus}
      ctaButtons={
        <>
          <Button asChild>
            <Link href="/contact">
              <Phone className="w-4 h-4 mr-2" />
              Arrange Your Transport
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/customize-umrah">
              <Sparkles className="w-4 h-4 mr-2" />
              Add Transport to a Custom Package
            </Link>
          </Button>
        </>
      }
    />
  );
}
