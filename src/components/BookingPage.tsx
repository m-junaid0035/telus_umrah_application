'use client';

import React, { useState, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPackageBookingAction } from '@/actions/packageBookingActions';
import { getCurrentUserAction } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CountryCodeSelector } from '@/components/CountryCodeSelector';
import { Check, ChevronRight, CreditCard, DollarSign } from 'lucide-react';

interface BookingState {
  paymentMethod: 'cash' | 'online' | null;
  adults: number;
  children: number;
  infants: number;
  rooms: number;
  email: string;
  adultsDetails: Array<{ name: string; gender: string; nationality: string; passportNumber: string; age: string | number; phone?: string }>;
  childrenDetails: Array<{ name: string; gender: string; nationality: string; passportNumber: string; age: string | number }>;
  infantsDetails: Array<{ name: string; gender: string; nationality: string; passportNumber: string; age: string | number }>;
  familyHeadIndex: number;
}

const steps = [
  { id: 1, name: 'Payment', description: 'Choose payment method' },
  { id: 2, name: 'Trip Details', description: 'Set travelers count' },
  { id: 3, name: 'Travelers', description: 'Traveler info' },
  { id: 4, name: 'Review', description: 'Confirm booking' },
];

export default function BookingPage({ packageName, packageId, pricing }: any) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [headCountry, setHeadCountry] = useState<any>(null);
  const [adultsAccordionValues, setAdultsAccordionValues] = useState<string[]>([]);
  const [childrenAccordionValues, setChildrenAccordionValues] = useState<string[]>([]);
  const [infantsAccordionValues, setInfantsAccordionValues] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [state, dispatch] = useReducer(
    (state: BookingState, action: any) => {
      switch (action.type) {
        case 'SET_PAYMENT':
          return { ...state, paymentMethod: action.payload };
        case 'SET_TRAVELERS':
          return {
            ...state,
            adults: action.payload.adults,
            children: action.payload.children,
            infants: action.payload.infants,
            rooms: action.payload.rooms,
          };
        case 'SET_EMAIL':
          return { ...state, email: action.payload };
        case 'SET_ADULTS_DETAILS':
          return { ...state, adultsDetails: action.payload };
        case 'SET_CHILDREN_DETAILS':
          return { ...state, childrenDetails: action.payload };
        case 'SET_INFANTS_DETAILS':
          return { ...state, infantsDetails: action.payload };
        case 'SET_FAMILY_HEAD':
          return { ...state, familyHeadIndex: action.payload };
        default:
          return state;
      }
    },
    {
      paymentMethod: null,
      adults: 1,
      children: 0,
      infants: 0,
      rooms: 1,
      email: '',
      adultsDetails: [{ name: '', gender: '', nationality: '', passportNumber: '', age: '' }],
      childrenDetails: [],
      infantsDetails: [],
      familyHeadIndex: 0,
    }
  );

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidPassport = (p?: string) => !!p && p.trim().length >= 6;
  const isNonEmpty = (v?: string | number) => (typeof v === 'number' ? true : !!(v && String(v).trim().length > 0));
  const inRange = (num: any, min: number, max: number) => {
    const n = Number(num);
    return !Number.isNaN(n) && n >= min && n <= max;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return state.paymentMethod !== null;
      case 2:
        return state.adults > 0 && state.rooms > 0;
      case 3:
        const adultsValid = state.adultsDetails.every(
          (a: any) =>
            isNonEmpty(a.name) &&
            isNonEmpty(a.nationality) &&
            isValidPassport(a.passportNumber) &&
            inRange(a.age, 12, 120) &&
            isNonEmpty(a.gender)
        );
        const childrenValid = state.childrenDetails.every(
          (c: any) =>
            isNonEmpty(c.name) &&
            isNonEmpty(c.nationality) &&
            inRange(c.age, 2, 11) &&
            isNonEmpty(c.gender)
        );
        const infantsValid = state.infantsDetails.every(
          (i: any) =>
            isNonEmpty(i.name) &&
            isNonEmpty(i.nationality) &&
            inRange(i.age, 0, 23) &&
            isNonEmpty(i.gender)
        );
        return adultsValid && childrenValid && infantsValid;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (!canProceed()) {
        setShowErrors(true);
        return;
      }
      setShowErrors(false);
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      const totalPrice = (state.adults * (pricing?.adultPrice || 0)) + 
                        (state.children * (pricing?.childPrice || 0)) + 
                        (state.infants * (pricing?.infantPrice || 0));

      // Use logged-in user's email if available, otherwise use the email from the form
      const bookingEmail = currentUser?.email || state.email;

      // Prepare adults with isHead flag
      const adultsWithHead = state.adultsDetails.map((adult: any, idx: number) => ({
        name: adult.name,
        gender: adult.gender,
        nationality: adult.nationality,
        passportNumber: adult.passportNumber,
        age: Number(adult.age) || 0,
        phone: adult.phone || '',
        isHead: idx === state.familyHeadIndex,
      }));

      // Prepare children
      const childrenData = state.childrenDetails.map((child: any) => ({
        name: child.name,
        gender: child.gender,
        nationality: child.nationality,
        age: Number(child.age) || 0,
      }));

      // Prepare infants
      const infantsData = state.infantsDetails.map((infant: any) => ({
        name: infant.name,
        gender: infant.gender,
        nationality: infant.nationality,
        age: Number(infant.age) || 0,
      }));

      // Create FormData
      const formData = new FormData();
      formData.append('packageId', packageId);
      formData.append('customerEmail', bookingEmail);
      formData.append('rooms', state.rooms.toString());
      formData.append('totalAmount', totalPrice.toString());
      formData.append('paymentMethod', state.paymentMethod || 'cash');
      formData.append('paymentStatus', 'pending');
      formData.append('status', 'pending');
      
      // Append traveler details as JSON
      formData.append('travelerDetails', JSON.stringify({
        adults: adultsWithHead,
        children: childrenData,
        infants: infantsData,
        familyHeadIndex: state.familyHeadIndex,
      }));

      console.log('Submitting booking with data:', {
        packageId,
        customerEmail: bookingEmail,
        rooms: state.rooms,
        totalAmount: totalPrice,
        paymentMethod: state.paymentMethod,
        adults: adultsWithHead,
        children: childrenData,
        infants: infantsData,
      });

      // Call the server action
      const result = await createPackageBookingAction({}, formData);

      if (result.error) {
        console.error('Booking error:', result.error);
        alert('Failed to create booking. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Store booking data for thank you page
      const bookingData = {
        packageId,
        packageName,
        paymentMethod: state.paymentMethod,
        travelers: {
          adults: state.adults,
          children: state.children,
          infants: state.infants,
          rooms: state.rooms,
        },
        email: state.email,
        adultsDetails: adultsWithHead,
        childrenDetails: childrenData,
        infantsDetails: infantsData,
        totalPrice,
      };
      
      sessionStorage.setItem('latestBooking', JSON.stringify(bookingData));
      
      // Redirect to thank you page
      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred while creating your booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Sync traveler detail arrays and open accordions when counts change
  useEffect(() => {
    // Load current user
    const loadUser = async () => {
      try {
        const user = await getCurrentUserAction();
        if (user) {
          setCurrentUser(user);
          // Pre-fill email if user is logged in
          if (user.email && !state.email) {
            dispatch({ type: 'SET_EMAIL', payload: user.email });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    // Adults
    if (state.adultsDetails.length !== state.adults) {
      const next = Array.from({ length: state.adults }).map((_, i) => {
        const existing = state.adultsDetails[i] || {};
        return {
          name: existing.name || '',
          gender: existing.gender || '',
          nationality: existing.nationality || '',
          passportNumber: existing.passportNumber || '',
          age: existing.age || '',
        };
      });
      dispatch({ type: 'SET_ADULTS_DETAILS', payload: next });
    }
    setAdultsAccordionValues(Array.from({ length: state.adults }).map((_, i) => `adult-${i}`));

    // Children
    if (state.childrenDetails.length !== state.children) {
      const next = Array.from({ length: state.children }).map((_, i) => {
        const existing = state.childrenDetails[i] || {};
        return {
          name: existing.name || '',
          gender: existing.gender || '',
          nationality: existing.nationality || '',
          passportNumber: existing.passportNumber || '',
          age: existing.age || '',
        };
      });
      dispatch({ type: 'SET_CHILDREN_DETAILS', payload: next });
    }
    setChildrenAccordionValues(Array.from({ length: state.children }).map((_, i) => `child-${i}`));

    // Infants
    if (state.infantsDetails.length !== state.infants) {
      const next = Array.from({ length: state.infants }).map((_, i) => {
        const existing = state.infantsDetails[i] || {};
        return {
          name: existing.name || '',
          gender: existing.gender || '',
          nationality: existing.nationality || '',
          passportNumber: existing.passportNumber || '',
          age: existing.age || '',
        };
      });
      dispatch({ type: 'SET_INFANTS_DETAILS', payload: next });
    }
    setInfantsAccordionValues(Array.from({ length: state.infants }).map((_, i) => `infant-${i}`));
  }, [state.adults, state.children, state.infants]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">📦 {packageName}</h1>
          <p className="text-xs md:text-sm text-gray-600">Complete your Umrah package booking</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Step 1: Payment Method */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Payment Method</h2>
                  <p className="text-gray-600">Select your preferred way to complete this booking</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => dispatch({ type: 'SET_PAYMENT', payload: 'cash' })}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      state.paymentMethod === 'cash'
                        ? 'border-[#2C2F7C] bg-[#2C2F7C]/5'
                        : 'border-gray-200 hover:border-[#2C2F7C] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <DollarSign className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 text-lg">Pay in Cash</p>
                        <p className="text-sm text-gray-600 mt-1">Visit our office and complete payment</p>
                      </div>
                    </div>
                    {state.paymentMethod === 'cash' && (
                      <div className="mt-4 flex items-center gap-2 text-emerald-600">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-semibold">Selected</span>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => dispatch({ type: 'SET_PAYMENT', payload: 'online' })}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      state.paymentMethod === 'online'
                        ? 'border-[#2C2F7C] bg-[#2C2F7C]/5'
                        : 'border-gray-200 hover:border-[#2C2F7C] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#2C2F7C] to-[#1a1d4d] rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <CreditCard className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 text-lg">Pay Online</p>
                        <p className="text-sm text-gray-600 mt-1">Secure payment gateway</p>
                      </div>
                    </div>
                    {state.paymentMethod === 'online' && (
                      <div className="mt-4 flex items-center gap-2 text-[#2C2F7C]">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-semibold">Selected</span>
                      </div>
                    )}
                  </button>
                </div>

                {showErrors && state.paymentMethod === null && (
                  <div className="mt-3 text-sm text-red-600">Please select a payment method to continue.</div>
                )}
              </div>
            )}

            {/* Step 2: Trip Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Details</h2>
                  <p className="text-gray-600">How many travelers for this booking?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#2C2F7C] transition-colors">
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">Adults (12+ years) *</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() =>
                          dispatch({
                            type: 'SET_TRAVELERS',
                            payload: { ...state, adults: Math.max(1, state.adults - 1) },
                          })
                        }
                        variant="outline"
                        size="sm"
                        className="h-9"
                      >
                        −
                      </Button>
                      <span className="w-8 text-center font-semibold text-lg">{state.adults}</span>
                      <Button
                        onClick={() =>
                          dispatch({
                            type: 'SET_TRAVELERS',
                            payload: { ...state, adults: Math.min(20, state.adults + 1) },
                          })
                        }
                        variant="outline"
                        size="sm"
                        className="h-9"
                      >
                        +
                      </Button>
                    </div>
                    {showErrors && state.adults < 1 && (
                      <p className="mt-2 text-xs text-red-600">At least one adult is required.</p>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#2C2F7C] transition-colors">
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">Children (2-11 years)</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() =>
                          dispatch({
                            type: 'SET_TRAVELERS',
                            payload: { ...state, children: Math.max(0, state.children - 1) },
                          })
                        }
                        variant="outline"
                        size="sm"
                        className="h-9"
                      >
                        −
                      </Button>
                      <span className="w-8 text-center font-semibold text-lg">{state.children}</span>
                      <Button
                        onClick={() =>
                          dispatch({
                            type: 'SET_TRAVELERS',
                            payload: { ...state, children: Math.min(10, state.children + 1) },
                          })
                        }
                        variant="outline"
                        size="sm"
                        className="h-9"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#2C2F7C] transition-colors">
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">Infants (0-23 months)</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() =>
                          dispatch({
                            type: 'SET_TRAVELERS',
                            payload: { ...state, infants: Math.max(0, state.infants - 1) },
                          })
                        }
                        variant="outline"
                        size="sm"
                        className="h-9"
                      >
                        −
                      </Button>
                      <span className="w-8 text-center font-semibold text-lg">{state.infants}</span>
                      <Button
                        onClick={() =>
                          dispatch({
                            type: 'SET_TRAVELERS',
                            payload: { ...state, infants: Math.min(10, state.infants + 1) },
                          })
                        }
                        variant="outline"
                        size="sm"
                        className="h-9"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#2C2F7C] transition-colors">
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">Rooms *</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() =>
                          dispatch({
                            type: 'SET_TRAVELERS',
                            payload: { ...state, rooms: Math.max(1, state.rooms - 1) },
                          })
                        }
                        variant="outline"
                        size="sm"
                        className="h-9"
                      >
                        −
                      </Button>
                      <span className="w-8 text-center font-semibold text-lg">{state.rooms}</span>
                      <Button
                        onClick={() =>
                          dispatch({
                            type: 'SET_TRAVELERS',
                            payload: { ...state, rooms: Math.min(10, state.rooms + 1) },
                          })
                        }
                        variant="outline"
                        size="sm"
                        className="h-9"
                      >
                        +
                      </Button>
                    </div>
                    {showErrors && state.rooms < 1 && (
                      <p className="mt-2 text-xs text-red-600">At least one room is required.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Traveler Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Traveler Information</h2>
                  <p className="text-gray-600">Enter details for all travelers</p>
                </div>

                {/* Adults Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#2C2F7C]/20">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2C2F7C] to-[#1a1d4d]"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Adults Information</h3>
                  </div>

                  <Accordion type="multiple" value={adultsAccordionValues} onValueChange={setAdultsAccordionValues} className="space-y-3">
                    {state.adultsDetails.map((adult: any, i: number) => (
                      <AccordionItem key={i} value={`adult-${i}`} className="border border-gray-200 rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                                i === state.familyHeadIndex ? 'bg-[#2C2F7C]' : 'bg-gray-400'
                              }`}
                            >
                              {i + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{adult.name || `Adult ${i + 1}`}</span>
                            {i === state.familyHeadIndex && (
                              <span className="ml-auto text-xs font-semibold text-[#2C2F7C] bg-[#2C2F7C]/10 px-2 py-1 rounded">
                                Family Head
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 bg-gray-50 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Name *</Label>
                              <Input
                                value={adult.name}
                                onChange={(e) => {
                                  const next = [...state.adultsDetails];
                                  next[i].name = e.target.value;
                                  dispatch({ type: 'SET_ADULTS_DETAILS', payload: next });
                                }}
                                className="h-10"
                                placeholder="Full name"
                              />
                              {showErrors && !isNonEmpty(adult.name) && (
                                <p className="mt-1 text-xs text-red-600">Name is required.</p>
                              )}
                            </div>
                            <div>
                              <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Nationality *</Label>
                              <Input
                                value={adult.nationality}
                                placeholder="e.g., Pakistan"
                                onChange={(e: any) => {
                                  const next = [...state.adultsDetails];
                                  next[i].nationality = e.target.value;
                                  dispatch({ type: 'SET_ADULTS_DETAILS', payload: next });
                                }}
                                className="h-10"
                              />
                              {showErrors && !isNonEmpty(adult.nationality) && (
                                <p className="mt-1 text-xs text-red-600">Nationality is required.</p>
                              )}
                            </div>
                            <div>
                              <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Passport *</Label>
                              <Input
                                value={adult.passportNumber}
                                onChange={(e: any) => {
                                  const next = [...state.adultsDetails];
                                  next[i].passportNumber = e.target.value;
                                  dispatch({ type: 'SET_ADULTS_DETAILS', payload: next });
                                }}
                                className="h-10"
                                placeholder="Passport #"
                              />
                              {showErrors && !isValidPassport(adult.passportNumber) && (
                                <p className="mt-1 text-xs text-red-600">Passport must be at least 6 characters.</p>
                              )}
                            </div>
                            <div>
                              <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Age *</Label>
                              <Input
                                type="number"
                                min={12}
                                max={120}
                                value={adult.age}
                                onChange={(e: any) => {
                                  const next = [...state.adultsDetails];
                                  next[i].age = e.target.value;
                                  dispatch({ type: 'SET_ADULTS_DETAILS', payload: next });
                                }}
                                className="h-10"
                                placeholder="Years"
                              />
                              {showErrors && !inRange(adult.age, 12, 120) && (
                                <p className="mt-1 text-xs text-red-600">Age must be between 12 and 120.</p>
                              )}
                            </div>
                            <div>
                              <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Gender *</Label>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`gender-${i}`}
                                    checked={adult.gender === 'male'}
                                    onChange={() => {
                                      const next = [...state.adultsDetails];
                                      next[i].gender = 'male';
                                      dispatch({ type: 'SET_ADULTS_DETAILS', payload: next });
                                    }}
                                    className="w-4 h-4 accent-[#2C2F7C]"
                                  />
                                  <span className="text-sm">Male</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`gender-${i}`}
                                    checked={adult.gender === 'female'}
                                    onChange={() => {
                                      const next = [...state.adultsDetails];
                                      next[i].gender = 'female';
                                      dispatch({ type: 'SET_ADULTS_DETAILS', payload: next });
                                    }}
                                    className="w-4 h-4 accent-[#2C2F7C]"
                                  />
                                  <span className="text-sm">Female</span>
                                </label>
                              </div>
                              {showErrors && !isNonEmpty(adult.gender) && (
                                <p className="mt-1 text-xs text-red-600">Gender is required.</p>
                              )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Children Section */}
                {state.children > 0 && (
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 pb-3 border-b border-emerald-200">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
                      <h3 className="text-lg font-semibold text-gray-900">Children Information (2-11 years)</h3>
                    </div>
                    <Accordion type="multiple" value={childrenAccordionValues} onValueChange={setChildrenAccordionValues} className="space-y-3">
                      {state.childrenDetails.map((child: any, i: number) => (
                        <AccordionItem key={i} value={`child-${i}`} className="border border-gray-200 rounded-lg overflow-hidden">
                          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold">{i + 1}</div>
                              <span className="text-sm font-medium text-gray-900">{child.name || `Child ${i + 1}`}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-4 bg-gray-50 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Name *</Label>
                                <Input
                                  value={child.name}
                                  onChange={(e: any) => {
                                    const next = [...state.childrenDetails];
                                    next[i].name = e.target.value;
                                    dispatch({ type: 'SET_CHILDREN_DETAILS', payload: next });
                                  }}
                                  className="h-10"
                                  placeholder="Full name"
                                />
                                {showErrors && !isNonEmpty(child.name) && <p className="mt-1 text-xs text-red-600">Name is required.</p>}
                              </div>
                              <div>
                                <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Nationality *</Label>
                                <Input
                                  value={child.nationality}
                                  onChange={(e: any) => {
                                    const next = [...state.childrenDetails];
                                    next[i].nationality = e.target.value;
                                    dispatch({ type: 'SET_CHILDREN_DETAILS', payload: next });
                                  }}
                                  className="h-10"
                                  placeholder="e.g., Pakistan"
                                />
                                {showErrors && !isNonEmpty(child.nationality) && <p className="mt-1 text-xs text-red-600">Nationality is required.</p>}
                              </div>
                              <div>
                                <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Age *</Label>
                                <Input
                                  type="number"
                                  min={2}
                                  max={11}
                                  value={child.age}
                                  onChange={(e: any) => {
                                    const next = [...state.childrenDetails];
                                    next[i].age = e.target.value;
                                    dispatch({ type: 'SET_CHILDREN_DETAILS', payload: next });
                                  }}
                                  className="h-10"
                                  placeholder="Years"
                                />
                                {showErrors && !inRange(child.age, 2, 11) && <p className="mt-1 text-xs text-red-600">Age must be 2-11.</p>}
                              </div>
                              <div>
                                <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Gender *</Label>
                                <div className="flex gap-4">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`child-gender-${i}`}
                                      checked={child.gender === 'male'}
                                      onChange={() => {
                                        const next = [...state.childrenDetails];
                                        next[i].gender = 'male';
                                        dispatch({ type: 'SET_CHILDREN_DETAILS', payload: next });
                                      }}
                                      className="w-4 h-4 accent-emerald-600"
                                    />
                                    <span className="text-sm">Male</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`child-gender-${i}`}
                                      checked={child.gender === 'female'}
                                      onChange={() => {
                                        const next = [...state.childrenDetails];
                                        next[i].gender = 'female';
                                        dispatch({ type: 'SET_CHILDREN_DETAILS', payload: next });
                                      }}
                                      className="w-4 h-4 accent-emerald-600"
                                    />
                                    <span className="text-sm">Female</span>
                                  </label>
                                </div>
                                {showErrors && !isNonEmpty(child.gender) && <p className="mt-1 text-xs text-red-600">Gender is required.</p>}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Infants Section */}
                {state.infants > 0 && (
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 pb-3 border-b border-violet-200">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-violet-600"></div>
                      <h3 className="text-lg font-semibold text-gray-900">Infants Information (0-23 months)</h3>
                    </div>
                    <Accordion type="multiple" value={infantsAccordionValues} onValueChange={setInfantsAccordionValues} className="space-y-3">
                      {state.infantsDetails.map((infant: any, i: number) => (
                        <AccordionItem key={i} value={`infant-${i}`} className="border border-gray-200 rounded-lg overflow-hidden">
                          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center font-semibold">{i + 1}</div>
                              <span className="text-sm font-medium text-gray-900">{infant.name || `Infant ${i + 1}`}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-4 bg-gray-50 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Name *</Label>
                                <Input
                                  value={infant.name}
                                  onChange={(e: any) => {
                                    const next = [...state.infantsDetails];
                                    next[i].name = e.target.value;
                                    dispatch({ type: 'SET_INFANTS_DETAILS', payload: next });
                                  }}
                                  className="h-10"
                                  placeholder="Full name"
                                />
                                {showErrors && !isNonEmpty(infant.name) && <p className="mt-1 text-xs text-red-600">Name is required.</p>}
                              </div>
                              <div>
                                <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Nationality *</Label>
                                <Input
                                  value={infant.nationality}
                                  onChange={(e: any) => {
                                    const next = [...state.infantsDetails];
                                    next[i].nationality = e.target.value;
                                    dispatch({ type: 'SET_INFANTS_DETAILS', payload: next });
                                  }}
                                  className="h-10"
                                  placeholder="e.g., Pakistan"
                                />
                                {showErrors && !isNonEmpty(infant.nationality) && <p className="mt-1 text-xs text-red-600">Nationality is required.</p>}
                              </div>
                              <div>
                                <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Age (months) *</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={23}
                                  value={infant.age}
                                  onChange={(e: any) => {
                                    const next = [...state.infantsDetails];
                                    next[i].age = e.target.value;
                                    dispatch({ type: 'SET_INFANTS_DETAILS', payload: next });
                                  }}
                                  className="h-10"
                                  placeholder="Months"
                                />
                                {showErrors && !inRange(infant.age, 0, 23) && <p className="mt-1 text-xs text-red-600">Age must be 0-23 months.</p>}
                              </div>
                              <div>
                                <Label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 block">Gender *</Label>
                                <div className="flex gap-4">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`infant-gender-${i}`}
                                      checked={infant.gender === 'male'}
                                      onChange={() => {
                                        const next = [...state.infantsDetails];
                                        next[i].gender = 'male';
                                        dispatch({ type: 'SET_INFANTS_DETAILS', payload: next });
                                      }}
                                      className="w-4 h-4 accent-violet-600"
                                    />
                                    <span className="text-sm">Male</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`infant-gender-${i}`}
                                      checked={infant.gender === 'female'}
                                      onChange={() => {
                                        const next = [...state.infantsDetails];
                                        next[i].gender = 'female';
                                        dispatch({ type: 'SET_INFANTS_DETAILS', payload: next });
                                      }}
                                      className="w-4 h-4 accent-violet-600"
                                    />
                                    <span className="text-sm">Female</span>
                                  </label>
                                </div>
                                {showErrors && !isNonEmpty(infant.gender) && <p className="mt-1 text-xs text-red-600">Gender is required.</p>}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Booking</h2>
                  <p className="text-gray-600">Please verify all details before confirming</p>
                </div>

                <div className="space-y-4">
                  <Card className="p-6 border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-semibold text-gray-900 capitalize">{state.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adults:</span>
                        <span className="font-semibold text-gray-900">{state.adults}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Children:</span>
                        <span className="font-semibold text-gray-900">{state.children}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Infants:</span>
                        <span className="font-semibold text-gray-900">{state.infants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rooms:</span>
                        <span className="font-semibold text-gray-900">{state.rooms}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold text-gray-900">{state.email}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Adults Details */}
                  {state.adults > 0 && (
                    <Card className="p-6 border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Adults Details</h3>
                      <div className="space-y-3">
                        {state.adultsDetails.map((a: any, i: number) => (
                          <div key={`adult-review-${i}`} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-3 rounded">
                            <div>
                              <span className="text-xs text-gray-500">Name</span>
                              <div className="font-medium text-gray-900">{a.name || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Gender</span>
                              <div className="font-medium text-gray-900 capitalize">{a.gender || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Nationality</span>
                              <div className="font-medium text-gray-900">{a.nationality || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Passport</span>
                              <div className="font-medium text-gray-900">{a.passportNumber || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Age</span>
                              <div className="font-medium text-gray-900">{a.age || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Role</span>
                              <div className="font-medium text-[#2C2F7C]">{i === state.familyHeadIndex ? 'Family Head' : 'Adult'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Children Details */}
                  {state.children > 0 && (
                    <Card className="p-6 border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Children Details</h3>
                      <div className="space-y-3">
                        {state.childrenDetails.map((c: any, i: number) => (
                          <div key={`child-review-${i}`} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-3 rounded">
                            <div>
                              <span className="text-xs text-gray-500">Name</span>
                              <div className="font-medium text-gray-900">{c.name || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Gender</span>
                              <div className="font-medium text-gray-900 capitalize">{c.gender || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Nationality</span>
                              <div className="font-medium text-gray-900">{c.nationality || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Age</span>
                              <div className="font-medium text-gray-900">{c.age || '—'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Infants Details */}
                  {state.infants > 0 && (
                    <Card className="p-6 border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Infants Details</h3>
                      <div className="space-y-3">
                        {state.infantsDetails.map((i: any, idx: number) => (
                          <div key={`infant-review-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-3 rounded">
                            <div>
                              <span className="text-xs text-gray-500">Name</span>
                              <div className="font-medium text-gray-900">{i.name || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Gender</span>
                              <div className="font-medium text-gray-900 capitalize">{i.gender || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Nationality</span>
                              <div className="font-medium text-gray-900">{i.nationality || '—'}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Age (months)</span>
                              <div className="font-medium text-gray-900">{i.age || '—'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <Card className="p-6 border-[#2C2F7C]/20 bg-gradient-to-br from-[#2C2F7C]/5 to-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>

                <div className="space-y-3 mb-4">
                  {state.adults > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Adults ({state.adults} × PKR {pricing?.adultPrice?.toLocaleString()})
                      </span>
                      <span className="font-semibold text-gray-900">PKR {(state.adults * (pricing?.adultPrice || 0)).toLocaleString()}</span>
                    </div>
                  )}
                  {state.children > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Children ({state.children} × PKR {pricing?.childPrice?.toLocaleString()})
                      </span>
                      <span className="font-semibold text-gray-900">PKR {(state.children * (pricing?.childPrice || 0)).toLocaleString()}</span>
                    </div>
                  )}
                  {state.infants > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Infants ({state.infants} × PKR {pricing?.infantPrice?.toLocaleString()})
                      </span>
                      <span className="font-semibold text-gray-900">PKR {(state.infants * (pricing?.infantPrice || 0)).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200 flex justify-between">
                    <span className="font-semibold text-gray-900">Subtotal</span>
                    <span className="text-lg font-bold text-[#2C2F7C]">
                      PKR{' '}
                      {(
                        state.adults * (pricing?.adultPrice || 0) +
                        state.children * (pricing?.childPrice || 0) +
                        state.infants * (pricing?.infantPrice || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Final price may vary based on selected options and current rates.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      

      {/* Footer Navigation */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
            {/* Previous Button */}
            <Button
              onClick={() => {
                setShowErrors(false);
                handlePrevious();
              }}
              variant="outline"
              className="h-9 md:h-11 px-4 md:px-6 text-sm md:text-base font-medium w-full sm:w-auto order-2 sm:order-1"
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {/* Progress Indicator - Compact */}
            <div className="flex items-center gap-1.5 md:gap-2 order-1 sm:order-2">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    disabled={step.id > currentStep}
                    className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm transition-all ${
                      step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : step.id === currentStep
                        ? 'bg-[#2C2F7C] text-white ring-2 ring-[#2C2F7C] ring-offset-1 md:ring-offset-2'
                        : 'bg-gray-300 text-gray-600'
                    } ${step.id <= currentStep ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-60'}`}
                  >
                    {step.id < currentStep ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : step.id}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-6 md:w-10 h-0.5 rounded transition-all ${
                        step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next/Complete Button with Error Message */}
            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 w-full sm:w-auto order-3">
              {showErrors && !canProceed() && (
                <span className="text-xs md:text-sm text-red-600 text-center sm:text-right">
                  Please fix the highlighted fields.
                </span>
              )}
              <Button
                onClick={() => {
                  if (currentStep === steps.length) {
                    handleComplete();
                  } else {
                    handleNext();
                  }
                }}
                disabled={isSubmitting}
                className={`h-9 md:h-11 px-4 md:px-6 text-sm md:text-base font-semibold w-full sm:w-auto ${
                  canProceed() ? 'bg-[#2C2F7C] hover:bg-[#1a1d4d]' : 'bg-[#2C2F7C] opacity-80'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : currentStep === steps.length ? (
                  'Complete Booking'
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
