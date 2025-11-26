"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAdditionalServiceAction } from "@/actions/additionalServiceActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAdditionalServicePage() {
  const router = useRouter();
  const [formState, formAction] = useActionState(createAdditionalServiceAction, {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    serviceType: "",
    isActive: true,
    icon: "",
  });

  useEffect(() => {
    if (formState?.data) {
      toast({
        title: "Success",
        description: "Additional service created successfully!",
      });
      router.push("/admin/additional-services");
    } else if (formState?.error) {
      const errorMessages = Object.values(formState.error).flat();
      errorMessages.forEach((msg: unknown) => {
        if (typeof msg === "string") {
          toast({
            title: "Error",
            description: msg,
            variant: "destructive",
          });
        } else if (Array.isArray(msg)) {
          msg.forEach((m: unknown) => {
            if (typeof m === "string") {
              toast({
                title: "Error",
                description: m,
                variant: "destructive",
              });
            }
          });
        }
      });
      setIsSubmitting(false);
    }
  }, [formState, router]);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataObj = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formDataObj);
    });
  };

  const errorFor = (field: string): boolean => {
    if (!formState?.error) return false;
    if (typeof formState.error === 'object' && !('message' in formState.error)) {
      return !!(formState.error as Record<string, string[]>)[field];
    }
    return false;
  };

  const getErrorMessage = (field: string): string => {
    if (!formState?.error) return "";
    if (typeof formState.error === 'object' && !('message' in formState.error)) {
      const errors = (formState.error as Record<string, string[]>)[field];
      return errors?.[0] || "";
    }
    return "";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/additional-services">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Additional Service</h1>
          <p className="text-gray-600 mt-1">Add a new service with price for custom Umrah form</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Create additional services that customers can select in the custom Umrah booking form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="name">
                  Service Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Umrah Visa, Transport, Meals"
                  required
                  className={errorFor("name") ? "border-red-500" : ""}
                  aria-invalid={errorFor("name")}
                />
                {errorFor("name") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getErrorMessage("name") || "Name is required"}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the service"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="price">
                  Price (PKR) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                  className={errorFor("price") ? "border-red-500" : ""}
                  aria-invalid={errorFor("price")}
                />
                {errorFor("price") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getErrorMessage("price") || "Price is required"}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="serviceType">
                  Service Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.serviceType || undefined}
                  onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                  required
                >
                  <SelectTrigger className={errorFor("serviceType") ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umrahVisa">Umrah Visa</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="zaiarat">Zaiarat</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                    <SelectItem value="esim">eSIM</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="serviceType" value={formData.serviceType} />
                {errorFor("serviceType") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getErrorMessage("serviceType") || "Service type is required"}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Select one of the 5 predefined service types
                </p>
              </div>

              <div>
                <Label htmlFor="icon">Icon Identifier (Optional)</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., umrahVisa, transport, zaiarat"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Icon identifier for frontend display (optional)
                </p>
              </div>

              <div className="md:col-span-2 flex items-center space-x-2">
                <Switch
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <input type="hidden" name="isActive" value={formData.isActive ? "true" : "false"} />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active (visible in forms)
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/admin/additional-services")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isPending}>
                {isSubmitting || isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Service"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

