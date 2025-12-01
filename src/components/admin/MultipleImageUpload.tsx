"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Plus } from "lucide-react";

interface MultipleImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
}

export function MultipleImageUpload({
  values,
  onChange,
  folder = "uploads",
  label = "Images",
  maxImages = 10,
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState<number | null>(null);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    const uploadIndex = index !== undefined ? index : values.length;
    setUploading(uploadIndex);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const imageUrl = data.url;
      const newValues = [...values];
      
      if (index !== undefined) {
        newValues[index] = imageUrl;
      } else {
        newValues.push(imageUrl);
      }

      onChange(newValues);
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload image");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const handleAddNew = () => {
    if (values.length < maxImages) {
      onChange([...values, ""]);
    }
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileSelect(e);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {values.length === 0 ? (
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleDirectUpload}
            disabled={uploading !== null}
            className="hidden"
            id="image-upload-direct"
          />
          <Label
            htmlFor="image-upload-direct"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {uploading !== null ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-1" />
                <p className="text-xs text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-xs text-gray-600">Click to upload image</p>
              </>
            )}
          </Label>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {values.map((url, index) => (
            <div key={index} className="relative group">
            {url ? (
              <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Image load error:", url);
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, index)}
                    disabled={uploading === index}
                    className="hidden"
                    id={`image-upload-${index}`}
                  />
                  <Label
                    htmlFor={`image-upload-${index}`}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {uploading === index ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-1" />
                        <p className="text-xs text-gray-600">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-600">Upload</p>
                      </>
                    )}
                  </Label>
                </div>
              )}
            </div>
          ))}
          
          {values.length < maxImages && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddNew}
              className="w-full h-32 border-2 border-dashed border-gray-300"
            >
              <Plus className="w-6 h-6 text-gray-400" />
            </Button>
          )}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        {values.filter(url => url).length} of {maxImages} images uploaded
      </p>
    </div>
  );
}

