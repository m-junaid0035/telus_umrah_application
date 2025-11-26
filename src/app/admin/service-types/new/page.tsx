"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createServiceTypeAction } from "@/actions/serviceTypeActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewServiceTypePage() {
  const router = useRouter();
  const [formState, formAction] = useActionState(createServiceTypeAction, {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (formState?.data) {
      toast({
        title: "Success",
        description: "Service type created successfully!",
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
        <Link href="/admin/service-types">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Service Type</h1>
          <p className="text-gray-600 mt-1">Add a new service type category (e.g., Travel, Visa, Transport)</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Type Details</CardTitle>
          <CardDescription>
            Create service type categories to group additional services
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
                  placeholder="e.g., Travel, Visa, Transport, Meals, Connectivity"
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
                  placeholder="Brief description of this service type"
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
                  placeholder="0"
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
              <Button type="submit" disabled={isSubmitting || isPending}>
                {isSubmitting || isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Type"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

