"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { ImageUpload } from "@/components/admin/ImageUpload";

interface FieldErrors {
  [key: string]: string[];
}
interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}
const initialState: FormState = { error: {} };

interface IHotel {
  _id: string;
  name: string;
  type: "Makkah" | "Madina";
}
interface IFeature {
  _id: string;
  feature_text: string;
}
interface IItinerary {
  _id: string;
  title: string;
}
interface IInclude {
  _id: string;
  include_text: string;
}
interface IExclude {
  _id: string;
  exclude_text: string;
}
interface IPolicy {
  _id: string;
  heading: string;
}

type ReactSelectOption = { value: string; label: string };

const multiSelectStyles: StylesConfig<ReactSelectOption, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#0f172a",
    borderColor: state.isFocused ? "#2563eb" : "rgba(15, 23, 42, 0.25)",
    borderRadius: "0.75rem",
    minHeight: "46px",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#0f172a",
    zIndex: 30,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#e0f2fe" : "#fff",
    color: "#0f172a",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    borderRadius: 9999,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#0f172a",
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

export default function EditUmrahPackageForm() {
  const { id } = useParams();
  const router = useRouter();
  const packageId = id as string;

  const [formState, setFormState] = useState<FormState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [itineraries, setItineraries] = useState<IItinerary[]>([]);
  const [includes, setIncludes] = useState<IInclude[]>([]);
  const [excludes, setExcludes] = useState<IExclude[]>([]);
  const [policies, setPolicies] = useState<IPolicy[]>([]);
  const [pkgData, setPkgData] = useState<any>(null);

  const [selectedFeatures, setSelectedFeatures] = useState<ReactSelectOption[]>([]);
  const [selectedItineraries, setSelectedItineraries] = useState<ReactSelectOption[]>([]);
  const [selectedIncludes, setSelectedIncludes] = useState<ReactSelectOption[]>([]);
  const [selectedExcludes, setSelectedExcludes] = useState<ReactSelectOption[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<ReactSelectOption[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  const errorFor = (field: string) =>
    formState.error && typeof formState.error === "object"
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  useEffect(() => {
    const loadData = async () => {
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

        if (pkgRes?.data) {
          const pkg = pkgRes.data;
          setPkgData(pkg);
          setImageUrl(pkg.image || "");

          setSelectedFeatures(pkg.features.map((f: any) => ({ value: f._id || f, label: f.feature_text || "" })));
          setSelectedItineraries(pkg.itinerary.map((i: any) => ({ value: i._id || i, label: i.title || "" })));
          setSelectedIncludes(pkg.includes.map((i: any) => ({ value: i._id || i, label: i.include_text || "" })));
          setSelectedExcludes(pkg.excludes.map((e: any) => ({ value: e._id || e, label: e.exclude_text || "" })));
          setSelectedPolicies(pkg.policies.map((p: any) => ({ value: p._id || p, label: p.heading || "" })));
        }

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
  }, [packageId]);

  if (!pkgData) {
    return <p className="text-center text-gray-500 mt-10">Loading package...</p>;
  }

  const makkahHotels = hotels.filter((h) => h.type === "Makkah");
  const madinahHotels = hotels.filter((h) => h.type === "Madina");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setFormState({ error: {} });

    const formData = new FormData(e.currentTarget);
    formData.set("image", imageUrl);
    selectedFeatures.forEach((f) => formData.append("features", f.value));
    selectedItineraries.forEach((i) => formData.append("itinerary", i.value));
    selectedIncludes.forEach((i) => formData.append("includes", i.value));
    selectedExcludes.forEach((e) => formData.append("excludes", e.value));
    selectedPolicies.forEach((p) => formData.append("policies", p.value));

    const popularCheckbox = e.currentTarget.querySelector<HTMLInputElement>("#popular");
    formData.set("popular", popularCheckbox?.checked ? "true" : "false");

    try {
      const res = await updateUmrahPackageAction(formState, packageId, formData);
      if (res?.data) {
        setSuccessDialogOpen(true);
      } else {
        setFormState(res);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="text-center">
          <CardTitle>Edit Umrah Package</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div>
              <Label htmlFor="name">Package Name</Label>
              <Input id="name" name="name" defaultValue={pkgData.name} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" defaultValue={pkgData.price} required />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" name="duration" type="number" defaultValue={pkgData.duration} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline">Airline</Label>
                <Input id="airline" name="airline" defaultValue={pkgData.airline} required />
              </div>
              <div>
                <Label htmlFor="departureCity">Departure City</Label>
                <Input id="departureCity" name="departureCity" defaultValue={pkgData.departureCity} required />
              </div>
            </div>

            <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 p-4 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Flight Schedule</h3>
                <p className="text-sm text-slate-600">Pakistan to KSA and return</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-800 mb-3">Departure (Pakistan → KSA)</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="departureFlight">Flight</Label>
                      <Input
                        id="departureFlight"
                        name="flights[departure][flight]"
                        defaultValue={pkgData.flights?.departure?.flight}
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
                        defaultValue={pkgData.flights?.departure?.sector}
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
                        defaultValue={pkgData.flights?.departure?.departureTime}
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
                        defaultValue={pkgData.flights?.departure?.arrivalTime}
                        aria-invalid={errorFor("flights.departure.arrivalTime") ? "true" : "false"}
                      />
                      {errorFor("flights.departure.arrivalTime") && (
                        <p className="text-sm text-red-500">{errorFor("flights.departure.arrivalTime")}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-800 mb-3">Arrival (KSA → Pakistan)</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="arrivalFlight">Flight</Label>
                      <Input
                        id="arrivalFlight"
                        name="flights[arrival][flight]"
                        defaultValue={pkgData.flights?.arrival?.flight}
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
                        defaultValue={pkgData.flights?.arrival?.sector}
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
                        defaultValue={pkgData.flights?.arrival?.departureTime}
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
                        defaultValue={pkgData.flights?.arrival?.arrivalTime}
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
              <Input id="badge" name="badge" defaultValue={pkgData.badge} />
            </div>

            <div>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                folder="packages"
                label="Package Image"
                error={errorFor("image") || undefined}
              />
            </div>

            <div>
              <Label htmlFor="travelers">Travelers</Label>
              <Input id="travelers" name="travelers" type="number" defaultValue={pkgData.travelers} required />
            </div>

            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input id="rating" name="rating" type="number" step="0.1" defaultValue={pkgData.rating} />
            </div>

            <div>
              <Label htmlFor="reviews">Reviews Count</Label>
              <Input id="reviews" name="reviews" type="number" defaultValue={pkgData.reviews} />
            </div>

            <div className="flex items-center gap-2">
              <input id="popular" name="popular" type="checkbox" defaultChecked={pkgData.popular} />
              <Label htmlFor="popular">Popular</Label>
            </div>

            {/* Hotels */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Makkah Hotel</Label>
                <select
                  id="makkahHotel"
                  name="hotels[makkah]"
                  defaultValue={
                    pkgData.hotels?.makkah 
                      ? (typeof pkgData.hotels.makkah === 'object' && pkgData.hotels.makkah._id 
                          ? pkgData.hotels.makkah._id 
                          : String(pkgData.hotels.makkah))
                      : ""
                  }
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select</option>
                  {makkahHotels.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Madinah Hotel</Label>
                <select
                  id="madinahHotel"
                  name="hotels[madinah]"
                  defaultValue={
                    pkgData.hotels?.madinah 
                      ? (typeof pkgData.hotels.madinah === 'object' && pkgData.hotels.madinah._id 
                          ? pkgData.hotels.madinah._id 
                          : String(pkgData.hotels.madinah))
                      : ""
                  }
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select</option>
                  {madinahHotels.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Multi-select fields */}
            <div>
              <Label>Features</Label>
              <Select
                styles={multiSelectStyles}
                isMulti
                options={features.map((f) => ({ value: f._id, label: f.feature_text }))}
                value={selectedFeatures}
                onChange={(newVal) => setSelectedFeatures([...(newVal as ReactSelectOption[])])}
              />
            </div>

            <div>
              <Label>Itinerary</Label>
              <Select
                styles={multiSelectStyles}
                isMulti
                options={itineraries.map((i) => ({ value: i._id, label: i.title }))}
                value={selectedItineraries}
                onChange={(newVal) => setSelectedItineraries([...(newVal as ReactSelectOption[])])}
              />
            </div>

            <div>
              <Label>Includes</Label>
              <Select
                styles={multiSelectStyles}
                isMulti
                options={includes.map((i) => ({ value: i._id, label: i.include_text }))}
                value={selectedIncludes}
                onChange={(newVal) => setSelectedIncludes([...(newVal as ReactSelectOption[])])}
              />
            </div>

            <div>
              <Label>Excludes</Label>
              <Select
                styles={multiSelectStyles}
                isMulti
                options={excludes.map((e) => ({ value: e._id, label: e.exclude_text }))}
                value={selectedExcludes}
                onChange={(newVal) => setSelectedExcludes([...(newVal as ReactSelectOption[])])}
              />
            </div>

            <div>
              <Label>Policies</Label>
              <Select
                styles={multiSelectStyles}
                isMulti
                options={policies.map((p) => ({ value: p._id, label: p.heading }))}
                value={selectedPolicies}
                onChange={(newVal) => setSelectedPolicies([...(newVal as ReactSelectOption[])])}
              />
            </div>

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Updating..." : "Update Package"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

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
