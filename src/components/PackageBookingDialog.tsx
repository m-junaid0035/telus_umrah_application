"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
    phone?: string; // required only for family head
  };
  type ChildDetail = {
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
    phone: user?.phone || "" 
  }]);
  const [childrenDetails, setChildrenDetails] = useState<ChildDetail[]>([]);
  const [familyHeadIndex, setFamilyHeadIndex] = useState<number>(0);
  const [errors, setErrors] = useState<{
    email?: string;
    adultsCount?: string;
    childrenCount?: string;
    rooms?: string;
    familyHead?: string;
    adults?: Array<{ name?: string; nationality?: string; passportNumber?: string; gender?: string; phone?: string }>;
    children?: Array<{ name?: string; nationality?: string; passportNumber?: string; gender?: string; age?: string }>;
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

  // Accordion open values (always open)
  const adultsAccordionValues = useMemo(() => adultsDetails.map((_, i) => `adult-${i}`), [adultsDetails]);
  const childrenAccordionValues = useMemo(() => childrenDetails.map((_, i) => `child-${i}`), [childrenDetails]);

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
      if (formData.rooms < 1) nextErrors.rooms = "At least one room is required";
      // Family head
      if (familyHeadIndex < 0 || familyHeadIndex >= adultsDetails.length) {
        nextErrors.familyHead = "Please select a family head";
      }
      // Adults
      nextErrors.adults = adultsDetails.map((a, i) => {
        const e: { name?: string; nationality?: string; passportNumber?: string; gender?: string; phone?: string } = {};
        if (!a.name) e.name = "Required";
        if (!a.nationality) e.nationality = "Required";
        if (!a.passportNumber || !/[A-Za-z0-9]{6,}/.test(a.passportNumber)) e.passportNumber = "Min 6 alphanumeric";
        if (!a.gender) e.gender = "Select gender";
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
        if (isNaN(ageNum)) e.age = "Age required"; else if (ageNum < 0 || ageNum > 16) e.age = "Age 0–16";
        return e;
      });

      // If any errors exist, block submit
      const hasFieldErrors =
        nextErrors.email ||
        nextErrors.adultsCount ||
        nextErrors.childrenCount ||
        nextErrors.rooms ||
        nextErrors.familyHead ||
        (nextErrors.adults && nextErrors.adults.some((e) => Object.keys(e).length > 0)) ||
        (nextErrors.children && nextErrors.children.some((e) => Object.keys(e).length > 0));

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
        if (!a.name || !a.nationality || !a.passportNumber || !a.gender) {
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

      const formDataObj = new FormData();
      formDataObj.append("packageId", packageId);
      // Derive customer fields from family head
      formDataObj.append("customerName", head.name);
      formDataObj.append("customerEmail", formData.customerEmail);
      formDataObj.append("customerPhone", head.phone!);
      formDataObj.append("customerNationality", head.nationality);
      formDataObj.append("adults", String(formData.adults));
      formDataObj.append("children", String(formData.children));
      childAgesFromDetails.forEach((age) => {
        formDataObj.append("childAges", String(age));
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
      };
      formDataObj.append("travelerDetails", JSON.stringify(travelerDetails));

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
          childAges: [],
          rooms: 1,
          notes: "",
        });
        setAdultsDetails([{ name: user?.name || "", gender: "", nationality: "", passportNumber: "", phone: user?.phone || "" }]);
        setChildrenDetails([]);
        setFamilyHeadIndex(0);
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
          next.push({ name: "", gender: "", nationality: "", passportNumber: "", phone: "" });
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[96vw] md:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-3 md:p-6">
        <DialogHeader>
          <DialogTitle>Book Package: {packageName}</DialogTitle>
        </DialogHeader>
        
        {!paymentMethod ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">Please select your preferred payment method:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  paymentMethod === "cash" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Pay in Cash
                  </CardTitle>
                  <CardDescription>
                    Visit our office to complete payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Fill out the booking form and visit our office to make the payment in person.
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  paymentMethod === "online" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setPaymentMethod("online")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Pay Online
                  </CardTitle>
                  <CardDescription>
                    Secure online payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Complete your booking and payment securely online.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
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
            {/* Adults & Children at top */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-muted/30 p-4 rounded-lg border">
              <div>
                <Label htmlFor="adults">Adults *</Label>
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
                <Label htmlFor="children">Children</Label>
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
                <Label htmlFor="rooms">Rooms *</Label>
                <CountStepper
                  value={formData.rooms}
                  min={1}
                  max={10}
                  onChange={(value) => setFormData({ ...formData, rooms: value })}
                />
                {errors.rooms && <p className="text-destructive text-xs mt-1">{errors.rooms}</p>}
              </div>
            </div>

            {/* Contact Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerEmail">Email *</Label>
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

            {/* Adults Details Accordion */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Adults Details</Label>
                <div className="text-xs text-muted-foreground">Select family head</div>
              </div>
              <RadioGroup value={String(familyHeadIndex)} onValueChange={(v) => setFamilyHeadIndex(Number(v))}>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Name *</Label>
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
                            <Label>Nationality *</Label>
                            <Input value={adult.nationality} onChange={(e) => {
                              const next = [...adultsDetails];
                              next[i].nationality = e.target.value;
                              setAdultsDetails(next);
                              setErrors((prev) => {
                                const arr = prev.adults ? [...prev.adults] : [];
                                if (!arr[i]) arr[i] = {};
                                arr[i].nationality = undefined;
                                return { ...prev, adults: arr };
                              });
                            }} />
                            {errors.adults?.[i]?.nationality && (<p className="text-destructive text-xs mt-1">{errors.adults[i].nationality}</p>)}
                          </div>
                          <div>
                            <Label>Passport Number *</Label>
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
                            <Label>Gender *</Label>
                            <div className="flex items-center gap-4 mt-2">
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
                            <div className="md:col-span-2">
                              <Label>Phone (Family Head) *</Label>
                              <Input value={adult.phone || ''} pattern="[0-9+\- ()]{6,}" onChange={(e) => {
                                const next = [...adultsDetails];
                                next[i].phone = e.target.value;
                                setAdultsDetails(next);
                                setErrors((prev) => {
                                  const arr = prev.adults ? [...prev.adults] : [];
                                  if (!arr[i]) arr[i] = {};
                                  arr[i].phone = undefined;
                                  return { ...prev, adults: arr };
                                });
                              }} />
                              {errors.adults?.[i]?.phone && (<p className="text-destructive text-xs mt-1">{errors.adults[i].phone}</p>)}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </RadioGroup>
              {errors.familyHead && <p className="text-destructive text-xs mt-2">{errors.familyHead}</p>}
            </div>

            {/* Children Details Accordion */}
            {formData.children > 0 && (
              <div>
                <Label>Children Details</Label>
                <Accordion type="multiple" value={childrenAccordionValues} onValueChange={() => {}} className="w-full mt-2">
                  {childrenDetails.map((child, i) => (
                    <AccordionItem key={i} value={`child-${i}`}>
                      <AccordionTrigger className="py-3">
                        <span className="font-medium">Child {i + 1}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Name *</Label>
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
                            <Label>Nationality *</Label>
                            <Input value={child.nationality} onChange={(e) => {
                              const next = [...childrenDetails];
                              next[i].nationality = e.target.value;
                              setChildrenDetails(next);
                              setErrors((prev) => {
                                const arr = prev.children ? [...prev.children] : [];
                                if (!arr[i]) arr[i] = {};
                                arr[i].nationality = undefined;
                                return { ...prev, children: arr };
                              });
                            }} />
                            {errors.children?.[i]?.nationality && (<p className="text-destructive text-xs mt-1">{errors.children[i].nationality}</p>)}
                          </div>
                          <div>
                            <Label>Passport Number *</Label>
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
                            <Label>Gender *</Label>
                            <div className="flex items-center gap-4 mt-2">
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
                          <div>
                            <Label>Age *</Label>
                            <Input type="number" min="0" max="16" value={child.age} onChange={(e) => {
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
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 flex-col sm:flex-row">
              <Button type="button" variant="secondary" onClick={() => setPaymentMethod(null)}>
                Back
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Booking Request"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

