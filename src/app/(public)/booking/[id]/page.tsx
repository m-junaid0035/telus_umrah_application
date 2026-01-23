import BookingPage from '@/components/BookingPage';
import { getUmrahPackageById } from '@/functions/packageFunction';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPageRoute({ params }: PageProps) {
  try {
    const { id } = await params;
    const packageData = await getUmrahPackageById(id);

    if (!packageData) {
      redirect('/umrah-packages');
    }

    return (
      <BookingPage
        packageName={packageData.name}
        packageId={id}
        pricing={{
          adultPrice: packageData.adultPrice || 0,
          childPrice: packageData.childPrice || 0,
          infantPrice: packageData.infantPrice || 0,
          subtotal: 0,
        }}
      />
    );
  } catch (error) {
    console.error('Booking page error:', error);
    redirect('/umrah-packages');
  }
}
