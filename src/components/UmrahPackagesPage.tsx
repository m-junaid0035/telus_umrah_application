import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import { 
  CheckCircle, 
  Star, 
  Calendar, 
  Hotel, 
  Plane, 
  Users, 
  MapPin,
  Clock,
  Filter,
  Search,
  X,
  ArrowUpDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { LoginDialog } from './LoginDialog';

// Import Makkah and Madina icons
import makkahIcon from '@/assets/ba6627702a0a2db3ec399c151ab739781dad0897.png';
import madinaIcon from '@/assets/4c0ebc2b4c4fd59170b1c28e046aa03ac40a6f01.png';

// Import airline logos
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
    reviews: 245
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
    reviews: 412
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
    reviews: 328
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
    reviews: 156
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
    reviews: 289
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
    reviews: 198
  }
];

export function UmrahPackagesPage() {
  const { user } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 700000]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(true);

  const handleBookNow = (pkg: any) => {
    if (!user) {
      setShowLoginDialog(true);
    } else {
      // Handle booking logic here
      alert(`Booking ${pkg.name}. This will redirect to booking form.`);
    }
  };

  // Filter packages
  let filteredPackages = allPackages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.hotels.makkah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.hotels.madinah.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || pkg.departureCity === selectedCity;
    const matchesDuration = selectedDuration === 'all' || 
                           (selectedDuration === '14' && pkg.duration <= 14) ||
                           (selectedDuration === '15-20' && pkg.duration >= 15 && pkg.duration <= 20) ||
                           (selectedDuration === '20+' && pkg.duration > 20);
    const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1];

    return matchesSearch && matchesCity && matchesDuration && matchesPrice;
  });

  // Sort packages
  if (sortBy === 'price-low') {
    filteredPackages = [...filteredPackages].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredPackages = [...filteredPackages].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredPackages = [...filteredPackages].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'duration') {
    filteredPackages = [...filteredPackages].sort((a, b) => a.duration - b.duration);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-white mb-4 text-5xl md:text-6xl">Umrah Packages 2025</h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Find the perfect Umrah package that suits your needs and budget
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCity('all');
                      setSelectedDuration('all');
                      setPriceRange([0, 700000]);
                    }}
                    className="text-sm text-blue-600"
                  >
                    Reset
                  </Button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <Label className="mb-2">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search packages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Departure City */}
                <div className="mb-6">
                  <Label className="mb-2">Departure City</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="Karachi">Karachi</SelectItem>
                      <SelectItem value="Lahore">Lahore</SelectItem>
                      <SelectItem value="Islamabad">Islamabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="mb-6">
                  <Label className="mb-2">Duration</Label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Durations</SelectItem>
                      <SelectItem value="14">Up to 14 Days</SelectItem>
                      <SelectItem value="15-20">15-20 Days</SelectItem>
                      <SelectItem value="20+">20+ Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <Label className="mb-2">
                    Price Range: PKR {priceRange[0].toLocaleString()} - PKR {priceRange[1].toLocaleString()}
                  </Label>
                  <Slider
                    min={0}
                    max={700000}
                    step={10000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-4"
                  />
                </div>

                {/* Quick Filters */}
                <div>
                  <Label className="mb-3">Quick Filters</Label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setPriceRange([0, 200000])}
                    >
                      Budget Packages
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setPriceRange([400000, 700000])}
                    >
                      Premium Packages
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedDuration('15-20')}
                    >
                      2-3 Weeks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-900">
                    {filteredPackages.length} packages found
                  </p>
                  <p className="text-sm text-gray-600">
                    Best Umrah deals for your spiritual journey
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Packages List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`overflow-hidden hover:shadow-xl transition-shadow ${
                    pkg.popular ? 'ring-2 ring-blue-500' : ''
                  }`}>
                    <CardContent className="p-0">
                      {/* Header Section */}
                      <div className={`${pkg.badgeColor} p-4 text-white`}>
                        <div className="flex items-start justify-between flex-wrap gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs">
                                {pkg.badge}
                              </Badge>
                              {pkg.popular && (
                                <Badge className="bg-yellow-500 text-white flex items-center gap-1 text-xs">
                                  <Star className="w-3 h-3 fill-white" />
                                  <span>Popular</span>
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-bold text-xl mb-2">{pkg.name}</h3>
                            <div className="flex items-center gap-3 text-white/90 flex-wrap text-xs">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{pkg.duration} Days</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{pkg.departureCity}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <img 
                                  src={getAirlineLogo(pkg.airline).toString()} 
                                  alt={pkg.airline}
                                  className="w-4 h-4 object-contain bg-white rounded p-0.5"
                                />
                                <span className="truncate max-w-[120px]">{pkg.airline}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white/80 text-xs mb-0.5">Starting from</p>
                            <p className="text-2xl font-bold">
                              PKR {pkg.price.toLocaleString()}
                            </p>
                            <p className="text-white/80 text-xs">per person</p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(pkg.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">
                            {pkg.rating} ({pkg.reviews} reviews)
                          </span>
                        </div>

                        {/* Hotels */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                          <Link 
                            href={`/hotels/makkah/${pkg.hotels.makkah.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                              <p className="text-xs text-gray-600 line-clamp-1 mb-0.5">{pkg.hotels.makkah.name}</p>
                              <p className="text-xs text-gray-500 mb-0.5">{pkg.hotels.makkah.distance}</p>
                              <div className="flex">
                                {[...Array(pkg.hotels.makkah.stars)].map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </Link>
                          <Link 
                           href={`/hotels/madinah/${pkg.hotels.madinah.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                              <p className="text-xs text-gray-600 line-clamp-1 mb-0.5">{pkg.hotels.madinah.name}</p>
                              <p className="text-xs text-gray-500 mb-0.5">{pkg.hotels.madinah.distance}</p>
                              <div className="flex">
                                {[...Array(pkg.hotels.madinah.stars)].map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                          {pkg.features.slice(0, 8).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                              <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                              <span className="truncate text-xs">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Users className="w-3.5 h-3.5" />
                            <span>{pkg.travelers}</span>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/umrah-packages/${pkg.id}`}>
                              <Button variant="outline" size="sm" className="text-xs h-8">
                                View Details
                              </Button>
                            </Link>
                            <Button 
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-xs h-8"
                              onClick={() => handleBookNow(pkg)}
                            >
                              Book Now
                              <Plane className="w-3.5 h-3.5 ml-1.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredPackages.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 mb-2">No packages found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCity('all');
                      setSelectedDuration('all');
                      setPriceRange([0, 700000]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}
