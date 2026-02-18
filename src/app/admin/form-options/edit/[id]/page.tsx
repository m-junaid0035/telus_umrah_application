"use client";

import { useState, useEffect, useTransition } from "react";
import { useActionState } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateFormOptionAction, fetchFormOptionByIdAction } from "@/actions/formOptionActions";
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

export default function EditFormOptionPage() {
  const { id } = useParams();
  const router = useRouter();
  const optionId = id as string;

  const [option, setOption] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [formState, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await updateFormOptionAction(prevState, optionId, formData);
    },
    {}
  );

  const [formData, setFormData] = useState({
    type: "" as FormOptionType | "",
    name: "",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    async function loadOption() {
      const res = await fetchFormOptionByIdAction(optionId);
      if (res.data) {
        setOption(res.data);
        setFormData({
          type: res.data.type,
          name: res.data.name,
          displayOrder: res.data.displayOrder || 0,
          isActive: res.data.isActive !== false,
        });
      } else {
        toast({
          title: "Error",
          description: res.error?.message?.[0] || "Failed to load form option",
          variant: "destructive",
        });
        router.push("/admin/form-options");
      }
      setLoading(false);
    }
    loadOption();
  }, [optionId, router]);

  useEffect(() => {
    if (formState?.data) {
      toast({
        title: "Success",
        description: "Form option updated successfully!",
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
    }
  }, [formState, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!option) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/form-options">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Form Option</h1>
          <p className="text-gray-600 mt-1">Update form option details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Option Details</CardTitle>
          <CardDescription>Update the form option information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="type">
                  Option Type <span className="text-red-500">*</span>
                </Label>
                <input type="hidden" name="type" value={formData.type} />
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as FormOptionType })
                  }
                  required
                  disabled
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
                    <SelectItem value={FormOptionType.AirlineClass}>Airline Class</SelectItem>
                    <SelectItem value={FormOptionType.Nationality}>Nationality</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Type cannot be changed after creation</p>
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

              <div className="md:col-span-2 flex items-center space-x-2">
                <Switch
                  id="isActive"
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
              <Button type="submit" disabled={isPending || formState?.data}>
                {isPending || formState?.data ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Option"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

