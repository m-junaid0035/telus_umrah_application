import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Plane, Hotel, Users, Bed, Star, CheckCircle, Send, Plus, Minus, X, Wifi, ChevronRight, ChevronLeft, Check, Award, Globe, Headphones, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { createCustomUmrahRequestAction } from '@/actions/customUmrahRequestActions';
import { fetchAllHotelsAction } from '@/actions/hotelActions';
import { fetchFormOptionsByTypeAction } from '@/actions/formOptionActions';
import { FormOptionType } from '@/models/FormOption';
import { toast } from '@/hooks/use-toast';

// Import airline logos
import sereneAirLogo from '@/assets/d0c55b978a086a73b2fb50854cf04ff81b6aac0b.png';
import gulfAirLogo from '@/assets/e28e0a2d39614f5bf7ea2c55d6fc579d46d4c9fc.png';
import turkishAirlinesLogo from '@/assets/ac3c2c97ff797a518e5f4d4cb47dcefc00bcb019.png';
import qatarAirwaysLogo from '@/assets/e8f7e43e4182484eee13d1fd750ab600da4a61b1.png';
import saudiaLogo from '@/assets/b9f20e713c92c82b6e94ffa74d871a980c8049ba.png';
import piaLogo from '@/assets/35293a117c78f2e22505cf3ae7ef2f152cf09f0b.png';
import emiratesLogo from '@/assets/bbf68fd4ecd3e7277285a22042637fbaafc25a7c.png';

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

const steps = [
  { number: 1, title: 'Services & Flight', description: 'Select services and flight details' },
  { number: 2, title: 'Travelers & Hotels', description: 'Travelers and hotel preferences' },
  { number: 3, title: 'Contact Info', description: 'Your contact information' },
];

interface HotelSelection {
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
}

