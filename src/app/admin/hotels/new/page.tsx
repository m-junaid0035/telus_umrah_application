"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
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

import { createHotelAction } from "@/actions/hotelActions";
import { HotelType } from "@/types/hotel";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
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

export default function CreateHotelForm() {
  const router = useRouter();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([""]);
  const [selectedBedTypes, setSelectedBedTypes] = useState<string[]>([]);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      return await createHotelAction(prevState, formData);
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

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="border-none text-center">
          <CardTitle>Create Hotel</CardTitle>
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter hotel description..."
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
              />
              {errorFor("distance") && (
                <p className="text-sm text-red-500">{errorFor("distance")}</p>
              )}
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
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="+966 12 345 6789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact[email]">Email</Label>
                <Input
                  id="contact[email]"
                  name="contact[email]"
                  type="email"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="hotel@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact[address]">Address</Label>
                <Textarea
                  id="contact[address]"
                  name="contact[address]"
                  rows={2}
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="Full address of the hotel"
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
                {isPending ? "Creating..." : "Create Hotel"}
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
          <p>Hotel created successfully!</p>
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
