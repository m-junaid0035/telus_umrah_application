import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Plane, Hotel, Users, Bed, Star, CheckCircle, Send, Plus, Minus, X, Wifi, ChevronRight, ChevronLeft, Check, Award, Globe, Headphones, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format, isBefore, startOfDay, addDays } from 'date-fns';
import { createCustomUmrahRequestAction } from '@/actions/customUmrahRequestActions';
import { fetchAllHotelsAction } from '@/actions/hotelActions';
import { fetchFormOptionsByTypeAction } from '@/actions/formOptionActions';
import { fetchActiveAdditionalServicesAction } from '@/actions/additionalServiceActions';
import { ServiceTypeDialog } from '@/components/ServiceTypeDialog';
import { FormOptionType } from '@/models/FormOption';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { LoginDialog } from './LoginDialog';

// Import airline logos
import sereneAirLogo from '@/assets/serene-air-logo.png';
import gulfAirLogo from '@/assets/gulf-air-logo.png';
import turkishAirlinesLogo from '@/assets/turkish-airline-logo.png';
import qatarAirwaysLogo from '@/assets/qatar-air-logo.png';
import saudiaLogo from '@/assets/saudi-air-logo.png';
import piaLogo from '@/assets/pia-logo.png';
import emiratesLogo from '@/assets/emirates-logo.png';

// Form options now fetched from backend
// Airlines logos mapping for display
const airlineLogoMap: Record<string, any> = {
  'Emirates': emiratesLogo,
  'Qatar Airways': qatarAirwaysLogo,
  'Turkish Airlines': turkishAirlinesLogo,
  'Saudia': saudiaLogo,
  'PIA': piaLogo,
  'Gulf Air': gulfAirLogo,
  'Serene Air': sereneAirLogo,
};

const serviceTypeIconMap: Record<string, React.ElementType> = {
  umrahVisa: Award,
  transport: Plane,
  zaiarat: MapPin,
  meals: Hotel, // Using Hotel as a placeholder for food/meals
  esim: Wifi,
};

const steps = [
  { number: 1, title: 'Services & Flight', description: 'Select services and flight details' },
  { number: 2, title: 'Travelers & Hotels', description: 'Travelers and hotel preferences' },
  { number: 3, title: 'Contact Info', description: 'Your contact information' },
];

interface HotelSelection {
  city: 'Makkah' | 'Madina';
  hotelClass: string;
  hotel: string;
  stayDuration: string;
  bedType: string;
}

interface BackendHotel {
  _id: string;
  name: string;
  star: number;
  type: 'Makkah' | 'Madina';
  availableBedTypes?: string[];
}

