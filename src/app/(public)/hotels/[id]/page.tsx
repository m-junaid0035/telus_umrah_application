"use client";
import { Suspense } from "react";
import { HotelDetailsPage } from "@/components/HotelDetailsPage";

export default function SingleHotelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelDetailsPage />
    </Suspense>
  );
}
