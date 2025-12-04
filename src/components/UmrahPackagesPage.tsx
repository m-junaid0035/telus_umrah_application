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
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { LoginDialog } from './LoginDialog';
import { fetchAllUmrahPackagesAction } from '@/actions/packageActions';
import { PackageBookingDialog } from './PackageBookingDialog';
import { toast } from '@/hooks/use-toast';


// Import Makkah and Madina icons
import makkahIcon from '@/assets/makkah-icon.png';
import madinaIcon from '@/assets/madina-icon.png';

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

interface Package {
  _id: string;
  name: string;
  price: number;
  duration: number;
  badge?: string;
  airline: string;
  departureCity: string;
  image?: string;
  popular?: boolean;
  hotels: {
    makkah?: { _id: string; name: string; star: number; distance?: string } | null;
    madinah?: { _id: string; name: string; star: number; distance?: string } | null;
  };
  features: Array<{ _id: string; feature_text: string }>;
  travelers?: string;
  rating?: number;
  reviews?: number;
}

export function UmrahPackagesPage() {
  const { user } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 700000]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const loadPackages = async () => {
      setLoading(true);
      try {
        const result = await fetchAllUmrahPackagesAction();
        if (result?.data && Array.isArray(result.data)) {
          setPackages(result.data as Package[]);
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
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  // Filter packages
  let filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pkg.hotels.makkah?.name && pkg.hotels.makkah.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (pkg.hotels.madinah?.name && pkg.hotels.madinah.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
    filteredPackages = [...filteredPackages].sort((a, b) => (b.rating || 0) - (a.rating || 0));
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
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
                <h3 className="text-gray-900 mb-2">Loading packages...</h3>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {filteredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                        <div className="flex items-center gap-4 text-white/90 flex-wrap text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{pkg.duration} Days</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>From {pkg.departureCity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                        <p className="text-white/80 text-sm mb-0.5">Starts from</p>
                        <p className="text-2xl sm:text-3xl font-extrabold">
                          PKR {pkg.price.toLocaleString()}
                        </p>
                        <p className="text-white/80 text-xs">per person</p>
                      </div>
                    </div>
                  </div>

                  <div className="package-card-content">
                    <div className="space-y-4">
                      {/* Hotels */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {pkg.hotels.makkah && (
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
                        {pkg.hotels.madinah && (
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
                            {pkg.features.slice(0, 6).map((feature, idx) => (
                              <div key={feature._id || idx} className="feature-item">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="truncate">{feature.feature_text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="package-card-footer">
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
                        {user ? (
                          <PackageBookingDialog
                            packageId={pkg._id}
                            packageName={pkg.name}
                            user={user}
                            trigger={
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white h-9 w-full sm:w-auto">
                                Book Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            }
                          />
                        ) : (
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white h-9 w-full sm:w-auto"
                            onClick={() => setShowLoginDialog(true)}
                          >
                            Book Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredPackages.length === 0 && !loading && (
                <div className="text-center py-12 lg:col-span-2">
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
            )}
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}

