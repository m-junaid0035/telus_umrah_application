"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPackageBookingAction } from "@/actions/packageBookingActions";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: user?.phone || "",
    customerNationality: "",
    adults: 1,
    children: 0,
    childAges: [] as number[],
    rooms: 1,
    checkInDate: "",
    checkOutDate: "",
    umrahVisa: false,
    transport: false,
    zaiarat: false,
    meals: false,
    esim: false,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("packageId", packageId);
      formDataObj.append("customerName", formData.customerName);
      formDataObj.append("customerEmail", formData.customerEmail);
      formDataObj.append("customerPhone", formData.customerPhone);
      if (formData.customerNationality) {
        formDataObj.append("customerNationality", formData.customerNationality);
      }
      formDataObj.append("adults", String(formData.adults));
      formDataObj.append("children", String(formData.children));
      formData.childAges.forEach((age) => {
        formDataObj.append("childAges", String(age));
      });
      formDataObj.append("rooms", String(formData.rooms));
      if (formData.checkInDate) {
        formDataObj.append("checkInDate", formData.checkInDate);
      }
      if (formData.checkOutDate) {
        formDataObj.append("checkOutDate", formData.checkOutDate);
      }
      formDataObj.append("umrahVisa", String(formData.umrahVisa));
      formDataObj.append("transport", String(formData.transport));
      formDataObj.append("zaiarat", String(formData.zaiarat));
      formDataObj.append("meals", String(formData.meals));
      formDataObj.append("esim", String(formData.esim));
      if (formData.notes) {
        formDataObj.append("notes", formData.notes);
      }

      const result = await createPackageBookingAction({}, formDataObj);

      if (result?.data) {
        toast({
          title: "Success",
          description: "Your booking request has been submitted! We will contact you soon.",
        });
        setOpen(false);
        // Reset form
        setFormData({
          customerName: user?.name || "",
          customerEmail: user?.email || "",
          customerPhone: user?.phone || "",
          customerNationality: "",
          adults: 1,
          children: 0,
          childAges: [],
          rooms: 1,
          checkInDate: "",
          checkOutDate: "",
          umrahVisa: false,
          transport: false,
          zaiarat: false,
          meals: false,
          esim: false,
          notes: "",
        });
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

  const updateChildAges = () => {
    const ages: number[] = [];
    for (let i = 0; i < formData.children; i++) {
      const ageInput = document.getElementById(`childAge-${i}`) as HTMLInputElement;
      if (ageInput && ageInput.value) {
        ages.push(Number(ageInput.value));
      }
    }
    setFormData({ ...formData, childAges: ages });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Package: {packageName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone *</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerNationality">Nationality</Label>
              <Input
                id="customerNationality"
                value={formData.customerNationality}
                onChange={(e) => setFormData({ ...formData, customerNationality: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="adults">Adults *</Label>
              <Input
                id="adults"
                type="number"
                min="1"
                max="20"
                value={formData.adults}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(20, Number(e.target.value) || 1));
                  setFormData({ ...formData, adults: value });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="children">Children</Label>
              <Input
                id="children"
                type="number"
                min="0"
                max="10"
                value={formData.children}
                onChange={(e) => {
                  const children = Math.max(0, Math.min(10, Number(e.target.value) || 0));
                  setFormData({ ...formData, children });
                  setTimeout(updateChildAges, 0);
                }}
              />
            </div>
            {formData.children > 0 && (
              <div className="md:col-span-2">
                <Label>Child Ages</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {Array.from({ length: formData.children }).map((_, i) => (
                    <Input
                      key={i}
                      id={`childAge-${i}`}
                      type="number"
                      min="0"
                      max="16"
                      placeholder={`Child ${i + 1} age`}
                      onChange={updateChildAges}
                    />
                  ))}
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="rooms">Rooms *</Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                max="10"
                value={formData.rooms}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(10, Number(e.target.value) || 1));
                  setFormData({ ...formData, rooms: value });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="checkInDate">Check-in Date</Label>
              <Input
                id="checkInDate"
                type="date"
                value={formData.checkInDate}
                onChange={(e) => {
                  setFormData({ ...formData, checkInDate: e.target.value });
                  // Reset check-out date if it's before new check-in date
                  if (formData.checkOutDate && e.target.value && new Date(formData.checkOutDate) <= new Date(e.target.value)) {
                    setFormData({ ...formData, checkInDate: e.target.value, checkOutDate: '' });
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="checkOutDate">Check-out Date</Label>
              <Input
                id="checkOutDate"
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                min={formData.checkInDate || undefined}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Additional Services</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.umrahVisa}
                  onChange={(e) => setFormData({ ...formData, umrahVisa: e.target.checked })}
                  className="rounded"
                />
                <span>Umrah Visa</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.transport}
                  onChange={(e) => setFormData({ ...formData, transport: e.target.checked })}
                  className="rounded"
                />
                <span>Transport</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.zaiarat}
                  onChange={(e) => setFormData({ ...formData, zaiarat: e.target.checked })}
                  className="rounded"
                />
                <span>Zaiarat</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.meals}
                  onChange={(e) => setFormData({ ...formData, meals: e.target.checked })}
                  className="rounded"
                />
                <span>Meals</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.esim}
                  onChange={(e) => setFormData({ ...formData, esim: e.target.checked })}
                  className="rounded"
                />
                <span>eSIM</span>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Booking"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

