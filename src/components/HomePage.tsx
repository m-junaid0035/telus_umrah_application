import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchAllUmrahPackagesAction } from '@/actions/packageActions';
import { fetchAllHotelsAction } from '@/actions/hotelActions';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Sparkles,
  Shield,
  Clock,
  HeadphonesIcon,
  Award,
  Globe,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings,
  Plane,
  Hotel,
  Palmtree,
  FileText,
  Building,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

// Import airline logos from Figma assets
import sereneAirLogo from '@/assets/d0c55b978a086a73b2fb50854cf04ff81b6aac0b.png';
import gulfAirLogo from '@/assets/e28e0a2d39614f5bf7ea2c55d6fc579d46d4c9fc.png';
import turkishAirlinesLogo from '@/assets/ac3c2c97ff797a518e5f4d4cb47dcefc00bcb019.png';
import qatarAirwaysLogo from '@/assets/e8f7e43e4182484eee13d1fd750ab600da4a61b1.png';
import thaiAirwaysLogo from '@/assets/cdb220143886cc62c69f62df943f6d4696ae28fd.png';
import saudiaLogo from '@/assets/b9f20e713c92c82b6e94ffa74d871a980c8049ba.png';
import piaLogo from '@/assets/35293a117c78f2e22505cf3ae7ef2f152cf09f0b.png';
import etihadLogo from '@/assets/713718ae1d0268b59f79364ed8d891884e2f5326.png';
import shaheenAirLogo from '@/assets/dc2814087104402377fd7a3913ebe47172426e2f.png';
import emiratesLogo from '@/assets/bbf68fd4ecd3e7277285a22042637fbaafc25a7c.png';
import airblueLogo from '@/assets/46162b64c705ab0c6c4e53a96bd897744d3a77d9.png';

// Import hero carousel images
import heroImage1 from '@/assets/f04256d4638239166ecad5f001ee7ffe910704b6.png';
import heroImage2 from '@/assets/f3ba011d2f586be8d86155c907d6c190755bf879.png';
import heroImage3 from '@/assets/04d3a5a5fba1a74db087029d3ce48fbe6729fffb.png';

// Import Makkah and Madina icons
import makkahIcon from '@/assets/ba6627702a0a2db3ec399c151ab739781dad0897.png';
import madinaIcon from '@/assets/4c0ebc2b4c4fd59170b1c28e046aa03ac40a6f01.png';

const features = [
  {
    icon: Sparkles,
    title: 'Best Prices',
    description: 'Guaranteed lowest fares for your travel',
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    description: '100% safe and secure transactions',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer assistance',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Agents',
    description: 'Professional travel consultants',
  },
];

const stats = [
  { number: '2M+', label: 'Happy Travelers', icon: Users },
  { number: '150+', label: 'Countries', icon: Globe },
  { number: '98%', label: 'Satisfaction Rate', icon: Award },
  { number: '24/7', label: 'Customer Support', icon: Clock },
];

// Airline logos data
const airlines = [
  { name: 'Emirates', logo: emiratesLogo },
  { name: 'Etihad Airways', logo: etihadLogo },
  { name: 'Qatar Airways', logo: qatarAirwaysLogo },
  { name: 'Turkish Airlines', logo: turkishAirlinesLogo },
  { name: 'Gulf Air', logo: gulfAirLogo },
  { name: 'Thai Airways', logo: thaiAirwaysLogo },
  { name: 'Saudia', logo: saudiaLogo },
  { name: 'PIA', logo: piaLogo },
  { name: 'Serene Air', logo: sereneAirLogo },
  { name: 'Airblue', logo: airblueLogo },
  { name: 'Shaheen Air', logo: shaheenAirLogo },
];

// Helper function to get airline logo
const getAirlineLogo = (airlineName: string) => {
  const airlineMap: { [key: string]: string } = {
    'Pakistan International Airlines': piaLogo.src,
    'Saudi Airlines': saudiaLogo.src,
    'Emirates': emiratesLogo.src,
    'Qatar Airways': qatarAirwaysLogo.src,
    'Turkish Airlines': turkishAirlinesLogo.src,
    'Etihad Airways': etihadLogo.src,
    'Gulf Air': gulfAirLogo.src,
    'Thai Airways': thaiAirwaysLogo.src,
    'Serene Air': sereneAirLogo.src,
    'Airblue': airblueLogo.src,
    'Shaheen Air': shaheenAirLogo.src,
  };
  return airlineMap[airlineName] || piaLogo;
};

