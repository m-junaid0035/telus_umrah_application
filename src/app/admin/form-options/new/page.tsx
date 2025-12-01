"use client";

import { useState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createFormOptionAction } from "@/actions/formOptionActions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { FormOptionType } from "@/models/FormOption";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function NewFormOptionPage() {
  const router = useRouter();
  const [formState, formAction] = useActionState(createFormOptionAction, {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "" as FormOptionType | "",
    name: "",
    displayOrder: 0,
    isActive: true,
    logo: "",
  });

  useEffect(() => {
    if (formState?.data) {
      toast({
        title: "Success",
        description: "Form option created successfully!",
      });
      router.push("/admin/form-options");
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
    // Check if error is a Record with field errors
    if (typeof formState.error === 'object' && !('message' in formState.error)) {
      return !!(formState.error as Record<string, string[]>)[field];
    }
    return false;
  };

  const getErrorMessage = (field: string): string => {
    if (!formState?.error) return "";
    if (typeof formState.error === 'object' && !('message' in formState.error)) {
      const fieldErrors = (formState.error as Record<string, string[]>)[field];
      return Array.isArray(fieldErrors) && fieldErrors.length > 0 ? fieldErrors[0] : "";
    }
    return "";
  };

  useEffect(() => {
    if (formState?.formData) {
      setFormData((prev) => ({ ...prev, ...formState.formData }));
    }
  }, [formState?.formData]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/form-options">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Form Option</h1>
          <p className="text-gray-600 mt-1">Add a new option for custom Umrah form</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Option Details</CardTitle>
          <CardDescription>
            Create options that will appear in the custom Umrah booking form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="type">
                  Option Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type || undefined}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as FormOptionType })
                  }
                  required
                >
                  <SelectTrigger
                    className={errorFor("type") ? "border-red-500" : ""}
                    aria-invalid={errorFor("type")}
                  >
                    <SelectValue placeholder="Select option type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FormOptionType.FromCity}>From City</SelectItem>
                    <SelectItem value={FormOptionType.ToCity}>To City</SelectItem>
                    <SelectItem value={FormOptionType.Airline}>Airline</SelectItem>
                    <SelectItem value={FormOptionType.AirlineClass}>Airline Class</SelectItem>
                    <SelectItem value={FormOptionType.Nationality}>Nationality</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="type" value={formData.type} required />
                {errorFor("type") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getErrorMessage("type") || "Type is required"}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Karachi, Pakistan"
                  required
                  className={errorFor("name") ? "border-red-500" : ""}
                  aria-invalid={errorFor("name")}
                />
                {errorFor("name") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getErrorMessage("name") || "Name is required"}
                  </p>
                )}
                {/* Auto-generated value from name */}
                <input 
                  type="hidden" 
                  name="value" 
                  value={formData.name.toLowerCase().replace(/\s+/g, "-")} 
                />
              </div>

              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: Number(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first (0 = first)
                </p>
              </div>

              {formData.type === FormOptionType.Airline && (
                <div>
                  <ImageUpload
                    value={formData.logo}
                    onChange={(url) => setFormData({ ...formData, logo: url })}
                    folder="airlines"
                    label="Logo (Optional)"
                  />
                  <input type="hidden" name="logo" value={formData.logo} />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload airline logo image
                  </p>
                </div>
              )}
              {formData.type !== FormOptionType.Airline && (
                <input type="hidden" name="logo" value="" />
              )}

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
                onClick={() => router.push("/admin/form-options")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Option"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

