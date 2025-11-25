import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import {
  CheckCircle,
  Star,
  Calendar,
  Hotel,
  Plane,
  Users,
  MapPin,
  Clock,
  ArrowLeft,
  Phone,
  Mail,
  Shield,
  Utensils,
  Car,
  Wifi,
  Briefcase,
  Home,
  Eye,
  Map,
  FileText,
  X,
  AlertCircle,
  Info,
  ChevronRight,
  Share2,
  Heart,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { LoginDialog } from './LoginDialog';
import { PackageBookingDialog } from './PackageBookingDialog';
import { fetchUmrahPackageByIdAction } from '@/actions/packageActions';
import { toast } from '@/hooks/use-toast';

// Import Makkah and Madina icons
import makkahIcon from '@/assets/makkah-icon.png';
import madinaIcon from '@/assets/madina-icon.png';

// Mock data removed - now fetching from backend
/*
const allPackages = [
  {
    id: 1,
    name: "Economy Umrah Package",
    price: 185000,
    duration: 14,
    badge: "Budget Friendly",
    badgeColor: "bg-green-500",
    airline: "Pakistan International Airlines",
    departureCity: "Karachi",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
    hotels: {
      makkah: { name: "Al Safwah Royal Orchid", distance: "800m from Haram", stars: 3 },
      madinah: { name: "Al Eiman Royal", distance: "500m from Masjid Nabawi", stars: 3 }
    },
    features: [
      "Return Air Ticket",
      "14 Days Accommodation",
      "Breakfast & Dinner",
      "Umrah Visa",
      "Airport Transfers",
      "Ziyarat Tours",
      "24/7 Support"
    ],
    travelers: "2-4 People per Room",
    rating: 4.3,
    reviews: 245,
    itinerary: [
      { day: 1, title: "Departure from Karachi", description: "Flight departure to Jeddah. Meet & greet at airport. Transfer to Makkah hotel." },
      { day: 2, title: "Umrah Performance", description: "Perform Umrah rituals with guidance. Rest and prayers at Haram." },
      { day: 3-7, title: "Makkah Stay", description: "Daily prayers at Haram. Optional Ziyarat tours to Islamic historical sites." },
      { day: 8, title: "Transfer to Madinah", description: "Check out from Makkah hotel. Travel to Madinah by road." },
      { day: 9-13, title: "Madinah Stay", description: "Prayers at Masjid Nabawi. Visit Islamic landmarks and historical sites." },
      { day: 14, title: "Return to Pakistan", description: "Check out and transfer to Jeddah airport for return flight." }
    ],
    includes: [
      "Return economy class air tickets",
      "14 nights accommodation (3-star hotels)",
      "Daily breakfast and dinner",
      "Umrah visa processing",
      "Airport to hotel transfers",
      "Makkah to Madinah transportation",
      "Basic Ziyarat tours",
      "24/7 customer support"
    ],
    excludes: [
      "Lunch meals",
      "Personal expenses",
      "Additional tours",
      "Travel insurance (optional)",
      "Laundry services"
    ],
    policies: {
      cancellation: "50% refund if cancelled 30 days before departure. 25% refund if cancelled 15-30 days before. No refund after 15 days.",
      payment: "20% advance payment required at booking. Full payment 15 days before departure.",
      visa: "Valid passport with minimum 6 months validity required. Visa processing takes 7-10 days."
    }
  },
  {
    id: 2,
    name: "Standard Umrah Package",
    price: 285000,
    duration: 15,
    badge: "Most Popular",
    badgeColor: "bg-blue-500",
    airline: "Saudi Airlines",
    departureCity: "Lahore",
    popular: true,
    image: "https://images.unsplash.com/photo-1591604129853-212965412d4f?w=800&q=80",
    hotels: {
      makkah: { name: "Swissotel Makkah", distance: "300m from Haram", stars: 4 },
      madinah: { name: "Crowne Plaza Madinah", distance: "200m from Masjid Nabawi", stars: 4 }
    },
    features: [
      "Return Air Ticket",
      "15 Days Accommodation",
      "All Meals Included",
      "Umrah Visa",
      "Airport & Hotel Transfers",
      "Guided Ziyarat Tours",
      "Travel Insurance",
      "24/7 Support"
    ],
    travelers: "2-3 People per Room",
    rating: 4.7,
    reviews: 412,
    itinerary: [
      { day: 1, title: "Departure from Lahore", description: "Direct Saudi Airlines flight to Jeddah. VIP meet & greet. Transfer to Makkah." },
      { day: 2, title: "Umrah Performance", description: "Complete Umrah rituals with experienced guide. Orientation session." },
      { day: 3-8, title: "Makkah Stay", description: "Daily prayers at Haram. Guided Ziyarat tours including Jabal Rahmah, Cave Hira." },
      { day: 9, title: "Transfer to Madinah", description: "Comfortable coach transfer to Madinah with rest stops." },
      { day: 10-14, title: "Madinah Stay", description: "Prayers at Masjid Nabawi. Visit Quba Mosque, Uhud, Qiblatain Mosque." },
      { day: 15, title: "Return Journey", description: "Airport transfer and return flight to Lahore." }
    ],
    includes: [
      "Return economy class tickets (Saudi Airlines)",
      "15 nights in 4-star hotels",
      "Full board meals (breakfast, lunch, dinner)",
      "Fast-track Umrah visa",
      "All ground transportation",
      "Professional guided Ziyarat tours",
      "Travel insurance coverage",
      "24/7 multilingual support",
      "Welcome kit with essentials"
    ],
    excludes: [
      "Personal shopping",
      "Additional snacks/beverages",
      "Optional premium tours",
      "Laundry services",
      "Excess baggage charges"
    ],
    policies: {
      cancellation: "75% refund if cancelled 45 days before. 50% if cancelled 30-45 days. 25% if cancelled 15-30 days.",
      payment: "25% advance at booking. 50% within 30 days. Full payment 20 days before departure.",
      visa: "Passport validity minimum 6 months. Polio certificate required. Visa processing 5-7 days."
    }
  },
  {
    id: 3,
    name: "Premium Umrah Package",
    price: 425000,
    duration: 20,
    badge: "Best Value",
    badgeColor: "bg-purple-500",
    airline: "Emirates",
    departureCity: "Islamabad",
    image: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&q=80",
    hotels: {
      makkah: { name: "Hilton Suites Makkah", distance: "Walking Distance to Haram", stars: 5 },
      madinah: { name: "Oberoi Madinah", distance: "Walking Distance to Masjid Nabawi", stars: 5 }
    },
    features: [
      "Business Class Available",
      "20 Days Accommodation",
      "Buffet - All Meals",
      "Umrah Visa (Fast Track)",
      "Private Transfers",
      "Premium Guided Ziyarat",
      "Laundry Service",
      "Travel Insurance",
      "SIM Card & WiFi",
      "24/7 Dedicated Support"
    ],
    travelers: "2 People per Room",
    rating: 4.9,
    reviews: 328,
    itinerary: [
      { day: 1, title: "Premium Departure", description: "Emirates flight to Jeddah. Business class option available. VIP lounge access." },
      { day: 2, title: "Umrah with Scholar", description: "Perform Umrah with Islamic scholar guidance. Premium ihram and essentials provided." },
      { day: 3-10, title: "Extended Makkah Stay", description: "Daily Haram prayers. Premium Ziyarat tours with historical insights. Shopping assistance." },
      { day: 11, title: "Luxury Transfer", description: "Private coach to Madinah with refreshments and comfort stops." },
      { day: 12-19, title: "Extended Madinah Stay", description: "Prayers at Masjid Nabawi. Extensive Ziyarat including Badr, Quba, Seven Mosques." },
      { day: 20, title: "Return in Comfort", description: "Private transfer to airport. Return Emirates flight." }
    ],
    includes: [
      "Return Emirates economy/business class tickets",
      "20 nights in 5-star hotels with Haram/Nabawi view",
      "Premium buffet meals (all three meals)",
      "VIP Umrah visa processing",
      "Private luxury transportation",
      "Expert-guided premium Ziyarat tours",
      "Comprehensive travel insurance",
      "Daily laundry service",
      "Local SIM card with data",
      "Unlimited WiFi",
      "Welcome premium kit",
      "24/7 dedicated tour manager"
    ],
    excludes: [
      "Personal shopping expenses",
      "Optional helicopter tour",
      "Spa services at hotel",
      "Business class upgrade (available at extra cost)"
    ],
    policies: {
      cancellation: "90% refund if cancelled 60 days before. 75% if 45-60 days. 50% if 30-45 days. 25% if 15-30 days.",
      payment: "30% advance at booking. Balance 30 days before departure. Flexible payment plans available.",
      visa: "Passport minimum 6 months validity. VIP visa processing 3-5 days. Dedicated visa coordinator."
    }
  },
  {
    id: 4,
    name: "VIP Luxury Umrah Package",
    price: 650000,
    duration: 25,
    badge: "Luxury",
    badgeColor: "bg-amber-500",
    airline: "Qatar Airways",
    departureCity: "Karachi",
    luxury: true,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    hotels: {
      makkah: { name: "Raffles Makkah Palace", distance: "Haram View", stars: 5 },
      madinah: { name: "Pullman Zamzam Madinah", distance: "Nabawi View", stars: 5 }
    },
    features: [
      "Business/First Class",
      "25 Days Luxury Stay",
      "Premium Buffet",
      "VIP Visa Processing",
      "Private Luxury Transfers",
      "Personal Guide",
      "Daily Laundry",
      "Premium Insurance",
      "Unlimited WiFi",
      "Meet & Greet",
      "Special Amenities",
      "24/7 Concierge"
    ],
    travelers: "Single/Double Room",
    rating: 5.0,
    reviews: 156,
    itinerary: [
      { day: 1, title: "First Class Experience", description: "Qatar Airways business/first class. VIP lounge. Fast-track immigration. Luxury transfer." },
      { day: 2, title: "VIP Umrah Service", description: "Private Umrah guidance with scholar. VIP wheelchair assistance. Premium ihram set." },
      { day: 3-13, title: "Luxury Makkah Experience", description: "Suite with Haram view. Private Ziyarat with historian. Personal shopping assistant." },
      { day: 14, title: "Premium Transfer", description: "Private luxury vehicle to Madinah with personal driver and refreshments." },
      { day: 15-24, title: "Exclusive Madinah Stay", description: "Suite with Nabawi view. Private scholar sessions. VIP access to special areas." },
      { day: 25, title: "Luxury Return", description: "Private airport transfer. Fast-track check-in. Business/first class return." }
    ],
    includes: [
      "Business/First class Qatar Airways tickets",
      "25 nights in presidential suites with holy views",
      "Premium international buffet & à la carte dining",
      "VIP fast-track visa processing",
      "Private luxury vehicles with personal driver",
      "Personal Islamic scholar/guide throughout",
      "Daily laundry & dry cleaning",
      "Premium comprehensive insurance",
      "Unlimited high-speed WiFi",
      "International SIM with unlimited data",
      "VIP meet & greet at all points",
      "Luxury welcome hamper",
      "Personal concierge 24/7",
      "Private shopping tours",
      "Spa access at hotels",
      "Priority Haram/Nabawi access"
    ],
    excludes: [
      "Personal luxury purchases",
      "Helicopter tours (can be arranged)",
      "Additional spa treatments",
      "Private jet upgrade"
    ],
    policies: {
      cancellation: "95% refund if cancelled 90 days before. 85% if 60-90 days. 75% if 45-60 days. 50% if 30-45 days.",
      payment: "40% advance at booking. 40% within 45 days. Balance 30 days before departure. Customized payment plans available.",
      visa: "VIP concierge handles all documentation. Fast-track processing 2-3 days. Personal visa coordinator assigned."
    }
  },
  {
    id: 5,
    name: "Family Umrah Package",
    price: 320000,
    duration: 18,
    badge: "Family Special",
    badgeColor: "bg-pink-500",
    airline: "Etihad Airways",
    departureCity: "Lahore",
    image: "https://images.unsplash.com/photo-1609128627965-e548b58e2952?w=800&q=80",
    hotels: {
      makkah: { name: "Anjum Hotel Makkah", distance: "400m from Haram", stars: 4 },
      madinah: { name: "Madinah Hilton", distance: "300m from Masjid Nabawi", stars: 4 }
    },
    features: [
      "Family Air Tickets",
      "18 Days Stay",
      "Family Meals Included",
      "Umrah Visa for All",
      "Family Transfers",
      "Kid-Friendly Tours",
      "Travel Insurance",
      "24/7 Family Support"
    ],
    travelers: "Family Rooms Available",
    rating: 4.6,
    reviews: 289,
    itinerary: [
      { day: 1, title: "Family Departure", description: "Etihad family-friendly flight. Kids' entertainment. Family meet & greet. Spacious transfer." },
      { day: 2, title: "Family Umrah", description: "Umrah guidance suitable for all ages. Special assistance for children and elderly." },
      { day: 3-9, title: "Makkah Family Time", description: "Family rooms near Haram. Kid-friendly Ziyarat. Family dining options. Play areas." },
      { day: 10, title: "Comfortable Transfer", description: "Family-friendly coach to Madinah with entertainment and comfort stops." },
      { day: 11-17, title: "Madinah Family Stay", description: "Spacious family suites. Child-appropriate tours. Family dining. Shopping time." },
      { day: 18, title: "Family Return", description: "Airport assistance for families. Return flight with kids' amenities." }
    ],
    includes: [
      "Return Etihad tickets for whole family",
      "18 nights family rooms/connecting rooms",
      "Family-style buffet meals",
      "Umrah visa for all family members",
      "Spacious family transfers",
      "Child-friendly Ziyarat tours",
      "Family travel insurance",
      "Kids' welcome kits",
      "Stroller/wheelchair assistance",
      "24/7 family support hotline",
      "Baby food arrangement on request"
    ],
    excludes: [
      "Special dietary requirements (available on request)",
      "Babysitting services",
      "Kids' extra activities",
      "Shopping expenses"
    ],
    policies: {
      cancellation: "75% refund if cancelled 45 days before. 50% if 30-45 days. Children under 2 years fully refundable.",
      payment: "30% advance at booking. Balance 25 days before departure. Family discount of 5% on 4+ members.",
      visa: "Special assistance for children's visa. Family visa processing together. Required: passport, photos, vaccination certificates."
    }
  },
  {
    id: 6,
    name: "Ramadan Special Package",
    price: 495000,
    duration: 20,
    badge: "Ramadan Special",
    badgeColor: "bg-teal-500",
    airline: "Saudi Airlines",
    departureCity: "Islamabad",
    image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=800&q=80",
    hotels: {
      makkah: { name: "Makkah Clock Tower", distance: "Connected to Haram", stars: 5 },
      madinah: { name: "Shaza Madinah", distance: "150m from Masjid Nabawi", stars: 5 }
    },
    features: [
      "Ramadan Air Tickets",
      "20 Days Stay",
      "Suhoor & Iftar",
      "Fast Track Visa",
      "Priority Transfers",
      "Special Ramadan Tours",
      "Taraweeh Arrangements",
      "Premium Insurance",
      "24/7 Support"
    ],
    travelers: "2-3 People per Room",
    rating: 4.8,
    reviews: 198,
    itinerary: [
      { day: 1, title: "Ramadan Arrival", description: "Special Ramadan flight timing. VIP meet & greet. Iftar arrangement on arrival." },
      { day: 2, title: "First Umrah", description: "Perform Umrah during blessed month. Special prayers and spiritual guidance." },
      { day: 3-11, title: "Blessed Makkah Days", description: "Daily Iftar in hotel. Taraweeh at Haram. Special Laylat al-Qadr arrangements. Suhoor timing." },
      { day: 12, title: "Journey to Madinah", description: "Transfer with Iftar pack. Arrival before Maghrib." },
      { day: 13-19, title: "Ramadan in Madinah", description: "Taraweeh at Masjid Nabawi. Special night prayers. Ziyarat between prayers. Iftar arrangements." },
      { day: 20, title: "Blessed Return", description: "Final prayers and duas. Return journey during Ramadan." }
    ],
    includes: [
      "Special Ramadan flight schedule",
      "20 nights in 5-star hotels near Haram/Nabawi",
      "Daily Suhoor & Iftar buffet",
      "Special Ramadan meals",
      "Fast-track Ramadan visa",
      "Priority ground transport",
      "Reserved Taraweeh spaces",
      "Special night prayer arrangements",
      "Laylat al-Qadr special program",
      "Spiritual guidance sessions",
      "Dates and refreshments for Iftar",
      "Ramadan guide and prayer schedule",
      "Travel insurance",
      "24/7 Ramadan support team"
    ],
    excludes: [
      "Personal Iftar preferences",
      "Additional night activities",
      "Extra spiritual sessions (can be arranged)",
      "Personal shopping"
    ],
    policies: {
      cancellation: "Special Ramadan policy: 80% refund if cancelled 60 days before. 60% if 45-60 days. 40% if 30-45 days.",
      payment: "35% advance at booking (high demand season). Balance 30 days before departure. Early bird discount 10% if booked 6 months in advance.",
      visa: "Priority Ramadan visa processing. Express service 5-7 days. Health requirements strictly checked for Ramadan."
    }
  }
];
*/

interface PackageDetailsPageProps {
  id: string;
}
export function PackageDetailsPage({ id }: PackageDetailsPageProps) {

  const router = useRouter();
  const { user } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPackage = async () => {
      try {
        const result = await fetchUmrahPackageByIdAction(id);
        if (result?.data) {
          setPkg(result.data);
        } else {
          toast({
            title: "Error",
            description: result?.error?.message?.[0] || "Package not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load package",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadPackage();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-gray-900 mb-4">Loading package...</h2>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-gray-900 mb-4">Package Not Found</h2>
          <Button onClick={() => router.push('/umrah-packages')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!user) {
      setShowLoginDialog(true);
    }
    // Booking dialog will handle the rest
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pkg.name,
        text: `Check out this amazing Umrah package: ${pkg.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      <div className="relative h-[400px] md:h-[500px] mt-20">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <Button
              variant="ghost"
              className="mb-4 text-white hover:bg-white/20"
              onClick={() => router.push('/umrah-packages')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Packages
            </Button>
            
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`${pkg.badgeColor} text-white`}>
                    {pkg.badge}
                  </Badge>
                  {pkg.popular && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 fill-white mr-1" />
                      Popular Choice
                    </Badge>
                  )}
                </div>
                <h1 className="text-white text-4xl md:text-5xl mb-3">{pkg.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-5 h-5" />
                    <span>{pkg.duration} Days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5" />
                    <span>{pkg.departureCity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Plane className="w-5 h-5" />
                    <span>{pkg.airline}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(pkg.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-white/40'
                        }`}
                      />
                    ))}
                    <span className="ml-1">{pkg.rating} ({pkg.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-2xl">
                <p className="text-sm text-gray-600 mb-1">Starting from</p>
                <p className="text-blue-600 text-3xl md:text-4xl mb-1">
                  PKR {pkg.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-4">per person</p>
                <div className="flex gap-2">
                  {user ? (
                    <PackageBookingDialog
                      packageId={pkg._id}
                      packageName={pkg.name}
                      user={user}
                      trigger={
                        <Button
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          Book Now
                        </Button>
                      }
                    />
                  ) : (
                    <Button
                      onClick={handleBookNow}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      Book Now
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotels */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-gray-900 mb-6 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    Accommodation
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Makkah Hotel */}
                    {pkg.hotels?.makkah && (
                      <Link 
                        href={`/makkah-hotels/makkah/${pkg.hotels.makkah.name?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                        className="block"
                      >
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <img src={makkahIcon.src} alt="Makkah" className="w-5 h-5" />
                              <h3 className="text-gray-900">Makkah Hotel</h3>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-gray-800 mb-2">{pkg.hotels.makkah.name || 'N/A'}</p>
                          {pkg.hotels.makkah.distance && (
                            <p className="text-sm text-gray-600 mb-3">{pkg.hotels.makkah.distance}</p>
                          )}
                          {pkg.hotels.makkah.star && (
                            <div className="flex items-center gap-1">
                              {[...Array(pkg.hotels.makkah.star)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">{pkg.hotels.makkah.star} Star</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    )}
                    {/* Madinah Hotel */}
                    {pkg.hotels?.madinah && (
                      <Link 
                        href={`/madina-hotels/madinah/${pkg.hotels.madinah.name?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                        className="block"
                      >
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <img src={madinaIcon.src} alt="Madina" className="w-5 h-5" />
                              <h3 className="text-gray-900">Madinah Hotel</h3>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-gray-800 mb-2">{pkg.hotels.madinah.name || 'N/A'}</p>
                          {pkg.hotels.madinah.distance && (
                            <p className="text-sm text-gray-600 mb-3">{pkg.hotels.madinah.distance}</p>
                          )}
                          {pkg.hotels.madinah.star && (
                            <div className="flex items-center gap-1">
                              {[...Array(pkg.hotels.madinah.star)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">{pkg.hotels.madinah.star} Star</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs for Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="itinerary" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                      <TabsTrigger value="includes">Includes</TabsTrigger>
                      <TabsTrigger value="excludes">Excludes</TabsTrigger>
                      <TabsTrigger value="policies">Policies</TabsTrigger>
                    </TabsList>

                    {/* Itinerary Tab */}
                    <TabsContent value="itinerary" className="space-y-4 mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Map className="w-5 h-5 text-blue-600" />
                        <h3 className="text-gray-900">Day by Day Itinerary</h3>
                      </div>
                      {pkg.itinerary && pkg.itinerary.map((item: any, index: number) => (
                        <div key={item._id || index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                              {item.day || index + 1}
                            </div>
                            {index < pkg.itinerary.length - 1 && (
                              <div className="w-0.5 h-full bg-blue-200 my-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <h4 className="text-gray-900 mb-1">{item.title || `Day ${index + 1}`}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    {/* Includes Tab */}
                    <TabsContent value="includes" className="space-y-3 mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-gray-900">What's Included</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pkg.includes && pkg.includes.map((item: any, index: number) => (
                          <div key={item._id || index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{typeof item === 'string' ? item : item.include_text || item}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Excludes Tab */}
                    <TabsContent value="excludes" className="space-y-3 mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h3 className="text-gray-900">What's Not Included</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pkg.excludes && pkg.excludes.map((item: any, index: number) => (
                          <div key={item._id || index} className="flex items-start gap-2">
                            <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{typeof item === 'string' ? item : item.exclude_text || item}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Policies Tab */}
                    <TabsContent value="policies" className="space-y-4 mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="text-gray-900">Terms & Policies</h3>
                      </div>
                      
                      {pkg.policies && (
                        <div className="space-y-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-gray-900 mb-2 flex items-center gap-2">
                              <Info className="w-4 h-4 text-blue-600" />
                              Cancellation Policy
                            </h4>
                            <p className="text-sm text-gray-700">{pkg.policies.cancellation}</p>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="text-gray-900 mb-2 flex items-center gap-2">
                              <Info className="w-4 h-4 text-green-600" />
                              Payment Terms
                            </h4>
                            <p className="text-sm text-gray-700">{pkg.policies.payment}</p>
                          </div>
                          
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="text-gray-900 mb-2 flex items-center gap-2">
                              <Info className="w-4 h-4 text-purple-600" />
                              Visa Requirements
                            </h4>
                            <p className="text-sm text-gray-700">{pkg.policies.visa}</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Package Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pkg.features && pkg.features.map((feature: any, index: number) => (
                      <div
                        key={feature._id || index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{typeof feature === 'string' ? feature : feature.feature_text || feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 space-y-6"
            >
              {/* Price Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-4">Package Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="text-gray-900">{pkg.duration} Days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Travelers</span>
                      <span className="text-gray-900">{pkg.travelers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Departure</span>
                      <span className="text-gray-900">{pkg.departureCity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Airline</span>
                      <span className="text-gray-900">{pkg.airline}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-600">Total Price</span>
                    <div className="text-right">
                      <p className="text-blue-600 text-2xl">
                        PKR {pkg.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>

                  {user ? (
                    <PackageBookingDialog
                      packageId={pkg._id}
                      packageName={pkg.name}
                      user={user}
                      trigger={
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 mb-3">
                          Book This Package
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      }
                    />
                  ) : (
                    <Button
                      onClick={handleBookNow}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 mb-3"
                    >
                      Book This Package
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  <Link href="/customize-umrah">
                    <Button variant="outline" className="w-full">
                      Customize Package
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-4">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our travel experts are here to help you with any questions.
                  </p>
                  <div className="space-y-3">
                    <a href="tel:+923001234567">
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="w-4 h-4 mr-2" />
                        +92 300 1234567
                      </Button>
                    </a>
                    <a href="mailto:info@telusumrah.com">
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        info@telusumrah.com
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span>100% Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Licensed Travel Agent</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span>24/7 Customer Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}

