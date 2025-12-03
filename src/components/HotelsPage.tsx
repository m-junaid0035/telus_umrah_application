"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import {
  Star,
  MapPin,
  Filter,
  Search,
  X,
  ArrowUpDown,
  Sparkles,
  ArrowRight,
  Home,
  Wifi,
  UtensilsCrossed,
  Tv,
  Wind,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchAllHotelsAction } from '@/actions/hotelActions';
import { toast } from '@/hooks/use-toast';
import { ImageWithFallback } from './figma/ImageWithFallback';
import makkahIcon from '@/assets/makkah-icon.png';
import madinaIcon from '@/assets/madina-icon.png';

interface Hotel {
  _id: string;
  name: string;
  type: 'Makkah' | 'Madina';
  location: string;
  star: number;
  distance?: string;
  description?: string;
  images?: string[];
  amenities?: string[];
  availableBedTypes?: string[];
  standardRoomPrice?: number;
  deluxeRoomPrice?: number;
  familySuitPrice?: number;
}


export function HotelsPage() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city');

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(cityParam === 'Makkah' || cityParam === 'Madina' ? cityParam : 'all');
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [usePriceFilter, setUsePriceFilter] = useState(false);
  const [customMinPrice, setCustomMinPrice] = useState('');
  const [customMaxPrice, setCustomMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load hotels
  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);
      try {
        const result = await fetchAllHotelsAction();
        console.log('Hotels API Result:', result);
        if (result?.data && Array.isArray(result.data)) {
          console.log('Hotels loaded:', result.data.length);
          setHotels(result.data as Hotel[]);
        } else {
          console.log('No data or not an array:', result);
          toast({
            title: "Error",
            description: result?.error?.message?.[0] || "Failed to load hotels",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading hotels:', error);
        toast({
          title: "Error",
          description: "Failed to load hotels",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  // Filter and sort hotels
  useEffect(() => {
    let filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'all' || hotel.type === selectedCity;
      const matchesStars = selectedStars.length === 0 || selectedStars.includes(hotel.star);
      
      // Price filter only applied if enabled
      let matchesPrice = true;
      if (usePriceFilter) {
        const minPrice = hotel.standardRoomPrice || hotel.deluxeRoomPrice || hotel.familySuitPrice;
        const filterMin = customMinPrice ? parseInt(customMinPrice) : 0;
        const filterMax = customMaxPrice ? parseInt(customMaxPrice) : Infinity;
        matchesPrice = !minPrice || (minPrice >= filterMin && minPrice <= filterMax);
      }

      return matchesSearch && matchesCity && matchesStars && matchesPrice;
    });

    console.log('Filtered hotels:', filtered.length, 'from total:', hotels.length);
    console.log('Filter details - Search:', searchTerm, 'City:', selectedCity, 'Stars:', selectedStars, 'Price Filter Enabled:', usePriceFilter);

    // Sort
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => {
        const priceA = a.standardRoomPrice || a.deluxeRoomPrice || a.familySuitPrice || 0;
        const priceB = b.standardRoomPrice || b.deluxeRoomPrice || b.familySuitPrice || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => {
        const priceA = a.standardRoomPrice || a.deluxeRoomPrice || a.familySuitPrice || 0;
        const priceB = b.standardRoomPrice || b.deluxeRoomPrice || b.familySuitPrice || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.star - a.star);
    }

    console.log('After sorting:', filtered.length);
    setFilteredHotels(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [hotels, searchTerm, selectedCity, selectedStars, usePriceFilter, customMinPrice, customMaxPrice, sortBy]);

  // Scroll to top when the page changes (pagination)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  }, [currentPage]);
  const toggleStarFilter = (star: number) => {
    setSelectedStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setSelectedStars([]);
    setUsePriceFilter(false);
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setSortBy('popular');
  };

  const makkahCount = hotels.filter(h => h.type === 'Makkah').length;
  const madinaCount = hotels.filter(h => h.type === 'Madina').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-1 w-12 bg-white/30 rounded-full"></div>
              <span className="text-sm uppercase tracking-wider font-semibold">Accommodations</span>
              <div className="h-1 w-12 bg-white/30 rounded-full"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Holy Hotels</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Browse and compare premium hotels in Makkah and Madinah, perfectly positioned near the Holy Mosques
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1">{hotels.length}</div>
              <p className="text-white/80 text-sm">Total Hotels</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1">{makkahCount}</div>
              <p className="text-white/80 text-sm">Makkah Hotels</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1">{madinaCount}</div>
              <p className="text-white/80 text-sm">Madinah Hotels</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-72 flex-shrink-0 ${!showFilters && 'hidden lg:block'}`}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  Filters
                </h3>
                {(searchTerm || selectedCity !== 'all' || selectedStars.length > 0 || usePriceFilter || sortBy !== 'popular') && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Search Hotels</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Hotel name, location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 border-gray-200"
                    />
                  </div>
                </div>

                {/* City Filter */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">City</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="Makkah">Makkah Only</SelectItem>
                      <SelectItem value="Madina">Madinah Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Star Rating */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Star Rating</Label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <label key={star} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedStars.includes(star)}
                          onChange={() => toggleStarFilter(star)}
                          className="w-4 h-4 text-blue-600 rounded accent-blue-600"
                        />
                        <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                          {Array.from({ length: star }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </span>
                        <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                          {star} Star{star > 1 ? 's' : ''}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Price Filter</Label>
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={usePriceFilter}
                      onChange={(e) => setUsePriceFilter(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">Enable price filtering</span>
                  </label>

                  {usePriceFilter && (
                    <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div>
                        <Label htmlFor="minPrice" className="text-xs font-semibold text-gray-600 block mb-2">
                          Minimum Price (PKR)
                        </Label>
                        <Input
                          id="minPrice"
                          type="number"
                          placeholder="Enter minimum price"
                          value={customMinPrice}
                          onChange={(e) => setCustomMinPrice(e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxPrice" className="text-xs font-semibold text-gray-600 block mb-2">
                          Maximum Price (PKR)
                        </Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          placeholder="Enter maximum price"
                          value={customMaxPrice}
                          onChange={(e) => setCustomMaxPrice(e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                      {(customMinPrice || customMaxPrice) && (
                        <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                          Filtering: PKR {customMinPrice || '0'} - PKR {customMaxPrice || '∞'}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sort */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hotels Grid */}
          <motion.div className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Filter Toggle for Mobile */}
            <div className="lg:hidden mb-6 flex gap-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredHotels.length} Hotels Found
                </h2>
                <p className="text-gray-600 text-sm">
                  {selectedCity === 'all' ? 'All cities' : selectedCity} • {sortBy === 'popular' ? 'Most Popular' : sortBy === 'price-low' ? 'Price Low to High' : sortBy === 'price-high' ? 'Price High to Low' : 'Highest Rated'}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredHotels
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((hotel, index) => {
                  const slug = hotel.name.toLowerCase().replace(/\s+/g, '-');
                  const cityPath = hotel.type === 'Makkah' ? 'makkah' : 'madinah';
                  const basePath = hotel.type === 'Makkah' ? '/makkah-hotels' : '/madina-hotels';
                  const hotelImage = hotel.images && hotel.images.length > 0
                    ? hotel.images[0]
                    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
                  const minPrice = hotel.standardRoomPrice || hotel.deluxeRoomPrice || hotel.familySuitPrice || 'Call for price';

                  return (
                    <motion.div
                      key={hotel._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <Link href={`${basePath}/${cityPath}/${slug}`}>
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col">
                          {/* Image Container */}
                          <div className="relative h-48 overflow-hidden bg-gray-100">
                            <ImageWithFallback
                              src={hotelImage}
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                            {/* City Badge */}
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-white/95 backdrop-blur-sm text-gray-900 flex items-center gap-1 px-3 py-1">
                                <img
                                  src={hotel.type === 'Makkah' ? makkahIcon.src : madinaIcon.src}
                                  alt={hotel.type}
                                  className="w-4 h-4"
                                />
                                {hotel.type}
                              </Badge>
                            </div>

                            {/* Star Rating Badge */}
                            <div className="absolute top-3 right-3">
                              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1">
                                <div className="flex">
                                  {Array.from({ length: hotel.star }).map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <span className="text-xs font-semibold text-gray-900">{hotel.star}.0</span>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col">
                            {/* Name */}
                            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {hotel.name}
                            </h3>

                            {/* Location */}
                            <div className="flex items-start gap-2 mb-4">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-600 line-clamp-1">{hotel.location}</p>
                            </div>

                            {/* Amenities - Show first 3 */}
                            {hotel.amenities && hotel.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs bg-blue-50 text-blue-700 border-0"
                                  >
                                    {amenity.length > 12 ? amenity.substring(0, 12) + '...' : amenity}
                                  </Badge>
                                ))}
                                {hotel.amenities.length > 3 && (
                                  <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-700 border-0">
                                    +{hotel.amenities.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Spacer */}
                            <div className="flex-1" />

                            {/* Price and Button */}
                            <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                              <div>
                                <p className="text-xs text-gray-500 mb-0.5">From</p>
                                {typeof minPrice === 'number' ? (
                                  <p className="text-2xl font-bold text-blue-600">PKR {minPrice.toLocaleString('en-PK')}</p>
                                ) : (
                                  <p className="text-sm font-semibold text-gray-700">{minPrice}</p>
                                )}
                              </div>
                              <Button
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white gap-1 px-3 h-9"
                              >
                                View <ArrowRight className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {filteredHotels.length > itemsPerPage && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({
                      length: Math.ceil(filteredHotels.length / itemsPerPage),
                    }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <Button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          className={`w-10 h-10 p-0 ${
                            currentPage === pageNum
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : ''
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() =>
                      setCurrentPage(prev =>
                        Math.min(
                          Math.ceil(filteredHotels.length / itemsPerPage),
                          prev + 1
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(filteredHotels.length / itemsPerPage)
                    }
                    variant="outline"
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Page Info */}
              <div className="text-center mt-6 text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredHotels.length)} of{' '}
                {filteredHotels.length} hotels
              </div>
            </>
            )}

            {/* CTA Section */}
            {!loading && filteredHotels.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 text-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-10 border border-blue-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Book?</h3>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  Create your customized Umrah package or contact our team for personalized assistance
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/customize-umrah">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6">
                      <Sparkles className="w-4 h-4" />
                      Customize Package
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 gap-2 px-6">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
