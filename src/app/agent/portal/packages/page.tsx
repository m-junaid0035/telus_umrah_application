"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Search, 
  MapPin, 
  Calendar, 
  ChevronDown,
  Phone,
  Mail,
  Plane,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrency } from '@/contexts/CurrencyContext';
import { fetchAllUmrahPackagesAction } from '@/actions/packageActions';
import { fetchSettingsAction } from '@/actions/settingsActions';

type UmrahPackage = {
  _id: string;
  name: string;
  price?: number;
  adultPrice?: number;
  childPrice?: number;
  infantPrice?: number;
  duration: number;
  image?: string;
  departureCity?: string;
  airline?: string;
  hotels?: {
    makkah?: { name: string; star: number };
    madinah?: { name: string; star: number };
  };
  travelers?: string;
  rating?: number;
  features?: Array<{ _id?: string; feature_text?: string } | string>;
  includes?: Array<{ _id?: string; include_text?: string } | string>;
  excludes?: Array<{ _id?: string; exclude_text?: string } | string>;
  itinerary?: Array<{ _id?: string; day?: number; description?: string } | string>;
  policies?: Array<{ _id?: string; description?: string } | string>;
  flights?: {
    departure?: {
      flight?: string;
      sector?: string;
      departureTime?: string;
      arrivalTime?: string;
    };
    arrival?: {
      flight?: string;
      sector?: string;
      departureTime?: string;
      arrivalTime?: string;
    };
  };
};

