"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const initializeAdmin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/init-admin");
      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message || "Admin user created successfully!" });
      } else {
        setResult({ success: false, message: data.error || "Failed to create admin user" });
      }
    } catch (error: any) {
      setResult({ success: false, message: error.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>
            Initialize the default admin user for the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Default Admin Credentials:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>Username:</strong> admin</li>
              <li><strong>Password:</strong> admin</li>
              <li><strong>Email:</strong> admin@telusumrah.com</li>
            </ul>
          </div>

          {result && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                result.success
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <p className="text-sm font-medium">{result.message}</p>
            </div>
          )}

          <Button
            onClick={initializeAdmin}
            disabled={loading || (result?.success === true)}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Admin User...
              </>
            ) : result?.success ? (
              "Admin User Created ✓"
            ) : (
              "Create Admin User"
            )}
          </Button>

          {result?.success && (
            <div className="text-center">
              <a
                href="/auth/login"
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Go to Admin Login →
              </a>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            <p>⚠️ This page should only be accessed during initial setup.</p>
            <p>After creating the admin, you can delete this page for security.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

