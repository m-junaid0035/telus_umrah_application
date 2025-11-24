"use client";

import { motion } from 'framer-motion';
import { Hotel, Star, MapPin, Search, Loader2, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchAllHotelsAction } from '@/actions/hotelActions';
import { toast } from '@/hooks/use-toast';

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

export default function HotelsListPage() {
  const [hotels, setHotels] = useState<BackendHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<'all' | 'Makkah' | 'Madina'>('all');
  const [selectedStars, setSelectedStars] = useState<'all' | 5 | 4 | 3>('all');

  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);
      try {
        const result = await fetchAllHotelsAction();
        if (result?.data && Array.isArray(result.data)) {
          setHotels(result.data as BackendHotel[]);
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
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || hotel.type === selectedLocation;
    const matchesStars = selectedStars === 'all' || hotel.star === selectedStars;
    return matchesSearch && matchesLocation && matchesStars;
  });

  const makkahCount = hotels.filter(h => h.type === 'Makkah').length;
  const madinaCount = hotels.filter(h => h.type === 'Madina').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="pt-24 pb-12 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Our Hotels
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Explore our curated selection of premium hotels in Makkah and Madina, 
              designed to make your spiritual journey comfortable and memorable.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-blue-600">{hotels.length}</div>
              <div className="text-sm text-gray-600">Total Hotels</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-emerald-600">{makkahCount}</div>
              <div className="text-sm text-gray-600">Makkah Hotels</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-purple-600">{madinaCount}</div>
              <div className="text-sm text-gray-600">Madina Hotels</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b sticky top-20 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search hotels by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-4">
              {/* Location Filter */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 mr-2">Location:</span>
                <div className="flex gap-2">
                  {[
                    { value: 'all' as const, label: 'All', count: hotels.length },
                    { value: 'Makkah' as const, label: 'Makkah', count: makkahCount },
                    { value: 'Madina' as const, label: 'Madina', count: madinaCount },
                  ].map((location) => (
                    <button
                      key={location.value}
                      onClick={() => setSelectedLocation(location.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedLocation === location.value
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {location.label} ({location.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Rating Filter */}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 mr-2">Rating:</span>
                <div className="flex gap-2">
                  {[
                    { value: 'all' as const, label: 'All Stars' },
                    { value: 5 as const, label: '5 Star' },
                    { value: 4 as const, label: '4 Star' },
                    { value: 3 as const, label: '3 Star' },
                  ].map((rating) => (
                    <button
                      key={rating.value}
                      onClick={() => setSelectedStars(rating.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedStars === rating.value
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rating.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <p className="text-gray-600 text-lg">
            Showing <span className="font-bold text-blue-600">{filteredHotels.length}</span> hotel{filteredHotels.length !== 1 ? 's' : ''}
            {selectedLocation !== 'all' && ` in ${selectedLocation}`}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 text-lg">Loading hotels...</p>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No hotels found</p>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel, index) => {
              const slug = hotel.name.toLowerCase().replace(/\s+/g, '-');
              const cityPath = hotel.type === 'Makkah' ? 'makkah' : 'madinah';
              const basePath = hotel.type === 'Makkah' ? '/makkah-hotels' : '/madina-hotels';
              
              return (
                <motion.div
                  key={hotel._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <Link href={`${basePath}/${cityPath}/${slug}`}>
                    <div className="relative h-64 overflow-hidden bg-gray-200">
                      {hotel.images && hotel.images.length > 0 ? (
                        <ImageWithFallback
                          src={hotel.images[0]}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-emerald-100">
                          <Hotel className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Location Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          hotel.type === 'Makkah' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {hotel.type}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/50 px-3 py-1.5 rounded-full">
                        {Array.from({ length: hotel.star || 0 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link href={`${basePath}/${cityPath}/${slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {hotel.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                      <span className="text-sm">{hotel.location}</span>
                    </div>

                    {hotel.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {hotel.description}
                      </p>
                    )}

                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <Link href={`${basePath}/${cityPath}/${slug}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        View Details
                        <MapPin className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

