"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hotel, Search, MapPin, Star, Eye, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AgentHotelsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('/api/hotels');
      const data = await response.json();
      if (data.success) {
        setHotels(data.hotels.filter((hotel: any) => hotel.isActive));
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'all' || hotel.city?.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const makkahHotels = hotels.filter(h => h.city?.toLowerCase() === 'makkah').length;
  const madinaHotels = hotels.filter(h => h.city?.toLowerCase() === 'madina').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Hotels Catalog
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-purple-200"
        >
          Browse hotels in Makkah and Madina
        </motion.p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search hotels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Filter by city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            <SelectItem value="makkah">Makkah</SelectItem>
            <SelectItem value="madina">Madina</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/30">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total Hotels</p>
              <p className="text-2xl font-bold text-white">{hotels.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/30">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Makkah</p>
              <p className="text-2xl font-bold text-white">{makkahHotels}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-cyan-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/30">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Madina</p>
              <p className="text-2xl font-bold text-white">{madinaHotels}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-500/20 to-green-500/20 border-teal-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/30">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Filtered</p>
              <p className="text-2xl font-bold text-white">{filteredHotels.length}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hotels Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white mt-4">Loading hotels...</p>
        </div>
      ) : filteredHotels.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Hotel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-300">No hotels found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel, index) => (
            <motion.div
              key={hotel._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
                {/* Hotel Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-cyan-600 overflow-hidden">
                  {hotel.images && hotel.images.length > 0 ? (
                    <img 
                      src={hotel.images[0]} 
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Hotel className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${
                      hotel.city?.toLowerCase() === 'makkah' 
                        ? 'bg-purple-500' 
                        : 'bg-green-500'
                    } text-white font-semibold`}>
                      {hotel.city || 'Unknown'}
                    </Badge>
                  </div>
                  {hotel.rating && (
                    <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-800">{hotel.rating}</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {hotel.name}
                  </h3>
                  
                  {/* Hotel Details */}
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="line-clamp-1">{hotel.address || 'Address not specified'}</span>
                    </div>

                    {hotel.distanceFromHaram && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Building className="w-4 h-4 text-blue-400" />
                        <span>{hotel.distanceFromHaram} from Haram</span>
                      </div>
                    )}

                    {hotel.description && (
                      <p className="text-sm text-gray-400 line-clamp-2 mt-2">
                        {hotel.description}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="border-t border-white/10 pt-4 mt-auto">
                    <button
                      onClick={() => router.push(`/hotels/${hotel._id}`)}
                      className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
