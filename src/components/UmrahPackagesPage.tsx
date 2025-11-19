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
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
                <h3 className="text-gray-900 mb-2">Loading packages...</h3>
              </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`overflow-hidden hover:shadow-xl transition-shadow ${
                    pkg.popular ? 'ring-2 ring-blue-500' : ''
                  }`}>
                    <CardContent className="p-0">
                      {/* Header Section */}
                      <div className={`${pkg.badge ? 'bg-blue-500' : 'bg-blue-600'} p-4 text-white`}>
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
                        {(pkg.rating || pkg.reviews) && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(pkg.rating || 0)
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
                        {(pkg.hotels.makkah || pkg.hotels.madinah) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {pkg.hotels.makkah && (
                              <div className="bg-gray-50 rounded-lg p-2">
                                <div className="flex items-center justify-between gap-1.5 mb-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <img src={makkahIcon.src} alt="Makkah" className="w-4 h-4" />
                                    <span className="text-xs font-semibold text-gray-900">Makkah Hotel</span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-1 mb-0.5">{pkg.hotels.makkah.name}</p>
                                {pkg.hotels.makkah.distance && (
                                  <p className="text-xs text-gray-500 mb-0.5">{pkg.hotels.makkah.distance}</p>
                                )}
                                <div className="flex">
                                  {[...Array(pkg.hotels.makkah.star || 0)].map((_, i) => (
                                    <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                            )}
                            {pkg.hotels.madinah && (
                              <div className="bg-gray-50 rounded-lg p-2">
                                <div className="flex items-center justify-between gap-1.5 mb-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <img src={madinaIcon.src} alt="Madina" className="w-4 h-4" />
                                    <span className="text-xs font-semibold text-gray-900">Madinah Hotel</span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-1 mb-0.5">{pkg.hotels.madinah.name}</p>
                                {pkg.hotels.madinah.distance && (
                                  <p className="text-xs text-gray-500 mb-0.5">{pkg.hotels.madinah.distance}</p>
                                )}
                                <div className="flex">
                                  {[...Array(pkg.hotels.madinah.star || 0)].map((_, i) => (
                                    <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Features */}
                        {pkg.features && pkg.features.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                            {pkg.features.slice(0, 8).map((feature, idx) => (
                              <div key={feature._id || idx} className="flex items-center gap-1 text-xs text-gray-600">
                                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                <span className="truncate text-xs">{feature.feature_text}</span>
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
                            {user ? (
                              <PackageBookingDialog
                                packageId={pkg._id}
                                packageName={pkg.name}
                                user={user}
                                trigger={
                                  <Button 
                                    size="sm"
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-xs h-8"
                                  >
                                    Book Now
                                    <Plane className="w-3.5 h-3.5 ml-1.5" />
                                  </Button>
                                }
                              />
                            ) : (
                              <Button 
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-xs h-8"
                                onClick={() => setShowLoginDialog(true)}
                              >
                                Book Now
                                <Plane className="w-3.5 h-3.5 ml-1.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredPackages.length === 0 && !loading && (
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
            )}
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}
