"use client";

import { motion } from 'framer-motion';
import { Hotel, Star, MapPin, Search, Loader2, Building2, Eye, ArrowUpDown, ChevronDown } from 'lucide-react';
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
  standardRoomPrice?: number;
  deluxeRoomPrice?: number;
  familySuitPrice?: number;
  rating?: number;
  reviews?: number;
}

type SortField = 'name' | 'stars' | 'distance' | 'price' | 'rating';

// Sort Header Component
interface SortHeaderProps {
  label: string;
  field: SortField;
  currentField: SortField;
  currentDirection: 'asc' | 'desc';
  onClick: () => void;
}

function SortHeader({ label, field, currentField, currentDirection, onClick }: SortHeaderProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors group"
    >
      {label}
      <ArrowUpDown className={`w-4 h-4 transition-all ${
        currentField === field
          ? 'text-blue-600 scale-110'
          : 'text-gray-400 group-hover:scale-105'
      }`} />
      {currentField === field && (
        <span className="text-xs font-bold text-blue-600">
          {currentDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );
}

export default function HotelsListPage() {
  const [hotels, setHotels] = useState<BackendHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStars, setSelectedStars] = useState<null | number>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter and Sort Logic
  const filteredAndSortedHotels = hotels
    .filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStars = selectedStars === null || hotel.star === selectedStars;
      return matchesSearch && matchesStars;
    })
    .sort((a, b) => {
      let aValue: any = '';
      let bValue: any = '';

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'stars':
          aValue = a.star;
          bValue = b.star;
          break;
        case 'distance':
          const parseDistance = (dist?: string) => {
            if (!dist) return 0;
            const match = dist.match(/(\d+)/);
            return match ? parseInt(match[0]) : 0;
          };
          aValue = parseDistance(a.distance);
          bValue = parseDistance(b.distance);
          break;
        case 'price':
          aValue = a.standardRoomPrice || 0;
          bValue = b.standardRoomPrice || 0;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

  const totalPages = Math.ceil(filteredAndSortedHotels.length / itemsPerPage);
  const paginatedHotels = filteredAndSortedHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
              All Hotels
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Browse our complete collection of premium hotels in Makkah and Madina
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="bg-white border-b sticky top-20 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search hotels by name or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-lg w-full"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Star Filter */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Star className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">
                    {selectedStars ? `${selectedStars} Stars` : 'All Stars'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
                  <button
                    onClick={() => {
                      setSelectedStars(null);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      selectedStars === null ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                    }`}
                  >
                    All Stars
                  </button>
                  {[5, 4, 3, 2, 1].map(star => (
                    <button
                      key={star}
                      onClick={() => {
                        setSelectedStars(star);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-t border-gray-100 ${
                        selectedStars === star ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                      }`}
                    >
                      {star} Star{star > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Per Page */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <span className="text-sm font-medium">{itemsPerPage} per page</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
                  {[10, 25, 50, 100].map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        setItemsPerPage(num);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        num > 10 ? 'border-t border-gray-100' : ''
                      } ${itemsPerPage === num ? 'bg-blue-50 text-blue-600 font-semibold' : ''}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Counter */}
              <div className="ml-auto text-sm text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredAndSortedHotels.length}</span> hotel{filteredAndSortedHotels.length !== 1 ? 's' : ''}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 text-lg">Loading hotels...</p>
          </div>
        ) : filteredAndSortedHotels.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No hotels found</p>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left">
                      <SortHeader
                        label="Hotel Name"
                        field="name"
                        currentField={sortField}
                        currentDirection={sortDirection}
                        onClick={() => handleSort('name')}
                      />
                    </th>
                    <th className="px-6 py-4 text-left">
                      <SortHeader
                        label="Stars"
                        field="stars"
                        currentField={sortField}
                        currentDirection={sortDirection}
                        onClick={() => handleSort('stars')}
                      />
                    </th>
                    <th className="px-6 py-4 text-left">
                      <SortHeader
                        label="City"
                        field="name"
                        currentField={sortField}
                        currentDirection={sortDirection}
                        onClick={() => {}}
                      />
                    </th>
                    <th className="px-6 py-4 text-left">
                      <SortHeader
                        label="Distance"
                        field="distance"
                        currentField={sortField}
                        currentDirection={sortDirection}
                        onClick={() => handleSort('distance')}
                      />
                    </th>
                    <th className="px-6 py-4 text-left">Check-in</th>
                    <th className="px-6 py-4 text-left">Check-out</th>
                    <th className="px-6 py-4 text-left">Nights</th>
                    <th className="px-6 py-4 text-left">
                      <SortHeader
                        label="Price"
                        field="price"
                        currentField={sortField}
                        currentDirection={sortDirection}
                        onClick={() => handleSort('price')}
                      />
                    </th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHotels.map((hotel, index) => {
                    const slug = hotel.name.toLowerCase().replace(/\s+/g, '-');
                    const cityPath = hotel.type === 'Makkah' ? 'makkah' : 'madinah';
                    const basePath = hotel.type === 'Makkah' ? '/makkah-hotels' : '/madina-hotels';
                    
                    return (
                      <motion.tr
                        key={hotel._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{hotel.name}</div>
                          {hotel.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">{hotel.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-0.5">
                            {Array.from({ length: hotel.star || 0 }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            hotel.type === 'Makkah' ? 'bg-blue-600' : 'bg-emerald-600'
                          }`}>
                            {hotel.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{hotel.distance || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">-</td>
                        <td className="px-6 py-4 text-sm text-gray-600">-</td>
                        <td className="px-6 py-4 text-sm text-gray-600">-</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {hotel.standardRoomPrice ? `$${hotel.standardRoomPrice}` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`${basePath}/${cityPath}/${slug}`}>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </Button>
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

