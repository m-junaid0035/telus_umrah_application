"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select, { MultiValue } from "react-select";
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

import { createUmrahPackageAction } from "@/actions/packageActions";
import { fetchAllHotelsAction } from "@/actions/hotelActions";
import { fetchAllFeaturesAction } from "@/actions/featureActions";
import { fetchAllItinerariesAction } from "@/actions/itinerariesActions";
import { fetchAllIncludesAction } from "@/actions/includeActions";
import { fetchAllExcludesAction } from "@/actions/excludeActions";
import { fetchAllPoliciesAction } from "@/actions/policyActions";

// Types
export interface IHotel {
  _id: string;
  name: string;
  type: "Makkah" | "Madina";
  location: string;
  star: number;
}
export interface IFeature {
  _id: string;
  feature_text: string;
}
export interface IItinerary {
  _id: string;
  day_start: number;
  day_end?: number;
  title: string;
  description: string;
}
export interface IInclude {
  _id: string;
  include_text: string;
}
export interface IExclude {
  _id: string;
  exclude_text: string;
}
export interface IPolicy {
  _id: string;
  heading: string;
  description: string;
}

interface FieldErrors {
  [key: string]: string[];
}
interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

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

  // ✅ Properly typed states for react-select
  const [selectedFeatures, setSelectedFeatures] = useState<{ value: string; label: string }[]>([]);
  const [selectedItineraries, setSelectedItineraries] = useState<{ value: string; label: string }[]>([]);
  const [selectedIncludes, setSelectedIncludes] = useState<{ value: string; label: string }[]>([]);
  const [selectedExcludes, setSelectedExcludes] = useState<{ value: string; label: string }[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<{ value: string; label: string }[]>([]);

  const [formState, setFormState] = useState<FormState>(initialState);
  const [isPending, setIsPending] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          hotelsRes,
          featuresRes,
          itinerariesRes,
          includesRes,
          excludesRes,
          policiesRes,
        ] = await Promise.all([
          fetchAllHotelsAction(),
          fetchAllFeaturesAction(),
          fetchAllItinerariesAction(),
          fetchAllIncludesAction(),
          fetchAllExcludesAction(),
          fetchAllPoliciesAction(),
        ]);

        if (hotelsRes?.data) setHotels(hotelsRes.data);
        if (featuresRes?.data) setFeatures(featuresRes.data);
        if (itinerariesRes?.data) setItineraries(itinerariesRes.data);
        if (includesRes?.data) setIncludes(includesRes.data);
        if (excludesRes?.data) setExcludes(excludesRes.data);
        if (policiesRes?.data) setPolicies(policiesRes.data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, []);

  const errorFor = (field: string) => {
    if (!formState.error || typeof formState.error !== "object") return null;
    const errors = formState.error as Record<string, string[]>;
    return errors[field]?.[0] ?? null;
  };

  const makkahHotels = hotels.filter((h) => h.type === "Makkah");
  const madinahHotels = hotels.filter((h) => h.type === "Madina");

  // ✅ Submit handler with FormData appending for selected options
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setFormState({ error: {} });

    const formData = new FormData(e.currentTarget);

    // Append manually for react-select values
    selectedFeatures.forEach((f) => formData.append("features[]", f.value));
    selectedItineraries.forEach((i) => formData.append("itinerary[]", i.value));
    selectedIncludes.forEach((i) => formData.append("includes[]", i.value));
    selectedExcludes.forEach((e) => formData.append("excludes[]", e.value));
    selectedPolicies.forEach((p) => formData.append("policies[]", p.value));

    // ✅ Handle checkbox properly
    const popularCheckbox = e.currentTarget.querySelector<HTMLInputElement>("#popular");
    formData.set("popular", popularCheckbox?.checked ? "true" : "false");

    try {
      const res = await createUmrahPackageAction(formState, formData);
      if (res?.data) {
        setSuccessDialogOpen(true);
        e.currentTarget.reset();
        setSelectedFeatures([]);
        setSelectedItineraries([]);
        setSelectedIncludes([]);
        setSelectedExcludes([]);
        setSelectedPolicies([]);
      } else {
        setFormState(res);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create package",
        variant: "destructive",
      });
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
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="name">Package Name</Label>
              <Input id="name" name="name" required />
              {errorFor("name") && <p className="text-sm text-red-500">{errorFor("name")}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" required />
              </div>
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input id="duration" name="duration" type="number" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline">Airline</Label>
                <Input id="airline" name="airline" required />
              </div>
              <div>
                <Label htmlFor="departureCity">Departure City</Label>
                <Input id="departureCity" name="departureCity" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="badge">Badge</Label>
                <Input id="badge" name="badge" />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" type="url" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="travelers">Travelers</Label>
                <Input id="travelers" name="travelers" type="number" required />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input id="rating" name="rating" type="number" step="0.1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reviews">Reviews Count</Label>
                <Input id="reviews" name="reviews" type="number" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input id="popular" name="popular" type="checkbox" />
                <Label htmlFor="popular">Popular</Label>
              </div>
            </div>

            {/* Hotels */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="makkahHotel">Makkah Hotel</Label>
                <select id="makkahHotel" name="hotels[makkah]" required className="border p-2 w-full rounded-md">
                  <option value="">Select Makkah Hotel</option>
                  {makkahHotels.map((h) => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="madinahHotel">Madinah Hotel</Label>
                <select id="madinahHotel" name="hotels[madinah]" required className="border p-2 w-full rounded-md">
                  <option value="">Select Madinah Hotel</option>
                  {madinahHotels.map((h) => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Multi Selects */}
            <div className="space-y-4">
              <div>
                <Label>Features</Label>
                <Select
                  isMulti
                  options={features.map((f) => ({ value: f._id, label: f.feature_text }))}
                  value={selectedFeatures}
                  onChange={(newValue) => setSelectedFeatures([...newValue] as { value: string; label: string }[])}
                />
              </div>

              <div>
                <Label>Itineraries</Label>
                <Select
                  isMulti
                  options={itineraries.map((i) => ({ value: i._id, label: i.title }))}
                  value={selectedItineraries}
                  onChange={(newValue) => setSelectedItineraries([...newValue] as { value: string; label: string }[])}
                />
              </div>

              <div>
                <Label>Includes</Label>
                <Select
                  isMulti
                  options={includes.map((i) => ({ value: i._id, label: i.include_text }))}
                  value={selectedIncludes}
                  onChange={(newValue) => setSelectedIncludes([...newValue] as { value: string; label: string }[])}
                />
              </div>

              <div>
                <Label>Excludes</Label>
                <Select
                  isMulti
                  options={excludes.map((e) => ({ value: e._id, label: e.exclude_text }))}
                  value={selectedExcludes}
                  onChange={(newValue) => setSelectedExcludes([...newValue] as { value: string; label: string }[])}
                />
              </div>

              <div>
                <Label>Policies</Label>
                <Select
                  isMulti
                  options={policies.map((p) => ({ value: p._id, label: p.heading }))}
                  value={selectedPolicies}
                  onChange={(newValue) => setSelectedPolicies([...newValue] as { value: string; label: string }[])}
                />
              </div>
            </div>

            <CardFooter className="flex justify-end border-none pt-4">
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
