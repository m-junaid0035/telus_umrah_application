import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar as CalendarIcon, MapPin, Plane, Hotel, Users, Bed, Star, CheckCircle, Send, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
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

interface HotelSelection {
  hotelClass: string;
  hotel: string;
  stayDuration: string;
  bedType: string;
}

export function CustomUmrahForm() {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    airline: '',
    airlineClass: '',
    adults: '1',
    children: '0',
    rooms: '1',
    umrahVisa: false,
    transport: false,
    zaiarat: false,
    meals: false,
    name: '',
    email: '',
    phone: '',
  });

  const [hotelSelections, setHotelSelections] = useState<HotelSelection[]>([
    { hotelClass: '', hotel: '', stayDuration: '', bedType: '' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, hotels: hotelSelections });
    alert('Thank you for your inquiry! We will contact you soon with the best package options.');
  };

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl p-6 md:p-8"
    >
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Customize Your Umrah Package</h2>
        <p className="text-gray-600">Fill in your details and we'll create the perfect package for you</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                        <Image src={airline.logo} alt={airline.name} className="w-5 h-5 object-contain" />
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

        {/* Hotel Details */}
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-green-600" />
              <h3 className="text-gray-900">Hotel Details</h3>
            </div>
            <Button
              type="button"
              onClick={addHotelSelection}
              variant="outline"
              size="sm"
              className="bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Another Hotel
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
                  <h4 className="text-sm text-gray-700 mb-3">Hotel {index + 1}</h4>
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
                    <Label className="text-sm mb-2">Stay Duration</Label>
                    <Select 
                      value={selection.stayDuration} 
                      onValueChange={(value) => updateHotelSelection(index, 'stayDuration', value)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="10">10 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                        <SelectItem value="21">21 Days</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
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

        {/* Travelers & Rooms */}
        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900">Travelers & Rooms</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="adults" className="text-sm mb-2">Adults</Label>
              <Select value={formData.adults} onValueChange={(value) => setFormData({ ...formData, adults: value })}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={String(num)}>{num} Adult{num > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="children" className="text-sm mb-2">Children</Label>
              <Select value={formData.children} onValueChange={(value) => setFormData({ ...formData, children: value })}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={String(num)}>{num} {num === 1 ? 'Child' : 'Children'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="rooms" className="text-sm mb-2">Rooms</Label>
              <Select value={formData.rooms} onValueChange={(value) => setFormData({ ...formData, rooms: value })}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={String(num)}>{num} Room{num > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-orange-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-orange-600" />
            <h3 className="text-gray-900">Additional Services</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Checkbox
                id="umrahVisa"
                checked={formData.umrahVisa}
                onCheckedChange={handleCheckboxChange('umrahVisa')}
              />
              <Label htmlFor="umrahVisa" className="cursor-pointer">
                <div>
                  <p className="text-sm">Umrah Visa</p>
                  <p className="text-xs text-gray-500">Visa processing included</p>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Checkbox
                id="transport"
                checked={formData.transport}
                onCheckedChange={handleCheckboxChange('transport')}
              />
              <Label htmlFor="transport" className="cursor-pointer">
                <div>
                  <p className="text-sm">Transport Facility</p>
                  <p className="text-xs text-gray-500">Airport & local transfers</p>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Checkbox
                id="zaiarat"
                checked={formData.zaiarat}
                onCheckedChange={handleCheckboxChange('zaiarat')}
              />
              <Label htmlFor="zaiarat" className="cursor-pointer">
                <div>
                  <p className="text-sm">Zaiarat</p>
                  <p className="text-xs text-gray-500">Guided holy sites tour</p>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Checkbox
                id="meals"
                checked={formData.meals}
                onCheckedChange={handleCheckboxChange('meals')}
              />
              <Label htmlFor="meals" className="cursor-pointer">
                <div>
                  <p className="text-sm">Meals (Breakfast + Dinner)</p>
                  <p className="text-xs text-gray-500">Daily breakfast & dinner</p>
                </div>
              </Label>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-gray-900 mb-4">Your Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </div>

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-6 text-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Submit Request
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
