"use client";

import { useState } from "react";

interface HotelImageViewerProps {
  images: string[];
  hotelName: string;
}

export function HotelImageViewer({ images, hotelName }: HotelImageViewerProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {images.map((image, index) => {
        if (imageErrors.has(index)) return null;
        return (
          <img
            key={index}
            src={image}
            alt={`${hotelName} - Image ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg border"
            onError={() => handleImageError(index)}
          />
        );
      })}
    </div>
  );
}