// Interface for backend hotel data
interface BackendHotel {
  _id: string;
  name: string;
  star: number;
  type: 'Makkah' | 'Madina';
  location: string;
  distance?: string;
  images?: string[];
  amenities?: string[];
  description?: string;
}

// Our Services Data
// To customize service images, simply replace the image URL below
const services = [
  {
    name: 'Flight Booking',
    description: 'Book flights to worldwide destinations',
    // Replace the image URL below with your custom image
    image: 'https://images.unsplash.com/photo-1719058292683-a358b17bc282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbGlnaHQlMjBhaXJwbGFuZSUyMGJvb2tpbmd8ZW58MXx8fHwxNzYyMTA5NTkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    name: 'Hotel Reservation',
    description: 'Luxury hotels at best prices',
    // Replace the image URL below with your custom image
    image: 'https://images.unsplash.com/photo-1700878354382-46816bf47ffc?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Visa Services',
    description: 'Hassle-free visa processing',
    // Replace the image URL below with your custom image
    image: 'https://images.unsplash.com/photo-1655722725332-9925c96dd627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXNzcG9ydCUyMHZpc2ElMjB0cmF2ZWx8ZW58MXx8fHwxNzYyMDgwMDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    name: 'Umrah Service',
    description: 'Complete Umrah pilgrimage services',
    // Replace the image URL below with your custom image
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
];

// Hero carousel images
const heroCarouselImages = [
  {
    image: heroImage1,
    title: 'Experience the Sacred Journey',
    subtitle: 'Your spiritual path to Mecca starts here',
  },
  {
    image: heroImage2,
    title: 'Luxurious Accommodations with Kaaba View',
    subtitle: 'Premium hotels with stunning views of the Holy Kaaba',
  },
  {
    image: heroImage3,
    title: 'Visit the Prophet\'s Mosque in Madinah',
    subtitle: 'Complete your spiritual journey to the holy city',
  },
];

export function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [packages, setPackages] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [hotels, setHotels] = useState<BackendHotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);

  // Fetch packages from backend
  useEffect(() => {
    const loadPackages = async () => {
      setLoadingPackages(true);
      try {
        const result = await fetchAllUmrahPackagesAction();
        if (result?.data && Array.isArray(result.data)) {
          // Get first 4 packages (or all if less than 4)
          setPackages(result.data.slice(0, 4));
        } else {
          toast({
            title: "Error",
            description: result?.error?.message?.[0] || "Failed to load packages",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load packages",
          variant: "destructive",
        });
      } finally {
        setLoadingPackages(false);
      }
    };
    loadPackages();
  }, []);

  // Fetch hotels from backend
  useEffect(() => {
    const loadHotels = async () => {
      setLoadingHotels(true);
      try {
        const result = await fetchAllHotelsAction();
        if (result?.data && Array.isArray(result.data)) {
          // Get first 6 hotels (mix of Makkah and Madina)
          // Prioritize hotels with images
          const hotelsWithImages = result.data.filter((h: BackendHotel) => h.images && h.images.length > 0);
          const hotelsWithoutImages = result.data.filter((h: BackendHotel) => !h.images || h.images.length === 0);
          const sortedHotels = [...hotelsWithImages, ...hotelsWithoutImages].slice(0, 6);
          setHotels(sortedHotels);
        } else {
          toast({
            title: "Error",
            description: result?.error?.message?.[0] || "Failed to load hotels",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load hotels",
          variant: "destructive",
        });
      } finally {
        setLoadingHotels(false);
      }
    };
    loadHotels();
  }, []);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroCarouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        {/* Carousel Container */}
        <div className="absolute inset-0">
          {heroCarouselImages.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.05,
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
              style={{ pointerEvents: currentSlide === index ? 'auto' : 'none' }}
            >
              <img
                src={slide.image.src}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Minimal dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            </motion.div>
          ))}
        </div>

        {/* Top Content - Title */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-32 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            {/* Dynamic Title Based on Slide */}
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="text-white mb-4 max-w-5xl mx-auto leading-tight drop-shadow-2xl"
            >
              {heroCarouselImages[currentSlide].title}
            </motion.h1>

            <motion.p
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white text-xl mb-6 max-w-3xl mx-auto drop-shadow-lg"
            >
              {heroCarouselImages[currentSlide].subtitle}
            </motion.p>
          </div>
        </div>

        {/* Bottom Content - CTA Buttons and Trust Indicators */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <Link href="/customize-umrah">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:via-amber-600 hover:to-amber-700 text-white px-8 py-6 text-base shadow-2xl group min-w-[240px]">
                    <Settings className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Customize Your Umrah
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>

              <Link href="/umrah-packages">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="bg-white/95 backdrop-blur-sm border-2 border-white text-gray-900 hover:bg-white hover:border-white px-8 py-6 text-base shadow-xl min-w-[240px] group"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Explore Packages
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-6 lg:gap-8 bg-black/30 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white flex items-center justify-center text-gray-900 text-xs shadow-lg"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-white">2M+</div>
                  <div className="text-xs text-white/80">Happy Pilgrims</div>
                </div>
              </div>

              <div className="h-10 w-px bg-white/30 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-white">4.9/5</div>
                  <div className="text-xs text-white/80">Rating</div>
                </div>
              </div>

              <div className="h-10 w-px bg-white/30 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white text-sm">Secure Booking</div>
                  <div className="text-xs text-white/80">Best Price Guarantee</div>
                </div>
              </div>

              <div className="h-10 w-px bg-white/30 hidden lg:block" />

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white text-sm">24/7 Support</div>
                  <div className="text-xs text-white/80">Always Available</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Carousel Navigation Dots */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 z-30 flex flex-col gap-3">
          {heroCarouselImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all ${currentSlide === index
                  ? 'bg-white h-12 w-3'
                  : 'bg-white/50 h-3 w-3 hover:bg-white/80'
                }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Latest Umrah Packages Section */}
      <section id="premade-umrah-packages" className="py-12 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full"></div>
                <span className="text-sm text-green-700 uppercase tracking-wider">Special Packages</span>
              </div>
              <h2 className="text-gray-900 text-2xl md:text-3xl">Featured Umrah Packages</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loadingPackages ? (
              <div className="col-span-full text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading packages...</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500 text-lg">No packages available</p>
              </div>
            ) : (
              packages.map((pkg, index) => {
                const badgeColors: Record<string, string> = {
                  'Budget Friendly': 'bg-green-500',
                  'Most Popular': 'bg-blue-500',
                  'Best Value': 'bg-purple-500',
                  'VIP Experience': 'bg-gradient-to-r from-amber-500 to-orange-600',
                };
                const badgeColor = badgeColors[pkg.badge || ''] || 'bg-blue-500';
                const makkahHotel = pkg.hotels?.makkah;
                const madinahHotel = pkg.hotels?.madinah;
                const features = pkg.features || [];

                return (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`overflow-hidden hover:shadow-xl transition-shadow ${pkg.popular ? 'ring-2 ring-blue-500' : ''
                      }`}>
                      <CardContent className="p-0">
                        {/* Header Section */}
                        <div className={`${badgeColor} p-4 text-white`}>
                          <div className="flex items-start justify-between flex-wrap gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {pkg.badge && (
                                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs">
                                    {pkg.badge}
                                  </Badge>
                                )}
                                {pkg.popular && (
                                  <Badge className="bg-yellow-500 text-white flex items-center gap-1 text-xs">
                                    <Star className="w-3 h-3 fill-white" />
                                    <span>Popular</span>
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-bold text-xl mb-2">{pkg.name}</h3>
                              <div className="flex items-center gap-3 text-white/90 flex-wrap text-xs">
                                {pkg.duration && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{pkg.duration} Days</span>
                                  </div>
                                )}
                                {pkg.departureCity && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{pkg.departureCity}</span>
                                  </div>
                                )}
                                {pkg.airline && (
                                  <div className="flex items-center gap-1.5">
                                    <img
                                      src={getAirlineLogo(pkg.airline).toString()}
                                      alt={pkg.airline}
                                      className="w-4 h-4 object-contain bg-white rounded p-0.5"
                                    />
                                    <span className="truncate max-w-[120px]">{pkg.airline}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white/80 text-xs mb-0.5">Starting from</p>
                              <p className="text-2xl font-bold">
                                PKR {pkg.price?.toLocaleString() || 'N/A'}
                              </p>
                              <p className="text-white/80 text-xs">per person</p>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Rating */}
                          {(pkg.rating || pkg.reviews) && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < Math.floor(pkg.rating || 0)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">
                                {pkg.rating || 0} ({pkg.reviews || 0} reviews)
                              </span>
                            </div>
                          )}

                          {/* Hotels */}
                          {(makkahHotel || madinahHotel) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                              {makkahHotel && (
                                <Link
                                  href={`/makkah-hotels/makkah/${makkahHotel.name?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                                  className="block"
                                >
                                  <div className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between gap-1.5 mb-0.5">
                                      <div className="flex items-center gap-1.5">
                                        <img src={makkahIcon.src} alt="Makkah" className="w-4 h-4" />
                                        <span className="text-xs font-semibold text-gray-900">Makkah Hotel</span>
                                      </div>
                                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-1 mb-0.5">{makkahHotel.name || 'N/A'}</p>
                                    {makkahHotel.distance && (
                                      <p className="text-xs text-gray-500 mb-0.5">{makkahHotel.distance}</p>
                                    )}
                                    {makkahHotel.star && (
                                      <div className="flex">
                                        {[...Array(makkahHotel.star)].map((_, i) => (
                                          <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              )}
                              {madinahHotel && (
                                <Link
                                  href={`/madina-hotels/madinah/${madinahHotel.name?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                                  className="block"
                                >
                                  <div className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between gap-1.5 mb-0.5">
                                      <div className="flex items-center gap-1.5">
                                        <img src={madinaIcon.src} alt="Madina" className="w-4 h-4" />
                                        <span className="text-xs font-semibold text-gray-900">Madinah Hotel</span>
                                      </div>
                                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-1 mb-0.5">{madinahHotel.name || 'N/A'}</p>
                                    {madinahHotel.distance && (
                                      <p className="text-xs text-gray-500 mb-0.5">{madinahHotel.distance}</p>
                                    )}
                                    {madinahHotel.star && (
                                      <div className="flex">
                                        {[...Array(madinahHotel.star)].map((_, i) => (
                                          <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              )}
                            </div>
                          )}

                          {/* Features */}
                          {features.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                              {features.slice(0, 8).map((feature: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                                  <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                  <span className="truncate text-xs">{feature.feature_text || feature}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            {pkg.travelers && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <Users className="w-3.5 h-3.5" />
                                <span>{pkg.travelers}</span>
                              </div>
                            )}
                            <div className="flex gap-2 ml-auto">
                              <Link href={`/umrah-packages/${pkg._id}`}>
                                <Button variant="outline" size="sm" className="text-xs h-8">
                                  View Details
                                </Button>
                              </Link>
                              <Link href="/umrah-packages">
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-xs h-8"
                                >
                                  Book Now
                                  <Plane className="w-3.5 h-3.5 ml-1.5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/umrah-packages">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-5 rounded-lg text-sm gap-2 shadow-md"
                >
                  View All Packages
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Link>

            <Link href="/customize-umrah">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-5 rounded-lg text-sm gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Customize Your Package
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}


      {/* Services Section */}
      <section className="py-12 bg-gradient-to-br from-slate-50 to-gray-100/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
              <span className="text-sm text-blue-700 uppercase tracking-wider">What We Offer</span>
            </div>
            <h2 className="text-gray-900 text-2xl md:text-3xl">Our Services</h2>
          </motion.div>

          {/* Horizontal Carousel with Navigation Arrows */}
          <div className="relative py-4">
            {/* Left Arrow */}
            <motion.button
              onClick={scrollLeft}
              initial={{ opacity: 0 }}
              animate={{ opacity: canScrollLeft ? 1 : 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-0 disabled:cursor-not-allowed"
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Right Arrow */}
            <motion.button
              onClick={scrollRight}
              initial={{ opacity: 0 }}
              animate={{ opacity: canScrollRight ? 1 : 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-0 disabled:cursor-not-allowed"
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Scroll Container */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide overflow-y-visible px-12"
            >
              <div className="flex gap-6 pb-8 px-1 pt-2">
                {services.map((service, index) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px]"
                  >
                    <div className="relative h-[280px] md:h-[320px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group">
                      {/* Background Image */}
                      <ImageWithFallback
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {/* Service Name */}
                          <h3 className="text-white text-xl md:text-2xl mb-2">
                            {service.name}
                          </h3>

                          {/* Description */}
                          <p className="text-white/80 text-sm md:text-base">
                            {service.description}
                          </p>
                        </motion.div>
                      </div>

                      {/* Hover Border Effect */}
                      <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/50 transition-colors rounded-2xl pointer-events-none" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Custom scrollbar hide styles */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

      {/* Airlines Carousel Section */}
      <section className="py-10 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full"></div>
              <span className="text-sm text-indigo-700 uppercase tracking-wider">Our Partners</span>
            </div>
            <h2 className="text-gray-900 text-2xl md:text-3xl">Leading Airlines</h2>
          </motion.div>

          {/* Infinite Scrolling Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-12 items-center"
                animate={{
                  x: [0, -1920],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
                {/* First set of logos */}
                {airlines.map((airline, index) => (
                  <motion.div
                    key={`airline-${index}`}
                    className="flex-shrink-0 bg-gray-50 rounded-xl p-4 w-32 h-32 flex items-center justify-center border border-gray-200"
                    whileHover={{ scale: 1.05, y: -4 }}
                  >
                    <img
                      src={airline.logo.src}
                      alt={airline.name}
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                    />
                  </motion.div>
                ))}

                {/* Duplicate set for seamless loop */}
                {airlines.map((airline, index) => (
                  <motion.div
                    key={`airline-duplicate-${index}`}
                    className="flex-shrink-0 bg-gray-50 rounded-xl p-4 w-32 h-32 flex items-center justify-center border border-gray-200"
                    whileHover={{ scale: 1.05, y: -4 }}
                  >
                    <img
                      src={airline.logo.src}
                      alt={airline.name}
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"></div>
              <span className="text-sm text-blue-700 uppercase tracking-wider">Why Us</span>
            </div>
            <h2 className="text-gray-900 text-2xl md:text-3xl">Why Choose Telus Umrah</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-3">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-1 text-sm">{feature.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Hotels */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
              <span className="text-sm text-purple-700 uppercase tracking-wider">Accommodations</span>
            </div>
            <h2 className="text-gray-900 text-2xl md:text-3xl">Popular Hotels</h2>
            <p className="text-gray-600 mt-2">Premium hotels near the Holy Mosques in Makkah and Madina</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loadingHotels ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : hotels.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No hotels available
              </div>
            ) : (
              hotels.map((hotel, index) => {
                const slug = hotel.name.toLowerCase().replace(/\s+/g, '-');
                const cityPath = hotel.type === 'Makkah' ? 'makkah' : 'madinah';
                const basePath = hotel.type === 'Makkah' ? '/makkah-hotels' : '/madina-hotels';
                const hotelImage = hotel.images && hotel.images.length > 0
                  ? hotel.images[0]
                  : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';

                return (
                  <Link key={hotel._id} href={`${basePath}/${cityPath}/${slug}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group bg-white"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <ImageWithFallback
                          src={hotelImage}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Stars Badge */}
                        {hotel.star > 0 && (
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-0.5">
                            {Array.from({ length: hotel.star }).map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        )}

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <div className="flex items-center gap-1 text-xs text-blue-300 mb-1">
                            <MapPin className="w-3 h-3" />
                            <span>{hotel.type}</span>
                          </div>
                          <h3 className="mb-1 text-sm line-clamp-1">{hotel.name}</h3>
                          {hotel.distance && (
                            <p className="text-blue-300 text-xs mb-0.5">{hotel.distance}</p>
                          )}
                          {hotel.location && (
                            <p className="text-white text-xs">{hotel.location}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link href="/makkah-hotels">
              <Button className="bg-[rgb(30,58,109)] hover:bg-[rgb(40,70,130)] mr-3">
                <Hotel className="w-4 h-4 mr-2" />
                View All Makkah Hotels
              </Button>
            </Link>
            <Link href="/madina-hotels">
              <Button className="bg-[rgb(30,58,109)] hover:bg-[rgb(40,70,130)]">
                <Hotel className="w-4 h-4 mr-2" />
                View All Madina Hotels
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-12 bg-gradient-to-r from-amber-600 to-orange-500 rounded-full"></div>
              <span className="text-sm text-amber-700 uppercase tracking-wider">Reviews</span>
            </div>
            <h2 className="text-gray-900 text-2xl md:text-3xl">Client Testimonials</h2>
          </motion.div>

          {/* Infinite Scrolling Testimonials */}
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-4"
                animate={{
                  x: [0, -2400],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  },
                }}
              >
                {/* First set of testimonials */}
                {[
                  {
                    name: 'Atif Ali',
                    role: 'Business Traveler',
                    comment: 'Exceptional service! The team handled everything from flights to hotels seamlessly. Highly recommended!',
                    rating: 5,
                  },
                  {
                    name: 'Hussnain Raza',
                    role: 'Family Vacation',
                    comment: 'Made our family vacation stress-free. Great deals and wonderful customer support throughout.',
                    rating: 5,
                  },
                  {
                    name: 'Abdullah Afaq',
                    role: 'Solo Traveler',
                    comment: 'Best travel agency! Professional, reliable, and always there when needed assistance.',
                    rating: 5,
                  },
                  {
                    name: 'Sarah Ahmed',
                    role: 'Umrah Pilgrim',
                    comment: 'The Umrah package was perfect. Hotels near Haram and excellent service made our journey memorable.',
                    rating: 5,
                  },
                  {
                    name: 'Muhammad Khan',
                    role: 'Group Travel',
                    comment: 'Organized our group tour flawlessly. Every detail was taken care of. Will definitely book again!',
                    rating: 5,
                  },
                  {
                    name: 'Fatima Noor',
                    role: 'Honeymoon Trip',
                    comment: 'They made our honeymoon special with great hotel choices and seamless travel arrangements.',
                    rating: 5,
                  },
                  {
                    name: 'Ali Hassan',
                    role: 'Corporate Travel',
                    comment: 'Professional service for our business delegations. Always on time and well organized.',
                    rating: 5,
                  },
                  {
                    name: 'Ayesha Malik',
                    role: 'Student Travel',
                    comment: 'Affordable packages for students with great support. Made my study abroad journey smooth.',
                    rating: 5,
                  },
                ].map((testimonial, index) => (
                  <div
                    key={`testimonial-${index}`}
                    className="flex-shrink-0 w-[300px] bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">"{testimonial.comment}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-gray-900 text-sm">{testimonial.name}</div>
                        <div className="text-xs text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Duplicate set for seamless loop */}
                {[
                  {
                    name: 'Atif Ali',
                    role: 'Business Traveler',
                    comment: 'Exceptional service! The team handled everything from flights to hotels seamlessly. Highly recommended!',
                    rating: 5,
                  },
                  {
                    name: 'Hussnain Raza',
                    role: 'Family Vacation',
                    comment: 'Made our family vacation stress-free. Great deals and wonderful customer support throughout.',
                    rating: 5,
                  },
                  {
                    name: 'Abdullah Afaq',
                    role: 'Solo Traveler',
                    comment: 'Best travel agency! Professional, reliable, and always there when needed assistance.',
                    rating: 5,
                  },
                  {
                    name: 'Sarah Ahmed',
                    role: 'Umrah Pilgrim',
                    comment: 'The Umrah package was perfect. Hotels near Haram and excellent service made our journey memorable.',
                    rating: 5,
                  },
                  {
                    name: 'Muhammad Khan',
                    role: 'Group Travel',
                    comment: 'Organized our group tour flawlessly. Every detail was taken care of. Will definitely book again!',
                    rating: 5,
                  },
                  {
                    name: 'Fatima Noor',
                    role: 'Honeymoon Trip',
                    comment: 'They made our honeymoon special with great hotel choices and seamless travel arrangements.',
                    rating: 5,
                  },
                  {
                    name: 'Ali Hassan',
                    role: 'Corporate Travel',
                    comment: 'Professional service for our business delegations. Always on time and well organized.',
                    rating: 5,
                  },
                  {
                    name: 'Ayesha Malik',
                    role: 'Student Travel',
                    comment: 'Affordable packages for students with great support. Made my study abroad journey smooth.',
                    rating: 5,
                  },
                ].map((testimonial, index) => (
                  <div
                    key={`testimonial-duplicate-${index}`}
                    className="flex-shrink-0 w-[300px] bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">"{testimonial.comment}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-gray-900 text-sm">{testimonial.name}</div>
                        <div className="text-xs text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white mb-3 text-2xl md:text-3xl">Ready to Start Your Journey?</h2>
            <p className="text-white/80 text-sm md:text-base mb-6 max-w-xl mx-auto">
              Join thousands of satisfied travelers with Telus Umrah
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/umrah-packages">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-5 rounded-lg shadow-lg text-sm h-auto">
                    <span>Book Your Trip</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/contact">
                  <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-5 rounded-lg text-sm h-auto">
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </div>


            <div className="flex flex-wrap gap-4 justify-center items-center text-white/70 text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-300" />
                <span>Best Price</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-300" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-300" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
