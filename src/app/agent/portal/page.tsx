"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Hotel, TrendingUp, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgentDashboardPage() {
  const stats = [
    {
      title: "Total Bookings",
      value: "0",
      icon: Briefcase,
      description: "All time bookings",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      title: "Active Packages",
      value: "0",
      icon: Package,
      description: "Available packages",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Hotels Listed",
      value: "0",
      icon: Hotel,
      description: "Available hotels",
      gradient: "from-cyan-500 to-teal-500",
    },
    {
      title: "This Month",
      value: "0",
      icon: TrendingUp,
      description: "Monthly bookings",
      gradient: "from-teal-500 to-green-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Welcome to Agent Portal
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-purple-200"
        >
          Manage your packages, hotels, and bookings all in one place
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} bg-opacity-10`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Browse Packages</CardTitle>
                  <CardDescription className="text-gray-400">
                    View all available Umrah packages
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Access our complete catalog of Umrah packages with exclusive agent rates and commissions.
              </p>
              <a 
                href="/agent/portal/packages"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:shadow-lg transition-all"
              >
                View Packages
              </a>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Hotel className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Browse Hotels</CardTitle>
                  <CardDescription className="text-gray-400">
                    Explore hotels in Makkah and Madina
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Find the best accommodations for your clients with special agent pricing and availability.
              </p>
              <a 
                href="/agent/portal/hotels"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all"
              >
                View Hotels
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Agent Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-300">
              Need assistance? Our dedicated agent support team is here to help you.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-400">Email:</span>{' '}
                <span className="text-purple-300 font-medium">agents@telusumrah.com</span>
              </div>
              <div>
                <span className="text-gray-400">Phone:</span>{' '}
                <span className="text-purple-300 font-medium">+92 300 1234567</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
