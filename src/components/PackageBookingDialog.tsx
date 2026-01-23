"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PackageBookingDialogProps {
  packageId: string;
  packageName: string;
  trigger: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export function PackageBookingDialog({ packageId, packageName, trigger, user }: PackageBookingDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartBooking = () => {
    setIsLoading(true);
    router.push(`/booking/${packageId}`);
  };

  return (
    <Button
      onClick={handleStartBooking}
      disabled={isLoading}
      className="bg-[#2C2F7C] hover:bg-[#1a1d4d]"
    >
      {isLoading ? "Loading..." : "Book Now"}
    </Button>
  );
}

