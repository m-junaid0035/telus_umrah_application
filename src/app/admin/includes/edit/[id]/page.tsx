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

import {
  fetchIncludeByIdAction,
  updateIncludeAction,
} from "@/actions/includeActions"; // make sure path is correct

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

export default function EditIncludeForm() {
  const { id } = useParams();
  const router = useRouter();
  const includeId = id as string;

  const [include, setInclude] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      return await updateIncludeAction(prevState, includeId, formData);
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
    async function loadInclude() {
      const res = await fetchIncludeByIdAction(includeId);
      if (res.data) {
        setInclude(res.data);
      }
      setLoading(false);
    }
    loadInclude();
  }, [includeId]);

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
      <div className="text-center py-10 text-gray-500">Loading include data...</div>
    );
  }

  if (!include) {
    return <p className="text-center text-red-500">Include not found.</p>;
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="border-none text-center">
          <CardTitle>Edit Include</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={dispatch} className="space-y-6 max-w-2xl mx-auto">
            {/* Include Text */}
            <div className="space-y-2">
              <Label htmlFor="include_text">Include Text</Label>
              <Input
                id="include_text"
                name="include_text"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                defaultValue={include.include_text}
              />
              {errorFor("include_text") && (
                <p className="text-sm text-red-500">{errorFor("include_text")}</p>
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
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Updating..." : "Update Include"}
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
          <p>Include updated successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/includes");
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
