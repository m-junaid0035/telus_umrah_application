"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginAdminAction } from "@/actions/authActions"; // Use admin action
import type { ApplicationAuthFormState } from "@/actions/authActions";

const initialState: ApplicationAuthFormState = {
  error: undefined,
  data: undefined,
};

export default function AdminLoginPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState: ApplicationAuthFormState, formData: FormData): Promise<ApplicationAuthFormState> => {
      const result = await loginAdminAction(prevState, formData); // Call admin login
      if (result?.data) {
        router.push("/admin"); // Redirect to admin panel
      }
      return result;
    },
    initialState
  );

  const errorFor = (field: string): string | null => {
    if (
      state.error &&
      typeof state.error === "object" &&
      field in state.error
    ) {
      return (state.error as Record<string, string[]>)[field]?.[0] || null;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mt-3">
            Admin Panel Login
          </h1>
          <p className="text-sm text-gray-500">Secure login to manage the platform</p>
        </div>

        <form action={formAction} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="admin"
              className="w-full border-gray-300 focus:border-black focus:ring-black"
              required
            />
            {errorFor("username") && <p className="text-sm text-red-500">{errorFor("username")}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full border-gray-300 focus:border-black focus:ring-black"
              required
            />
            {errorFor("password") && (
              <p className="text-sm text-red-500">{errorFor("password")}</p>
            )}
          </div>

          {/* General Error */}
          {"message" in (state.error ?? {}) && (
            <p className="text-sm text-red-500 text-center">
              {(state.error as any).message?.[0]}
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-2 text-white bg-black hover:bg-gray-800 transition rounded-lg"
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
