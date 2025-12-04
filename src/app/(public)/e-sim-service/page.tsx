"use client";

import { Wifi, Phone, Sparkles } from 'lucide-react';
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

export default function ESimServicePage() {
  return (
    <ServicePageLayout
      title="E-Sim Service"
      description="Stay connected with our E-Sim services"
      longDescription={
        <>
          <p>
            Stay connected with family and friends back home with our reliable and affordable E-Sim services. Forget the hassle of finding a local sim card upon arrival. With our E-Sim service, you can have a Saudi Arabian mobile number and data plan ready to use the moment you land.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Instant Activation:</strong> Receive your E-Sim via email and activate it instantly on your compatible device.</li>
            <li><strong>High-Speed Data:</strong> Enjoy fast and reliable 4G/5G data coverage across Saudi Arabia.</li>
            <li><strong>Affordable Plans:</strong> Choose from a variety of data and calling plans tailored for travelers and pilgrims.</li>
            <li><strong>Keep Your Number:</strong> Continue using your primary number for calls and messages while using our E-Sim for data.</li>
          </ul>
          <p>
            Our E-Sim service is the perfect solution for modern travelers who need to stay online for navigation, communication, and sharing their precious moments.
          </p>
        </>
      }
      Icon={Wifi}
      ctaButtons={
        <>
          <Button asChild>
            <Link href="/contact">
              <Phone className="w-4 h-4 mr-2" />
              Ask About E-Sim Plans
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/customize-umrah">
              <Sparkles className="w-4 h-4 mr-2" />
              Add E-Sim to a Custom Package
            </Link>
          </Button>
        </>
      }
    />
  );
}
