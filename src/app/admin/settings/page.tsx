"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { fetchSettingsAction, updateAgentDiscountAction } from "@/actions/settingsActions";

export default function AdminSettingsPage() {
  const [discount, setDiscount] = useState("0");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const result = await fetchSettingsAction();
        if (result?.data?.agentDiscountPercent !== undefined) {
          setDiscount(String(result.data.agentDiscountPercent));
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.set("agentDiscountPercent", discount);
      const result = await updateAgentDiscountAction(formData);
      if (result?.error) {
        toast({
          title: "Failed to update",
          description: result.error?.message?.[0] || "Unable to save agent discount.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Agent discount updated",
          description: "All agent pricing now reflects the new discount.",
        });
        if (result?.data?.agentDiscountPercent !== undefined) {
          setDiscount(String(result.data.agentDiscountPercent));
        }
      }
    } catch (error) {
      toast({
        title: "Failed to update",
        description: "Unable to save agent discount.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Agent Pricing</h1>
        <p className="text-purple-200">Set a global discount that applies to agent portal pricing.</p>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Agent Discount Percentage</CardTitle>
          <CardDescription className="text-white/70">
            The discount applies to all packages and hotels shown to agents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="agentDiscountPercent" className="text-sm text-white/80">
                Discount (%)
              </label>
              <Input
                id="agentDiscountPercent"
                name="agentDiscountPercent"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
                className="bg-white/10 border-white/20 text-white"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading || saving}>
                {saving ? "Saving..." : "Save Discount"}
              </Button>
              {loading && <span className="text-sm text-white/60">Loading settings...</span>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
