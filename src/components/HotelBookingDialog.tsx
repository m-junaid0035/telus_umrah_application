"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createHotelBookingAction } from "@/actions/hotelBookingActions";
import { toast } from "@/hooks/use-toast";
import { Loader2, DollarSign, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HotelBookingDialogProps {
  hotelId: string;
  hotelName: string;
  trigger: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  hotel?: {
    standardRoomPrice?: number;
    deluxeRoomPrice?: number;
    familySuitPrice?: number;
    transportPrice?: number;
    mealsPrice?: number;
  };
  selectedRoomType?: number; // 0 = standard, 1 = deluxe, 2 = family
}

export function HotelBookingDialog({ hotelId, hotelName, trigger, user, hotel, selectedRoomType = 0 }: HotelBookingDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  
  // Determine room type from selectedRoomType index
  const getRoomType = (index: number): string => {
    if (index === 0) return 'standard';
    if (index === 1) return 'deluxe';
    if (index === 2) return 'family';
    return 'standard';
  };
  
  // Get room type from selectedRoomType prop (0=standard, 1=deluxe, 2=family)
  const currentRoomType = getRoomType(selectedRoomType);
  
  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: user?.phone || "",
    customerNationality: "",
    checkInDate: "",
    checkOutDate: "",
    rooms: 1,
    adults: 1,
    children: 0,
    childAges: [] as number[],
    bedType: "",
    meals: false,
    transport: false,
    notes: "",
  });
  
  // Calculate price preview using the selected room type from hotel details page
  const calculatePricePreview = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !hotel) return 0;
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Use currentRoomType (from selectedRoomType prop) instead of formData.roomType
    let roomPrice = 0;
    if (currentRoomType === 'deluxe' && hotel.deluxeRoomPrice) {
      roomPrice = hotel.deluxeRoomPrice;
    } else if (currentRoomType === 'family' && hotel.familySuitPrice) {
      roomPrice = hotel.familySuitPrice;
    } else if (hotel.standardRoomPrice) {
      roomPrice = hotel.standardRoomPrice;
    }
    
    let total = roomPrice * nights * formData.rooms;
    
    if (formData.meals && hotel.mealsPrice) {
      total += hotel.mealsPrice * nights * formData.rooms;
    }
    if (formData.transport && hotel.transportPrice) {
      total += hotel.transportPrice;
    }
    
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hotelId) {
      toast({
        title: "Error",
        description: "Hotel information is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    if (!formData.checkInDate || !formData.checkOutDate) {
      toast({
        title: "Error",
        description: "Please select both check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      toast({
        title: "Error",
        description: "Check-in date cannot be in the past",
        variant: "destructive",
      });
      return;
    }

    if (checkOut <= checkIn) {
      toast({
        title: "Error",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return;
    }

    // Validate child ages
    if (formData.childAges.some(age => age < 0 || age > 16)) {
      toast({
        title: "Error",
        description: "Child ages must be between 0 and 16 years",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("hotelId", hotelId);
      formDataObj.append("hotelName", hotelName);
      formDataObj.append("customerName", formData.customerName);
      formDataObj.append("customerEmail", formData.customerEmail);
      formDataObj.append("customerPhone", formData.customerPhone);
      if (formData.customerNationality) {
        formDataObj.append("customerNationality", formData.customerNationality);
      }
      formDataObj.append("checkInDate", formData.checkInDate);
      formDataObj.append("checkOutDate", formData.checkOutDate);
      formDataObj.append("rooms", String(formData.rooms));
      formDataObj.append("adults", String(formData.adults));
      formDataObj.append("children", String(formData.children));
      formData.childAges.forEach((age) => {
        formDataObj.append("childAges", String(age));
      });
      if (formData.bedType) {
        formDataObj.append("bedType", formData.bedType);
      }
      // Always append roomType from selectedRoomType prop (the one clicked on hotel details page)
      const roomTypeToSend = currentRoomType || "standard";
      formDataObj.append("roomType", roomTypeToSend);
      formDataObj.append("meals", String(formData.meals));
      formDataObj.append("transport", String(formData.transport));
      if (formData.notes) {
        formDataObj.append("notes", formData.notes);
      }
      if (paymentMethod) {
        formDataObj.append("paymentMethod", paymentMethod);
      }

      const result = await createHotelBookingAction({}, formDataObj);

      if (result?.data) {
        setOpen(false);
        // Reset form
        setPaymentMethod(null);
        setFormData({
          customerName: user?.name || "",
          customerEmail: user?.email || "",
          customerPhone: user?.phone || "",
          customerNationality: "",
          checkInDate: "",
          checkOutDate: "",
          rooms: 1,
          adults: 1,
          children: 0,
          childAges: [],
          bedType: "",
          meals: false,
          transport: false,
          notes: "",
        });
        // Redirect to thank you page
        router.push("/thank-you?type=hotel");
      } else {
        // Handle different error formats
        let errorMessage = "Failed to submit booking. Please try again.";
        
        if (result?.error) {
          if (Array.isArray(result.error.message)) {
            errorMessage = result.error.message[0];
          } else if (typeof result.error.message === 'string') {
            errorMessage = result.error.message;
          } else if (typeof result.error === 'object') {
            // Handle fieldErrors format
            const fieldErrors = Object.values(result.error).flat();
            if (fieldErrors.length > 0) {
              errorMessage = Array.isArray(fieldErrors[0]) ? fieldErrors[0][0] : String(fieldErrors[0]);
            }
          }
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateChildAges = () => {
    const ages: number[] = [];
    for (let i = 0; i < formData.children; i++) {
      const ageInput = document.getElementById(`childAge-${i}`) as HTMLInputElement;
      if (ageInput && ageInput.value) {
        ages.push(Number(ageInput.value));
      }
    }
    setFormData({ ...formData, childAges: ages });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Hotel: {hotelName}</DialogTitle>
        </DialogHeader>
        
        {!paymentMethod ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">Please select your preferred payment method:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  paymentMethod === "cash" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Pay in Cash
                  </CardTitle>
                  <CardDescription>
                    Visit our office to complete payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Fill out the booking form and visit our office to make the payment in person. An invoice will be sent to your email.
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  paymentMethod === "online" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setPaymentMethod("online")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Pay Online
                  </CardTitle>
                  <CardDescription>
                    Secure online payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Complete your booking and payment securely online.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : paymentMethod === "online" ? (
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Online Payment:</strong> Payment gateway integration will be added here. 
                For now, please use the "Pay in Cash" option to complete your booking.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setPaymentMethod(null)}>
                Back
              </Button>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone *</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerNationality">Nationality</Label>
              <Input
                id="customerNationality"
                value={formData.customerNationality}
                onChange={(e) => setFormData({ ...formData, customerNationality: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="checkInDate">Check-in Date *</Label>
              <Input
                id="checkInDate"
                type="date"
                value={formData.checkInDate}
                onChange={(e) => {
                  setFormData({ ...formData, checkInDate: e.target.value });
                  // Reset check-out date if it's before new check-in date
                  if (formData.checkOutDate && e.target.value && new Date(formData.checkOutDate) <= new Date(e.target.value)) {
                    setFormData({ ...formData, checkInDate: e.target.value, checkOutDate: '' });
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <Label htmlFor="checkOutDate">Check-out Date *</Label>
              <Input
                id="checkOutDate"
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                min={formData.checkInDate || undefined}
                required
              />
            </div>
            <div>
              <Label htmlFor="rooms">Rooms *</Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                max="10"
                value={formData.rooms}
                onChange={(e) => {
                  const inputValue = e.target.value === '' ? 1 : Number(e.target.value);
                  const value = Math.max(1, Math.min(10, inputValue || 1));
                  setFormData({ ...formData, rooms: value });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="adults">Adults *</Label>
              <Input
                id="adults"
                type="number"
                min="1"
                max="20"
                value={formData.adults}
                onChange={(e) => {
                  const inputValue = e.target.value === '' ? 1 : Number(e.target.value);
                  const value = Math.max(1, Math.min(20, inputValue || 1));
                  setFormData({ ...formData, adults: value });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="children">Children</Label>
              <Input
                id="children"
                type="number"
                min="0"
                max="10"
                value={formData.children}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  const children = Math.max(0, Math.min(10, value || 0));
                  setFormData({ ...formData, children });
                  // Update child ages after state update
                  setTimeout(() => {
                    const ages: number[] = [];
                    for (let i = 0; i < children; i++) {
                      const ageInput = document.getElementById(`childAge-${i}`) as HTMLInputElement;
                      if (ageInput && ageInput.value) {
                        ages.push(Number(ageInput.value));
                      }
                    }
                    setFormData(prev => ({ ...prev, childAges: ages }));
                  }, 0);
                }}
              />
            </div>
            {formData.children > 0 && (
              <div className="md:col-span-2">
                <Label>Child Ages</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {Array.from({ length: formData.children }).map((_, i) => (
                    <Input
                      key={i}
                      id={`childAge-${i}`}
                      type="number"
                      min="0"
                      max="16"
                      placeholder={`Child ${i + 1} age`}
                      value={formData.childAges[i] || ''}
                      onChange={(e) => {
                        const age = e.target.value === '' ? 0 : Number(e.target.value);
                        const newAges = [...formData.childAges];
                        newAges[i] = age;
                        setFormData({ ...formData, childAges: newAges });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Display selected room type (read-only) */}
            <div>
              <Label>Selected Room Type</Label>
              <div className="w-full px-3 py-2 border rounded-md bg-gray-50">
                {currentRoomType === 'deluxe' && hotel?.deluxeRoomPrice && (
                  <span className="font-medium">Deluxe Room - PKR {hotel.deluxeRoomPrice.toLocaleString()}/night</span>
                )}
                {currentRoomType === 'family' && hotel?.familySuitPrice && (
                  <span className="font-medium">Family Suite - PKR {hotel.familySuitPrice.toLocaleString()}/night</span>
                )}
                {(currentRoomType === 'standard' || (!hotel?.deluxeRoomPrice && !hotel?.familySuitPrice)) && hotel?.standardRoomPrice && (
                  <span className="font-medium">Standard Room - PKR {hotel.standardRoomPrice.toLocaleString()}/night</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Selected from hotel details page</p>
            </div>
            <div>
              <Label htmlFor="bedType">Bed Type</Label>
              <select
                id="bedType"
                value={formData.bedType}
                onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select bed type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="twin">Twin</option>
                <option value="triple">Triple</option>
                <option value="quad">Quad</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Additional Services</Label>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.meals}
                    onChange={(e) => setFormData({ ...formData, meals: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-medium">Meals</span>
                </div>
                {hotel?.mealsPrice && (
                  <span className="text-sm text-gray-600">
                    PKR {hotel.mealsPrice.toLocaleString()} per room per night
                  </span>
                )}
              </label>
              <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.transport}
                    onChange={(e) => setFormData({ ...formData, transport: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-medium">Transport</span>
                </div>
                {hotel?.transportPrice && (
                  <span className="text-sm text-gray-600">
                    PKR {hotel.transportPrice.toLocaleString()}
                  </span>
                )}
              </label>
            </div>
          </div>
          
          {/* Price Preview */}
          {formData.checkInDate && formData.checkOutDate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Estimated Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  PKR {calculatePricePreview().toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setPaymentMethod(null)}>
              Back
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Booking"
              )}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

