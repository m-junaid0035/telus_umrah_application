"use client";

import { FileText, Phone, Sparkles } from 'lucide-react';
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

export default function VisaServicesPage() {
  return (
    <ServicePageLayout
      title="Visa Services"
      description="Hassle-free visa processing"
      longDescription={
        <>
          <p>
            Navigating the visa application process can be complex and time-consuming. Our expert team provides hassle-free visa processing services for your international travel, specializing in Umrah and tourist visas for Saudi Arabia. We guide you through the entire application process, from documentation to submission, to ensure a smooth and timely approval.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Expert Guidance:</strong> Our experienced consultants are up-to-date with the latest visa regulations.</li>
            <li><strong>Document Verification:</strong> We meticulously check all your documents to minimize the chances of rejection.</li>
            <li><strong>Fast Processing:</strong> We leverage our expertise to expedite your visa application.</li>
            <li><strong>Status Updates:</strong> Stay informed with regular updates on your application status.</li>
          </ul>
          <p>
            Whether you are traveling for pilgrimage or leisure, trust us to handle your visa needs with professionalism and care, allowing you to focus on planning the rest of your trip.
          </p>
        </>
      }
      Icon={FileText}
      ctaButtons={
        <>
          <Button asChild>
            <Link href="/contact">
              <Phone className="w-4 h-4 mr-2" />
              Contact Us for a Consultation
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/customize-umrah">
              <Sparkles className="w-4 h-4 mr-2" />
              Include Visa in a Custom Package
            </Link>
          </Button>
        </>
      }
    />
  );
}
