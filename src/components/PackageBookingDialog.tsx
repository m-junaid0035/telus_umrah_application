"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPackageBookingAction } from "@/actions/packageBookingActions";
import { toast } from "@/hooks/use-toast";
import { Loader2, CreditCard, DollarSign, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CountryCodeSelector, countries as COUNTRY_LIST, Country } from "@/components/CountryCodeSelector";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface PackageBookingDialogProps {
  packageId: string;
  packageName: string;
  trigger: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export function PackageBookingDialog({ packageId, packageName, trigger, user }: PackageBookingDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // kept for backend compatibility; values will be derived from family head on submit
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: user?.phone || "",
    customerNationality: "",
    adults: 1,
    children: 0,
    infants: 0,
    childAges: [] as number[],
    rooms: 1,
    notes: "",
  });
  
  // Traveler details state (UI only)
  type AdultDetail = {
    name: string;
    gender: "male" | "female" | "";
    nationality: string;
    passportNumber: string;
    age: number | "";
        phone?: string; // required only for family head
  };
  type ChildDetail = {
    name: string;
    gender: "male" | "female" | "";
    nationality: string;
    passportNumber: string;
    age: number | "";
  };
  type InfantDetail = {
    name: string;
    gender: "male" | "female" | "";
    nationality: string;
    passportNumber: string;
    age: number | "";
  };

  const [adultsDetails, setAdultsDetails] = useState<AdultDetail[]>([{ 
    name: user?.name || "",
    gender: "",
    nationality: "",
    passportNumber: "",
    age: "",
    phone: user?.phone || ""
  }]);
  const [childrenDetails, setChildrenDetails] = useState<ChildDetail[]>([]);
  const [infantsDetails, setInfantsDetails] = useState<InfantDetail[]>([]);
  const [familyHeadIndex, setFamilyHeadIndex] = useState<number>(0);
  const [headCountry, setHeadCountry] = useState<Country>(COUNTRY_LIST[4]);

  // Inline country selector used for nationality fields
  function CountrySelect({ value, onChange, placeholder }: { value?: string; onChange: (c: string) => void; placeholder?: string }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const current = COUNTRY_LIST.find((c) => c.code.toLowerCase() === String(value || "").toLowerCase()) || null;
    const filtered = COUNTRY_LIST.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()) || c.dialCode.includes(search)
    );

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
          {current ? (
            <>
              <span className={`fi fi-${current.flagCode} h-5 w-7`}></span>
              <span className="text-sm text-gray-700">{current.name}</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">{placeholder || 'Select country'}</span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 max-h-80 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-lg p-2">
          <input
            className="w-full p-2 mb-2 border rounded text-sm"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filtered.map((c) => (
            <DropdownMenuItem key={c.code} onClick={() => { onChange(c.code); setOpen(false); setSearch(''); }} className="flex items-center gap-3 px-2 py-2 hover:bg-blue-50 cursor-pointer">
              <span className={`fi fi-${c.flagCode} h-5 w-7`}></span>
              <div className="flex-1 text-sm">
                <div className="font-medium text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-500">{c.dialCode} • {c.code}</div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  const [errors, setErrors] = useState<{
    email?: string;
    adultsCount?: string;
    childrenCount?: string;
    infantsCount?: string;
    rooms?: string;
    familyHead?: string;
    adults?: Array<{ name?: string; nationality?: string; passportNumber?: string; gender?: string; age?: string; phone?: string }>;
    children?: Array<{ name?: string; nationality?: string; passportNumber?: string; gender?: string; age?: string }>;
    infants?: Array<{ name?: string; nationality?: string; passportNumber?: string; gender?: string; age?: string }>;
  }>({});

  // Utility: Count stepper (no manual typing)
  function CountStepper({
    value,
    onChange,
    min,
    max,
  }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
    return (
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => onChange(Math.max(min, value - 1))} aria-label="decrease">
          <Minus className="h-4 w-4" />
        </Button>
        <Input value={value} readOnly className="w-20 text-center select-none" />
        <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => onChange(Math.min(max, value + 1))} aria-label="increase">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Keep children ages in sync with child details for backend compatibility
  const childAgesFromDetails = useMemo(() => {
    return childrenDetails.map((c) => (c.age === "" ? 0 : Number(c.age)));
  }, [childrenDetails]);

  // Keep infant ages in sync
  const infantAgesFromDetails = useMemo(() => {
    return infantsDetails.map((c) => (c.age === "" ? 0 : Number(c.age)));
  }, [infantsDetails]);

  // Accordion open values (always open)
  const adultsAccordionValues = useMemo(() => adultsDetails.map((_, i) => `adult-${i}`), [adultsDetails]);
  const childrenAccordionValues = useMemo(() => childrenDetails.map((_, i) => `child-${i}`), [childrenDetails]);
  const infantsAccordionValues = useMemo(() => infantsDetails.map((_, i) => `infant-${i}`), [infantsDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nextErrors: typeof errors = {};
      // Email validation
      if (!formData.customerEmail) {
        nextErrors.email = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.customerEmail)) {
          nextErrors.email = "Please enter a valid email";
        }
      }
      // Counts
      if (formData.adults < 1) nextErrors.adultsCount = "At least one adult is required";
      if (formData.children < 0) nextErrors.childrenCount = "Children cannot be negative";
      if (formData.infants < 0) nextErrors.infantsCount = "Infants cannot be negative";
      if (formData.rooms < 1) nextErrors.rooms = "At least one room is required";
      // Family head
      if (familyHeadIndex < 0 || familyHeadIndex >= adultsDetails.length) {
        nextErrors.familyHead = "Please select a family head";
      }
      // Adults
      nextErrors.adults = adultsDetails.map((a, i) => {
        const e: { name?: string; nationality?: string; passportNumber?: string; gender?: string; age?: string; phone?: string } = {};
        if (!a.name) e.name = "Required";
        if (!a.nationality) e.nationality = "Required";
        if (!a.passportNumber || !/[A-Za-z0-9]{6,}/.test(a.passportNumber)) e.passportNumber = "Min 6 alphanumeric";
        if (!a.gender) e.gender = "Select gender";
        // Age required for adults and must be >=12
        const ageNum = a.age === "" ? NaN : Number(a.age);
        if (isNaN(ageNum)) e.age = "Age required";
        else if (ageNum < 12 || ageNum > 120) e.age = "Adult age must be 12 years or older";
        if (familyHeadIndex === i && !a.phone) e.phone = "Phone required for head";
        return e;
      });
      // Children
      nextErrors.children = childrenDetails.map((c) => {
        const e: { name?: string; nationality?: string; passportNumber?: string; gender?: string; age?: string } = {};
        if (!c.name) e.name = "Required";
        if (!c.nationality) e.nationality = "Required";
        if (!c.passportNumber || !/[A-Za-z0-9]{6,}/.test(c.passportNumber)) e.passportNumber = "Min 6 alphanumeric";
        if (!c.gender) e.gender = "Select gender";
        const ageNum = c.age === "" ? NaN : Number(c.age);
        if (isNaN(ageNum)) e.age = "Age required"; else if (ageNum < 2 || ageNum > 11) e.age = "Child age must be 2–11 years";
        return e;
      });
      // Infants
      nextErrors.infants = infantsDetails.map((c) => {
        const e: { name?: string; nationality?: string; passportNumber?: string; gender?: string; age?: string } = {};
        if (!c.name) e.name = "Required";
        if (!c.nationality) e.nationality = "Required";
        if (!c.passportNumber || !/[A-Za-z0-9]{6,}/.test(c.passportNumber)) e.passportNumber = "Min 6 alphanumeric";
        if (!c.gender) e.gender = "Select gender";
        const ageNum = c.age === "" ? NaN : Number(c.age);
        if (isNaN(ageNum)) e.age = "Age required"; else if (ageNum < 0 || ageNum > 23) e.age = "Infant age must be 0–23 months";
        return e;
      });

      // If any errors exist, block submit
      const hasFieldErrors =
        nextErrors.email ||
        nextErrors.adultsCount ||
        nextErrors.childrenCount ||
        nextErrors.infantsCount ||
        nextErrors.rooms ||
        nextErrors.familyHead ||
        (nextErrors.adults && nextErrors.adults.some((e) => Object.keys(e).length > 0)) ||
        (nextErrors.children && nextErrors.children.some((e) => Object.keys(e).length > 0)) ||
        (nextErrors.infants && nextErrors.infants.some((e) => Object.keys(e).length > 0));

      if (hasFieldErrors) {
        setErrors(nextErrors);
        toast({ title: "Please fix the highlighted fields", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      setErrors({});
      // Basic validation according to new requirements
      if (formData.adults < 1) {
        toast({ title: "Validation", description: "At least one adult is required.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      if (familyHeadIndex < 0 || familyHeadIndex >= adultsDetails.length) {
        toast({ title: "Validation", description: "Please select a family head among adults.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      // Validate adults
      for (let i = 0; i < adultsDetails.length; i++) {
        const a = adultsDetails[i];
        if (!a.name || !a.nationality || !a.passportNumber || !a.gender || a.age === "") {
          toast({ title: "Validation", description: `Please complete all fields for Adult ${i + 1}.`, variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
      }
      // Validate family head phone
      const head = adultsDetails[familyHeadIndex];
      if (!head.phone) {
        toast({ title: "Validation", description: "Phone number is required for the family head.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      // Validate children
      for (let i = 0; i < childrenDetails.length; i++) {
        const c = childrenDetails[i];
        if (!c.name || !c.nationality || !c.passportNumber || !c.gender || c.age === "") {
          toast({ title: "Validation", description: `Please complete all fields for Child ${i + 1}.`, variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
      }

      // Validate infants
      for (let i = 0; i < infantsDetails.length; i++) {
        const c = infantsDetails[i];
        if (!c.name || !c.nationality || !c.passportNumber || !c.gender || c.age === "") {
          toast({ title: "Validation", description: `Please complete all fields for Infant ${i + 1}.`, variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
      }

      const formDataObj = new FormData();
      formDataObj.append("packageId", packageId);
      // Derive customer fields from family head
      formDataObj.append("customerName", head.name);
      formDataObj.append("customerEmail", formData.customerEmail);
      const headDial = headCountry?.dialCode || "";
      const headPhoneFinal = head.phone ? (head.phone.startsWith(headDial) ? head.phone : `${headDial}${head.phone}`) : "";
      formDataObj.append("customerPhone", headPhoneFinal);
      formDataObj.append("customerNationality", head.nationality);
      formDataObj.append("adults", String(formData.adults));
      formDataObj.append("children", String(formData.children));
      formDataObj.append("infants", String(formData.infants));
      childAgesFromDetails.forEach((age) => {
        formDataObj.append("childAges", String(age));
      });
      infantAgesFromDetails.forEach((age) => {
        formDataObj.append("infantAges", String(age));
      });
      formDataObj.append("rooms", String(formData.rooms));
      if (formData.notes) {
        formDataObj.append("notes", formData.notes);
      }
      if (paymentMethod) {
        formDataObj.append("paymentMethod", paymentMethod);
      }

      // Attach traveler details for reference (backend will ignore unknown keys if unsupported)
      const travelerDetails = {
        familyHeadIndex,
        adults: adultsDetails,
        children: childrenDetails,
        infants: infantsDetails,
      };
      formDataObj.append("travelerDetails", JSON.stringify(travelerDetails));
      // Also include structured JSON arrays for the server to prefer
      formDataObj.append("adultsJson", JSON.stringify(adultsDetails));
      formDataObj.append("childrenJson", JSON.stringify(childrenDetails));
      formDataObj.append("infantsJson", JSON.stringify(infantsDetails));

      const result = await createPackageBookingAction({}, formDataObj);

      if (result?.data) {
        setOpen(false);
        // Reset form
        setPaymentMethod(null);
        setFormData({
          customerName: user?.name || "",
          customerEmail: user?.email || "",
          customerPhone: user?.phone || "",
          customerNationality: "",
          adults: 1,
          children: 0,
          infants: 0,
          childAges: [],
          rooms: 1,
          notes: "",
        });
        // Reset adults details including age
        setAdultsDetails([{ name: user?.name || "", gender: "", nationality: "", passportNumber: "", age: "", phone: user?.phone || "" }]);
        setChildrenDetails([]);
        setInfantsDetails([]);
        setFamilyHeadIndex(0);
        setHeadCountry(COUNTRY_LIST[4]);
        setErrors({});
        // Redirect to thank you page
        router.push("/thank-you?type=package");
      } else {
        toast({
          title: "Error",
          description: result?.error?.message?.[0] || "Failed to submit booking. Please try again.",
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

  // Sync arrays when counts change
  const ensureAdultsLength = (count: number) => {
    setAdultsDetails((prev) => {
      const next = [...prev];
      if (count > next.length) {
        for (let i = next.length; i < count; i++) {
          next.push({ name: "", gender: "", nationality: "", passportNumber: "", age: "", phone: "" });
        }
      } else if (count < next.length) {
        next.length = count;
      }
      // clamp family head index
      if (familyHeadIndex >= count) setFamilyHeadIndex(Math.max(0, count - 1));
      return next;
    });
    // resize errors arrays accordingly
    setErrors((prev) => ({
      ...prev,
      adults: Array.from({ length: count }, (_, i) => prev.adults?.[i] || {}),
    }));
  };

  const ensureChildrenLength = (count: number) => {
    setChildrenDetails((prev) => {
      const next = [...prev];
      if (count > next.length) {
        for (let i = next.length; i < count; i++) {
          next.push({ name: "", gender: "", nationality: "", passportNumber: "", age: "" });
        }
      } else if (count < next.length) {
        next.length = count;
      }
      return next;
    });
    setErrors((prev) => ({
      ...prev,
      children: Array.from({ length: count }, (_, i) => prev.children?.[i] || {}),
    }));
  };

  const ensureInfantsLength = (count: number) => {
    setInfantsDetails((prev) => {
      const next = [...prev];
      if (count > next.length) {
        for (let i = next.length; i < count; i++) {
          next.push({ name: "", gender: "", nationality: "", passportNumber: "", age: "" });
        }
      } else if (count < next.length) {
        next.length = count;
      }
      return next;
    });
    setErrors((prev) => ({
      ...prev,
      infants: Array.from({ length: count }, (_, i) => prev.infants?.[i] || {}),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[96vw] md:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-3 md:p-6">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 -m-6 mb-6 p-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold text-white mb-2">Book Package: {packageName}</DialogTitle>
          <DialogDescription className="text-blue-100">Complete your booking in a few simple steps. All fields marked with * are required.</DialogDescription>
        </DialogHeader>
        
        {!paymentMethod ? (
          <div className="space-y-6 py-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Payment Method</h3>
              <p className="text-sm text-gray-600">Choose how you'd like to complete your payment</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${
                  paymentMethod === "cash" ? "border-blue-500 shadow-lg bg-blue-50" : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Pay in Cash
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Visit our office
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Complete the booking form and visit our office to make the payment in person. Flexible and convenient.
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${
                  paymentMethod === "online" ? "border-blue-500 shadow-lg bg-blue-50" : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setPaymentMethod("online")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Pay Online
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Secure & instant
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Complete your booking and payment securely online. Fast, safe, and encrypted transactions.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center pt-4">
              <Button type="button" variant="outline" size="lg" onClick={() => setOpen(false)} className="px-8">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Summary Card */}
            <Card className="border-2 border-blue-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="adults" className="text-sm font-semibold text-gray-700 mb-2 block">Adults *</Label>
                <CountStepper
                  value={formData.adults}
                  min={1}
                  max={20}
                  onChange={(value) => {
                    setFormData({ ...formData, adults: value });
                    ensureAdultsLength(value);
                  }}
                />
                {errors.adultsCount && <p className="text-destructive text-xs mt-1">{errors.adultsCount}</p>}
              </div>
              <div>
                <Label htmlFor="children" className="mb-2 block">Children</Label>
                <CountStepper
                  value={formData.children}
                  min={0}
                  max={10}
                  onChange={(children) => {
                    setFormData({ ...formData, children });
                    ensureChildrenLength(children);
                  }}
                />
                {errors.childrenCount && <p className="text-destructive text-xs mt-1">{errors.childrenCount}</p>}
              </div>
              <div>
                <Label htmlFor="infants" className="mb-2 block">Infants</Label>
                <CountStepper
                  value={formData.infants}
                  min={0}
                  max={10}
                  onChange={(infants) => {
                    setFormData({ ...formData, infants });
                    ensureInfantsLength(infants);
                  }}
                />
                {errors.infantsCount && <p className="text-destructive text-xs mt-1">{errors.infantsCount}</p>}
              </div>
              <div>
                <Label htmlFor="rooms" className="mb-2 block">Rooms *</Label>
                <CountStepper
                  value={formData.rooms}
                  min={1}
                  max={10}
                  onChange={(value) => setFormData({ ...formData, rooms: value })}
                />
                {errors.rooms && <p className="text-destructive text-xs mt-1">{errors.rooms}</p>}
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card className="border-2 border-blue-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerEmail" className="text-sm font-semibold text-gray-700 mb-2 block">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, customerEmail: e.target.value });
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  required
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Travelers Details Card */}
            <Card className="border-2 border-blue-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Travelers Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Adults Details */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <Label className="text-base font-semibold text-gray-900">Adults Information</Label>
                  </div>
              <RadioGroup value={String(familyHeadIndex)} onValueChange={(v) => {
                  const idx = Number(v);
                  setFamilyHeadIndex(idx);
                  // Attempt to set head country based on adult nationality (if present)
                  const nat = adultsDetails?.[idx]?.nationality;
                  if (nat) {
                    const found = COUNTRY_LIST.find(c => c.code.toLowerCase() === String(nat).toLowerCase());
                    if (found) setHeadCountry(found);
                  }
                }}>
                <Accordion type="multiple" value={adultsAccordionValues} onValueChange={() => {}} className="w-full">
                  {adultsDetails.map((adult, i) => (
                    <AccordionItem key={i} value={`adult-${i}`}>
                      <AccordionTrigger className="py-3">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={String(i)} aria-label={`Family Head ${i + 1}`} />
                          <span className="font-medium">Adult {i + 1}</span>
                          {familyHeadIndex === i && <span className="text-xs text-blue-600">(Family Head)</span>}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {/* First Row: Name, Nationality, Passport, Age */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <Label className="mb-2 block">Name *</Label>
                              <Input value={adult.name} onChange={(e) => {
                                const next = [...adultsDetails];
                                next[i].name = e.target.value;
                                setAdultsDetails(next);
                                setErrors((prev) => {
                                  const arr = prev.adults ? [...prev.adults] : [];
                                  if (!arr[i]) arr[i] = {};
                                  arr[i].name = undefined;
                                  return { ...prev, adults: arr };
                                });
                              }} />
                              {errors.adults?.[i]?.name && (<p className="text-destructive text-xs mt-1">{errors.adults[i].name}</p>)}
                            </div>
                            <div>
                              <Label className="mb-2 block">Nationality *</Label>
                              <CountrySelect
                                value={adult.nationality}
                                placeholder="Select nationality"
                                onChange={(code) => {
                                  const next = [...adultsDetails];
                                  next[i].nationality = code;
                                  setAdultsDetails(next);
                                  setErrors((prev) => {
                                    const arr = prev.adults ? [...prev.adults] : [];
                                    if (!arr[i]) arr[i] = {};
                                    arr[i].nationality = undefined;
                                    return { ...prev, adults: arr };
                                  });
                                }}
                              />
                              {errors.adults?.[i]?.nationality && (<p className="text-destructive text-xs mt-1">{errors.adults[i].nationality}</p>)}
                            </div>
                            <div>
                              <Label className="mb-2 block">Passport Number *</Label>
                              <Input value={adult.passportNumber} pattern="[A-Za-z0-9]{6,}" maxLength={20} onChange={(e) => {
                                const next = [...adultsDetails];
                                next[i].passportNumber = e.target.value;
                                setAdultsDetails(next);
                                setErrors((prev) => {
                                  const arr = prev.adults ? [...prev.adults] : [];
                                  if (!arr[i]) arr[i] = {};
                                  arr[i].passportNumber = undefined;
                                  return { ...prev, adults: arr };
                                });
                              }} />
                              {errors.adults?.[i]?.passportNumber && (<p className="text-destructive text-xs mt-1">{errors.adults[i].passportNumber}</p>)}
                            </div>
                            <div>
                              <Label className="mb-2 block">Age (Years) *</Label>
                              <Input type="number" min={12} max={120} value={adult.age} onChange={(e) => {
                                const next = [...adultsDetails];
                                next[i].age = e.target.value === '' ? '' : Number(e.target.value);
                                setAdultsDetails(next);
                                setErrors((prev) => {
                                  const arr = prev.adults ? [...prev.adults] : [];
                                  if (!arr[i]) arr[i] = {};
                                  arr[i].age = undefined;
                                  return { ...prev, adults: arr };
                                });
                              }} />
                              {errors.adults?.[i]?.age && (<p className="text-destructive text-xs mt-1">{errors.adults[i].age}</p>)}
                              <p className="text-xs text-muted-foreground mt-1">Adult: 12+ years</p>
                            </div>
                          </div>
                          
                          {/* Second Row: Gender and Phone */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <Label className="mb-2 block">Gender *</Label>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2">
                                <input type="radio" name={`adult-gender-${i}`} checked={adult.gender === 'male'} onChange={() => {
                                  const next = [...adultsDetails];
                                  next[i].gender = 'male';
                                  setAdultsDetails(next);
                                  setErrors((prev) => {
                                    const arr = prev.adults ? [...prev.adults] : [];
                                    if (!arr[i]) arr[i] = {};
                                    arr[i].gender = undefined;
                                    return { ...prev, adults: arr };
                                  });
                                }} />
                                <span>Male</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input type="radio" name={`adult-gender-${i}`} checked={adult.gender === 'female'} onChange={() => {
                                  const next = [...adultsDetails];
                                  next[i].gender = 'female';
                                  setAdultsDetails(next);
                                  setErrors((prev) => {
                                    const arr = prev.adults ? [...prev.adults] : [];
                                    if (!arr[i]) arr[i] = {};
                                    arr[i].gender = undefined;
                                    return { ...prev, adults: arr };
                                  });
                                }} />
                                <span>Female</span>
                              </label>
                            </div>
                              {errors.adults?.[i]?.gender && (<p className="text-destructive text-xs mt-1">{errors.adults[i].gender}</p>)}
                            </div>
                            {familyHeadIndex === i && (
                              <div>
                                <Label className="mb-2 block">Phone (Family Head) *</Label>
                                <CountryCodeSelector
                                  selectedCountry={headCountry}
                                  onCountryChange={(c) => setHeadCountry(c)}
                                  phoneNumber={String(adult.phone || '')}
                                  onPhoneChange={(v) => {
                                    const next = [...adultsDetails];
                                    next[i].phone = v;
                                    setAdultsDetails(next);
                                    setErrors((prev) => {
                                      const arr = prev.adults ? [...prev.adults] : [];
                                      if (!arr[i]) arr[i] = {};
                                      arr[i].phone = undefined;
                                      return { ...prev, adults: arr };
                                    });
                                  }}
                                  placeholder="Phone number"
                                  required
                                />
                                {errors.adults?.[i]?.phone && (<p className="text-destructive text-xs mt-1">{errors.adults[i].phone}</p>)}
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </RadioGroup>
              {errors.familyHead && <p className="text-destructive text-xs mt-2">{errors.familyHead}</p>}
            </div>

                {/* Children Details */}
                {formData.children > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 mt-6">
                      <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                      <Label className="text-base font-semibold text-gray-900">Children Information</Label>
                    </div>
                    <Accordion type="multiple" value={childrenAccordionValues} onValueChange={() => {}} className="w-full">
                  {childrenDetails.map((child, i) => (
                    <AccordionItem key={i} value={`child-${i}`}>
                      <AccordionTrigger className="py-3">
                        <span className="font-medium">Child {i + 1}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {/* First Row: Name, Nationality, Passport, Age */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <Label className="mb-2 block">Name *</Label>
                              <Input value={child.name} onChange={(e) => {
                                const next = [...childrenDetails];
                                next[i].name = e.target.value;
                                setChildrenDetails(next);
                                setErrors((prev) => {
                                  const arr = prev.children ? [...prev.children] : [];
                                  if (!arr[i]) arr[i] = {};
                                  arr[i].name = undefined;
                                  return { ...prev, children: arr };
                                });
                              }} />
                              {errors.children?.[i]?.name && (<p className="text-destructive text-xs mt-1">{errors.children[i].name}</p>)}
                            </div>
                            <div>
                              <Label className="mb-2 block">Nationality *</Label>
                              <CountrySelect
                                value={child.nationality}
                                placeholder="Select nationality"
                                onChange={(code) => {
                                  const next = [...childrenDetails];
                                  next[i].nationality = code;
                                  setChildrenDetails(next);
                                  setErrors((prev) => {
                                    const arr = prev.children ? [...prev.children] : [];
                                    if (!arr[i]) arr[i] = {};
                                    arr[i].nationality = undefined;
                                    return { ...prev, children: arr };
                                  });
                                }}
                              />
                              {errors.children?.[i]?.nationality && (<p className="text-destructive text-xs mt-1">{errors.children[i].nationality}</p>)}
                            </div>
                            <div>
                              <Label className="mb-2 block">Passport Number *</Label>
                              <Input value={child.passportNumber} pattern="[A-Za-z0-9]{6,}" maxLength={20} onChange={(e) => {
                                const next = [...childrenDetails];
                                next[i].passportNumber = e.target.value;
                                setChildrenDetails(next);
                                setErrors((prev) => {
                                  const arr = prev.children ? [...prev.children] : [];
                                  if (!arr[i]) arr[i] = {};
                                  arr[i].passportNumber = undefined;
                                  return { ...prev, children: arr };
                                });
                              }} />
                              {errors.children?.[i]?.passportNumber && (<p className="text-destructive text-xs mt-1">{errors.children[i].passportNumber}</p>)}
                            </div>
                            <div>
                              <Label className="mb-2 block">Age (Years) *</Label>
                              <Input type="number" min={2} max={11} value={child.age} onChange={(e) => {
                                const next = [...childrenDetails];
                                next[i].age = e.target.value === '' ? '' : Number(e.target.value);
                                setChildrenDetails(next);
                                setErrors((prev) => {
                                  const arr = prev.children ? [...prev.children] : [];
                                  if (!arr[i]) arr[i] = {};
                                  arr[i].age = undefined;
                                  return { ...prev, children: arr };
                                });
                              }} />
                              {errors.children?.[i]?.age && (<p className="text-destructive text-xs mt-1">{errors.children[i].age}</p>)}
                              <p className="text-xs text-muted-foreground mt-1">Child: 2–11 years</p>
                            </div>
                          </div>
                          
                          {/* Second Row: Gender */}
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                            <Label className="mb-2 block">Gender *</Label>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2">
                                <input type="radio" name={`child-gender-${i}`} checked={child.gender === 'male'} onChange={() => {
                                  const next = [...childrenDetails];
                                  next[i].gender = 'male';
                                  setChildrenDetails(next);
                                  setErrors((prev) => {
                                    const arr = prev.children ? [...prev.children] : [];
                                    if (!arr[i]) arr[i] = {};
                                    arr[i].gender = undefined;
                                    return { ...prev, children: arr };
                                  });
                                }} />
                                <span>Male</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input type="radio" name={`child-gender-${i}`} checked={child.gender === 'female'} onChange={() => {
                                  const next = [...childrenDetails];
                                  next[i].gender = 'female';
                                  setChildrenDetails(next);
                                  setErrors((prev) => {
                                    const arr = prev.children ? [...prev.children] : [];
                                    if (!arr[i]) arr[i] = {};
                                    arr[i].gender = undefined;
                                    return { ...prev, children: arr };
                                  });
                                }} />
                                <span>Female</span>
                              </label>
                            </div>
                            {errors.children?.[i]?.gender && (<p className="text-destructive text-xs mt-1">{errors.children[i].gender}</p>)}
                          </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

                {/* Infants Details */}
                {formData.infants > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 mt-6">
                      <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                      <Label className="text-base font-semibold text-gray-900">Infants Information</Label>
                    </div>
                    <Accordion type="multiple" value={infantsAccordionValues} onValueChange={() => {}} className="w-full">
                  {infantsDetails.map((child, i) => (
                    <AccordionItem key={i} value={`infant-${i}`}>
                      <AccordionTrigger className="py-3">
                        <span className="font-medium">Infant {i + 1}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {/* First Row: Name, Nationality, Passport, Age */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <Label className="mb-2 block">Name *</Label>
                              <Input value={child.name} onChange={(e) => {
                                const next = [...infantsDetails];
                                next[i].name = e.target.value;
                                setInfantsDetails(next);
                                setErrors((prev) => {
                                  const arr = prev.infants ? [...prev.infants] : [];
                                  if (!arr[i]) arr[i] = {};
                                  arr[i].name = undefined;
                                  return { ...prev, infants: arr };
                                });
                              }} />
                              {errors.infants?.[i]?.name && (<p className="text-destructive text-xs mt-1">{errors.infants[i].name}</p>)}
                            </div>
                            <div>
                              <Label className="mb-2 block">Nationality *</Label>
                              <CountrySelect
                                value={child.nationality}
                                placeholder="Select nationality"
                                onChange={(code) => {
                                  const next = [...infantsDetails];
                                  next[i].nationality = code;
                                  setInfantsDetails(next);
                                  setErrors((prev) => {
                                    const arr = prev.infants ? [...prev.infants] : [];
                                    if (!arr[i]) arr[i] = {};
                                    arr[i].nationality = undefined;
                                    return { ...prev, infants: arr };
                                  });
                                }}
                              />
                              {errors.infants?.[i]?.nationality && (<p className="text-destructive text-xs mt-1">{errors.infants[i].nationality}</p>)}
                            </div>
                            <div>
                              <Label className="mb-2 block">Passport Number *</Label>
                              <Input value={child.passportNumber} pattern="[A-Za-z0-9]{6,}" maxLength={20} onChange={(e) => {
                                const next = [...infantsDetails];
                                next[i].passportNumber = e.target.value;
                                setInfantsDetails(next);
                                setErrors((prev) => {
                                  const arr = prev.infants ? [...prev.infants] : [];
                                  if (!arr[i]) arr[i] = {};
                                  arr[i].passportNumber = undefined;
                                  return { ...prev, infants: arr };
                                });
                              }} />
                              {errors.infants?.[i]?.passportNumber && (<p className="text-destructive text-xs mt-1">{errors.infants[i].passportNumber}</p>)}
                            </div>
                            <div>
                              <Label className="mb-2 block">Age (Months) *</Label>
                              <Input type="number" min={0} max={23} value={child.age} onChange={(e) => {
                                const next = [...infantsDetails];
                                next[i].age = e.target.value === '' ? '' : Number(e.target.value);
                                setInfantsDetails(next);
                                setErrors((prev) => {
                                  const arr = prev.infants ? [...prev.infants] : [];
                                  if (!arr[i]) arr[i] = {};
                                  arr[i].age = undefined;
                                  return { ...prev, infants: arr };
                                });
                              }} />
                              {errors.infants?.[i]?.age && (<p className="text-destructive text-xs mt-1">{errors.infants[i].age}</p>)}
                              <p className="text-xs text-muted-foreground mt-1">Infant: 0–23 months</p>
                            </div>
                          </div>
                          
                          {/* Second Row: Gender */}
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                            <Label className="mb-2 block">Gender *</Label>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2">
                                <input type="radio" name={`infant-gender-${i}`} checked={child.gender === 'male'} onChange={() => {
                                  const next = [...infantsDetails];
                                  next[i].gender = 'male';
                                  setInfantsDetails(next);
                                  setErrors((prev) => {
                                    const arr = prev.infants ? [...prev.infants] : [];
                                    if (!arr[i]) arr[i] = {};
                                    arr[i].gender = undefined;
                                    return { ...prev, infants: arr };
                                  });
                                }} />
                                <span>Male</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input type="radio" name={`infant-gender-${i}`} checked={child.gender === 'female'} onChange={() => {
                                  const next = [...infantsDetails];
                                  next[i].gender = 'female';
                                  setInfantsDetails(next);
                                  setErrors((prev) => {
                                    const arr = prev.infants ? [...prev.infants] : [];
                                    if (!arr[i]) arr[i] = {};
                                    arr[i].gender = undefined;
                                    return { ...prev, infants: arr };
                                  });
                                }} />
                                <span>Female</span>
                              </label>
                            </div>
                            {errors.infants?.[i]?.gender && (<p className="text-destructive text-xs mt-1">{errors.infants[i].gender}</p>)}
                          </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

              </CardContent>
            </Card>

            {/* Additional Notes Card */}
            <Card className="border-2 border-blue-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 mb-3 block">Special Requests or Comments (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  placeholder="Add any special requests, dietary requirements, or additional information..."
                  className="resize-none"
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between items-center gap-3 pt-4 border-t-2 border-gray-100">
              <Button type="button" variant="ghost" onClick={() => setPaymentMethod(null)} className="text-gray-600">
                ← Back to Payment
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} size="lg" className="px-6">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} size="lg" className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Booking Request →
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

