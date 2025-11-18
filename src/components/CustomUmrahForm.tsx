import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Plane, Hotel, Users, Bed, Star, CheckCircle, Send, Plus, Minus, X, Wifi, ChevronRight, ChevronLeft, Check, Award, Globe, Headphones } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';

// Import airline logos
import sereneAirLogo from '@/assets/d0c55b978a086a73b2fb50854cf04ff81b6aac0b.png';
import gulfAirLogo from '@/assets/e28e0a2d39614f5bf7ea2c55d6fc579d46d4c9fc.png';
import turkishAirlinesLogo from '@/assets/ac3c2c97ff797a518e5f4d4cb47dcefc00bcb019.png';
import qatarAirwaysLogo from '@/assets/e8f7e43e4182484eee13d1fd750ab600da4a61b1.png';
import saudiaLogo from '@/assets/b9f20e713c92c82b6e94ffa74d871a980c8049ba.png';
import piaLogo from '@/assets/35293a117c78f2e22505cf3ae7ef2f152cf09f0b.png';
import emiratesLogo from '@/assets/bbf68fd4ecd3e7277285a22042637fbaafc25a7c.png';

const airlines = [
  { name: 'Emirates', logo: emiratesLogo },
  { name: 'Qatar Airways', logo: qatarAirwaysLogo },
  { name: 'Turkish Airlines', logo: turkishAirlinesLogo },
  { name: 'Saudia', logo: saudiaLogo },
  { name: 'PIA', logo: piaLogo },
  { name: 'Gulf Air', logo: gulfAirLogo },
  { name: 'Serene Air', logo: sereneAirLogo },
];

const hotels = [
  { name: 'Swissôtel Makkah', stars: '5-star' },
  { name: 'Hilton Suites Makkah', stars: '5-star' },
  { name: 'Pullman ZamZam', stars: '5-star' },
  { name: 'Fairmont Makkah', stars: '5-star' },
  { name: 'Movenpick Hotel', stars: '5-star' },
  { name: 'Anjum Hotel Makkah', stars: '4-star' },
  { name: 'Dar Al Eiman Royal', stars: '4-star' },
  { name: 'Millennium Makkah', stars: '4-star' },
  { name: 'Al Safwah Royale Orchid', stars: '4-star' },
  { name: 'Elaf Kinda Hotel', stars: '3-star' },
  { name: 'Al Kiswah Towers', stars: '3-star' },
  { name: 'Makkah Hotel', stars: '3-star' },
  { name: 'Azka Al Safa', stars: '3-star' },
];

const fromCities = [
  'Karachi, Pakistan',
  'Lahore, Pakistan',
  'Islamabad, Pakistan',
  'Multan, Pakistan',
  'Faisalabad, Pakistan',
  'Peshawar, Pakistan',
  'Quetta, Pakistan',
  'Sialkot, Pakistan',
];

const toCities = [
  'Jeddah, Saudi Arabia',
  'Madinah, Saudi Arabia',
];

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
    { hotelClass: '', hotel: '', stayDuration: '', bedType: '' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, hotels: hotelSelections });
    alert('Thank you for your inquiry! We will contact you soon with the best package options.');
  };

  const handleSwitchChange = (field: string) => (checked: boolean) => {
    setFormData({ ...formData, [field]: checked });
  };

  const addHotelSelection = () => {
    setHotelSelections([...hotelSelections, { hotelClass: '', hotel: '', stayDuration: '', bedType: '' }]);
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

  const getFilteredHotels = (starRating: string) => {
    return hotels.filter(hotel => hotel.stars === starRating);
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
      setFormData({ ...formData, rooms: formData.rooms + 1 });
    }
  };

  const decrementRooms = () => {
    if (formData.rooms > 1) {
      setFormData({ ...formData, rooms: formData.rooms - 1 });
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
                          {fromCities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
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
                          {toCities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
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
                          {airlines.map((airline) => (
                            <SelectItem key={airline.name} value={airline.name}>
                              <div className="flex items-center gap-2">
                                <img src={airline.logo.src} alt={airline.name} className="w-5 h-5 object-contain" />
                                {airline.name}
                              </div>
                            </SelectItem>
                          ))}
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
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="premium-economy">Premium Economy</SelectItem>
                          <SelectItem value="business">Business Class</SelectItem>
                          <SelectItem value="first">First Class</SelectItem>
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
                        
                        {hotelSelections.length > 1 && (
                          <h4 className="text-sm text-gray-700 mb-3">Madina Hotel {index + 1} details</h4>
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
                              value={selection.hotel} 
                              onValueChange={(value) => updateHotelSelection(index, 'hotel', value)}
                              disabled={!selection.hotelClass}
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder={selection.hotelClass ? "Select hotel" : "Select class first"} />
                              </SelectTrigger>
                              <SelectContent>
                                {getFilteredHotels(selection.hotelClass).map((hotel) => (
                                  <SelectItem key={hotel.name} value={hotel.name}>{hotel.name}</SelectItem>
                                ))}
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
                                  const currentValue = parseInt(selection.stayDuration) || 1;
                                  if (currentValue > 1) {
                                    updateHotelSelection(index, 'stayDuration', String(currentValue - 1));
                                  }
                                }}
                                disabled={!selection.stayDuration || parseInt(selection.stayDuration) <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              
                              <div className="flex-1 text-center">
                                <span className="text-gray-900">
                                  {selection.stayDuration || '0'} Night{parseInt(selection.stayDuration) !== 1 ? 's' : ''}
                                </span>
                              </div>
                              
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => {
                                  const currentValue = parseInt(selection.stayDuration) || 0;
                                  if (currentValue < 90) {
                                    updateHotelSelection(index, 'stayDuration', String(currentValue + 1));
                                  }
                                }}
                                disabled={!!selection.stayDuration && parseInt(selection.stayDuration) >= 90}
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
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Request
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