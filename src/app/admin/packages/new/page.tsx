"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select, { StylesConfig } from "react-select";
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
import { ImageUpload } from "@/components/admin/ImageUpload";

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
type ReactSelectOption = { value: string; label: string };

const multiSelectStyles: StylesConfig<ReactSelectOption, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1e293b",
    color: "#fff",
    borderColor: state.isFocused ? "#2563eb" : "#334155",
    borderRadius: "0.75rem",
    minHeight: "46px",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1e293b",
    color: "#fff",
    zIndex: 30,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#334155" : "#1e293b",
    color: "#fff",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#334155",
    color: "#fff",
    borderRadius: 9999,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#fff",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#0f172a",
    ":hover": {
      backgroundColor: "#cbd5f5",
      color: "#0f172a",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#475569",
  }),
  input: (base) => ({
    ...base,
    color: "#0f172a",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#0f172a",
  }),
};

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
  const [selectedFeatures, setSelectedFeatures] = useState<ReactSelectOption[]>([]);
  const [selectedItineraries, setSelectedItineraries] = useState<ReactSelectOption[]>([]);
  const [selectedIncludes, setSelectedIncludes] = useState<ReactSelectOption[]>([]);
  const [selectedExcludes, setSelectedExcludes] = useState<ReactSelectOption[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<ReactSelectOption[]>([]);

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
    departureFlight: "",
    departureSector: "",
    departureDepartureTime: "",
    departureArrivalTime: "",
    arrivalFlight: "",
    arrivalSector: "",
    arrivalDepartureTime: "",
    arrivalArrivalTime: "",
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
        departureFlight: formState.formData.flights?.departure?.flight || "",
        departureSector: formState.formData.flights?.departure?.sector || "",
        departureDepartureTime: formState.formData.flights?.departure?.departureTime || "",
        departureArrivalTime: formState.formData.flights?.departure?.arrivalTime || "",
        arrivalFlight: formState.formData.flights?.arrival?.flight || "",
        arrivalSector: formState.formData.flights?.arrival?.sector || "",
        arrivalDepartureTime: formState.formData.flights?.arrival?.departureTime || "",
        arrivalArrivalTime: formState.formData.flights?.arrival?.arrivalTime || "",
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

    // Add image URL from state (ImageUpload component doesn't use form input)
    if (formValues.image) {
      formData.set("image", formValues.image);
    }

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
          departureFlight: "",
          departureSector: "",
          departureDepartureTime: "",
          departureArrivalTime: "",
          arrivalFlight: "",
          arrivalSector: "",
          arrivalDepartureTime: "",
          arrivalArrivalTime: "",
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

            {/* Flights */}
            <div className="rounded-xl border bg-slate-900 border-slate-700 p-4 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-white">Flight Schedule</h3>
                <p className="text-sm text-white/80">Pakistan to KSA and return</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-800 p-4 border border-slate-700">
                  <h4 className="font-semibold text-white mb-3">Departure (Pakistan → KSA)</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="departureFlight">Flight</Label>
                      <Input
                        id="departureFlight"
                        name="flights[departure][flight]"
                        value={formValues.departureFlight}
                        onChange={(e) => setFormValues({ ...formValues, departureFlight: e.target.value })}
                        aria-invalid={errorFor("flights.departure.flight") ? "true" : "false"}
                      />
                      {errorFor("flights.departure.flight") && (
                        <p className="text-sm text-red-500">{errorFor("flights.departure.flight")}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="departureSector">Sector</Label>
                      <Input
                        id="departureSector"
                        name="flights[departure][sector]"
                        value={formValues.departureSector}
                        onChange={(e) => setFormValues({ ...formValues, departureSector: e.target.value })}
                        aria-invalid={errorFor("flights.departure.sector") ? "true" : "false"}
                      />
                      {errorFor("flights.departure.sector") && (
                        <p className="text-sm text-red-500">{errorFor("flights.departure.sector")}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="departureDepartureTime">Departure</Label>
                      <Input
                        id="departureDepartureTime"
                        name="flights[departure][departureTime]"
                        placeholder="e.g., 25-DEC 21:25"
                        value={formValues.departureDepartureTime}
                        onChange={(e) => setFormValues({ ...formValues, departureDepartureTime: e.target.value })}
                        aria-invalid={errorFor("flights.departure.departureTime") ? "true" : "false"}
                      />
                      {errorFor("flights.departure.departureTime") && (
                        <p className="text-sm text-red-500">{errorFor("flights.departure.departureTime")}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="departureArrivalTime">Arrival</Label>
                      <Input
                        id="departureArrivalTime"
                        name="flights[departure][arrivalTime]"
                        placeholder="e.g., 26-DEC 01:35"
                        value={formValues.departureArrivalTime}
                        onChange={(e) => setFormValues({ ...formValues, departureArrivalTime: e.target.value })}
                        aria-invalid={errorFor("flights.departure.arrivalTime") ? "true" : "false"}
                      />
                      {errorFor("flights.departure.arrivalTime") && (
                        <p className="text-sm text-red-500">{errorFor("flights.departure.arrivalTime")}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-800 p-4 border border-slate-700">
                  <h4 className="font-semibold text-white mb-3">Arrival (KSA → Pakistan)</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="arrivalFlight">Flight</Label>
                      <Input
                        id="arrivalFlight"
                        name="flights[arrival][flight]"
                        value={formValues.arrivalFlight}
                        onChange={(e) => setFormValues({ ...formValues, arrivalFlight: e.target.value })}
                        aria-invalid={errorFor("flights.arrival.flight") ? "true" : "false"}
                      />
                      {errorFor("flights.arrival.flight") && (
                        <p className="text-sm text-red-500">{errorFor("flights.arrival.flight")}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="arrivalSector">Sector</Label>
                      <Input
                        id="arrivalSector"
                        name="flights[arrival][sector]"
                        value={formValues.arrivalSector}
                        onChange={(e) => setFormValues({ ...formValues, arrivalSector: e.target.value })}
                        aria-invalid={errorFor("flights.arrival.sector") ? "true" : "false"}
                      />
                      {errorFor("flights.arrival.sector") && (
                        <p className="text-sm text-red-500">{errorFor("flights.arrival.sector")}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="arrivalDepartureTime">Departure</Label>
                      <Input
                        id="arrivalDepartureTime"
                        name="flights[arrival][departureTime]"
                        placeholder="e.g., 14-JAN 02:50"
                        value={formValues.arrivalDepartureTime}
                        onChange={(e) => setFormValues({ ...formValues, arrivalDepartureTime: e.target.value })}
                        aria-invalid={errorFor("flights.arrival.departureTime") ? "true" : "false"}
                      />
                      {errorFor("flights.arrival.departureTime") && (
                        <p className="text-sm text-red-500">{errorFor("flights.arrival.departureTime")}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="arrivalArrivalTime">Arrival</Label>
                      <Input
                        id="arrivalArrivalTime"
                        name="flights[arrival][arrivalTime]"
                        placeholder="e.g., 14-JAN 09:40"
                        value={formValues.arrivalArrivalTime}
                        onChange={(e) => setFormValues({ ...formValues, arrivalArrivalTime: e.target.value })}
                        aria-invalid={errorFor("flights.arrival.arrivalTime") ? "true" : "false"}
                      />
                      {errorFor("flights.arrival.arrivalTime") && (
                        <p className="text-sm text-red-500">{errorFor("flights.arrival.arrivalTime")}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
              <ImageUpload
                value={formValues.image}
                onChange={(url) => setFormValues({ ...formValues, image: url })}
                folder="packages"
                label="Package Image"
                error={errorFor("image") || undefined}
              />
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
            <div className="rounded-xl border bg-slate-900 border-slate-700 p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white mb-2 block text-sm font-medium">Makkah Hotel</label>
                  <select 
                    id="makkahHotel" 
                    name="hotels[makkah]" 
                    required 
                    value={formValues.makkahHotel}
                    onChange={(e) => setFormValues({ ...formValues, makkahHotel: e.target.value })}
                    aria-invalid={errorFor("hotels.makkah") ? "true" : "false"}
                    className={`border border-slate-700 bg-slate-800 text-white p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                      errorFor("hotels.makkah") ? "border-red-500 border-2" : ""
                    }`}
                    style={{ backgroundColor: "#1e293b", color: "#fff" }}
                  >
                    <option value="" style={{ backgroundColor: "#1e293b", color: "#fff" }}>Select Makkah Hotel</option>
                    {makkahHotels.map((h) => (
                      <option key={h._id} value={h._id} style={{ backgroundColor: "#1e293b", color: "#fff" }}>{h.name}</option>
                    ))}
                  </select>
                  {errorFor("hotels.makkah") && <p className="text-sm text-red-500">{errorFor("hotels.makkah")}</p>}
                </div>

                <div>
                  <label className="text-white mb-2 block text-sm font-medium">Madinah Hotel</label>
                  <select 
                    id="madinahHotel" 
                    name="hotels[madinah]" 
                    required 
                    value={formValues.madinahHotel}
                    onChange={(e) => setFormValues({ ...formValues, madinahHotel: e.target.value })}
                    aria-invalid={errorFor("hotels.madinah") ? "true" : "false"}
                    className={`border border-slate-700 bg-slate-800 text-white p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                      errorFor("hotels.madinah") ? "border-red-500 border-2" : ""
                    }`}
                    style={{ backgroundColor: "#1e293b", color: "#fff" }}
                  >
                    <option value="" style={{ backgroundColor: "#1e293b", color: "#fff" }}>Select Madinah Hotel</option>
                    {madinahHotels.map((h) => (
                      <option key={h._id} value={h._id} style={{ backgroundColor: "#1e293b", color: "#fff" }}>{h.name}</option>
                    ))}
                  </select>
                  {errorFor("hotels.madinah") && <p className="text-sm text-red-500">{errorFor("hotels.madinah")}</p>}
                </div>
              </div>
            </div>

            {/* Multi Selects */}
            <div className="rounded-xl border bg-slate-900 border-slate-700 p-4 space-y-4">
              <div>
                <Label className="text-white mb-2 block">Features</Label>
                <Select
                  styles={multiSelectStyles}
                  isMulti
                  options={features.map((f) => ({ value: f._id, label: f.feature_text }))}
                  value={selectedFeatures}
                  onChange={(newValue) => setSelectedFeatures([...(newValue as ReactSelectOption[])])}
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Itineraries</Label>
                <Select
                  styles={multiSelectStyles}
                  isMulti
                  options={itineraries.map((i) => ({ value: i._id, label: i.title }))}
                  value={selectedItineraries}
                  onChange={(newValue) => setSelectedItineraries([...(newValue as ReactSelectOption[])])}
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Includes</Label>
                <Select
                  styles={multiSelectStyles}
                  isMulti
                  options={includes.map((i) => ({ value: i._id, label: i.include_text }))}
                  value={selectedIncludes}
                  onChange={(newValue) => setSelectedIncludes([...(newValue as ReactSelectOption[])])}
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Excludes</Label>
                <Select
                  styles={multiSelectStyles}
                  isMulti
                  options={excludes.map((e) => ({ value: e._id, label: e.exclude_text }))}
                  value={selectedExcludes}
                  onChange={(newValue) => setSelectedExcludes([...(newValue as ReactSelectOption[])])}
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Policies</Label>
                <Select
                  styles={multiSelectStyles}
                  isMulti
                  options={policies.map((p) => ({ value: p._id, label: p.heading }))}
                  value={selectedPolicies}
                  onChange={(newValue) => setSelectedPolicies([...(newValue as ReactSelectOption[])])}
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
