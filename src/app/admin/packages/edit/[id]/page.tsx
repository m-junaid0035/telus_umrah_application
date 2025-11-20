"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Select from "react-select";
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

  const [selectedFeatures, setSelectedFeatures] = useState<{ value: string; label: string }[]>([]);
  const [selectedItineraries, setSelectedItineraries] = useState<{ value: string; label: string }[]>([]);
  const [selectedIncludes, setSelectedIncludes] = useState<{ value: string; label: string }[]>([]);
  const [selectedExcludes, setSelectedExcludes] = useState<{ value: string; label: string }[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<{ value: string; label: string }[]>([]);

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

            <div>
              <Label htmlFor="badge">Badge</Label>
              <Input id="badge" name="badge" defaultValue={pkgData.badge} />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" type="url" defaultValue={pkgData.image} />
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
                isMulti
                options={features.map((f) => ({ value: f._id, label: f.feature_text }))}
                value={selectedFeatures}
                onChange={(newVal) => setSelectedFeatures([...newVal] as { value: string; label: string }[])}
              />
            </div>

            <div>
              <Label>Itinerary</Label>
              <Select
                isMulti
                options={itineraries.map((i) => ({ value: i._id, label: i.title }))}
                value={selectedItineraries}
                onChange={(newVal) => setSelectedItineraries([...newVal] as { value: string; label: string }[])}
              />
            </div>

            <div>
              <Label>Includes</Label>
              <Select
                isMulti
                options={includes.map((i) => ({ value: i._id, label: i.include_text }))}
                value={selectedIncludes}
                onChange={(newVal) => setSelectedIncludes([...newVal] as { value: string; label: string }[])}
              />
            </div>

            <div>
              <Label>Excludes</Label>
              <Select
                isMulti
                options={excludes.map((e) => ({ value: e._id, label: e.exclude_text }))}
                value={selectedExcludes}
                onChange={(newVal) => setSelectedExcludes([...newVal] as { value: string; label: string }[])}
              />
            </div>

            <div>
              <Label>Policies</Label>
              <Select
                isMulti
                options={policies.map((p) => ({ value: p._id, label: p.heading }))}
                value={selectedPolicies}
                onChange={(newVal) => setSelectedPolicies([...newVal] as { value: string; label: string }[])}
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