export function CustomUmrahForm() {
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
    umrahVisa: false,
    transport: false,
    zaiarat: false,
    meals: false,
    esim: false,
    name: '',
    email: '',
    phone: '',
    nationality: '',
  });

  const [hotelSelections, setHotelSelections] = useState<HotelSelection[]>([
    { hotelClass: '', hotel: '', stayDuration: '1', bedType: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendHotels, setBackendHotels] = useState<BackendHotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  
  // Form options from backend
  const [fromCities, setFromCities] = useState<Array<{name: string, value: string, logo?: string}>>([]);
  const [toCities, setToCities] = useState<Array<{name: string, value: string, logo?: string}>>([]);
  const [airlines, setAirlines] = useState<Array<{name: string, value: string, logo?: string}>>([]);
  const [airlineClasses, setAirlineClasses] = useState<Array<{name: string, value: string}>>([]);
  const [nationalities, setNationalities] = useState<Array<{name: string, value: string}>>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

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
        
        // Load form options
        const [fromCitiesRes, toCitiesRes, airlinesRes, airlineClassesRes, nationalitiesRes] = await Promise.all([
          fetchFormOptionsByTypeAction(FormOptionType.FromCity),
          fetchFormOptionsByTypeAction(FormOptionType.ToCity),
          fetchFormOptionsByTypeAction(FormOptionType.Airline),
          fetchFormOptionsByTypeAction(FormOptionType.AirlineClass),
          fetchFormOptionsByTypeAction(FormOptionType.Nationality),
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
      } catch (error) {
        console.error("Failed to load data:", error);
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
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.nationality) {
      toast({
        title: "Error",
        description: "Please fill in all contact information fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.from || !formData.to || !formData.departDate || !formData.returnDate || !formData.airline || !formData.airlineClass) {
      toast({
        title: "Error",
        description: "Please fill in all flight details",
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
      toast({
        title: "Error",
        description: `Please fill in all hotel details${invalidHotels.length > 1 ? ' for all hotels' : ''}`,
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
        console.log(`Hotel ${idx + 1} has invalid duration:`, h.stayDuration);
      }
      return invalid;
    });
    
    if (invalidDurations.length > 0) {
      toast({
        title: "Error",
        description: `Stay duration must be between 1 and 90 nights${invalidDurations.length > 1 ? ' for all hotels' : ''}`,
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
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("phone", formData.phone);
      formDataObj.append("nationality", formData.nationality);

      // Flight Details
      formDataObj.append("from", formData.from);
      formDataObj.append("to", formData.to);
      formDataObj.append("departDate", formData.departDate.toISOString());
      formDataObj.append("returnDate", formData.returnDate.toISOString());
      formDataObj.append("airline", formData.airline);
      formDataObj.append("airlineClass", formData.airlineClass);

      // Travelers
      formDataObj.append("adults", formData.adults.toString());
      formDataObj.append("children", formData.children.toString());
      formData.childAges.forEach(age => {
        formDataObj.append("childAges", age.toString());
      });
      formDataObj.append("rooms", formData.rooms.toString());

      // Additional Services
      formDataObj.append("umrahVisa", formData.umrahVisa.toString());
      formDataObj.append("transport", formData.transport.toString());
      formDataObj.append("zaiarat", formData.zaiarat.toString());
      formDataObj.append("meals", formData.meals.toString());
      formDataObj.append("esim", formData.esim.toString());

      // Hotels - First hotel is Makkah, additional are Madina
      formDataObj.append("hotelCount", hotelSelections.length.toString());
      hotelSelections.forEach((hotel, index) => {
        const city = index === 0 ? "Makkah" : "Madina";
        console.log(`Adding hotel ${index + 1}:`, { ...hotel, city });
        formDataObj.append(`hotels[${index}][hotelClass]`, hotel.hotelClass || '');
        formDataObj.append(`hotels[${index}][hotel]`, hotel.hotel || '');
        formDataObj.append(`hotels[${index}][stayDuration]`, hotel.stayDuration || '1');
        formDataObj.append(`hotels[${index}][bedType]`, hotel.bedType || '');
        formDataObj.append(`hotels[${index}][city]`, city);
      });
      
      console.log("Submitting form with hotels:", hotelSelections.length);

      const result = await createCustomUmrahRequestAction({}, formDataObj);

      if (result?.data) {
        toast({
          title: "Success",
          description: "Thank you for your inquiry! We will contact you soon with the best package options.",
        });
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
          umrahVisa: false,
          transport: false,
          zaiarat: false,
          meals: false,
          esim: false,
          name: '',
          email: '',
          phone: '',
          nationality: '',
        });
        setHotelSelections([{ hotelClass: '', hotel: '', stayDuration: '1', bedType: '' }]);
        setCurrentStep(1);
      } else {
        console.error("Form submission error:", result?.error);
        let errorMessage = "Failed to submit request. Please try again.";
        
        if (result?.error) {
          if (Array.isArray(result.error.message)) {
            errorMessage = result.error.message[0];
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

  const handleSwitchChange = (field: string) => (checked: boolean) => {
    setFormData({ ...formData, [field]: checked });
  };

  const addHotelSelection = () => {
    setHotelSelections([...hotelSelections, { hotelClass: '', hotel: '', stayDuration: '1', bedType: '' }]);
  };

  const removeHotelSelection = (index: number) => {
    if (hotelSelections.length > 1) {
      setHotelSelections(hotelSelections.filter((_, i) => i !== index));
    }
  };

  const updateHotelSelection = (index: number, field: keyof HotelSelection, value: string) => {
    const updated = [...hotelSelections];
    updated[index] = { ...updated[index], [field]: value };
    // If hotel class changes, reset hotel name
    if (field === 'hotelClass') {
      updated[index].hotel = '';
    }
    setHotelSelections(updated);
  };

  const getFilteredHotels = (starRating: string, index: number) => {
    if (!starRating || !backendHotels || backendHotels.length === 0) return [];
    const starNum = parseInt(starRating.replace('-star', ''));
    if (isNaN(starNum) || starNum < 1 || starNum > 5) return [];
    
    // First hotel is Makkah, rest are Madina
    const cityType = index === 0 ? 'Makkah' : 'Madina';
    
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

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
                <div className="bg-orange-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="text-gray-900">Additional Services</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      formData.umrahVisa 
                        ? 'bg-[rgb(30,58,109)] text-white' 
                        : 'bg-white text-gray-900'
                    }`}>
                      <Label htmlFor="umrahVisa" className="cursor-pointer">
                        <div>
                          <p className="text-sm">Umrah Visa</p>
                          <p className={`text-xs ${formData.umrahVisa ? 'text-white/80' : 'text-gray-500'}`}>
                            Visa processing
                          </p>
                        </div>
                      </Label>
                      <Switch
                        id="umrahVisa"
                        checked={formData.umrahVisa}
                        onCheckedChange={handleSwitchChange('umrahVisa')}
                      />
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      formData.transport 
                        ? 'bg-[rgb(30,58,109)] text-white' 
                        : 'bg-white text-gray-900'
                    }`}>
                      <Label htmlFor="transport" className="cursor-pointer">
                        <div>
                          <p className="text-sm">Transport</p>
                          <p className={`text-xs ${formData.transport ? 'text-white/80' : 'text-gray-500'}`}>
                            Airport transfers
                          </p>
                        </div>
                      </Label>
                      <Switch
                        id="transport"
                        checked={formData.transport}
                        onCheckedChange={handleSwitchChange('transport')}
                      />
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      formData.zaiarat 
                        ? 'bg-[rgb(30,58,109)] text-white' 
                        : 'bg-white text-gray-900'
                    }`}>
                      <Label htmlFor="zaiarat" className="cursor-pointer">
                        <div>
                          <p className="text-sm">Zaiarat</p>
                          <p className={`text-xs ${formData.zaiarat ? 'text-white/80' : 'text-gray-500'}`}>
                            Holy sites tour
                          </p>
                        </div>
                      </Label>
                      <Switch
                        id="zaiarat"
                        checked={formData.zaiarat}
                        onCheckedChange={handleSwitchChange('zaiarat')}
                      />
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      formData.meals 
                        ? 'bg-[rgb(30,58,109)] text-white' 
                        : 'bg-white text-gray-900'
                    }`}>
                      <Label htmlFor="meals" className="cursor-pointer">
                        <div>
                          <p className="text-sm">Meals</p>
                          <p className={`text-xs ${formData.meals ? 'text-white/80' : 'text-gray-500'}`}>
                            Breakfast + Dinner
                          </p>
                        </div>
                      </Label>
                      <Switch
                        id="meals"
                        checked={formData.meals}
                        onCheckedChange={handleSwitchChange('meals')}
                      />
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      formData.esim 
                        ? 'bg-[rgb(30,58,109)] text-white' 
                        : 'bg-white text-gray-900'
                    }`}>
                      <Label htmlFor="esim" className="cursor-pointer">
                        <div>
                          <p className="text-sm">eSIM</p>
                          <p className={`text-xs ${formData.esim ? 'text-white/80' : 'text-gray-500'}`}>
                            Mobile connectivity
                          </p>
                        </div>
                      </Label>
                      <Switch
                        id="esim"
                        checked={formData.esim}
                        onCheckedChange={handleSwitchChange('esim')}
                      />
                    </div>
                  </div>
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
                      <Select value={formData.from} onValueChange={(value) => setFormData({ ...formData, from: value })}>
                        <SelectTrigger className="bg-white">
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
                    </div>
                    
                    <div>
                      <Label htmlFor="to" className="text-sm mb-2 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> To
                      </Label>
                      <Select value={formData.to} onValueChange={(value) => setFormData({ ...formData, to: value })}>
                        <SelectTrigger className="bg-white">
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
                    </div>
                    
                    <div>
                      <Label className="text-sm mb-2 flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" /> Depart Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left bg-white">
                            {formData.departDate ? format(formData.departDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.departDate}
                            onSelect={(date) => setFormData({ ...formData, departDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label className="text-sm mb-2 flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" /> Return Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left bg-white">
                            {formData.returnDate ? format(formData.returnDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.returnDate}
                            onSelect={(date) => setFormData({ ...formData, returnDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                    </div>
                    
                    <div>
                      <Label htmlFor="airlineClass" className="text-sm mb-2">Class</Label>
                      <Select value={formData.airlineClass} onValueChange={(value) => setFormData({ ...formData, airlineClass: value })}>
                        <SelectTrigger className="bg-white">
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
                      <h3 className="text-gray-900">Makkah Hotel Details</h3>
                    </div>
                    <Button
                      type="button"
                      onClick={addHotelSelection}
                      variant="outline"
                      size="sm"
                      className="bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Hotel for Madina
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {hotelSelections.map((selection, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border-2 border-green-200 relative">
                        {hotelSelections.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeHotelSelection(index)}
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {index === 0 && (
                          <h4 className="text-sm text-gray-700 mb-3 font-semibold">Makkah Hotel Details</h4>
                        )}
                        {index > 0 && (
                          <h4 className="text-sm text-gray-700 mb-3 font-semibold">Madina Hotel {index} Details</h4>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm mb-2 flex items-center gap-1">
                              <Star className="w-4 h-4" /> Hotel Class
                            </Label>
                            <Select 
                              value={selection.hotelClass} 
                              onValueChange={(value) => updateHotelSelection(index, 'hotelClass', value)}
                            >
                              <SelectTrigger className="bg-white">
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
                                const hotelName = value.includes(':') ? value.split(':')[1] : value;
                                updateHotelSelection(index, 'hotel', hotelName);
                              }}
                              disabled={!selection.hotelClass}
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder={selection.hotelClass ? "Select hotel" : "Select class first"} />
                              </SelectTrigger>
                              <SelectContent>
                                {loadingHotels ? (
                                  <div className="px-2 py-1.5 text-sm text-gray-500">Loading hotels...</div>
                                ) : getFilteredHotels(selection.hotelClass, index).length === 0 ? (
                                  <div className="px-2 py-1.5 text-sm text-gray-500">No hotels available for this class in {index === 0 ? 'Makkah' : 'Madina'}</div>
                                ) : (
                                  getFilteredHotels(selection.hotelClass, index).map((hotel, hotelIndex) => {
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
                              onValueChange={(value) => updateHotelSelection(index, 'bedType', value)}
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select bed type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">Single Bed</SelectItem>
                                <SelectItem value="double">Double Bed</SelectItem>
                                <SelectItem value="twin">Twin Beds</SelectItem>
                                <SelectItem value="triple">Triple Beds</SelectItem>
                                <SelectItem value="quad">Quad Room</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                        className="bg-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm mb-2">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                        className="bg-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-sm mb-2">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+92 300 1234567"
                        required
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="nationality" className="text-sm mb-2">Nationality</Label>
                      <Select 
                        value={formData.nationality} 
                        onValueChange={(value) => setFormData({ ...formData, nationality: value })}
                      >
                        <SelectTrigger className="bg-white">
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
    </motion.div>
  );
}