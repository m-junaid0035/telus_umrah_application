"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

interface Service {
  _id: string;
  name: string;
  description?: string;
  price: number;
}

interface ServiceTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceType: string;
  services: Service[];
  selectedServices: string[];
  onServiceToggle: (serviceId: string) => void;
}

export function ServiceTypeDialog({
  open,
  onOpenChange,
  serviceType,
  services,
  selectedServices,
  onServiceToggle,
}: ServiceTypeDialogProps) {
  // Services are already filtered by type, so use them directly
  const filteredServices = services;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{serviceType} Services</DialogTitle>
          <DialogDescription>
            Select services from the {serviceType} category. Prices are shown for each service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const isSelected = selectedServices.includes(service._id);
              return (
                <div
                  key={service._id}
                  className={`flex flex-col justify-between p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[rgb(30,58,109)] text-white border-[rgb(30,58,109)]'
                      : 'bg-white text-gray-900 border-gray-200 hover:border-[rgb(30,58,109)]'
                  }`}
                  onClick={() => onServiceToggle(service._id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="cursor-pointer text-sm font-semibold flex-1">
                        {service.name}
                      </Label>
                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => onServiceToggle(service._id)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-shrink-0"
                      />
                    </div>
                    {service.description && (
                      <p className={`text-xs mb-2 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {service.description}
                      </p>
                    )}
                  </div>
                  <div className={`mt-2 pt-2 border-t ${isSelected ? 'border-white/30' : 'border-gray-200'}`}>
                    <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[rgb(30,58,109)]'}`}>
                      PKR {service.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>No services available in this category.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

