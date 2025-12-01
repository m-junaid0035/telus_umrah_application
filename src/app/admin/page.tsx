"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
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
  Star,
  Trash2
} from "lucide-react";
import { fetchRecentUsersAction, fetchUserStatisticsAction, deleteUserAction } from "@/actions/userActions";
import { fetchDashboardStatsAction } from "@/actions/dashboardStatsActions";

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
  star1Hotels: number;
  star2Hotels: number;
  star3Hotels: number;
  star4Hotels: number;
  star5Hotels: number;
  recentHotels: number;
  monthlyData: Array<{ month: string; count: number }>;
}


export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalHotels: 0,
    totalPackageBookings: 0,
    totalHotelBookings: 0,
    totalCustomRequests: 0,
    star1Hotels: 0,
    star2Hotels: 0,
    star3Hotels: 0,
    star4Hotels: 0,
    star5Hotels: 0,
  });

  // Load stats first (fast - only counts)
  useEffect(() => {
    const loadStats = async () => {
      try {
        const dashboardStatsRes = await fetchDashboardStatsAction();
        if (dashboardStatsRes?.data) {
          setStats({
            totalPackages: dashboardStatsRes.data.totalPackages,
            totalHotels: dashboardStatsRes.data.totalHotels,
            totalPackageBookings: dashboardStatsRes.data.totalPackageBookings,
            totalHotelBookings: dashboardStatsRes.data.totalHotelBookings,
            totalCustomRequests: dashboardStatsRes.data.totalCustomRequests,
            star1Hotels: dashboardStatsRes.data.star1Hotels,
            star2Hotels: dashboardStatsRes.data.star2Hotels,
            star3Hotels: dashboardStatsRes.data.star3Hotels,
            star4Hotels: dashboardStatsRes.data.star4Hotels,
            star5Hotels: dashboardStatsRes.data.star5Hotels,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Load detailed data (users and statistics)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load only essential data in parallel - much faster!
        const [
          usersRes,
          statsRes,
        ] = await Promise.all([
          fetchRecentUsersAction(20), // Only get 20 most recent users
          fetchUserStatisticsAction(),
        ]);

        if (usersRes?.data) {
          const validUsers = usersRes.data.filter((user) => user && user.createdAt) as User[];
          setUsers(validUsers);
        }
        if (statsRes?.data) setStatistics(statsRes.data);
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

  const loadUsers = async () => {
    try {
      const usersRes = await fetchRecentUsersAction(20);
      if (usersRes?.data) {
        const validUsers = usersRes.data.filter((user) => user && user.createdAt) as User[];
        setUsers(validUsers);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      const result = await deleteUserAction(userToDelete._id);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message?.[0] || "Failed to delete user",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        await loadUsers();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Show stats immediately, even if other data is loading
  if (loading && statsLoading) {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>User Growth (Last 6 Months)</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : statistics?.monthlyData ? (
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

        {/* Hotel Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Hotel Star Distribution</CardTitle>
            <CardDescription>Number of hotels by star rating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {statsLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">
                      <Star className="h-5 w-5" /><Star className="h-5 w-5" /><Star className="h-5 w-5" /><Star className="h-5 w-5" /><Star className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">5 Star</p>
                  </div>
                  <div className="text-xl font-bold text-purple-600">{stats.star5Hotels || 0}</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">
                      <Star className="h-5 w-5" /><Star className="h-5 w-5" /><Star className="h-5 w-5" /><Star className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">4 Star</p>
                  </div>
                  <div className="text-xl font-bold text-purple-600">{stats.star4Hotels || 0}</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">
                      <Star className="h-5 w-5" /><Star className="h-5 w-5" /><Star className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">3 Star</p>
                  </div>
                  <div className="text-xl font-bold text-purple-600">{stats.star3Hotels || 0}</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">
                      <Star className="h-5 w-5" /><Star className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">2 Star</p>
                  </div>
                  <div className="text-xl font-bold text-purple-600">{stats.star2Hotels || 0}</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">
                      <Star className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">1 Star</p>
                  </div>
                  <div className="text-xl font-bold text-purple-600">{stats.star1Hotels || 0}</div>
                </div>
              </>
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
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest 20 users who have signed up on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : users.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
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
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setUserToDelete(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