export default function AgentPackagesPage() {
  const { convertPrice } = useCurrency();
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [agentDiscountPercent, setAgentDiscountPercent] = useState(0);

  useEffect(() => {
    fetchPackages();
    fetchAgentDiscount();
  }, []);

  const fetchPackages = async () => {
    try {
      const result = await fetchAllUmrahPackagesAction();
      if (result?.data && Array.isArray(result.data)) {
        setPackages(result.data as unknown as UmrahPackage[]);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
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
    const base = price ?? 0;
    const percent = clampDiscount(agentDiscountPercent);
    return base - (base * percent) / 100;
  };

  const formatPrice = (price?: number) => convertPrice(applyDiscount(price));

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.departureCity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.airline?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Umrah Packages
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-purple-200"
          >
            Click on any package to view all details
          </motion.p>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative w-full md:w-96"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </motion.div>
      </div>

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

        <div className="text-sm text-gray-300">
          Total: <span className="font-semibold text-white">{filteredPackages.length}</span> packages
        </div>
      </motion.div>

      {/* Accordion Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white mt-4">Loading packages...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-300">No packages found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {paginatedPackages.map((pkg, index) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="bg-white/5 border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedId(expandedId === pkg._id ? null : pkg._id)}
                  className="w-full"
                >
                  <CardContent className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Package Icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>

                      {/* Compact Info */}
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white line-clamp-1">{pkg.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {pkg.duration} Days
                          </span>
                          {pkg.departureCity && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {pkg.departureCity}
                            </span>
                          )}
                          {pkg.airline && (
                            <span className="flex items-center gap-1">
                              <Plane className="w-3 h-3" />
                              {pkg.airline}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price Badge */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-white">
                          {formatPrice(pkg.price ?? pkg.adultPrice ?? 0)}
                        </p>
                        <p className="text-xs text-gray-400">Per Adult</p>
                      </div>

                      {/* Expand Icon */}
                      <motion.div
                        animate={{ rotate: expandedId === pkg._id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 ml-4"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </CardContent>
                </button>

                {/* Accordion Content */}
                {expandedId === pkg._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t border-white/10 p-4 bg-white/[0.02]">
                      {/* Main Grid - 3 Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Column 1: Pricing & Duration */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Pricing</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Adult:</span>
                                <span className="text-white font-medium">
                                  {formatPrice(pkg.adultPrice ?? 0)}
                                </span>
                              </div>
                              {pkg.childPrice && pkg.childPrice > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Child:</span>
                                  <span className="text-white font-medium">
                                    {formatPrice(pkg.childPrice)}
                                  </span>
                                </div>
                              )}
                              {pkg.infantPrice !== undefined && pkg.infantPrice > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Infant:</span>
                                  <span className="text-white font-medium">
                                    {formatPrice(pkg.infantPrice)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Duration</h4>
                            <p className="text-white text-sm">{pkg.duration} Days & Nights</p>
                          </div>

                          {pkg.travelers && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Accommodation</h4>
                              <p className="text-white text-sm">{pkg.travelers}</p>
                            </div>
                          )}

                          {pkg.rating && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Rating</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-white">{pkg.rating}</span>
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Column 2: Hotels & Flights */}
                        <div className="space-y-3">
                          {/* Hotels */}
                          {(pkg.hotels?.makkah || pkg.hotels?.madinah) && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Hotels</h4>
                              <div className="space-y-2 text-sm">
                                {pkg.hotels?.makkah && (
                                  <div className="flex items-center justify-between bg-white/[0.05] p-2 rounded">
                                    <span className="text-gray-300 line-clamp-1">{pkg.hotels.makkah.name}</span>
                                    {pkg.hotels.makkah.star && (
                                      <span className="text-yellow-400 text-xs flex-shrink-0">
                                        {`⭐`.repeat(pkg.hotels.makkah.star)}
                                      </span>
                                    )}
                                  </div>
                                )}
                                {pkg.hotels?.madinah && (
                                  <div className="flex items-center justify-between bg-white/[0.05] p-2 rounded">
                                    <span className="text-gray-300 line-clamp-1">{pkg.hotels.madinah.name}</span>
                                    {pkg.hotels.madinah.star && (
                                      <span className="text-yellow-400 text-xs flex-shrink-0">
                                        {`⭐`.repeat(pkg.hotels.madinah.star)}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Flight Schedule */}
                          {(pkg.flights?.departure || pkg.flights?.arrival) && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Flights</h4>
                              <div className="space-y-2 text-xs">
                                {pkg.flights?.departure && (
                                  <div className="bg-white/[0.05] p-2 rounded">
                                    <p className="text-gray-300 font-medium mb-1">Outbound</p>
                                    {pkg.flights.departure.flight && <p className="text-white">{pkg.flights.departure.flight}</p>}
                                    {pkg.flights.departure.sector && <p className="text-gray-400">{pkg.flights.departure.sector}</p>}
                                    {pkg.flights.departure.departureTime && (
                                      <p className="text-gray-400">{pkg.flights.departure.departureTime} → {pkg.flights.departure.arrivalTime}</p>
                                    )}
                                  </div>
                                )}
                                {pkg.flights?.arrival && (
                                  <div className="bg-white/[0.05] p-2 rounded">
                                    <p className="text-gray-300 font-medium mb-1">Return</p>
                                    {pkg.flights.arrival.flight && <p className="text-white">{pkg.flights.arrival.flight}</p>}
                                    {pkg.flights.arrival.sector && <p className="text-gray-400">{pkg.flights.arrival.sector}</p>}
                                    {pkg.flights.arrival.departureTime && (
                                      <p className="text-gray-400">{pkg.flights.arrival.departureTime} → {pkg.flights.arrival.arrivalTime}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Column 3: Features */}
                        <div className="space-y-3">
                          {pkg.features && pkg.features.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Features</h4>
                              <div className="space-y-1 text-xs">
                                {pkg.features.map((feature, idx) => {
                                  const featureText = typeof feature === 'string' ? feature : feature?.feature_text;
                                  return featureText ? (
                                    <div key={idx} className="flex items-start gap-2">
                                      <span className="text-green-400 mt-1">✓</span>
                                      <span className="text-gray-300 line-clamp-2">{featureText}</span>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Includes / Excludes Section */}
                      {(pkg.includes?.length || pkg.excludes?.length) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/10">
                          {pkg.includes && pkg.includes.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-green-400 mb-2 uppercase">✓ Includes</h4>
                              <ul className="space-y-1 text-xs">
                                {pkg.includes.slice(0, 5).map((item: string | { _id?: string; include_text?: string }, idx) => {
                                  const text = typeof item === 'string' ? item : item?.include_text;
                                  return text ? (
                                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                                      <span className="text-green-400 flex-shrink-0">•</span>
                                      <span className="line-clamp-1">{text}</span>
                                    </li>
                                  ) : null;
                                })}
                                {pkg.includes.length > 5 && (
                                  <li className="text-gray-400 italic">+{pkg.includes.length - 5} more</li>
                                )}
                              </ul>
                            </div>
                          )}

                          {pkg.excludes && pkg.excludes.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-red-400 mb-2 uppercase">✗ Excludes</h4>
                              <ul className="space-y-1 text-xs">
                                {pkg.excludes.slice(0, 5).map((item: string | { _id?: string; exclude_text?: string }, idx) => {
                                  const text = typeof item === 'string' ? item : item?.exclude_text;
                                  return text ? (
                                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                                      <span className="text-red-400 flex-shrink-0">•</span>
                                      <span className="line-clamp-1">{text}</span>
                                    </li>
                                  ) : null;
                                })}
                                {pkg.excludes.length > 5 && (
                                  <li className="text-gray-400 italic">+{pkg.excludes.length - 5} more</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Itinerary Section */}
                      {pkg.itinerary && pkg.itinerary.length > 0 && (
                        <div className="mb-4 pb-4 border-b border-white/10">
                          <h4 className="text-xs font-semibold text-blue-400 mb-3 uppercase">📅 Day-by-Day Itinerary</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {pkg.itinerary.map((item, idx) => {
                              const itemText = typeof item === 'string' ? item : item?.description;
                              const dayNum = typeof item === 'string' ? null : item?.day;
                              return itemText ? (
                                <div key={idx} className="flex items-start gap-3 text-xs bg-white/[0.03] p-2 rounded">
                                  <span className="text-blue-400 font-bold flex-shrink-0 min-w-8">
                                    Day {dayNum || idx + 1}
                                  </span>
                                  <span className="text-gray-300 line-clamp-2">{itemText}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {/* Policies Section */}
                      {pkg.policies && pkg.policies.length > 0 && (
                        <div className="mb-4 pb-4 border-b border-white/10">
                          <h4 className="text-xs font-semibold text-amber-400 mb-3 uppercase">📋 Policies</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {pkg.policies.map((policy, idx) => {
                              const policyText = typeof policy === 'string' ? policy : policy?.description;
                              return policyText ? (
                                <div key={idx} className="flex items-start gap-2 text-xs bg-white/[0.03] p-2 rounded">
                                  <span className="text-amber-400 flex-shrink-0">⚠</span>
                                  <span className="text-gray-300 line-clamp-2">{policyText}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-2"
                          onClick={() => {
                            // You can implement phone call action
                            alert('Contact us for more details');
                          }}
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-2"
                          onClick={() => {
                            // You can implement email action
                            alert('Send email for inquiry');
                          }}
                        >
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredPackages.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-lg border border-white/10"
        >
          <p className="text-sm text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPackages.length)} of {filteredPackages.length}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              ).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
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
        </motion.div>
      )}
    </div>
  );
}
