import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Star
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

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

const destinations = [
  {
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2MjAyOTU4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    deals: 'From $599',
    description: 'City of Lights',
  },
  {
    name: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1657106251952-2d584ebdf886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmUlMjBuaWdodHxlbnwxfHx8fDE3NjE5ODkxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    deals: 'From $799',
    description: 'Luxury & Adventure',
  },
  {
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1729606559610-c0c6aeea85c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwYmVhY2glMjByZXNvcnR8ZW58MXx8fHwxNzYyMDQxNTU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    deals: 'From $499',
    description: 'Tropical Paradise',
  },
  {
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1623566713971-1f7ad1dc7bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHklMjB0cmF2ZWx8ZW58MXx8fHwxNzYyMDQxNTU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    deals: 'From $899',
    description: 'Modern Tradition',
  },
  {
    name: 'Maldives',
    image: 'https://images.unsplash.com/photo-1614505241347-7f4765c1035e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJlc29ydCUyMGx1eHVyeXxlbnwxfHx8fDE3NjIwNDE1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    deals: 'From $1,299',
    description: 'Island Escape',
  },
  {
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1759614581731-4c7090648de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhaXJwbGFuZSUyMHRyYXZlbCUyMGJ1c2luZXNzfGVufDF8fHx8MTc2MjA0MTU1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    deals: 'From $399',
    description: 'The Big Apple',
  },
];

