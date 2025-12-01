"use client";

import { useState } from "react";

interface PackageImageViewProps {
  src: string;
  alt: string;
  className?: string;
}

export function PackageImageView({ src, alt, className }: PackageImageViewProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null; // Don't render anything if image fails to load
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        console.error("Failed to load package image:", src);
        setHasError(true);
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

