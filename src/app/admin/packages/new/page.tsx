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
  formData?: any; // Preserve form data when validation fails
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

  // Form field values for data preservation
  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    duration: "",
    badge: "",
    airline: "",
    departureCity: "",
    image: "",
    travelers: "",
    rating: "",
    reviews: "",
    popular: false,
    makkahHotel: "",
    madinahHotel: "",
  });

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
    // Handle nested field errors (e.g., "hotels.makkah")
    return errors[field]?.[0] ?? null;
  };

  // Restore form data when validation fails
  useEffect(() => {
    if (formState.formData) {
      setFormValues({
        name: formState.formData.name || "",
        price: formState.formData.price?.toString() || "",
        duration: formState.formData.duration?.toString() || "",
        badge: formState.formData.badge || "",
        airline: formState.formData.airline || "",
        departureCity: formState.formData.departureCity || "",
        image: formState.formData.image || "",
        travelers: formState.formData.travelers || "",
        rating: formState.formData.rating?.toString() || "",
        reviews: formState.formData.reviews?.toString() || "",
        popular: formState.formData.popular || false,
        makkahHotel: formState.formData.hotels?.makkah || "",
        madinahHotel: formState.formData.hotels?.madinah || "",
      });
      
      // Restore selected options if they exist in formData
      if (formState.formData.features && formState.formData.features.length > 0) {
        const featureOptions = formState.formData.features.map((f: string) => {
          const feature = features.find(feat => feat._id === f);
          return feature ? { value: feature._id, label: feature.feature_text } : null;
        }).filter(Boolean) as { value: string; label: string }[];
        if (featureOptions.length > 0) setSelectedFeatures(featureOptions);
      }
      
      if (formState.formData.itinerary && formState.formData.itinerary.length > 0) {
        const itineraryOptions = formState.formData.itinerary.map((i: string) => {
          const itinerary = itineraries.find(it => it._id === i);
          return itinerary ? { value: itinerary._id, label: itinerary.title } : null;
        }).filter(Boolean) as { value: string; label: string }[];
        if (itineraryOptions.length > 0) setSelectedItineraries(itineraryOptions);
      }
      
      if (formState.formData.includes && formState.formData.includes.length > 0) {
        const includeOptions = formState.formData.includes.map((i: string) => {
          const include = includes.find(inc => inc._id === i);
          return include ? { value: include._id, label: include.include_text } : null;
        }).filter(Boolean) as { value: string; label: string }[];
        if (includeOptions.length > 0) setSelectedIncludes(includeOptions);
      }
      
      if (formState.formData.excludes && formState.formData.excludes.length > 0) {
        const excludeOptions = formState.formData.excludes.map((e: string) => {
          const exclude = excludes.find(ex => ex._id === e);
          return exclude ? { value: exclude._id, label: exclude.exclude_text } : null;
        }).filter(Boolean) as { value: string; label: string }[];
        if (excludeOptions.length > 0) setSelectedExcludes(excludeOptions);
      }
      
      if (formState.formData.policies && formState.formData.policies.length > 0) {
        const policyOptions = formState.formData.policies.map((p: string) => {
          const policy = policies.find(pol => pol._id === p);
          return policy ? { value: policy._id, label: policy.heading } : null;
        }).filter(Boolean) as { value: string; label: string }[];
        if (policyOptions.length > 0) setSelectedPolicies(policyOptions);
      }
    }
  }, [formState.formData, features, itineraries, includes, excludes, policies]);

  const makkahHotels = hotels.filter((h) => h.type === "Makkah");
  const madinahHotels = hotels.filter((h) => h.type === "Madina");

  // ✅ Submit handler with FormData appending for selected options
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setFormState({ error: {} });

    const formData = new FormData(e.currentTarget);

    // Append manually for react-select values
    selectedFeatures.forEach((f) => formData.append("features", f.value));
    selectedItineraries.forEach((i) => formData.append("itinerary", i.value));
    selectedIncludes.forEach((i) => formData.append("includes", i.value));
    selectedExcludes.forEach((e) => formData.append("excludes", e.value));
    selectedPolicies.forEach((p) => formData.append("policies", p.value));

    // ✅ Handle checkbox properly
    const popularCheckbox = e.currentTarget.querySelector<HTMLInputElement>("#popular");
    formData.set("popular", popularCheckbox?.checked ? "true" : "false");

    try {
      const res = await createUmrahPackageAction(formState, formData);
      if (res?.data) {
        setSuccessDialogOpen(true);
        e.currentTarget.reset();
        setFormValues({
          name: "",
          price: "",
          duration: "",
          badge: "",
          airline: "",
          departureCity: "",
          image: "",
          travelers: "",
          rating: "",
          reviews: "",
          popular: false,
          makkahHotel: "",
          madinahHotel: "",
        });
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
              <Input 
                id="name" 
                name="name" 
                required 
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                aria-invalid={errorFor("name") ? "true" : "false"}
              />
              {errorFor("name") && <p className="text-sm text-red-500">{errorFor("name")}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  required 
                  value={formValues.price}
                  onChange={(e) => setFormValues({ ...formValues, price: e.target.value })}
                  aria-invalid={errorFor("price") ? "true" : "false"}
                />
                {errorFor("price") && <p className="text-sm text-red-500">{errorFor("price")}</p>}
              </div>
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  type="number" 
                  required 
                  value={formValues.duration}
                  onChange={(e) => setFormValues({ ...formValues, duration: e.target.value })}
                  aria-invalid={errorFor("duration") ? "true" : "false"}
                />
                {errorFor("duration") && <p className="text-sm text-red-500">{errorFor("duration")}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline">Airline</Label>
                <Input 
                  id="airline" 
                  name="airline" 
                  required 
                  value={formValues.airline}
                  onChange={(e) => setFormValues({ ...formValues, airline: e.target.value })}
                  aria-invalid={errorFor("airline") ? "true" : "false"}
                />
                {errorFor("airline") && <p className="text-sm text-red-500">{errorFor("airline")}</p>}
              </div>
              <div>
                <Label htmlFor="departureCity">Departure City</Label>
                <Input 
                  id="departureCity" 
                  name="departureCity" 
                  required 
                  value={formValues.departureCity}
                  onChange={(e) => setFormValues({ ...formValues, departureCity: e.target.value })}
                  aria-invalid={errorFor("departureCity") ? "true" : "false"}
                />
                {errorFor("departureCity") && <p className="text-sm text-red-500">{errorFor("departureCity")}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="badge">Badge</Label>
                <Input 
                  id="badge" 
                  name="badge" 
                  value={formValues.badge}
                  onChange={(e) => setFormValues({ ...formValues, badge: e.target.value })}
                  aria-invalid={errorFor("badge") ? "true" : "false"}
                />
                {errorFor("badge") && <p className="text-sm text-red-500">{errorFor("badge")}</p>}
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image" 
                  name="image" 
                  type="url" 
                  value={formValues.image}
                  onChange={(e) => setFormValues({ ...formValues, image: e.target.value })}
                  aria-invalid={errorFor("image") ? "true" : "false"}
                />
                {errorFor("image") && <p className="text-sm text-red-500">{errorFor("image")}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="travelers">Travelers</Label>
                <Input 
                  id="travelers" 
                  name="travelers" 
                  type="number" 
                  required 
                  value={formValues.travelers}
                  onChange={(e) => setFormValues({ ...formValues, travelers: e.target.value })}
                  aria-invalid={errorFor("travelers") ? "true" : "false"}
                />
                {errorFor("travelers") && <p className="text-sm text-red-500">{errorFor("travelers")}</p>}
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input 
                  id="rating" 
                  name="rating" 
                  type="number" 
                  step="0.1" 
                  value={formValues.rating}
                  onChange={(e) => setFormValues({ ...formValues, rating: e.target.value })}
                  aria-invalid={errorFor("rating") ? "true" : "false"}
                />
                {errorFor("rating") && <p className="text-sm text-red-500">{errorFor("rating")}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reviews">Reviews Count</Label>
                <Input 
                  id="reviews" 
                  name="reviews" 
                  type="number" 
                  value={formValues.reviews}
                  onChange={(e) => setFormValues({ ...formValues, reviews: e.target.value })}
                  aria-invalid={errorFor("reviews") ? "true" : "false"}
                />
                {errorFor("reviews") && <p className="text-sm text-red-500">{errorFor("reviews")}</p>}
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input 
                  id="popular" 
                  name="popular" 
                  type="checkbox" 
                  checked={formValues.popular}
                  onChange={(e) => setFormValues({ ...formValues, popular: e.target.checked })}
                />
                <Label htmlFor="popular">Popular</Label>
              </div>
            </div>

            {/* Hotels */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="makkahHotel">Makkah Hotel</Label>
                <select 
                  id="makkahHotel" 
                  name="hotels[makkah]" 
                  required 
                  value={formValues.makkahHotel}
                  onChange={(e) => setFormValues({ ...formValues, makkahHotel: e.target.value })}
                  aria-invalid={errorFor("hotels.makkah") ? "true" : "false"}
                  className={`border p-2 w-full rounded-md ${
                    errorFor("hotels.makkah") ? "border-red-500 border-2" : ""
                  }`}
                >
                  <option value="">Select Makkah Hotel</option>
                  {makkahHotels.map((h) => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
                {errorFor("hotels.makkah") && <p className="text-sm text-red-500">{errorFor("hotels.makkah")}</p>}
              </div>

              <div>
                <Label htmlFor="madinahHotel">Madinah Hotel</Label>
                <select 
                  id="madinahHotel" 
                  name="hotels[madinah]" 
                  required 
                  value={formValues.madinahHotel}
                  onChange={(e) => setFormValues({ ...formValues, madinahHotel: e.target.value })}
                  aria-invalid={errorFor("hotels.madinah") ? "true" : "false"}
                  className={`border p-2 w-full rounded-md ${
                    errorFor("hotels.madinah") ? "border-red-500 border-2" : ""
                  }`}
                >
                  <option value="">Select Madinah Hotel</option>
                  {madinahHotels.map((h) => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
                {errorFor("hotels.madinah") && <p className="text-sm text-red-500">{errorFor("hotels.madinah")}</p>}
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
