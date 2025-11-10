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

import {
  fetchUmrahPackageByIdAction,
  updateUmrahPackageAction,
} from "@/actions/packageActions";

import { fetchAllHotelsAction } from "@/actions/hotelActions";
import { fetchAllFeaturesAction } from "@/actions/featureActions";
import { fetchAllItinerariesAction } from "@/actions/itinerariesActions";
import { fetchAllIncludesAction } from "@/actions/includeActions";
import { fetchAllExcludesAction } from "@/actions/excludeActions";
import { fetchAllPoliciesAction } from "@/actions/policyActions";

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

interface IHotel {
  _id: string;
  name: string;
  type: "Makkah" | "Madina";
  location: string;
  star: number;
}

interface IUmrahPackage {
  _id: string;
  name: string;
  price: number;
  duration: number;
  airline: string;
  departureCity: string;
  badge?: string;
  image?: string;
  travelers: number;
  rating?: number;
  reviews?: number;
  popular?: boolean;
  hotels: { makkah?: string; madinah?: string };
  features: string[];
  itinerary: string[];
  includes: string[];
  excludes: string[];
  policies: string[];
}

export default function EditUmrahPackageForm() {
  const { id } = useParams();
  const router = useRouter();
  const packageId = id as string;

  const [packageData, setPackageData] = useState<IUmrahPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [features, setFeatures] = useState<{ _id: string; feature_text: string }[]>([]);
  const [itineraries, setItineraries] = useState<{ _id: string; title: string }[]>([]);
  const [includes, setIncludes] = useState<{ _id: string; include_text: string }[]>([]);
  const [excludes, setExcludes] = useState<{ _id: string; exclude_text: string }[]>([]);
  const [policies, setPolicies] = useState<{ _id: string; heading: string }[]>([]);

  const initialState: FormState = { error: {} };

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      return await updateUmrahPackageAction(prevState, packageId, formData);
    },
    initialState
  );

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [
          pkgRes,
          hotelsRes,
          featuresRes,
          itinerariesRes,
          includesRes,
          excludesRes,
          policiesRes,
        ] = await Promise.all([
          fetchUmrahPackageByIdAction(packageId),
          fetchAllHotelsAction(),
          fetchAllFeaturesAction(),
          fetchAllItinerariesAction(),
          fetchAllIncludesAction(),
          fetchAllExcludesAction(),
          fetchAllPoliciesAction(),
        ]);

        if (pkgRes?.data) setPackageData(pkgRes.data);
        if (hotelsRes?.data) setHotels(hotelsRes.data);
        if (featuresRes?.data) setFeatures(featuresRes.data);
        if (itinerariesRes?.data) setItineraries(itinerariesRes.data);
        if (includesRes?.data) setIncludes(includesRes.data);
        if (excludesRes?.data) setExcludes(excludesRes.data);
        if (policiesRes?.data) setPolicies(policiesRes.data);
      } catch {
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [packageId]);

  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description: (formState.error as any).message?.[0] || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formState]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading package data...</div>;
  }

  if (!packageData) {
    return <p className="text-center text-red-500">Package not found.</p>;
  }

  const makkahHotels = hotels.filter(h => h.type === "Makkah");
  const madinahHotels = hotels.filter(h => h.type === "Madina");

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="border-none text-center">
          <CardTitle>Edit Umrah Package</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={dispatch} className="space-y-6 max-w-2xl mx-auto">
            {/* Package Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={packageData.name}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("name") && <p className="text-sm text-red-500">{errorFor("name")}</p>}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                required
                defaultValue={packageData.price}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("price") && <p className="text-sm text-red-500">{errorFor("price")}</p>}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                required
                defaultValue={packageData.duration}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("duration") && <p className="text-sm text-red-500">{errorFor("duration")}</p>}
            </div>

            {/* Airline */}
            <div className="space-y-2">
              <Label htmlFor="airline">Airline</Label>
              <Input
                id="airline"
                name="airline"
                required
                defaultValue={packageData.airline}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Departure City */}
            <div className="space-y-2">
              <Label htmlFor="departureCity">Departure City</Label>
              <Input
                id="departureCity"
                name="departureCity"
                required
                defaultValue={packageData.departureCity}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Badge */}
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                name="badge"
                defaultValue={packageData.badge}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                defaultValue={packageData.image}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Travelers */}
            <div className="space-y-2">
              <Label htmlFor="travelers">Travelers</Label>
              <Input
                id="travelers"
                name="travelers"
                type="number"
                required
                defaultValue={packageData.travelers}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                defaultValue={packageData.rating}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Reviews */}
            <div className="space-y-2">
              <Label htmlFor="reviews">Reviews Count</Label>
              <Input
                id="reviews"
                name="reviews"
                type="number"
                min={0}
                defaultValue={packageData.reviews}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Popular */}
            <div className="space-y-2">
              <Label htmlFor="popular">Popular</Label>
              <Input
                id="popular"
                name="popular"
                type="checkbox"
                defaultChecked={packageData.popular}
              />
            </div>

            {/* Hotels */}
            <div className="space-y-2">
              <Label htmlFor="makkahHotel">Makkah Hotel</Label>
              <select
                id="makkahHotel"
                name="hotels[makkah]"
                required
                defaultValue={packageData.hotels?.makkah || ""}
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                <option value="">Select Makkah Hotel</option>
                {makkahHotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>

              <Label htmlFor="madinahHotel">Madinah Hotel</Label>
              <select
                id="madinahHotel"
                name="hotels[madinah]"
                required
                defaultValue={packageData.hotels?.madinah || ""}
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                <option value="">Select Madinah Hotel</option>
                {madinahHotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>
            </div>

            {/* Multi-select fields */}
            <div className="space-y-2">
              <Label htmlFor="features">Features</Label>
              <select
                id="features"
                name="features[]"
                multiple
                defaultValue={packageData.features || []}
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                {features.map(f => <option key={f._id} value={f._id}>{f.feature_text}</option>)}
              </select>

              <Label htmlFor="itineraries">Itineraries</Label>
              <select
                id="itineraries"
                name="itinerary[]"
                multiple
                defaultValue={packageData.itinerary || []}
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                {itineraries.map(f => <option key={f._id} value={f._id}>{f.title}</option>)}
              </select>

              <Label htmlFor="includes">Includes</Label>
              <select
                id="includes"
                name="includes[]"
                multiple
                defaultValue={packageData.includes || []}
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                {includes.map(f => <option key={f._id} value={f._id}>{f.include_text}</option>)}
              </select>

              <Label htmlFor="excludes">Excludes</Label>
              <select
                id="excludes"
                name="excludes[]"
                multiple
                defaultValue={packageData.excludes || []}
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                {excludes.map(f => <option key={f._id} value={f._id}>{f.exclude_text}</option>)}
              </select>

              <Label htmlFor="policies">Policies</Label>
              <select
                id="policies"
                name="policies[]"
                multiple
                defaultValue={packageData.policies || []}
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                {policies.map(f => <option key={f._id} value={f._id}>{f.heading}</option>)}
              </select>
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">{(formState.error as any).message?.[0]}</p>
            )}

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Updating..." : "Update Package"}
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
          <p>Package updated successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/packages");
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
