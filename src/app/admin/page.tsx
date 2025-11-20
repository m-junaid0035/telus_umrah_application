"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Package, 
  Hotel, 
  BookOpen, 
  TrendingUp, 
  UserPlus,
  Calendar,
  DollarSign,
  Loader2,
  MapPin,
  Star
} from "lucide-react";
import { fetchAllUsersAction, fetchUserStatisticsAction } from "@/actions/userActions";
import { fetchAllHotelsAction } from "@/actions/hotelActions";
import { fetchHotelStatisticsAction } from "@/actions/hotelStatisticsActions";
import { fetchAllUmrahPackagesAction } from "@/actions/packageActions";
import { fetchAllPackageBookingsAction } from "@/actions/packageBookingActions";
import { fetchAllHotelBookingsAction } from "@/actions/hotelBookingActions";
import { fetchAllCustomUmrahRequestsAction } from "@/actions/customUmrahRequestActions";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface Statistics {
  totalUsers: number;
  recentUsers: number;
  monthlyUsers: number;
  monthlyData: Array<{ month: string; count: number }>;
}

interface HotelStatistics {
  totalHotels: number;
  makkahHotels: number;
  madinaHotels: number;
  star3Hotels: number;
  star4Hotels: number;
  star5Hotels: number;
  recentHotels: number;
  monthlyData: Array<{ month: string; count: number }>;
}

interface Hotel {
  _id: string;
  name: string;
  type: string;
  location: string;
  star: number;
  createdAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [hotelStatistics, setHotelStatistics] = useState<HotelStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalHotels: 0,
    totalPackageBookings: 0,
    totalHotelBookings: 0,
    totalCustomRequests: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          usersRes,
          statsRes,
          packagesRes,
          hotelsRes,
          hotelStatsRes,
          packageBookingsRes,
          hotelBookingsRes,
          customRequestsRes,
        ] = await Promise.all([
          fetchAllUsersAction(),
          fetchUserStatisticsAction(),
          fetchAllUmrahPackagesAction(),
          fetchAllHotelsAction(),
          fetchHotelStatisticsAction(),
          fetchAllPackageBookingsAction(),
          fetchAllHotelBookingsAction(),
          fetchAllCustomUmrahRequestsAction(),
        ]);

        if (usersRes?.data) {
          // Filter out any items with null required fields
          const validUsers = usersRes.data.filter((user) => user && user.createdAt) as User[];
          setUsers(validUsers);
        }
        if (statsRes?.data) setStatistics(statsRes.data);
        if (hotelsRes?.data) {
          setHotels(hotelsRes.data);
          setStats(prev => ({ ...prev, totalHotels: hotelsRes.data.length }));
        }
        if (hotelStatsRes?.data) setHotelStatistics(hotelStatsRes.data);
        if (packagesRes?.data) setStats(prev => ({ ...prev, totalPackages: packagesRes.data.length }));
        if (packageBookingsRes?.data) setStats(prev => ({ ...prev, totalPackageBookings: packageBookingsRes.data.length }));
        if (hotelBookingsRes?.data) setStats(prev => ({ ...prev, totalHotelBookings: hotelBookingsRes.data.length }));
        if (customRequestsRes?.data) setStats(prev => ({ ...prev, totalCustomRequests: customRequestsRes.data.length }));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the admin dashboard</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {statistics?.recentUsers || 0} new in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPackages}</div>
            <p className="text-xs text-muted-foreground">Umrah packages available</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
            <Hotel className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHotels}</div>
            <p className="text-xs text-muted-foreground">Hotels in system</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPackageBookings + stats.totalHotelBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPackageBookings} packages, {stats.totalHotelBookings} hotels
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth (Last 6 Months)</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            {statistics?.monthlyData ? (
              <div className="space-y-4">
                <div className="flex items-end justify-between h-64 gap-3 px-2">
                  {statistics.monthlyData.map((data, index) => {
                    const maxCount = Math.max(...statistics.monthlyData.map(d => d.count), 1);
                    const height = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full h-64 flex items-end justify-center">
                          <div
                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 cursor-pointer shadow-md hover:shadow-lg"
                            style={{ height: `${Math.max(height, 5)}%`, minHeight: '8px' }}
                            title={`${data.count} users in ${data.month}`}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {data.count} users
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 font-medium mt-2">
                          {data.month.split(' ')[0]}
                        </div>
                        <div className="text-sm font-bold text-gray-900">{data.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
            <CardDescription>Overview of system activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">New Users (30 days)</p>
                  <p className="text-xs text-gray-600">Monthly registrations</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{statistics?.monthlyUsers || 0}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Growth Rate</p>
                  <p className="text-xs text-gray-600">User acquisition</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {statistics?.totalUsers && statistics.totalUsers > 0
                  ? ((statistics.monthlyUsers / statistics.totalUsers) * 100).toFixed(1)
                  : 0}
                %
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Custom Requests</p>
                  <p className="text-xs text-gray-600">Pending inquiries</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalCustomRequests}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>All users who have signed up on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">ID: {user._id.slice(-8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900">{user.email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users registered yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
