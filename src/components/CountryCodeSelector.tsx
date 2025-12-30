"use client";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import 'flag-icons/css/flag-icons.min.css';

export interface Country {
  code: string;
  name: string;
  flagCode: string;
  dialCode: string;
}

export const countries: Country[] = [
  { code: 'US', name: 'United States', flagCode: 'us', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flagCode: 'gb', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flagCode: 'ca', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flagCode: 'au', dialCode: '+61' },
  { code: 'PK', name: 'Pakistan', flagCode: 'pk', dialCode: '+92' },
  { code: 'SA', name: 'Saudi Arabia', flagCode: 'sa', dialCode: '+966' },
  { code: 'AE', name: 'United Arab Emirates', flagCode: 'ae', dialCode: '+971' },
  { code: 'IN', name: 'India', flagCode: 'in', dialCode: '+91' },
  { code: 'BD', name: 'Bangladesh', flagCode: 'bd', dialCode: '+880' },
  { code: 'MY', name: 'Malaysia', flagCode: 'my', dialCode: '+60' },
  { code: 'SG', name: 'Singapore', flagCode: 'sg', dialCode: '+65' },
  { code: 'TH', name: 'Thailand', flagCode: 'th', dialCode: '+66' },
  { code: 'NZ', name: 'New Zealand', flagCode: 'nz', dialCode: '+64' },
  { code: 'ZA', name: 'South Africa', flagCode: 'za', dialCode: '+27' },
  { code: 'EG', name: 'Egypt', flagCode: 'eg', dialCode: '+20' },
  { code: 'NG', name: 'Nigeria', flagCode: 'ng', dialCode: '+234' },
  { code: 'KE', name: 'Kenya', flagCode: 'ke', dialCode: '+254' },
  { code: 'FR', name: 'France', flagCode: 'fr', dialCode: '+33' },
  { code: 'DE', name: 'Germany', flagCode: 'de', dialCode: '+49' },
  { code: 'IT', name: 'Italy', flagCode: 'it', dialCode: '+39' },
  { code: 'ES', name: 'Spain', flagCode: 'es', dialCode: '+34' },
  { code: 'JP', name: 'Japan', flagCode: 'jp', dialCode: '+81' },
  { code: 'CN', name: 'China', flagCode: 'cn', dialCode: '+86' },
  { code: 'KR', name: 'South Korea', flagCode: 'kr', dialCode: '+82' },
  { code: 'BR', name: 'Brazil', flagCode: 'br', dialCode: '+55' },
  { code: 'MX', name: 'Mexico', flagCode: 'mx', dialCode: '+52' },
  { code: 'AR', name: 'Argentina', flagCode: 'ar', dialCode: '+54' },
];

interface CountryCodeSelectorProps {
  selectedCountry?: Country;
  onCountryChange: (country: Country) => void;
  phoneNumber: string;
  onPhoneChange: (phone: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function CountryCodeSelector({
  selectedCountry,
  onCountryChange,
  phoneNumber,
  onPhoneChange,
  placeholder = "Phone number",
  required = false,
}: CountryCodeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCountry = selectedCountry || countries[4]; // Default to Pakistan

  return (
    <div className="flex gap-2">
      {/* Country Selector Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
          <span className={`fi fi-${currentCountry.flagCode} h-5 w-7`}></span>
          <span className="text-sm font-medium text-gray-700">{currentCountry.dialCode}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-lg">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
            <Input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <DropdownMenuItem
                key={country.code}
                onClick={() => {
                  onCountryChange(country);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <span className={`fi fi-${country.flagCode} h-5 w-7`}></span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{country.name}</div>
                  <div className="text-xs text-gray-500">{country.dialCode}</div>
                </div>
                {currentCountry.code === country.code && (
                  <span className="text-blue-600 text-lg">✓</span>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No countries found
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Phone Number Input */}
      <Input
        type="tel"
        value={phoneNumber}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="flex-1"
      />
    </div>
  );
}
