"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Hotel, 
  Search, 
  MapPin, 
  Star, 
  Eye,
  ChevronUp,
  ChevronDown,
  Grid3x3,
  List,
  Eye as EyeIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { fetchAllHotelsAction } from '@/actions/hotelActions';
import { fetchSettingsAction } from '@/actions/settingsActions';

type HotelRecord = {
  _id: string;
  type?: string;
  name: string;
  location?: string;
  star?: number;
  description?: string;
  distance?: string;
  images?: string[];
  amenities?: string[];
  standardRoomPrice?: number;
  deluxeRoomPrice?: number;
  familySuitPrice?: number;
};

type SortField = 'name' | 'star' | 'distance';
type SortOrder = 'asc' | 'desc';

export default function AgentHotelsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<HotelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [agentDiscountPercent, setAgentDiscountPercent] = useState(0);

  useEffect(() => {
    fetchHotels();
    fetchAgentDiscount();
  }, []);

  const fetchHotels = async () => {
    try {
      const result = await fetchAllHotelsAction();
      if (result?.data && Array.isArray(result.data)) {
        setHotels(result.data as HotelRecord[]);
      } else {
        setHotels([]);
        console.error('Failed to fetch hotels:', result?.error);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentDiscount = async () => {
    try {
      const result = await fetchSettingsAction();
      if (result?.data?.agentDiscountPercent !== undefined) {
        setAgentDiscountPercent(Number(result.data.agentDiscountPercent));
      }
    } catch (error) {
      console.error('Error fetching agent discount:', error);
    }
  };

  const clampDiscount = (value: number) => Math.min(Math.max(value, 0), 100);

  const applyDiscount = (price?: number) => {
    if (price === undefined || price === null) return null;
    const percent = clampDiscount(agentDiscountPercent);
    const discounted = price - (price * percent) / 100;
    return Math.round(discounted);
  };

  const formatPrice = (price?: number) => {
    const discounted = applyDiscount(price);
    return discounted === null ? '-' : `${discounted.toLocaleString()} PKR`;
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'all' || hotel.type?.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    let aVal: any = '';
    let bVal: any = '';

    if (sortField === 'name') {
      aVal = a.name;
      bVal = b.name;
    } else if (sortField === 'star') {
      aVal = a.star ?? 0;
      bVal = b.star ?? 0;
    } else if (sortField === 'distance') {
      aVal = parseInt(a.distance || '0');
      bVal = parseInt(b.distance || '0');
    }

    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const totalPages = Math.ceil(sortedHotels.length / itemsPerPage);
  const paginatedHotels = sortedHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const makkahHotels = hotels.filter(h => h.type?.toLowerCase() === 'makkah').length;
  const madinaHotels = hotels.filter(h => h.type?.toLowerCase() === 'madina').length;

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4 inline ml-1" /> : 
      <ChevronDown className="w-4 h-4 inline ml-1" />;
  };


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

        <select 
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-white/10 border border-white/20 text-white rounded px-4 py-2 w-full md:w-48"
        >
          <option value="all" className="bg-gray-900">All Cities</option>
          <option value="makkah" className="bg-gray-900">Makkah</option>
          <option value="madina" className="bg-gray-900">Madina</option>
        </select>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-300 text-sm">Show</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white/10 border border-white/20 text-white rounded px-3 py-2 text-sm"
          >
            <option value={10} className="bg-gray-900">10</option>
            <option value={25} className="bg-gray-900">25</option>
            <option value={50} className="bg-gray-900">50</option>
            <option value={100} className="bg-gray-900">100</option>
          </select>
          <span className="text-gray-300 text-sm">entries</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-2"
          >
            <Grid3x3 className="w-4 h-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            List
          </Button>
        </div>

        <div className="text-sm text-gray-300">
          Total: <span className="font-semibold text-white">{filteredHotels.length}</span> hotels
        </div>
      </motion.div>

      {/* Stats */}
      {viewMode === 'grid' && (
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
                <Hotel className="w-5 h-5 text-white" />
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
                <Hotel className="w-5 h-5 text-white" />
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
      )}

      {/* Content */}
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
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedHotels.map((hotel, index) => (
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
                      hotel.type?.toLowerCase() === 'makkah' 
                        ? 'bg-purple-500' 
                        : 'bg-green-500'
                    } text-white font-semibold`}>
                      {hotel.type || 'Unknown'}
                    </Badge>
                  </div>
                  {hotel.star && (
                    <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-800">{hotel.star}</span>
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
                      <span className="line-clamp-1">{hotel.location || 'Address not specified'}</span>
                    </div>

                    {hotel.distance && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>{hotel.distance}m from Haram</span>
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
      ) : (
        // List View
        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    <button 
                      onClick={() => toggleSort('name')}
                      className="flex items-center gap-2 hover:text-blue-400"
                    >
                      Hotel Name {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">City</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                    <button 
                      onClick={() => toggleSort('star')}
                      className="flex items-center gap-2 hover:text-blue-400 mx-auto"
                    >
                      Stars {getSortIcon('star')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                    <button 
                      onClick={() => toggleSort('distance')}
                      className="flex items-center gap-2 hover:text-blue-400 mx-auto"
                    >
                      Distance (m) {getSortIcon('distance')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Standard Room</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Deluxe Room</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Family Suite</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHotels.map((hotel, index) => (
                  <motion.tr
                    key={hotel._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <Hotel className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white line-clamp-1">{hotel.name}</p>
                          <p className="text-xs text-gray-400">{hotel.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <Badge className={`${
                        hotel.type?.toLowerCase() === 'makkah'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-green-500/20 text-green-300 border-green-500/30'
                      } border`}>
                        {hotel.type || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {hotel.star && (
                          <>
                            <span className="text-yellow-400">{'⭐'.repeat(hotel.star)}</span>
                            <span className="text-gray-400 text-sm">({hotel.star})</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {hotel.distance ? `${hotel.distance}m` : '-'}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {formatPrice(hotel.standardRoomPrice)}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {formatPrice(hotel.deluxeRoomPrice)}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {formatPrice(hotel.familySuitPrice)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => router.push(`/hotels/${hotel._id}`)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span className="text-sm">View</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <p className="text-sm text-gray-300">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedHotels.length)} of {sortedHotels.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
