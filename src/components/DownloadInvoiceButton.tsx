"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadInvoiceButtonProps {
  bookingId: string;
  bookingType: "hotel" | "package";
}

export function DownloadInvoiceButton({ bookingId, bookingType }: DownloadInvoiceButtonProps) {
  const handleDownload = () => {
    window.open(`/api/invoice/${bookingId}?type=${bookingType}`, '_blank');
  };

  return (
    <Button
      onClick={handleDownload}
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Download Invoice (PDF)
    </Button>
  );
}

