"use client";
import { Suspense } from "react";
import { HotelsPage } from "@/components/HotelsPage";

export default function AllHotelsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelsPage />
    </Suspense>
  );
}
