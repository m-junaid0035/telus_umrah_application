"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import { createUmrahPackageAction } from "@/actions/packageActions";
import { fetchAllHotelsAction } from "@/actions/hotelActions";
import { fetchAllFeaturesAction } from "@/actions/featureActions";
import { fetchAllItinerariesAction } from "@/actions/itinerariesActions";
import { fetchAllIncludesAction } from "@/actions/includeActions";
import { fetchAllExcludesAction } from "@/actions/excludeActions";
import { fetchAllPoliciesAction } from "@/actions/policyActions";

// Types
export interface IHotel { _id: string; name: string; type: "Makkah" | "Madina"; location: string; star: number; }
export interface IFeature { _id: string; feature_text: string; createdAt: string; updatedAt: string; }
export interface IItinerary { _id: string; day_start: number; day_end?: number; title: string; description: string; createdAt: string; updatedAt: string; }
export interface IInclude { _id: string; include_text: string; createdAt: string; updatedAt: string; }
export interface IExclude { _id: string; exclude_text: string; createdAt: string; updatedAt: string; }
export interface IPolicy { _id: string; heading: string; description: string; createdAt: string; updatedAt: string; }

interface FieldErrors { [key: string]: string[]; }
interface FormState { error?: FieldErrors | { message?: string[] }; data?: any; }

const initialState: FormState = { error: {} };

export default function CreateUmrahPackageForm() {
  const router = useRouter();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [itineraries, setItineraries] = useState<IItinerary[]>([]);
  const [includes, setIncludes] = useState<IInclude[]>([]);
  const [excludes, setExcludes] = useState<IExclude[]>([]);
  const [policies, setPolicies] = useState<IPolicy[]>([]);

  const [formState, setFormState] = useState<FormState>(initialState);
  const [isPending, setIsPending] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [hotelsRes, featuresRes, itinerariesRes, includesRes, excludesRes, policiesRes] = await Promise.all([
          fetchAllHotelsAction(),
          fetchAllFeaturesAction(),
          fetchAllItinerariesAction(),
          fetchAllIncludesAction(),
          fetchAllExcludesAction(),
          fetchAllPoliciesAction()
        ]);

        if (hotelsRes?.data) setHotels(hotelsRes.data);
        if (featuresRes?.data) setFeatures(featuresRes.data);
        if (itinerariesRes?.data) setItineraries(itinerariesRes.data);
        if (includesRes?.data) setIncludes(includesRes.data);
        if (excludesRes?.data) setExcludes(excludesRes.data);
        if (policiesRes?.data) setPolicies(policiesRes.data);
      } catch {
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
      }
    };
    loadData();
  }, []);

 const errorFor = (field: string) => {
  if (!formState.error || typeof formState.error !== "object") return null;
  const errors = formState.error as Record<string, string[]>;
  return errors[field]?.[0] ?? null;
};


  const makkahHotels = hotels.filter(h => h.type === "Makkah");
  const madinahHotels = hotels.filter(h => h.type === "Madina");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setFormState({ error: {} });

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createUmrahPackageAction(formState, formData);
      if (res?.data) {
        setSuccessDialogOpen(true);
        e.currentTarget.reset();
      } else {
        setFormState(res);
      }
    } catch {
      toast({ title: "Error", description: "Failed to create package", variant: "destructive" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="border-none text-center">
          <CardTitle>Create Umrah Package</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {/* Package Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Package Name</Label>
              <Input id="name" name="name" required className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("name") && <p className="text-sm text-red-500">{errorFor("name")}</p>}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" required className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("price") && <p className="text-sm text-red-500">{errorFor("price")}</p>}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input id="duration" name="duration" type="number" required className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("duration") && <p className="text-sm text-red-500">{errorFor("duration")}</p>}
            </div>

            {/* Airline */}
            <div className="space-y-2">
              <Label htmlFor="airline">Airline</Label>
              <Input id="airline" name="airline" required className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Departure City */}
            <div className="space-y-2">
              <Label htmlFor="departureCity">Departure City</Label>
              <Input id="departureCity" name="departureCity" required className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Badge */}
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input id="badge" name="badge" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" type="url" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Travelers */}
            <div className="space-y-2">
              <Label htmlFor="travelers">Travelers</Label>
              <Input id="travelers" name="travelers" type="number" required className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input id="rating" name="rating" type="number" min={0} max={5} step={0.1} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Reviews */}
            <div className="space-y-2">
              <Label htmlFor="reviews">Reviews Count</Label>
              <Input id="reviews" name="reviews" type="number" min={0} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Popular */}
            <div className="space-y-2">
              <Label htmlFor="popular">Popular</Label>
              <Input id="popular" name="popular" type="checkbox" />
            </div>

            {/* Hotels */}
            <div className="space-y-2">
              <Label htmlFor="makkahHotel">Makkah Hotel</Label>
              <select id="makkahHotel" name="hotels[makkah]" required className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <option value="">Select Makkah Hotel</option>
                {makkahHotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>

              <Label htmlFor="madinahHotel">Madinah Hotel</Label>
              <select id="madinahHotel" name="hotels[madinah]" required className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <option value="">Select Madinah Hotel</option>
                {madinahHotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>
            </div>

            {/* Multi-select fields */}
            <div className="space-y-2">
              <Label htmlFor="features">Features</Label>
              <select id="features" name="features[]" multiple className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                {features.map(f => <option key={f._id} value={f._id}>{f.feature_text}</option>)}
              </select>

              <Label htmlFor="itineraries">Itineraries</Label>
              <select id="itineraries" name="itinerary[]" multiple className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                {itineraries.map(f => <option key={f._id} value={f._id}>{f.title}</option>)}
              </select>

              <Label htmlFor="includes">Includes</Label>
              <select id="includes" name="includes[]" multiple className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                {includes.map(f => <option key={f._id} value={f._id}>{f.include_text}</option>)}
              </select>

              <Label htmlFor="excludes">Excludes</Label>
              <select id="excludes" name="excludes[]" multiple className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                {excludes.map(f => <option key={f._id} value={f._id}>{f.exclude_text}</option>)}
              </select>

              <Label htmlFor="policies">Policies</Label>
              <select id="policies" name="policies[]" multiple className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
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
                {isPending ? "Creating..." : "Create Package"}
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
          <p>Package created successfully!</p>
          <DialogFooter>
            <Button onClick={() => { setSuccessDialogOpen(false); router.push("/admin/packages"); }}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
