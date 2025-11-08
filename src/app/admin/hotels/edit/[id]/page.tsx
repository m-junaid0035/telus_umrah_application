"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useParams, useRouter } from "next/navigation";
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

import { fetchHotelByIdAction, updateHotelAction } from "@/actions/hotelActions";
import { HotelType } from "@/types/hotel";

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

export default function EditHotelForm() {
  const { id } = useParams();
  const router = useRouter();
  const hotelId = id as string;

  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      return await updateHotelAction(prevState, hotelId, formData);
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
    async function loadHotel() {
      const res = await fetchHotelByIdAction(hotelId);
      if (res.data) {
        setHotel(res.data);
      }
      setLoading(false);
    }
    loadHotel();
  }, [hotelId]);

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

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading hotel data...</div>
    );
  }

  if (!hotel) {
    return <p className="text-center text-red-500">Hotel not found.</p>;
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="border-none text-center">
          <CardTitle>Edit Hotel</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={dispatch} className="space-y-6 max-w-2xl mx-auto">
            {/* Hotel Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name</Label>
              <Input
                id="name"
                name="name"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                defaultValue={hotel.name}
              />
              {errorFor("name") && (
                <p className="text-sm text-red-500">{errorFor("name")}</p>
              )}
            </div>

            {/* Hotel Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Hotel Type</Label>
              <select
                id="type"
                name="type"
                className="w-full rounded-md border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2"
                defaultValue={hotel.type}
                required
              >
                {Object.values(HotelType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errorFor("type") && (
                <p className="text-sm text-red-500">{errorFor("type")}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                defaultValue={hotel.location}
              />
              {errorFor("location") && (
                <p className="text-sm text-red-500">{errorFor("location")}</p>
              )}
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <Label htmlFor="star">Star Rating</Label>
              <Input
                id="star"
                name="star"
                type="number"
                min={1}
                max={5}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                defaultValue={hotel.star}
              />
              {errorFor("star") && (
                <p className="text-sm text-red-500">{errorFor("star")}</p>
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
                {isPending ? "Updating..." : "Update Hotel"}
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
          <p>Hotel updated successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/hotels");
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
