"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { fetchHotelByIdAction, updateHotelAction } from "@/actions/hotelActions";
import { HotelType } from "@/types/hotel";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
  formData?: any; // Preserve form data when validation fails
}

const initialState: FormState = {
  error: {},
};

const bedTypeOptions = [
  { value: "single", label: "Single Bed" },
  { value: "double", label: "Double Bed" },
  { value: "twin", label: "Twin Beds" },
  { value: "triple", label: "Triple Beds" },
  { value: "quad", label: "Quad Room" },
];

export default function EditHotelForm() {
  const { id } = useParams();
  const router = useRouter();
  const hotelId = id as string;

  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([""]);
  const [selectedBedTypes, setSelectedBedTypes] = useState<string[]>([]);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      return await updateHotelAction(prevState, hotelId, formData);
    },
    initialState
  );

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  useEffect(() => {
    async function loadHotel() {
      const res = await fetchHotelByIdAction(hotelId);
      if (res.data) {
        setHotel(res.data);
        setAmenities(res.data.amenities && res.data.amenities.length > 0 ? res.data.amenities : [""]);
        setImages(res.data.images && res.data.images.length > 0 ? res.data.images : [""]);
        setSelectedBedTypes(res.data.availableBedTypes || []);
      }
      setLoading(false);
    }
    loadHotel();
  }, [hotelId]);

  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description:
          (formState.error as any).message?.[0] || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formState]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading hotel data...</div>
    );
  }

  if (!hotel) {
    return <p className="text-center text-red-500">Hotel not found.</p>;
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="border-none text-center">
          <CardTitle>Edit Hotel</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            action={(formData) => {
              // Filter out empty amenities and images before submission
              amenities.forEach((amenity) => {
                if (amenity.trim()) {
                  formData.append("amenities", amenity.trim());
                }
              });
              images.forEach((image) => {
                if (image.trim()) {
                  formData.append("images", image.trim());
                }
              });
              dispatch(formData);
            }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            {/* Hotel Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name</Label>
              <Input
                id="name"
                name="name"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                defaultValue={hotel.name}
              />
              {errorFor("name") && (
                <p className="text-sm text-red-500">{errorFor("name")}</p>
              )}
            </div>

            {/* Hotel Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Hotel Type</Label>
              <select
                id="type"
                name="type"
                className="w-full rounded-md border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2"
                defaultValue={hotel.type}
                required
              >
                {Object.values(HotelType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errorFor("type") && (
                <p className="text-sm text-red-500">{errorFor("type")}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                defaultValue={hotel.location}
              />
              {errorFor("location") && (
                <p className="text-sm text-red-500">{errorFor("location")}</p>
              )}
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <Label htmlFor="star">Star Rating</Label>
              <Input
                id="star"
                name="star"
                type="number"
                min={1}
                max={5}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                defaultValue={hotel.star}
              />
              {errorFor("star") && (
                <p className="text-sm text-red-500">{errorFor("star")}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700 text-black dark:text-black"
                placeholder="Enter hotel description..."
                defaultValue={hotel.description || ""}
              />
              {errorFor("description") && (
                <p className="text-sm text-red-500">{errorFor("description")}</p>
              )}
            </div>

            {/* Distance */}
            <div className="space-y-2">
              <Label htmlFor="distance">Distance from Haram/Masjid</Label>
              <Input
                id="distance"
                name="distance"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="e.g., 300m from Haram, Walking Distance to Masjid Nabawi"
                defaultValue={hotel.distance || ""}
              />
              {errorFor("distance") && (
                <p className="text-sm text-red-500">{errorFor("distance")}</p>
              )}
            </div>

            {/* Room Prices */}
            <div className="space-y-4 border-t pt-4">
              <Label className="text-lg font-semibold">Room Prices (PKR)</Label>
              <div className="space-y-2">
                <Label htmlFor="standardRoomPrice">Standard Room Price</Label>
                <Input
                  id="standardRoomPrice"
                  name="standardRoomPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="Enter price for standard room"
                  defaultValue={hotel.standardRoomPrice || ""}
                />
                {errorFor("standardRoomPrice") && (
                  <p className="text-sm text-red-500">{errorFor("standardRoomPrice")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deluxeRoomPrice">Deluxe Room Price</Label>
                <Input
                  id="deluxeRoomPrice"
                  name="deluxeRoomPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="Enter price for deluxe room"
                  defaultValue={hotel.deluxeRoomPrice || ""}
                />
                {errorFor("deluxeRoomPrice") && (
                  <p className="text-sm text-red-500">{errorFor("deluxeRoomPrice")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="familySuitPrice">Family Suite Price</Label>
                <Input
                  id="familySuitPrice"
                  name="familySuitPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="Enter price for family suite"
                  defaultValue={hotel.familySuitPrice || ""}
                />
                {errorFor("familySuitPrice") && (
                  <p className="text-sm text-red-500">{errorFor("familySuitPrice")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="transportPrice">Transport Price (PKR)</Label>
                <Input
                  id="transportPrice"
                  name="transportPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="Enter price for transport service"
                  defaultValue={hotel.transportPrice || ""}
                />
                {errorFor("transportPrice") && (
                  <p className="text-sm text-red-500">{errorFor("transportPrice")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mealsPrice">Meals Price per Room per Night (PKR)</Label>
                <Input
                  id="mealsPrice"
                  name="mealsPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="Enter price for meals per room per night"
                  defaultValue={hotel.mealsPrice || ""}
                />
                {errorFor("mealsPrice") && (
                  <p className="text-sm text-red-500">{errorFor("mealsPrice")}</p>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <Label>Amenities</Label>
              {amenities.map((amenity, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={amenity}
                    onChange={(e) => {
                      const newAmenities = [...amenities];
                      newAmenities[index] = e.target.value;
                      setAmenities(newAmenities);
                    }}
                    className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                    placeholder="Enter amenity (e.g., Free WiFi, Air Conditioning)"
                  />
                  {amenities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setAmenities(amenities.filter((_, i) => i !== index));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmenities([...amenities, ""])}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Amenity
              </Button>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>Image URLs</Label>
              {images.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="url"
                    value={image}
                    onChange={(e) => {
                      const newImages = [...images];
                      newImages[index] = e.target.value;
                      setImages(newImages);
                    }}
                    className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                    placeholder="Enter image URL"
                  />
                  {images.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setImages(images.filter((_, i) => i !== index));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setImages([...images, ""])}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image URL
              </Button>
            </div>

            {/* Available Bed Types */}
            <div className="space-y-2">
              <Label>Available Bed Types</Label>
              <div className="grid grid-cols-2 gap-2">
                {bedTypeOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`bedType-${option.value}`}
                      checked={selectedBedTypes.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBedTypes([...selectedBedTypes, option.value]);
                        } else {
                          setSelectedBedTypes(selectedBedTypes.filter((t) => t !== option.value));
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={`bedType-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedBedTypes.map((bedType) => (
                <input
                  key={bedType}
                  type="hidden"
                  name="availableBedTypes"
                  value={bedType}
                />
              ))}
            </div>

            {/* Contact Information */}
            <div className="space-y-4 border-t pt-4">
              <Label className="text-lg font-semibold">Contact Information</Label>
              <div className="space-y-2">
                <Label htmlFor="contact[phone]">Phone</Label>
                <Input
                  id="contact[phone]"
                  name="contact[phone]"
                  type="tel"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="966123456789 (digits only)"
                  defaultValue={hotel.contact?.phone || ""}
                  onKeyDown={(e) => {
                    // Prevent non-numeric characters (except backspace, delete, tab, arrow keys)
                    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    // Remove non-digit characters
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                  maxLength={15}
                />
                {errorFor("contact.phone") && (
                  <p className="text-sm text-red-500">{errorFor("contact.phone")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact[email]">Email</Label>
                <Input
                  id="contact[email]"
                  name="contact[email]"
                  type="email"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="hotel@example.com"
                  defaultValue={hotel.contact?.email || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact[address]">Address</Label>
                <Textarea
                  id="contact[address]"
                  name="contact[address]"
                  rows={2}
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700 text-black dark:text-black"
                  placeholder="Full address of the hotel"
                  defaultValue={hotel.contact?.address || ""}
                />
              </div>
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as any).message?.[0]}
              </p>
            )}

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Updating..." : "Update Hotel"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Hotel updated successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/hotels");
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
