"use client";

import { Utensils, Phone, Sparkles } from 'lucide-react';
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

export default function MealServicePage() {
  return (
    <ServicePageLayout
      title="Meal Service"
      description="Delicious and hygienic meal plans"
      longDescription={
        <>
          <p>
            Ensure you are well-nourished throughout your spiritual journey with our delicious and hygienic meal services. We understand the importance of good food for a comfortable pilgrimage, and we offer a variety of meal plans to cater to different tastes and dietary requirements.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Variety of Cuisines:</strong> Enjoy a range of options including Pakistani, Indian, and continental dishes.</li>
            <li><strong>Flexible Plans:</strong> Choose between breakfast-only, half-board (breakfast and dinner), or full-board (breakfast, lunch, and dinner) plans.</li>
            <li><strong>Hygienic Preparation:</strong> All meals are prepared in clean, hygienic environments to ensure your health and safety.</li>
            <li><strong>Convenient Delivery:</strong> Meals can be served at your hotel's dining hall or delivered to your room for your convenience.</li>
          </ul>
          <p>
            Our meal services can be added to any Umrah package, providing you with peace of mind and allowing you to focus on your worship.
          </p>
        </>
      }
      Icon={Utensils}
      ctaButtons={
        <>
          <Button asChild>
            <Link href="/contact">
              <Phone className="w-4 h-4 mr-2" />
              Inquire About Meal Plans
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/customize-umrah">
              <Sparkles className="w-4 h-4 mr-2" />
              Add Meals to a Custom Package
            </Link>
          </Button>
        </>
      }
    />
  );
}
