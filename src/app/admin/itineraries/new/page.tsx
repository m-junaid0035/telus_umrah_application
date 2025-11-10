"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import { createItineraryAction } from "@/actions/itinerariesActions";

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function CreateItineraryForm() {
  const router = useRouter();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      return await createItineraryAction(prevState, formData);
    },
    initialState
  );

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description:
          (formState.error as any).message?.[0] || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formState]);

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="border-none text-center">
          <CardTitle>Create Itinerary</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={dispatch} className="space-y-6 max-w-2xl mx-auto">
            {/* Day Start */}
            <div className="space-y-2">
              <Label htmlFor="day_start">Start Day</Label>
              <Input
                id="day_start"
                name="day_start"
                type="number"
                min={1}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("day_start") && (
                <p className="text-sm text-red-500">{errorFor("day_start")}</p>
              )}
            </div>

            {/* Day End (optional) */}
            <div className="space-y-2">
              <Label htmlFor="day_end">End Day (Optional)</Label>
              <Input
                id="day_end"
                name="day_end"
                type="number"
                min={1}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("day_end") && (
                <p className="text-sm text-red-500">{errorFor("day_end")}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("title") && (
                <p className="text-sm text-red-500">{errorFor("title")}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={4}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("description") && (
                <p className="text-sm text-red-500">{errorFor("description")}</p>
              )}
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as any).message?.[0]}
              </p>
            )}

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Creating..." : "Create Itinerary"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Itinerary created successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/itineraries");
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
