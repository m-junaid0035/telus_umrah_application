import ThankYouClient from "@/components/ThankYouClient";
import { Suspense } from "react";

export default function ThankYouPage() {
  // This is now a Server Component
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouClient />
    </Suspense>
  );
}