export function CustomUmrahForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    airline: '',
    airlineClass: '',
    adults: 1,
    children: 0,
    childAges: [] as number[],
    rooms: 1,
    selectedServices: [] as string[], // Array of service IDs
    name: '',
    email: '',
    phone: '',
    nationality: '',
  });

  const [hotelSelections, setHotelSelections] = useState<HotelSelection[]>([]);
  const { isAuthenticated, user } = useAuth();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendHotels, setBackendHotels] = useState<BackendHotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  
  // Form validation errors state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form options from backend
  const [fromCities, setFromCities] = useState<Array<{name: string, value: string, logo?: string}>>([]);
  const [toCities, setToCities] = useState<Array<{name: string, value: string, logo?: string}>>([]);
  const [airlines, setAirlines] = useState<Array<{name: string, value: string, logo?: string}>>([]);
  const [airlineClasses, setAirlineClasses] = useState<Array<{name: string, value: string}>>([]);
  const [nationalities, setNationalities] = useState<Array<{name: string, value: string}>>([]);
  const [additionalServices, setAdditionalServices] = useState<Array<{
    _id: string;
    name: string;
    description?: string;
    price: number;
    serviceType?: string;
    icon?: string;
  }>>([]);
  const [serviceTypes, setServiceTypes] = useState<Array<{
    type: string;
    label: string;
    services: Array<{ _id: string; name: string; price: number; description?: string }>;
  }>>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [serviceTypeDialogOpen, setServiceTypeDialogOpen] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setLoadingHotels(true);
      setLoadingOptions(true);
      
      try {
        // Load hotels
        const hotelsResult = await fetchAllHotelsAction();
        if (hotelsResult?.data && Array.isArray(hotelsResult.data)) {
          setBackendHotels(hotelsResult.data as BackendHotel[]);
        }
        
        // Load form options and additional services
        const [fromCitiesRes, toCitiesRes, airlinesRes, airlineClassesRes, nationalitiesRes, servicesRes] = await Promise.all([
          fetchFormOptionsByTypeAction(FormOptionType.FromCity),
          fetchFormOptionsByTypeAction(FormOptionType.ToCity),
          fetchFormOptionsByTypeAction(FormOptionType.Airline),
          fetchFormOptionsByTypeAction(FormOptionType.AirlineClass),
          fetchFormOptionsByTypeAction(FormOptionType.Nationality),
          fetchActiveAdditionalServicesAction(),
        ]);
        
        if (fromCitiesRes?.data) {
          setFromCities(fromCitiesRes.data.map(opt => ({
            name: opt.name,
            value: opt.value,
            logo: opt.logo,
          })));
        }
        
        if (toCitiesRes?.data) {
          setToCities(toCitiesRes.data.map(opt => ({
            name: opt.name,
            value: opt.value,
            logo: opt.logo,
          })));
        }
        
        if (airlinesRes?.data) {
          setAirlines(airlinesRes.data.map(opt => ({
            name: opt.name,
            value: opt.value,
            logo: opt.logo || airlineLogoMap[opt.name],
          })));
        }
        
        if (airlineClassesRes?.data) {
          setAirlineClasses(airlineClassesRes.data.map(opt => ({
            name: opt.name,
            value: opt.value,
          })));
        }
        
        if (nationalitiesRes?.data) {
          setNationalities(nationalitiesRes.data.map(opt => ({
            name: opt.name,
            value: opt.value,
          })));
        }
        
        // Always show the 5 service types, even if no services exist
        const typeGroups: Record<string, Array<{ _id: string; name: string; price: number; description?: string }>> = {
          umrahVisa: [],
          transport: [],
          zaiarat: [],
          meals: [],
          esim: [],
        };
        
        // Group services by type if they exist
        if (servicesRes?.data && Array.isArray(servicesRes.data)) {
          setAdditionalServices(servicesRes.data);
          
          servicesRes.data.forEach((service: any) => {
            // Check both serviceType and icon fields (icon as fallback)
            const serviceType = service.serviceType || service.icon;
            // Match serviceType (case-insensitive)
            if (serviceType) {
              const normalizedType = String(serviceType).toLowerCase().trim();
              
              // Check if it matches one of our 5 types with flexible matching
              // Umrah Visa
              if (normalizedType === 'umrahvisa' || normalizedType === 'umrah-visa' || normalizedType === 'visa') {
                typeGroups.umrahVisa.push({
                  _id: service._id,
                  name: service.name,
                  price: service.price,
                  description: service.description,
                });
              } 
              // Transport
              else if (normalizedType === 'transport') {
                typeGroups.transport.push({
                  _id: service._id,
                  name: service.name,
                  price: service.price,
                  description: service.description,
                });
              } 
              // Zaiarat - handle common typos: zairat, ziarat, ziyara, ziyarat
              else if (normalizedType === 'zaiarat' || 
                       normalizedType === 'zairat' || 
                       normalizedType === 'ziarat' || 
                       normalizedType === 'ziyara' || 
                       normalizedType === 'ziyarat' ||
                       normalizedType.startsWith('zai') ||
                       normalizedType.startsWith('ziy')) {
                typeGroups.zaiarat.push({
                  _id: service._id,
                  name: service.name,
                  price: service.price,
                  description: service.description,
                });
              } 
              // Meals
              else if (normalizedType === 'meals' || normalizedType === 'meal') {
                typeGroups.meals.push({
                  _id: service._id,
                  name: service.name,
                  price: service.price,
                  description: service.description,
                });
              } 
              // eSIM
              else if (normalizedType === 'esim' || normalizedType === 'e-sim' || normalizedType === 'sim' || normalizedType === 'esimcard') {
                typeGroups.esim.push({
                  _id: service._id,
                  name: service.name,
                  price: service.price,
                  description: service.description,
                });
              }
            }
          });
        }
        
        // Always create service types array with labels (even if empty)
        const types = [
          { type: 'umrahVisa', label: 'Umrah Visa', services: typeGroups.umrahVisa },
          { type: 'transport', label: 'Transport', services: typeGroups.transport },
          { type: 'zaiarat', label: 'Zaiarat', services: typeGroups.zaiarat },
          { type: 'meals', label: 'Meals', services: typeGroups.meals },
          { type: 'esim', label: 'eSIM', services: typeGroups.esim },
        ];
        
        setServiceTypes(types);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        });
      } finally {
        setLoadingHotels(false);
        setLoadingOptions(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your request.",
        variant: "destructive",
      });
      setIsLoginDialogOpen(true);
      return;
    }
    
    // Validate all fields before submission
    const validation = validateAllFields();
    if (!validation.isValid) {
      const errorCount = Object.keys(validation.errors).length;
      const firstError = Object.values(validation.errors)[0];
      
      toast({
        title: "Validation Error",
        description: firstError || `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting`,
        variant: "destructive",
      });
      
      // Scroll to first error field after a short delay to ensure DOM is updated
      setTimeout(() => {
        const firstErrorField = document.querySelector('[class*="border-red-500"]');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return;
    }
    
    setIsSubmitting(true);

    // Validate contact information
    if (!formData.name || formData.name.trim().length < 2) {
      toast({
        title: "Error",
        description: "Please enter your full name (at least 2 characters)",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.phone || formData.phone.trim().length < 5) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.nationality || formData.nationality.trim().length < 2) {
      toast({
        title: "Error",
        description: "Please select your nationality",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate flight details
    if (!formData.from || formData.from.trim().length < 2) {
      toast({
        title: "Error",
        description: "Please select departure city",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.to || formData.to.trim().length < 2) {
      toast({
        title: "Error",
        description: "Please select destination city",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.departDate) {
      toast({
        title: "Error",
        description: "Please select departure date",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.returnDate) {
      toast({
        title: "Error",
        description: "Please select return date",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.airline || formData.airline.trim().length < 2) {
      toast({
        title: "Error",
        description: "Please select an airline",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.airlineClass || formData.airlineClass.trim().length < 1) {
      toast({
        title: "Error",
        description: "Please select airline class",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate dates
    const departDate = new Date(formData.departDate);
    const returnDate = new Date(formData.returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (departDate < today) {
      toast({
        title: "Error",
        description: "Departure date cannot be in the past",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (returnDate <= departDate) {
      toast({
        title: "Error",
        description: "Return date must be after departure date",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate hotel selections
    if (!hotelSelections || hotelSelections.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one hotel",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const invalidHotels = hotelSelections.filter((h, idx) => {
      const missing = !h.hotelClass || !h.hotel || !h.stayDuration || !h.bedType;
      if (missing) {
        console.log(`Hotel ${idx + 1} missing fields:`, {
          hotelClass: h.hotelClass,
          hotel: h.hotel,
          stayDuration: h.stayDuration,
          bedType: h.bedType
        });
      }
      return missing;
    });
    
    if (invalidHotels.length > 0) {
      const hotelNumbers = invalidHotels.map((_, idx) => idx + 1).join(', ');
      toast({
        title: "Error",
        description: `Please fill in all hotel details for hotel${invalidHotels.length > 1 ? 's' : ''} ${hotelNumbers}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate stay duration
    const invalidDurations = hotelSelections.filter((h, idx) => {
      const duration = parseInt(h.stayDuration || '0');
      const invalid = isNaN(duration) || duration < 1 || duration > 90;
      if (invalid) {
        console.log(`Hotel has invalid duration:`, h.stayDuration);
      }
      return invalid;
    });
    
    if (invalidDurations.length > 0) {
      toast({
        title: "Error",
        description: `Stay duration must be between 1 and 90 nights for all hotels`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate hotel names are not empty strings
    const emptyHotelNames = hotelSelections.filter((h, idx) => {
      return !h.hotel || h.hotel.trim().length === 0;
    });
    
    if (emptyHotelNames.length > 0) {
      toast({
        title: "Error",
        description: `Please select a hotel name for all hotel selections`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate child ages
    if (formData.childAges.some(age => age < 0 || age > 16)) {
      toast({
        title: "Error",
        description: "Child ages must be between 0 and 16 years",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      
      // Contact Information
      formDataObj.append("name", formData.name.trim());
      formDataObj.append("email", formData.email.trim().toLowerCase());
      formDataObj.append("phone", formData.phone.trim());
      formDataObj.append("nationality", formData.nationality.trim());

      // Flight Details
      formDataObj.append("from", formData.from.trim());
      formDataObj.append("to", formData.to.trim());
      if (!formData.departDate || !formData.returnDate) {
        toast({
          title: "Error",
          description: "Please select both departure and return dates",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      formDataObj.append("departDate", formData.departDate.toISOString());
      formDataObj.append("returnDate", formData.returnDate.toISOString());
      formDataObj.append("airline", formData.airline.trim());
      formDataObj.append("airlineClass", formData.airlineClass.trim());

      // Travelers
      formDataObj.append("adults", formData.adults.toString());
      formDataObj.append("children", formData.children.toString());
      formData.childAges.forEach(age => {
        formDataObj.append("childAges", age.toString());
      });
      formDataObj.append("rooms", formData.rooms.toString());

      // Additional Services - send selected service IDs
      // Always send the array, even if empty
      const servicesToSend = Array.isArray(formData.selectedServices) ? formData.selectedServices : [];
      formDataObj.append("selectedServices", JSON.stringify(servicesToSend));

      // Hotels - City is now part of hotel selection
      formDataObj.append("hotelCount", hotelSelections.length.toString());
      hotelSelections.forEach((hotel, index) => {
        const city = hotel.city;
        console.log(`Adding hotel ${index + 1}:`, { 
          hotelClass: hotel.hotelClass,
          hotel: hotel.hotel,
          stayDuration: hotel.stayDuration,
          bedType: hotel.bedType,
          city 
        });
        formDataObj.append(`hotels[${index}][hotelClass]`, hotel.hotelClass.trim());
        formDataObj.append(`hotels[${index}][hotel]`, hotel.hotel.trim());
        formDataObj.append(`hotels[${index}][stayDuration]`, hotel.stayDuration.trim());
        formDataObj.append(`hotels[${index}][bedType]`, hotel.bedType.trim());
        formDataObj.append(`hotels[${index}][city]`, city);
      });
      
      console.log("Submitting form with hotels:", hotelSelections.length);
      console.log("Form data being sent:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        from: formData.from,
        to: formData.to,
        departDate: formData.departDate?.toISOString(),
        returnDate: formData.returnDate?.toISOString(),
        airline: formData.airline,
        airlineClass: formData.airlineClass,
        adults: formData.adults,
        children: formData.children,
        rooms: formData.rooms,
        hotelCount: hotelSelections.length,
      });

      const result = await createCustomUmrahRequestAction({}, formDataObj);
      
      console.log("Server response:", result);

      if (result?.data) {
        // Reset form
        setFormData({
          from: '',
          to: '',
          departDate: undefined,
          returnDate: undefined,
          airline: '',
          airlineClass: '',
          adults: 1,
          children: 0,
          childAges: [],
          rooms: 1,
          selectedServices: [],
          name: '',
          email: '',
          phone: '',
          nationality: '',
        });
        setHotelSelections([]);
        setCurrentStep(1);
        // Redirect to thank you page
        router.push("/thank-you?type=custom");
      } else {
        console.error("Form submission error:", result?.error);
        let errorMessage = "Failed to submit request. Please try again.";
        
        if (result?.error) {
          // Handle Zod validation errors (fieldErrors format)
          if (typeof result.error === 'object' && !result.error.message) {
            const fieldErrors = Object.entries(result.error)
              .map(([field, errors]) => {
                const errorArray = Array.isArray(errors) ? errors : [errors];
                return `${field}: ${errorArray.join(', ')}`;
              })
              .join('; ');
            if (fieldErrors) {
              errorMessage = `Validation error: ${fieldErrors}`;
            }
          } else if (Array.isArray(result.error.message)) {
            errorMessage = result.error.message.join(', ');
          } else if (typeof result.error.message === 'string') {
            errorMessage = result.error.message;
          } else if (typeof result.error === 'object') {
            // Handle fieldErrors format
            const fieldErrors = Object.values(result.error).flat();
            if (fieldErrors.length > 0) {
              errorMessage = Array.isArray(fieldErrors[0]) ? fieldErrors[0][0] : String(fieldErrors[0]);
            }
          }
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedServices.includes(serviceId);
      return {
        ...prev,
        selectedServices: isSelected
          ? prev.selectedServices.filter(id => id !== serviceId)
          : [...prev.selectedServices, serviceId]
      };
    });
  };

  const addHotelSelection = (city: 'Makkah' | 'Madina') => {
    setHotelSelections(prev => [...prev, { city, hotelClass: '', hotel: '', stayDuration: '1', bedType: '' }]);
  };

  const removeHotelSelection = (index: number) => {
    setHotelSelections(hotelSelections.filter((_, i) => i !== index));
  };

  const updateHotelSelection = (index: number, field: keyof HotelSelection, value: string) => {
    const updated = [...hotelSelections];
    updated[index] = { ...updated[index], [field]: value };
    // If hotel class changes, reset hotel name and bed type
    if (field === 'hotelClass') {
      updated[index].hotel = '';
      updated[index].bedType = '';
    }
    // If hotel name changes, reset bed type
    if (field === 'hotel') {
      updated[index].bedType = '';
    }
    setHotelSelections(updated);
  };

  const getFilteredHotels = (starRating: string, city: 'Makkah' | 'Madina') => {
    if (!starRating || !backendHotels || backendHotels.length === 0 || !city) return [];
    const starNum = parseInt(starRating.replace('-star', ''));
    if (isNaN(starNum) || starNum < 1 || starNum > 5) return [];
    
    // First hotel is Makkah, rest are Madina
    const cityType = city;
    
    let filtered = backendHotels.filter(hotel => {
      if (!hotel || !hotel.star || !hotel.type || !hotel.name) return false;
      return hotel.star === starNum && hotel.type === cityType;
    });
    
    return filtered.map((hotel, idx) => ({
      name: hotel.name,
      star: hotel.star,
      _id: hotel._id || `${hotel.name}-${idx}-${Date.now()}`,
      originalIndex: idx, // Add original index for uniqueness
    }));
  };

  const incrementAdults = () => {
    if (formData.adults < 20) {
      setFormData({ ...formData, adults: formData.adults + 1 });
    }
  };

  const decrementAdults = () => {
    if (formData.adults > 1) {
      setFormData({ ...formData, adults: formData.adults - 1 });
    }
  };

  const incrementChildren = () => {
    if (formData.children < 10) {
      const newChildAges = [...formData.childAges, 0]; // Add a new child with default age 0
      setFormData({ ...formData, children: formData.children + 1, childAges: newChildAges });
    }
  };

  const decrementChildren = () => {
    if (formData.children > 0) {
      const newChildAges = formData.childAges.slice(0, -1); // Remove the last child's age
      setFormData({ ...formData, children: formData.children - 1, childAges: newChildAges });
    }
  };

  const updateChildAge = (index: number, age: number) => {
    const newChildAges = [...formData.childAges];
    newChildAges[index] = age;
    setFormData({ ...formData, childAges: newChildAges });
  };

  const incrementRooms = () => {
    if (formData.rooms < 10) {
      setFormData({ ...formData, rooms: Math.min(10, formData.rooms + 1) });
    }
  };

  const decrementRooms = () => {
    if (formData.rooms > 1) {
      setFormData({ ...formData, rooms: Math.max(1, formData.rooms - 1) });
    }
  };

  // Validation functions
  const validateField = (field: string, value: any) => {
    const errors: Record<string, string> = { ...formErrors };
    
    switch (field) {
      case 'name':
        if (!value || value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else {
          delete errors.name;
        }
        break;
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (!value || value.trim().length < 5) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      case 'nationality':
        if (!value || value.trim().length < 2) {
          errors.nationality = 'Please select your nationality';
        } else {
          delete errors.nationality;
        }
        break;
      case 'from':
        if (!value || value.trim().length < 2) {
          errors.from = 'Please select departure city';
        } else {
          delete errors.from;
        }
        break;
      case 'to':
        if (!value || value.trim().length < 2) {
          errors.to = 'Please select destination city';
        } else {
          delete errors.to;
        }
        break;
      case 'departDate':
        if (!value) {
          errors.departDate = 'Please select departure date';
        } else {
          const today = startOfDay(new Date());
          const selectedDate = startOfDay(new Date(value));
          if (isBefore(selectedDate, today)) {
            errors.departDate = 'Departure date cannot be in the past';
          } else {
            delete errors.departDate;
            // If return date exists and is before or equal to departure, show error
            if (formData.returnDate) {
              const returnDate = startOfDay(new Date(formData.returnDate));
              if (isBefore(returnDate, selectedDate) || returnDate.getTime() === selectedDate.getTime()) {
                errors.returnDate = 'Return date must be after departure date';
              } else {
                delete errors.returnDate;
              }
            }
          }
        }
        break;
      case 'returnDate':
        if (!value) {
          errors.returnDate = 'Please select return date';
        } else if (formData.departDate) {
          const departDate = startOfDay(new Date(formData.departDate));
          const returnDate = startOfDay(new Date(value));
          if (isBefore(returnDate, departDate) || returnDate.getTime() === departDate.getTime()) {
            errors.returnDate = 'Return date must be after departure date';
          } else {
            delete errors.returnDate;
          }
        } else {
          errors.returnDate = 'Please select departure date first';
        }
        break;
      case 'airline':
        if (!value || value.trim().length < 2) {
          errors.airline = 'Please select an airline';
        } else {
          delete errors.airline;
        }
        break;
      case 'airlineClass':
        if (!value || value.trim().length < 1) {
          errors.airlineClass = 'Please select airline class';
        } else {
          delete errors.airlineClass;
        }
        break;
    }
    
    setFormErrors(errors);
  };

  const validateAllFields = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    // Contact information
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone || formData.phone.trim().length < 5) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!formData.nationality || formData.nationality.trim().length < 2) {
      errors.nationality = 'Please select your nationality';
    }
    
    // Flight details
    if (!formData.from || formData.from.trim().length < 2) {
      errors.from = 'Please select departure city';
    }
    if (!formData.to || formData.to.trim().length < 2) {
      errors.to = 'Please select destination city';
    }
    if (!formData.departDate) {
      errors.departDate = 'Please select departure date';
    } else {
      const today = startOfDay(new Date());
      const selectedDate = startOfDay(new Date(formData.departDate));
      if (isBefore(selectedDate, today)) {
        errors.departDate = 'Departure date cannot be in the past';
      }
    }
    if (!formData.returnDate) {
      errors.returnDate = 'Please select return date';
    } else if (formData.departDate) {
      const departDate = startOfDay(new Date(formData.departDate));
      const returnDate = startOfDay(new Date(formData.returnDate));
      if (isBefore(returnDate, departDate) || returnDate.getTime() === departDate.getTime()) {
        errors.returnDate = 'Return date must be after departure date';
      }
    }
    if (!formData.airline || formData.airline.trim().length < 2) {
      errors.airline = 'Please select an airline';
    }
    if (!formData.airlineClass || formData.airlineClass.trim().length < 1) {
      errors.airlineClass = 'Please select airline class';
    }
    
    // Hotel validation
    if (!hotelSelections || hotelSelections.length === 0) {
      errors.hotels = 'Please add at least one hotel';
    } else {
      hotelSelections.forEach((hotel, idx) => {
        if (!hotel.hotelClass || !hotel.hotel || !hotel.stayDuration || !hotel.bedType) {
          errors[`hotel_${idx}`] = `Please fill in all details for hotel ${idx + 1}`;
        } else {
          const duration = parseInt(hotel.stayDuration || '0');
          if (isNaN(duration) || duration < 1 || duration > 90) {
            errors[`hotel_${idx}_duration`] = `Stay duration must be between 1 and 90 nights for hotel ${idx + 1}`;
          }
        }
      });
    }
    
    // Set errors in state immediately
    setFormErrors(errors);
    
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const nextStep = () => {
    // Validate current step before proceeding
    let canProceed = true;
    const stepErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      // Validate flight details
      if (!formData.from || formData.from.trim().length < 2) {
        stepErrors.from = 'Please select departure city';
        canProceed = false;
      }
      if (!formData.to || formData.to.trim().length < 2) {
        stepErrors.to = 'Please select destination city';
        canProceed = false;
      }
      if (!formData.departDate) {
        stepErrors.departDate = 'Please select departure date';
        canProceed = false;
      } else {
        const today = startOfDay(new Date());
        const selectedDate = startOfDay(new Date(formData.departDate));
        if (isBefore(selectedDate, today)) {
          stepErrors.departDate = 'Departure date cannot be in the past';
          canProceed = false;
        }
      }
      if (!formData.returnDate) {
        stepErrors.returnDate = 'Please select return date';
        canProceed = false;
      } else if (formData.departDate) {
        const departDate = startOfDay(new Date(formData.departDate));
        const returnDate = startOfDay(new Date(formData.returnDate));
        if (isBefore(returnDate, departDate) || returnDate.getTime() === departDate.getTime()) {
          stepErrors.returnDate = 'Return date must be after departure date';
          canProceed = false;
        }
      }
      if (!formData.airline || formData.airline.trim().length < 2) {
        stepErrors.airline = 'Please select an airline';
        canProceed = false;
      }
      if (!formData.airlineClass || formData.airlineClass.trim().length < 1) {
        stepErrors.airlineClass = 'Please select airline class';
        canProceed = false;
      }
    } else if (currentStep === 2) {
      // Validate hotels
      if (!hotelSelections || hotelSelections.length === 0) {
        stepErrors.hotels = 'Please add at least one hotel';
        canProceed = false;
      } else {
        hotelSelections.forEach((hotel, idx) => {
          if (!hotel.hotelClass || !hotel.hotel || !hotel.stayDuration || !hotel.bedType) {
            stepErrors[`hotel_${idx}`] = `Please fill in all details for hotel ${idx + 1}`;
            canProceed = false;
          } else {
            const duration = parseInt(hotel.stayDuration || '0');
            if (isNaN(duration) || duration < 1 || duration > 90) {
              stepErrors[`hotel_${idx}_duration`] = `Stay duration must be between 1 and 90 nights`;
              canProceed = false;
            }
          }
        });
      }
    }
    
    if (canProceed && currentStep < 3) {
      setFormErrors({});
      setCurrentStep(currentStep + 1);
    } else if (!canProceed) {
      // Set errors and show them
      setFormErrors(stepErrors);
      // Show toast for first error
      const firstError = Object.values(stepErrors)[0];
      if (firstError) {
        toast({
          title: "Validation Error",
          description: firstError,
          variant: "destructive",
        });
      }
      // Scroll to first error after state update
      setTimeout(() => {
        const firstErrorField = document.querySelector('[class*="border-red-500"]');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Clear errors when going back
      setFormErrors({});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        {/* Left Side - Step Indicator */}
        <div className="lg:w-80 bg-gradient-to-b from-[rgb(30,58,109)] to-[rgb(20,40,80)] p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="text-white mb-2">Customize Your Package</h2>
            <p className="text-blue-200 text-sm">Complete all steps to submit your request</p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Progress Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-4 top-10 w-0.5 h-16 bg-blue-400/30">
                    <motion.div
                      className="w-full bg-blue-300"
                      initial={{ height: 0 }}
                      animate={{ height: currentStep > step.number ? '100%' : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                {/* Step Content */}
                <div className="flex items-start gap-4 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep > step.number
                        ? 'bg-green-500'
                        : currentStep === step.number
                        ? 'bg-white text-[rgb(30,58,109)]'
                        : 'bg-blue-400/30 text-blue-200'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-sm font-semibold">{step.number}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-sm font-semibold transition-colors ${
                        currentStep >= step.number ? 'text-white' : 'text-blue-200'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-xs mt-1 transition-colors ${
                        currentStep >= step.number ? 'text-blue-200' : 'text-blue-300/60'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-blue-200 text-xs mb-2">
              <span>Progress</span>
              <span>{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-2">
              <motion.div
                className="bg-blue-300 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 space-y-4">
            <motion.div 
              className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-orange-500 rounded-full p-2">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Nusuk Partner</p>
                <p className="text-blue-200 text-xs">Official authorized partner</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-green-500 rounded-full p-2">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Global Offices</p>
                <p className="text-blue-200 text-xs">Worldwide presence</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-blue-500 rounded-full p-2">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Local Support</p>
                <p className="text-blue-200 text-xs">24/7 customer service</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="flex-1 p-6 md:p-8">
          {/* Error Summary Banner */}
          {Object.keys(formErrors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Please fix the following errors:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {Object.values(formErrors).slice(0, 5).map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                      {Object.keys(formErrors).length > 5 && (
                        <li>...and {Object.keys(formErrors).length - 5} more error(s)</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Additional Services & Flight Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Additional Services */}
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Additional Services</h3>
                  </div>

                  {loadingOptions ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                      <span className="ml-3 text-gray-600">Loading available services...</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap gap-3">
                        {serviceTypes.map((typeGroup) => {
                          const Icon = serviceTypeIconMap[typeGroup.type] || Headphones;
                          const isSelected = selectedServiceType === typeGroup.type;
                          const hasServices = typeGroup.services.length > 0;
                          const selectedCount = typeGroup.services.filter(s => formData.selectedServices.includes(s._id)).length;

                          return (
                            <motion.button
                              key={typeGroup.type}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={!hasServices}
                              onClick={() => {
                                if (hasServices) {
                                  setSelectedServiceType(isSelected ? null : typeGroup.type);
                                }
                              }}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-medium ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'
                              } ${!hasServices ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                              <span>{typeGroup.label}</span>
                              {selectedCount > 0 && (
                                <span className="text-xs bg-white/20 text-white rounded-full px-2">{selectedCount}</span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {selectedServiceType && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="border-t border-gray-200 pt-4"
                        >
                          <div className="flex flex-wrap gap-3">
                            {(serviceTypes.find(t => t.type === selectedServiceType)?.services || []).map((service) => {
                              const isSelected = formData.selectedServices.includes(service._id);
                              return (
                                <motion.div
                                  key={service._id}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleServiceToggle(service._id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-medium ${
                                      isSelected
                                        ? 'bg-green-600 border-green-600 text-white shadow-md'
                                        : 'bg-white border-gray-300 text-gray-700 hover:border-green-500'
                                    }`}
                                  >
                                    {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    <span>{service.name}</span>
                                    {service.price > 0 && (
                                      <span className={`text-xs opacity-80 ${isSelected ? 'text-green-100' : 'text-gray-500'}`}>
                                        (+PKR {service.price})
                                      </span>
                                    )}
                                  </button>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* Flight Details */}
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Plane className="w-5 h-5 text-blue-600" />
                    <h3 className="text-gray-900">Flight Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from" className="text-sm mb-2 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> From
                      </Label>
                      <Select 
                        value={formData.from} 
                        onValueChange={(value) => {
                          setFormData({ ...formData, from: value });
                          validateField('from', value);
                        }}
                      >
                        <SelectTrigger className={`bg-white ${formErrors.from ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select departure city" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingOptions ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : fromCities.length > 0 ? (
                            fromCities.map((city) => (
                              <SelectItem key={city.value} value={city.value}>{city.name}</SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-options" disabled>No cities available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {formErrors.from && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.from}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="to" className="text-sm mb-2 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> To
                      </Label>
                      <Select 
                        value={formData.to} 
                        onValueChange={(value) => {
                          setFormData({ ...formData, to: value });
                          validateField('to', value);
                        }}
                      >
                        <SelectTrigger className={`bg-white ${formErrors.to ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingOptions ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : toCities.length > 0 ? (
                            toCities.map((city) => (
                              <SelectItem key={city.value} value={city.value}>{city.name}</SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-options" disabled>No cities available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {formErrors.to && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.to}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm mb-2 flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" /> Depart Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className={`w-full justify-start text-left bg-white ${
                              formErrors.departDate ? 'border-red-500 focus:border-red-500' : ''
                            }`}
                          >
                            {formData.departDate ? format(formData.departDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.departDate}
                            onSelect={(date) => {
                              if (date) {
                                setFormData({ ...formData, departDate: date });
                                validateField('departDate', date);
                                // If return date exists and is invalid, re-validate it
                                if (formData.returnDate) {
                                  validateField('returnDate', formData.returnDate);
                                }
                              }
                            }}
                            disabled={(date) => isBefore(date, startOfDay(new Date()))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {formErrors.departDate && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.departDate}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm mb-2 flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" /> Return Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className={`w-full justify-start text-left bg-white ${
                              formErrors.returnDate ? 'border-red-500 focus:border-red-500' : ''
                            }`}
                          >
                            {formData.returnDate ? format(formData.returnDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.returnDate}
                            onSelect={(date) => {
                              if (date) {
                                setFormData({ ...formData, returnDate: date });
                                validateField('returnDate', date);
                              }
                            }}
                            disabled={(date) => {
                              const today = startOfDay(new Date());
                              // Disable past dates
                              if (isBefore(date, today)) return true;
                              // Disable dates before or equal to departure date
                              if (formData.departDate) {
                                const departDate = startOfDay(new Date(formData.departDate));
                                return isBefore(date, addDays(departDate, 1)) || date.getTime() === departDate.getTime();
                              }
                              return false;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {formErrors.returnDate && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.returnDate}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="airline" className="text-sm mb-2">Airline</Label>
                      <Select value={formData.airline} onValueChange={(value) => setFormData({ ...formData, airline: value })}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select airline" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingOptions ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : airlines.length > 0 ? (
                            airlines.map((airline) => (
                              <SelectItem key={airline.value} value={airline.value}>
                                <div className="flex items-center gap-2">
                                  {airline.logo && (
                                    <img 
                                      src={typeof airline.logo === 'string' ? airline.logo : (airline.logo as any)?.src || airline.logo} 
                                      alt={airline.name} 
                                      className="w-5 h-5 object-contain" 
                                    />
                                  )}
                                  <span>{airline.name}</span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-options" disabled>No airlines available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {formErrors.airline && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.airline}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="airlineClass" className="text-sm mb-2">Class</Label>
                      <Select 
                        value={formData.airlineClass} 
                        onValueChange={(value) => {
                          setFormData({ ...formData, airlineClass: value });
                          validateField('airlineClass', value);
                        }}
                      >
                        <SelectTrigger className={`bg-white ${formErrors.airlineClass ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingOptions ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : airlineClasses.length > 0 ? (
                            airlineClasses.map((cls) => (
                              <SelectItem key={cls.value} value={cls.value}>{cls.name}</SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="economy">Economy</SelectItem>
                              <SelectItem value="premium-economy">Premium Economy</SelectItem>
                              <SelectItem value="business">Business Class</SelectItem>
                              <SelectItem value="first">First Class</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      {formErrors.airlineClass && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.airlineClass}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Travelers & Rooms + Hotel Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Travelers & Rooms */}
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h3 className="text-gray-900">Travelers & Rooms</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="adults" className="text-sm mb-2">Adults</Label>
                      <div className="flex items-center gap-3 bg-white rounded-lg border p-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={decrementAdults}
                          disabled={formData.adults <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center">
                          <span className="text-gray-900">{formData.adults} Adult{formData.adults > 1 ? 's' : ''}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={incrementAdults}
                          disabled={formData.adults >= 20}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="children" className="text-sm mb-2">Children</Label>
                      <div className="flex items-center gap-3 bg-white rounded-lg border p-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={decrementChildren}
                          disabled={formData.children <= 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center">
                          <span className="text-gray-900">{formData.children} {formData.children === 1 ? 'Child' : 'Children'}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={incrementChildren}
                          disabled={formData.children >= 10}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="rooms" className="text-sm mb-2">Rooms</Label>
                      <div className="flex items-center gap-3 bg-white rounded-lg border p-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={decrementRooms}
                          disabled={formData.rooms <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center">
                          <span className="text-gray-900">{formData.rooms} Room{formData.rooms > 1 ? 's' : ''}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={incrementRooms}
                          disabled={formData.rooms >= 10}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Child Ages Section - Only show when children > 0 */}
                  {formData.children > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3"
                    >
                      {formData.childAges.map((age, index) => (
                        <div key={index}>
                          <Label className="text-sm mb-2">Child {index + 1} - Age needed</Label>
                          <Input
                            type="number"
                            min="0"
                            max="16"
                            value={age}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              if (value <= 16) {
                                updateChildAge(index, value);
                              }
                            }}
                            placeholder="Enter age (0-16)"
                            className="bg-white"
                          />
                        </div>
                      ))}
                      <p className="text-xs text-gray-600 mt-2">
                        To find you a place to stay that fits your entire group along with correct prices, we need to know how old your child will be at check-out
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Hotel Details */}
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Hotel className="w-5 h-5 text-green-600" />
                      <h3 className="text-gray-900">Hotel Details</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => addHotelSelection('Makkah')}
                        variant="outline"
                        size="sm"
                        className="bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Makkah Hotel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => addHotelSelection('Madina')}
                        variant="outline"
                        size="sm"
                        className="bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Madina Hotel
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {hotelSelections.length === 0 && (
                      <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed">
                        <Hotel className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hotels added</h3>
                        <p className="mt-1 text-sm text-gray-500">Select 'Add Makkah Hotel' or 'Add Madina Hotel' to get started.</p>
                      </div>
                    )}
                    {hotelSelections.map((selection, index) => {
                      const hotelNumber = hotelSelections.slice(0, index + 1).filter(h => h.city === selection.city).length;

                      return (
                        <div key={index} className="bg-white p-4 rounded-lg border-2 border-green-200 relative">
                          <Button
                            type="button"
                            onClick={() => removeHotelSelection(index)}
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          
                          <h4 className="text-sm text-gray-700 mb-3 font-semibold">{selection.city} Hotel {hotelNumber}</h4>
                          
                          {(formErrors[`hotel_${index}`] || formErrors[`hotel_${index}_duration`]) && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
                              {formErrors[`hotel_${index}`] && (
                                <p className="text-sm text-red-600">{formErrors[`hotel_${index}`]}</p>
                              )}
                              {formErrors[`hotel_${index}_duration`] && (
                                <p className="text-sm text-red-600">{formErrors[`hotel_${index}_duration`]}</p>
                              )}
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm mb-2 flex items-center gap-1">
                                <Star className="w-4 h-4" /> Hotel Class
                              </Label>
                              <Select 
                                value={selection.hotelClass} 
                                onValueChange={(value) => {
                                  updateHotelSelection(index, 'hotelClass', value);
                                  // Clear hotel error when hotel class is selected
                                  if (formErrors[`hotel_${index}`]) {
                                    const newErrors = { ...formErrors };
                                    delete newErrors[`hotel_${index}`];
                                    setFormErrors(newErrors);
                                  }
                                }}
                              >
                                <SelectTrigger className={`bg-white ${formErrors[`hotel_${index}`] && !selection.hotelClass ? 'border-red-500' : ''}`}>
                                  <SelectValue placeholder="Select rating first" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3-star">3 Star</SelectItem>
                                  <SelectItem value="4-star">4 Star</SelectItem>
                                  <SelectItem value="5-star">5 Star</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-sm mb-2">Hotel Name</Label>
                              <Select 
                                value={selection.hotel ? `${index}:${selection.hotel}` : undefined} 
                                onValueChange={(value) => {
                                  // Extract hotel name from value format "selectionIndex:hotelName"
                                  // Split only on the first colon to handle hotel names with colons
                                  const colonIndex = value.indexOf(':');
                                  const hotelName = colonIndex > -1 ? value.substring(colonIndex + 1) : value;
                                  updateHotelSelection(index, 'hotel', hotelName);
                                  // Clear hotel error when hotel is selected
                                  if (formErrors[`hotel_${index}`]) {
                                    const newErrors = { ...formErrors };
                                    delete newErrors[`hotel_${index}`];
                                    setFormErrors(newErrors);
                                  }
                                }}
                                disabled={!selection.hotelClass}
                              >
                                <SelectTrigger className={`bg-white ${formErrors[`hotel_${index}`] && !selection.hotel ? 'border-red-500' : ''}`}>
                                  <SelectValue placeholder={selection.hotelClass ? "Select hotel" : "Select class first"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {loadingHotels ? (
                                    <div className="px-2 py-1.5 text-sm text-gray-500">Loading hotels...</div>
                                  ) : getFilteredHotels(selection.hotelClass, selection.city).length === 0 ? (
                                    <div className="px-2 py-1.5 text-sm text-gray-500">No hotels available for this class in {selection.city}</div>
                                  ) : (
                                    getFilteredHotels(selection.hotelClass, selection.city).map((hotel, hotelIndex) => {
                                      // Create a truly unique key using selection index, hotel index, and hotel identifier
                                      // This ensures uniqueness even if hotel names or IDs are duplicated
                                      const hotelId = String(hotel._id || `hotel-${hotelIndex}`);
                                      const uniqueKey = `sel-${index}-hotel-${hotelIndex}-${hotelId.replace(/[^a-zA-Z0-9]/g, '-')}`;
                                      // Make value unique by including selection index to avoid conflicts between selections
                                      // Format: "selectionIndex:hotelName" - we'll extract hotel name in onValueChange
                                      const uniqueValue = `${index}:${hotel.name || hotelId}`;
                                      return (
                                        <SelectItem key={uniqueKey} value={uniqueValue}>
                                          {hotel.name}
                                        </SelectItem>
                                      );
                                    })
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-sm mb-2">Stay Duration (Nights)</Label>
                              <div className="flex items-center gap-3 bg-white rounded-lg border p-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => {
                                    const currentValue = parseInt(selection.stayDuration || '1') || 1;
                                    if (currentValue > 1) {
                                      updateHotelSelection(index, 'stayDuration', String(currentValue - 1));
                                    }
                                  }}
                                  disabled={parseInt(selection.stayDuration || '1') <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                
                                <div className="flex-1 text-center">
                                  <span className="text-gray-900">
                                    {selection.stayDuration || '1'} Night{parseInt(selection.stayDuration || '1') !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => {
                                    const currentValue = parseInt(selection.stayDuration || '1') || 1;
                                    if (currentValue >= 1 && currentValue < 90) {
                                      updateHotelSelection(index, 'stayDuration', String(currentValue + 1));
                                    }
                                  }}
                                  disabled={parseInt(selection.stayDuration || '1') >= 90}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-sm mb-2 flex items-center gap-1">
                                <Bed className="w-4 h-4" /> Bed Type
                              </Label>
                              <Select
                                value={selection.bedType}
                                onValueChange={(value) => {
                                  updateHotelSelection(index, 'bedType', value);
                                  // Clear hotel error when bed type is selected
                                  if (formErrors[`hotel_${index}`]) {
                                    const newErrors = { ...formErrors };
                                    delete newErrors[`hotel_${index}`];
                                    setFormErrors(newErrors);
                                  }
                                }}
                                disabled={!selection.hotel}
                              >
                                <SelectTrigger className={`bg-white ${formErrors[`hotel_${index}`] && !selection.bedType ? 'border-red-500' : ''}`}>
                                  <SelectValue placeholder="Select bed type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(backendHotels.find(h => h.name === selection.hotel)?.availableBedTypes || []).length > 0 ? (
                                    backendHotels.find(h => h.name === selection.hotel)?.availableBedTypes?.map(bedType => (
                                      <SelectItem key={bedType} value={bedType}>
                                        {bedType.charAt(0).toUpperCase() + bedType.slice(1)}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="no-options" disabled>
                                      {selection.hotel ? 'No bed types available' : 'Select a hotel first'}
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-gray-900 mb-4">Your Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm mb-2">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          validateField('name', e.target.value);
                        }}
                        placeholder="John Doe"
                        required
                        className={`bg-white ${formErrors.name ? 'border-red-500' : ''}`}
                      />
                      {formErrors.name && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm mb-2">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          validateField('email', e.target.value);
                        }}
                        placeholder="john@example.com"
                        required
                        className={`bg-white ${formErrors.email ? 'border-red-500' : ''}`}
                      />
                      {formErrors.email && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-sm mb-2">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          validateField('phone', e.target.value);
                        }}
                        placeholder="+92 300 1234567"
                        required
                        className={`bg-white ${formErrors.phone ? 'border-red-500' : ''}`}
                      />
                      {formErrors.phone && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nationality" className="text-sm mb-2">Nationality</Label>
                      <Select 
                        value={formData.nationality} 
                        onValueChange={(value) => {
                          setFormData({ ...formData, nationality: value });
                          validateField('nationality', value);
                        }}
                      >
                        <SelectTrigger className={`bg-white ${formErrors.nationality ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingOptions ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : nationalities.length > 0 ? (
                            nationalities.map((nat) => (
                              <SelectItem key={nat.value} value={nat.value}>{nat.name}</SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="pakistani">Pakistani</SelectItem>
                              <SelectItem value="indian">Indian</SelectItem>
                              <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                              <SelectItem value="saudi">Saudi Arabian</SelectItem>
                              <SelectItem value="emirati">Emirati</SelectItem>
                              <SelectItem value="egyptian">Egyptian</SelectItem>
                              <SelectItem value="indonesian">Indonesian</SelectItem>
                              <SelectItem value="malaysian">Malaysian</SelectItem>
                              <SelectItem value="turkish">Turkish</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      {formErrors.nationality && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.nationality}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </form>
        </div>
      </div>
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </motion.div>
  );
}