const services = [
  {
    name: 'Flight Booking',
    icon: Plane,
    description: 'Book flights to worldwide destinations',
    image: 'https://images.unsplash.com/photo-1719058292683-a358b17bc282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbGlnaHQlMjBhaXJwbGFuZSUyMGJvb2tpbmd8ZW58MXx8fHwxNzYyMTA5NTkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    name: 'Hotel Reservation',
    icon: Hotel,
    description: 'Luxury hotels at best prices',
    image: 'https://images.unsplash.com/photo-1614506660579-c6c478e2f349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3NjIwNjgxNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    name: 'Travel Packages',
    icon: Palmtree,
    description: 'Complete vacation packages',
    image: 'https://images.unsplash.com/photo-1761069449669-1b17dc39831b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjB2YWNhdGlvbiUyMHBhY2thZ2VzfGVufDF8fHx8MTc2MjMzNTk0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    name: 'Visa Services',
    icon: FileText,
    description: 'Hassle-free visa processing',
    image: 'https://images.unsplash.com/photo-1655722725332-9925c96dd627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXNzcG9ydCUyMHZpc2ElMjB0cmF2ZWx8ZW58MXx8fHwxNzYyMDgwMDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    name: 'Umrah Service',
    icon: Building,
    description: 'Complete Umrah pilgrimage services',
    image: 'https://images.unsplash.com/photo-1571909552531-1601eaec8f79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYWFiYSUyMG1lY2NhJTIwdW1yYWglMjBwaWxncmltYWdlfGVufDF8fHx8MTc2MjMzNTc0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
];

export function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1652964287112-438ece0a6acc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNjYSUyMHBpbGdyaW1hZ2UlMjBzcGlyaXR1YWx8ZW58MXx8fHwxNzYyNTQwMTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Spiritual Umrah Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/80 to-purple-900/85" />

          {/* Subtle Animated Pattern */}
          <motion.div
            animate={{
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-[calc(100vh-116px)]">
          <div className="w-full text-center py-20">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8"
            >
              <Building className="w-5 h-5 text-white/90" />
              <span className="text-sm text-white/90">Begin Your Sacred Journey with Telus Umrah</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white mb-6 max-w-5xl mx-auto leading-tight"
            >
              Embark on a{' '}
              <motion.span
                className="inline-block bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Blessed Umrah Journey
              </motion.span>
              <br />
              Tailored Just for You
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Experience a spiritually enriching pilgrimage with our comprehensive Umrah packages.
              From premium flights and hotels near Haram to guided tours and complete visa services,
              we handle every detail so you can focus on your worship.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link href="/customize-umrah">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 hover:from-blue-950 hover:via-blue-900 hover:to-blue-950 text-white px-8 py-7 text-lg shadow-2xl group min-w-[280px]">
                    <Settings className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Customize Your Umrah Trip
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
                    className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 px-8 py-7 text-lg shadow-xl min-w-[280px] group"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Explore Umrah Packages
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center items-center gap-8 text-white/80"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white flex items-center justify-center text-gray-900 text-xs shadow-lg"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-white">2M+</div>
                  <div className="text-xs text-white/70">Happy Pilgrims</div>
                </div>
              </div>

              <div className="h-12 w-px bg-white/20" />

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-white">4.9/5</div>
                  <div className="text-xs text-white/70">Customer Rating</div>
                </div>
              </div>

              <div className="h-12 w-px bg-white/20" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white">Secure</div>
                  <div className="text-xs text-white/70">Best Price Guarantee</div>
                </div>
              </div>

              <div className="h-12 w-px bg-white/20" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white">24/7</div>
                  <div className="text-xs text-white/70">Customer Support</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </motion.div>
      </section>

      {/* Latest Umrah Packages Section */}
      <section id="premade-umrah-packages" className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Building className="w-6 h-6 text-green-800" />
              <span className="text-sm text-green-800">Special Umrah Packages</span>
            </div>
            <h2 className="text-gray-900 mb-4 text-3xl md:text-4xl">Latest Umrah Packages</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the spiritual journey with our carefully curated Umrah packages
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Economy Umrah Package',
                duration: '7 Days / 6 Nights',
                price: '$1,299',
                image: 'https://images.unsplash.com/photo-1710695198971-3abdf7fcc82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYWFiYSUyMG1lY2NhJTIwdW1yYWh8ZW58MXx8fHwxNzYyNDQyMDIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                hotel: '3 Star',
                features: ['Round-trip Flights', 'Hotel Stay', 'Breakfast Included', 'Airport Transfer'],
                popular: false,
              },
              {
                name: 'Premium Umrah Package',
                duration: '14 Days / 13 Nights',
                price: '$2,499',
                image: 'https://images.unsplash.com/photo-1676200928665-8b97df7ab979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNjYSUyMG1vc3F1ZSUyMHBpbGdyaW1hZ2V8ZW58MXx8fHwxNzYyNTIyMTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                hotel: '4 Star Near Haram',
                features: ['Round-trip Flights', '4 Star Hotel', 'All Meals', 'Transport', 'Ziarat Tour', 'Visa Processing'],
                popular: true,
              },
              {
                name: 'Luxury Umrah Package',
                duration: '21 Days / 20 Nights',
                price: '$4,999',
                image: 'https://images.unsplash.com/photo-1689333532270-7849d33de8aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRpbmFoJTIwbW9zcXVlJTIwc2F1ZGl8ZW58MXx8fHwxNzYyNDM5OTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                hotel: '5 Star Premium',
                features: ['Business Class Flights', '5 Star Hotel', 'All Meals', 'Private Transport', 'VIP Ziarat', 'Visa Processing', 'Personal Guide'],
                popular: false,
              },
            ].map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden ${pkg.popular ? 'ring-2 ring-green-500' : ''
                  }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <ImageWithFallback
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Price Tag on Image */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                    <div className="text-xs text-gray-600">Starting from</div>
                    <div className="text-2xl text-green-600">{pkg.price}</div>
                    <div className="text-xs text-gray-500">per person</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl text-gray-900 mb-2">{pkg.name}</h3>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span>{pkg.hotel}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Book Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className={`w-full py-6 rounded-xl text-base shadow-md ${pkg.popular
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        }`}
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-4">Need a customized package?</p>
            <Link href="/customize-umrah">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 rounded-xl text-base"
                >
                  Customize Your Umrah Package
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}


      {/* Services Section */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-gray-900 mb-4 text-3xl md:text-4xl">Our Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive travel solutions tailored to your needs
            </p>
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
                    className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px]"
                  >
                    <div className="relative h-[320px] md:h-[380px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
                      {/* Background Image */}
                      <ImageWithFallback
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-8">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {/* Icon */}
                          <div className="mb-4">
                            <service.icon className="w-16 h-16 md:w-20 md:h-20 text-white" />
                          </div>

                          {/* Service Name */}
                          <h3 className="text-white text-2xl md:text-3xl mb-3">
                            {service.name}
                          </h3>

                          {/* Description */}
                          <p className="text-white/90 text-sm md:text-base mb-4">
                            {service.description}
                          </p>

                          {/* Learn More Button */}
                          <motion.button
                            whileHover={{ x: 5 }}
                            className="text-blue-400 text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span>Learn More</span>
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      </div>

                      {/* Hover Border Effect */}
                      <div className="absolute inset-0 border-4 border-blue-500/0 group-hover:border-blue-500/50 transition-colors rounded-3xl pointer-events-none" />
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
      (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-gray-900 mb-3 text-3xl md:text-4xl">
              Book with Leading Airlines
            </h2>
            <p className="text-gray-600 text-lg">
              Travel with the Best Flights Across the World!
            </p>
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
                    className="flex-shrink-0 bg-transparent rounded-2xl p-6 w-40 h-40 flex items-center justify-center"
                    whileHover={{ scale: 1.1, y: -8 }}
                  >
                    <Image
                      src={airline.logo}
                      alt={airline.name}
                      width={500}
                      height={500}
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                    />
                  </motion.div>
                ))}

                {/* Duplicate set for seamless loop */}
                {airlines.map((airline, index) => (
                  <motion.div
                    key={`airline-duplicate-${index}`}
                    className="flex-shrink-0 bg-transparent rounded-2xl p-6 w-40 h-40 flex items-center justify-center"
                    whileHover={{ scale: 1.1, y: -8 }}
                  >
                    <Image
                      src={airline.logo}
                      alt={airline.name}
                      width={500}
                      height={500}
                      className="object-contain transition-all duration-300"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-gray-900 mb-4 text-3xl md:text-4xl">Why Choose Us?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the difference with Telus Umrah
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-blue-100"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-gray-900 mb-4 text-3xl md:text-4xl">Popular Destinations</h2>
            <p className="text-gray-600 text-lg">
              Discover breathtaking destinations around the world
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group bg-white"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <ImageWithFallback
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="text-xs text-blue-300 mb-2">{destination.description}</div>
                    <h3 className="mb-2 text-xl">{destination.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-blue-300 text-lg">{destination.deals}</p>
                      <motion.div
                        className="flex items-center gap-1 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ x: 5 }}
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-gray-900 mb-4 text-3xl md:text-4xl">What Our Clients Say</h2>
            <p className="text-gray-600 text-lg">
              Hear from travelers who trusted us with their journeys
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Atif Ali',
                role: 'Business Traveler',
                comment: 'Exceptional service! The team handled everything from flights to hotels seamlessly. Highly recommended for business trips.',
                rating: 5,
              },
              {
                name: 'Hussnain Raza',
                role: 'Family Vacation',
                comment: 'Made our family vacation stress-free. Great deals and wonderful customer support throughout our journey.',
                rating: 5,
              },
              {
                name: 'Abdullah Afaq',
                role: 'Solo Traveler',
                comment: 'Best travel agency I\'ve used! Professional, reliable, and always there when I needed assistance.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
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
            <h2 className="text-white mb-4 text-3xl md:text-4xl">Ready to Start Your Journey?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who trust Telus Umrah for unforgettable experiences
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-xl shadow-lg text-lg h-auto">
                  <span>Book Your Trip Now</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 rounded-xl text-lg h-auto">
                  Contact Our Agents
                </Button>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-6 justify-center items-center text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
