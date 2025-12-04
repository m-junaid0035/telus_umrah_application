"use client";

import { Palmtree, Phone, Sparkles } from 'lucide-react';
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

export default function ZaiaratToursPage() {
  return (
    <ServicePageLayout
      title="Zaiarat Tours"
      description="Visit holy places with our guided tours"
      longDescription={
        <>
          <p>
            Enrich your pilgrimage by visiting the significant historical and sacred sites in Makkah and Madinah. Our guided Zaiarat tours are designed to provide you with deep historical context and spiritual insights, connecting you with the rich Islamic heritage of the holy cities.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Expert Local Guides:</strong> Our guides are knowledgeable in the history and significance of each site.</li>
            <li><strong>Comfortable Transportation:</strong> Travel in comfort and safety in our modern, air-conditioned vehicles.</li>
            <li><strong>Key Sites in Makkah:</strong> Visit locations such as Jabal al-Nour (Cave of Hira), Jabal Thawr, and Mina.</li>
            <li><strong>Key Sites in Madinah:</strong> Explore Masjid Quba (the first mosque of Islam), Masjid al-Qiblatain, and the site of the Battle of Uhud.</li>
          </ul>
          <p>
            These tours are a valuable addition to any Umrah package, offering a profound educational and spiritual dimension to your journey.
          </p>
        </>
      }
      Icon={Palmtree}
      ctaButtons={
        <>
          <Button asChild>
            <Link href="/contact">
              <Phone className="w-4 h-4 mr-2" />
              Ask About Tour Details
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/customize-umrah">
              <Sparkles className="w-4 h-4 mr-2" />
              Add Tours to a Custom Package
            </Link>
          </Button>
        </>
      }
    />
  );
}
