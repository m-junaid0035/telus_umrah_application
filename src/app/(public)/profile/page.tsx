"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCurrentUserAction, logoutUserAction } from "@/actions/authActions";
import { updateUserProfileAction, changeUserPasswordAction } from "@/actions/userActions";
import { fetchAllPackageBookingsAction } from "@/actions/packageBookingActions";
import { fetchAllHotelBookingsAction } from "@/actions/hotelBookingActions";
import { fetchAllCustomUmrahRequestsAction } from "@/actions/customUmrahRequestActions";
import { User, Mail, Phone, MapPin, Calendar, Package, Hotel, FileText, Edit2, Save, X, Loader2, LogOut, Shield, Camera, Upload, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import Cropper, { type Area } from "react-easy-crop";

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = url;
  });

const getCroppedImageBlob = async (
  imageSrc: string,
  cropPixels: CropArea,
  requestedType: string
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to initialize image editor");
  }

  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  const normalizedType =
    requestedType === "image/png" || requestedType === "image/webp"
      ? requestedType
      : "image/jpeg";

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to crop image"));
          return;
        }
        resolve(blob);
      },
      normalizedType,
      normalizedType === "image/png" ? undefined : 0.92
    );
  });
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarCropOpen, setAvatarCropOpen] = useState(false);
  const [avatarSource, setAvatarSource] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [user, setUser] = useState<any>(null);
  const [packageBookings, setPackageBookings] = useState<any[]>([]);
  const [hotelBookings, setHotelBookings] = useState<any[]>([]);
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    return () => {
      if (avatarSource) {
        URL.revokeObjectURL(avatarSource);
      }
    };
  }, [avatarSource]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userResult = await getCurrentUserAction();
      
      if (!userResult) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your profile",
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      setUser(userResult);
      setFormData({
        name: userResult.name || "",
        email: userResult.email || "",
        phone: userResult.phone || "",
        countryCode: userResult.countryCode || "+92",
      });

      // Load bookings
      const [packagesRes, hotelsRes, customRequestsRes] = await Promise.all([
        fetchAllPackageBookingsAction(),
        fetchAllHotelBookingsAction(),
        fetchAllCustomUmrahRequestsAction(),
      ]);

      if (packagesRes.data) {
        const userPackages = packagesRes.data.filter(
          (booking: any) => booking.customerEmail === userResult.email
        );
        setPackageBookings(userPackages);
      }

      if (hotelsRes.data) {
        const userHotels = hotelsRes.data.filter(
          (booking: any) => booking.customerEmail === userResult.email
        );
        setHotelBookings(userHotels);
      }

      if (customRequestsRes.data) {
        const userCustomRequests = customRequestsRes.data.filter(
          (request: any) => request.email === userResult.email
        );
        setCustomRequests(userCustomRequests);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Validate phone number
      if (!formData.phone || formData.phone.trim() === "") {
        toast({
          title: "Error",
          description: "Phone number is required",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // Validate name
      if (!formData.name || formData.name.trim() === "") {
        toast({
          title: "Error",
          description: "Name is required",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const result = await updateUserProfileAction(user._id || user.id, {
        name: formData.name,
        phone: formData.phone,
        countryCode: formData.countryCode,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message?.[0] || "Failed to update profile",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // Update local user state
      setUser(result.data);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate current password
    if (!passwordData.currentPassword || passwordData.currentPassword.trim() === "") {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive",
      });
      return;
    }

    // Validate new password
    if (!passwordData.newPassword || passwordData.newPassword.trim() === "") {
      toast({
        title: "Error",
        description: "New password is required",
        variant: "destructive",
      });
      return;
    }

    // Validate password confirmation match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Validate minimum password length
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    // Validate password is different from current
    if (passwordData.newPassword === passwordData.currentPassword) {
      toast({
        title: "Error",
        description: "New password must be different from the current password",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      const result = await changeUserPasswordAction(user._id || user.id, passwordData.currentPassword, passwordData.newPassword);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message?.[0] || "Failed to change password",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetAvatarEditor = () => {
    if (avatarSource) {
      URL.revokeObjectURL(avatarSource);
    }
    setAvatarSource(null);
    setSelectedAvatarFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setAvatarCropOpen(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedAvatarFile(file);
    setAvatarSource(objectUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setAvatarCropOpen(true);
    event.target.value = "";
  };

  const handleConfirmAvatarUpload = async () => {
    if (!avatarSource || !selectedAvatarFile || !croppedAreaPixels) {
      toast({
        title: "Error",
        description: "Please adjust the crop area before uploading",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingAvatar(true);

      const croppedBlob = await getCroppedImageBlob(
        avatarSource,
        croppedAreaPixels,
        selectedAvatarFile.type
      );

      const mimeType = croppedBlob.type || "image/jpeg";
      const extension =
        mimeType === "image/png"
          ? "png"
          : mimeType === "image/webp"
          ? "webp"
          : "jpg";
      const croppedFile = new File([croppedBlob], `avatar-${Date.now()}.${extension}`, {
        type: mimeType,
      });

      const uploadFormData = new FormData();
      uploadFormData.append("file", croppedFile);
      uploadFormData.append("folder", "profile-pictures");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      const profileUpdate = await updateUserProfileAction(user._id || user.id, {
        avatar: data.url,
      });

      if (profileUpdate.error) {
        throw new Error(profileUpdate.error.message?.[0] || "Failed to save profile picture");
      }

      setUser(profileUpdate.data);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
      resetAvatarEditor();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUserAction();
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-500/15 text-emerald-600 border-emerald-300/25";
      case "pending":
        return "bg-yellow-500/15 text-yellow-600 border-yellow-300/25";
      case "cancelled":
        return "bg-rose-500/15 text-rose-600 border-rose-300/25";
      case "completed":
        return "bg-blue-500/15 text-blue-600 border-blue-300/25";
      default:
        return "bg-slate-500/15 text-slate-600 border-slate-300/25";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account and bookings</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-8 border-2 border-blue-100 shadow-lg">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-blue-100">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  {user.countryCode} {user.phone}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                  <Badge className="bg-blue-500/15 text-blue-600 border border-blue-300/25">
                    <User className="w-3 h-3 mr-1" />
                    Active Member
                  </Badge>
                  <Badge className="bg-green-500/15 text-green-600 border border-green-300/25">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Info
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            {/* Package Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Package Bookings
                </CardTitle>
                <CardDescription>
                  Your Umrah package bookings and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {packageBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No package bookings yet</p>
                    <Link href="/packages">
                      <Button className="mt-4">Browse Packages</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {packageBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {booking.packageName || "Umrah Package"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Booking ID: {booking._id}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Travelers</p>
                            <p className="font-medium">
                              {(booking.adults?.length || 0)} Adults, {(booking.children?.length || 0)} Children
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Rooms</p>
                            <p className="font-medium">{booking.rooms}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Amount</p>
                            <p className="font-medium">
                              PKR {booking.totalAmount?.toLocaleString() || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Booked On</p>
                            <p className="font-medium">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/bookings/package/${booking._id}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                          {booking.invoiceUrl && (
                            <a href={booking.invoiceUrl} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline">
                                Download Invoice
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hotel Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-purple-600" />
                  Hotel Bookings
                </CardTitle>
                <CardDescription>
                  Your hotel reservations and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hotelBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Hotel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No hotel bookings yet</p>
                    <Link href="/hotels">
                      <Button className="mt-4">Browse Hotels</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hotelBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {booking.hotelName || "Hotel Booking"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Booking ID: {booking._id}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Check-in</p>
                            <p className="font-medium">
                              {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Check-out</p>
                            <p className="font-medium">
                              {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Amount</p>
                            <p className="font-medium">
                              PKR {booking.totalAmount?.toLocaleString() || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Booked On</p>
                            <p className="font-medium">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/bookings/hotel/${booking._id}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                          {booking.invoiceUrl && (
                            <a href={booking.invoiceUrl} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline">
                                Download Invoice
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

              {/* Custom Umrah Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    Custom Umrah Requests
                  </CardTitle>
                  <CardDescription>
                    Your custom Umrah requests and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {customRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No custom requests yet</p>
                      <Link href="/customize-umrah">
                        <Button className="mt-4">Create Custom Request</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customRequests.map((request) => (
                        <div
                          key={request._id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Custom Umrah Request
                              </h3>
                              <p className="text-sm text-gray-600">
                                Request ID: {request._id}
                              </p>
                            </div>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Departure</p>
                              <p className="font-medium">{request.from || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Destination</p>
                              <p className="font-medium">{request.to || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Travelers</p>
                              <p className="font-medium">
                                {(request.adults || 0)} Adults{typeof request.children === 'number' ? `, ${request.children} Children` : ''}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Requested On</p>
                              <p className="font-medium">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Link href={`/bookings/custom/${request._id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
          </TabsContent>

          {/* Profile Info Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your profile information
                    </CardDescription>
                  </div>
                  {!editing ? (
                    <Button
                      variant="outline"
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: user.name || "",
                            email: user.email || "",
                            phone: user.phone || "",
                            countryCode: user.countryCode || "+92",
                          });
                        }}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={!editing}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled={true}
                      className="mt-2 bg-gray-50"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="countryCode">Country Code</Label>
                    <Input
                      id="countryCode"
                      value={formData.countryCode}
                      onChange={(e) =>
                        setFormData({ ...formData, countryCode: e.target.value })
                      }
                      disabled={!editing}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!editing}
                      className="mt-2"
                    />
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Account Status</h4>
                      <p className="text-sm text-gray-600">
                        Your account is active and verified. You can make bookings and access all features.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Must be at least 8 characters long
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Security Tips</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Use a strong, unique password</li>
                        <li>Never share your password with anyone</li>
                        <li>Change your password regularly</li>
                        <li>Log out from shared devices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={avatarCropOpen}
        onOpenChange={(open) => {
          if (!open && !uploadingAvatar) {
            resetAvatarEditor();
          }
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
            <DialogDescription>
              Crop your image to a square for the best profile picture fit.
            </DialogDescription>
          </DialogHeader>

          {avatarSource && (
            <>
              <div className="relative h-72 w-full overflow-hidden rounded-md bg-black/60">
                <Cropper
                  image={avatarSource}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, areaPixels: Area) => {
                    setCroppedAreaPixels({
                      x: Math.round(areaPixels.x),
                      y: Math.round(areaPixels.y),
                      width: Math.round(areaPixels.width),
                      height: Math.round(areaPixels.height),
                    });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar-zoom">Zoom</Label>
                <input
                  id="avatar-zoom"
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={resetAvatarEditor}
              disabled={uploadingAvatar}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmAvatarUpload}
              disabled={uploadingAvatar || !croppedAreaPixels}
            >
              {uploadingAvatar ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Crop & Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
