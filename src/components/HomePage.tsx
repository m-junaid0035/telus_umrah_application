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


// Import airline logos
import sereneAirLogo from '@/assets/serene-air-logo.png';
import gulfAirLogo from '@/assets/gulf-air-logo.png';
import turkishAirlinesLogo from '@/assets/turkish-airline-logo.png';
import qatarAirwaysLogo from '@/assets/qatar-air-logo.png';
import thaiAirwaysLogo from '@/assets/thai-air.png';
import saudiaLogo from '@/assets/saudi-air-logo.png';
import piaLogo from '@/assets/pia-logo.png';
import etihadLogo from '@/assets/etihad-logo.png';
import shaheenAirLogo from '@/assets/shaheen-logo.png';
import emiratesLogo from '@/assets/emirates-logo.png';
import airblueLogo from '@/assets/airblue-logo.png';

// Import hero carousel images
import heroImage1 from '@/assets/hero-bg-1.png';
import heroImage2 from '@/assets/hero-bg-2.png';
import heroImage3 from '@/assets/hero-bg-3.png';

// Import Makkah and Madina icons
import makkahIcon from '@/assets/makkah-icon.png';
import madinaIcon from '@/assets/madina-icon.png';

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
  {
    name: 'Zaiarat Tours',
    description: 'Visit holy places with our guided tours',
    image: 'https://pearlsofinspirationblog.wordpress.com/wp-content/uploads/2016/09/63838420.jpg?w=1024&h=768'
  },
  {
    name: 'Meal',
    description: 'Delicious and hygienic meal plans',
    image: 'https://www.islamiclandmarks.com/wp-content/uploads/2024/02/pakistani_restaurants_in_makkah_saudi_arabia.jpg'
  },
  {
    name: 'E-Sim',
    description: 'Stay connected with our E-Sim services',
    image: 'https://cdn.digitalindiacorporation.in/wp-content/uploads/2024/07/mobile.png'
  },
  {
    name: 'Transport',
    description: 'Comfortable and reliable transportation',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
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

import { useCurrency } from '@/contexts/CurrencyContext';

export function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [packages, setPackages] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [hotels, setHotels] = useState<BackendHotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const { convertPrice } = useCurrency();

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
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base shadow-2xl group min-w-[240px]">
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
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-base shadow-2xl min-w-[240px] group">
                    <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Explore Packages
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust indicators removed as requested */}
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
      <section id="premade-umrah-packages" className="py-8 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/30">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
              packages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`package-card ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="package-card-header">
                    <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-3">
                      <div className="flex-1 w-full sm:w-auto">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {pkg.badge && (
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs">
                              {pkg.badge}
                            </Badge>
                          )}
                          {pkg.popular && (
                            <Badge className="bg-yellow-400 text-blue-900 flex items-center gap-1 text-xs font-semibold">
                              <Sparkles className="w-3 h-3" />
                              <span>POPULAR CHOICE</span>
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-xl sm:text-2xl mb-2">{pkg.name}</h3>
                        <div className="flex items-center gap-3 text-white/90 text-sm flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{pkg.duration} Days</span>
                          </div>
                          {pkg.flights?.departure?.sector && (
                            <>
                              <span className="text-white/50">•</span>
                              <div className="flex items-center gap-1.5">
                                <Plane className="w-4 h-4" />
                                <span className="font-medium">{pkg.flights.departure.sector}</span>
                              </div>
                            </>
                          )}
                          {pkg.flights?.departure?.departureTime && (
                            <>
                              <span className="text-white/50">•</span>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>{pkg.flights.departure.departureTime}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                        <p className="text-white/80 text-sm mb-0.5">Starts from</p>
                        <p className="text-2xl sm:text-3xl font-extrabold">
                          {convertPrice(pkg.price)}
                        </p>
                        <p className="text-white/80 text-xs">per person</p>
                      </div>
                    </div>
                  </div>

                  <div className="package-card-content">
                    <div className="space-y-4">
                      {/* Hotels */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {pkg.hotels?.makkah && (
                          <Link href={`/hotels/${pkg.hotels.makkah._id}`} className="block hotel-card">
                              <div className="flex items-center gap-3 mb-2">
                                <img src={makkahIcon.src} alt="Makkah" className="w-8 h-8" />
                                <div>
                                  <span className="font-semibold text-gray-900">Makkah Hotel</span>
                                  <div className="flex">
                                    {[...Array(pkg.hotels.makkah.star || 0)].map((_, i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 line-clamp-1">{pkg.hotels.makkah.name}</p>
                          </Link>
                        )}
                        {pkg.hotels?.madinah && (
                           <Link href={`/hotels/${pkg.hotels.madinah._id}`} className="block hotel-card">
                              <div className="flex items-center gap-3 mb-2">
                                <img src={madinaIcon.src} alt="Madinah" className="w-8 h-8" />
                                <div>
                                  <span className="font-semibold text-gray-900">Madinah Hotel</span>
                                  <div className="flex">
                                    {[...Array(pkg.hotels.madinah.star || 0)].map((_, i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 line-clamp-1">{pkg.hotels.madinah.name}</p>
                          </Link>
                        )}
                      </div>

                      {/* Features */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Package Highlights</h4>
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            {pkg.features.slice(0, 6).map((feature: any, idx: number) => (
                              <div key={idx} className="feature-item">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="truncate">{feature.feature_text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="package-card-footer mt-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Airline</p>
                          <p className="font-semibold text-sm text-gray-800">{pkg.airline}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Link href={`/umrah-packages/${pkg._id}`} className="w-full sm:w-auto">
                          <Button variant="outline" className="h-9 w-full sm:w-auto">
                            View Details
                          </Button>
                        </Link>
                        <Link href="/umrah-packages" className="w-full sm:w-auto">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white h-9 w-full sm:w-auto">
                            Book Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
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
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-5 rounded-lg text-sm gap-2 shadow-md"
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
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-5 rounded-lg text-sm gap-2"
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


      {/* Services Section - Improved Design */}
      <section className="py-12 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
              <span className="text-sm text-blue-700 uppercase tracking-wider font-semibold">What We Offer</span>
              <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
            </div>
            <h2 className="text-gray-900 text-3xl md:text-4xl font-bold mb-2">Our Premium Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Everything you need for a seamless and spiritual journey</p>
          </motion.div>

          {/* Services Grid - 4 columns on desktop, 2 on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.map((service, index) => {
              const serviceLinks: { [key: string]: string } = {
                'Flight Booking': '/flight-booking',
                'Hotel Reservation': '/hotel-reservation',
                'Visa Services': '/visa-services',
                'Umrah Service': '/umrah-service',
                'Zaiarat Tours': '/zaiarat-tours',
                'Meal': '/meal-service',
                'E-Sim': '/e-sim-service',
                'Transport': '/transport-service'
              };
              const link = serviceLinks[service.name] || '/';

              return (
                <Link href={link} key={service.name} className="group h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -6 }}
                  >
                    <div className="relative h-[200px] md:h-[240px] rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white">
                      {/* Background Image with Zoom Effect */}
                      <ImageWithFallback
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                      />

                      {/* Enhanced Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300" />

                      {/* Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Content Container */}
                      <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
                        <motion.div
                          initial={{ y: 10, opacity: 0.8 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-1"
                        >
                          {/* Service Icon/Badge */}
                          <div className="inline-block">
                            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                          </div>

                          {/* Service Name */}
                          <h3 className="text-white text-base md:text-lg font-bold leading-tight">
                            {service.name}
                          </h3>

                          {/* Description - Show on hover/focus */}
                          <p className="text-white/70 text-xs md:text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                            {service.description}
                          </p>
                        </motion.div>
                      </div>

                      {/* Animated Border on Hover */}
                      <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-blue-400/0 group-hover:border-blue-400/60 transition-all duration-300 pointer-events-none" />
                    </div>
                  </motion.div>
                </Link>
            )})}
          </div>


        </div>
      </section>

      {/* Airlines Carousel Section */}
      <section className="py-8 bg-white border-y border-gray-100 overflow-hidden">
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
      <section className="py-8 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30">
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
      <section className="py-8 bg-gradient-to-br from-gray-50 to-slate-100/50">
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
                const basePath = '/hotels';
                const hotelImage = hotel.images && hotel.images.length > 0
                  ? hotel.images[0]
                  : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';

                return (
                  <Link key={hotel._id} href={`${basePath}/${hotel._id}`}>
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
                          <h3 className="mb-1 text-sm font-semibold line-clamp-1">{hotel.name}</h3>
                          {hotel.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-200">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{hotel.location}</span>
                            </div>
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
            <Link href="/hotels">
              <Button className="bg-[rgb(30,58,109)] hover:bg-[rgb(40,70,130)] mr-3">
                <Hotel className="w-4 h-4 mr-2" />
                View All Makkah Hotels
              </Button>
            </Link>
            <Link href="/hotels">
              <Button className="bg-[rgb(30,58,109)] hover:bg-[rgb(40,70,130)]">
                <Hotel className="w-4 h-4 mr-2" />
                View All Madina Hotels
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 bg-white overflow-hidden">
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
                        {testimonial.name?.split(' ').map(n => n[0]).join('')}
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
                        {testimonial.name?.split(' ').map(n => n[0]).join('')}
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

      {/* CTA Section - Redesigned */}
      <section className="relative py-12 bg-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2620&q=80"
            alt="Abstract background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Ready to Start Your Sacred Journey?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                Let us handle the details while you focus on your spiritual experience. Get a personalized Umrah package tailored just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/customize-umrah">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-7 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                    Create My Package
                  </Button>
                </Link>
                <Link href="/umrah-packages">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-black hover:bg-white hover:text-black font-semibold text-lg py-7 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                    View Packages
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20"
            >
              <h3 className="text-2xl font-semibold mb-6 text-white">Why Book With Us?</h3>
              <ul className="space-y-5">
                <li className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Trusted & Secure</h4>
                    <p className="text-gray-300 text-sm">IATA-certified with secure online payments.</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Personalized Experience</h4>
                    <p className="text-gray-300 text-sm">Packages tailored to your needs and budget.</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <HeadphonesIcon className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">24/7 Expert Support</h4>
                    <p className="text-gray-300 text-sm">Our team is always here to assist you.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

