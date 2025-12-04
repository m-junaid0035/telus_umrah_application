"use client";

import { Package, Sparkles } from 'lucide-react';
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

export default function UmrahServicePage() {
  return (
    <ServicePageLayout
      title="Umrah Service"
      description="Complete Umrah pilgrimage services"
      longDescription={
        <>
          <p>
            Embark on your spiritual journey with our comprehensive Umrah services. We understand the significance of this sacred pilgrimage and are dedicated to providing a seamless, comfortable, and spiritually enriching experience. Our all-inclusive approach covers every aspect of your trip, allowing you to focus entirely on your worship.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>All-Inclusive Packages:</strong> Our packages typically include visa processing, return flights, accommodation in Makkah and Madinah, and ground transportation.</li>
            <li><strong>Expert Guidance:</strong> Benefit from the knowledge of our experienced guides who can assist with rituals and historical context.</li>
            <li><strong>Choice of Accommodation:</strong> Select from a wide range of hotels based on your budget and preference for proximity to the Harams.</li>
            <li><strong>Dedicated Support:</strong> From pre-departure preparations to on-the-ground assistance in Saudi Arabia, our team is with you every step of the way.</li>
          </ul>
          <p>
            Whether you are a first-time pilgrim or returning for another blessed journey, our Umrah services are designed to cater to your every need.
          </p>
        </>
      }
      Icon={Package}
      ctaButtons={
        <>
          <Button asChild>
            <Link href="/umrah-packages">
              <Package className="w-4 h-4 mr-2" />
              View Pre-Designed Packages
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/customize-umrah">
              <Sparkles className="w-4 h-4 mr-2" />
              Build Your Own Package
            </Link>
          </Button>
        </>
      }
    />
  );
}
