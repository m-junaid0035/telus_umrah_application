"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchServiceTypeByIdAction,
  updateServiceTypeAction,
} from "@/actions/serviceTypeActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditServiceTypePage() {
  const { id } = useParams();
  const router = useRouter();
  const typeId = id as string;

  const [type, setType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [formState, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await updateServiceTypeAction(prevState, typeId, formData);
    },
    {}
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    async function loadType() {
      const res = await fetchServiceTypeByIdAction(typeId);
      if (res.data) {
        setType(res.data);
        setFormData({
          name: res.data.name,
          description: res.data.description || "",
          displayOrder: res.data.displayOrder || 0,
          isActive: res.data.isActive !== false,
        });
      } else {
        toast({
          title: "Error",
          description: res.error?.message?.[0] || "Failed to load service type",
          variant: "destructive",
        });
        router.push("/admin/service-types");
      }
      setLoading(false);
    }
    loadType();
  }, [typeId, router]);

  useEffect(() => {
    if (formState?.data) {
      toast({
        title: "Success",
        description: "Service type updated successfully!",
      });
      router.push("/admin/service-types");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!type) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/service-types">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Service Type</h1>
          <p className="text-gray-600 mt-1">Update service type details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Type Details</CardTitle>
          <CardDescription>
            Update the service type information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="name">
                  Type Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: Number(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first (0 = first)
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
                onClick={() => router.push("/admin/service-types")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Type"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

