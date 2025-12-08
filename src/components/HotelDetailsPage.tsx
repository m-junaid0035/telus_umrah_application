import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Star, 
  MapPin, 
  Wifi, 
  Coffee, 
  Utensils, 
  Car, 
  Dumbbell,
  Wind,
  Tv,
  Bath,
  Bed,
  Users,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  Building2,
  Clock,
  Shield,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { HotelBookingDialog } from './HotelBookingDialog';
import { fetchAllHotelsAction } from '@/actions/hotelActions';

// Import Makkah and Madina icons
import makkahIcon from '@/assets/makkah-icon.png';
import madinaIcon from '@/assets/madina-icon.png';

// Hotel data - In a real app, this would come from an API
const hotelsData: any = {
  makkah: {
    'al-safwah-royal-orchid': {
      name: 'Al Safwah Royal Orchid',
      stars: 3,
      distance: '800m from Haram',
      city: 'Makkah',
      address: 'Ibrahim Al Khalil Street, Makkah 24231, Saudi Arabia',
      price: 45000,
      rating: 4.3,
      reviews: 1250,
      description: 'Al Safwah Royal Orchid offers comfortable accommodation near the Holy Haram. Perfect for pilgrims seeking quality stay at affordable prices.',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Free WiFi', description: 'High-speed internet' },
        { icon: Wind, name: 'Air Conditioning', description: 'Climate control' },
        { icon: Utensils, name: 'Restaurant', description: 'On-site dining' },
        { icon: Coffee, name: 'Room Service', description: '24/7 service' },
        { icon: Car, name: 'Airport Transfer', description: 'Free shuttle' },
        { icon: Tv, name: 'Satellite TV', description: 'Multiple channels' },
        { icon: Bath, name: 'Private Bathroom', description: 'En-suite' },
        { icon: Shield, name: 'Safety Deposit', description: 'Secure storage' }
      ],
      roomTypes: [
        { type: 'Standard Room', capacity: '2-3 People', size: '25 sqm', price: 45000 },
        { type: 'Deluxe Room', capacity: '2-4 People', size: '35 sqm', price: 65000 },
        { type: 'Family Suite', capacity: '4-6 People', size: '50 sqm', price: 95000 }
      ],
      features: [
        '24/7 Front Desk',
        'Prayer Room',
        'Laundry Service',
        'Currency Exchange',
        'Baggage Storage',
        'Elevator Access',
        'Daily Housekeeping',
        'Multilingual Staff'
      ],
      nearbyPlaces: [
        { name: 'Masjid al-Haram', distance: '800m', time: '10 min walk' },
        { name: 'Abraj Al Bait', distance: '1.2km', time: '15 min walk' },
        { name: 'Makkah Mall', distance: '2.5km', time: '8 min drive' }
      ]
    },
    'swissotel-makkah': {
      name: 'Swissotel Makkah',
      stars: 4,
      distance: '300m from Haram',
      city: 'Makkah',
      address: 'Al Khalil Road, Makkah 24231, Saudi Arabia',
      price: 85000,
      rating: 4.7,
      reviews: 2150,
      description: 'Swissotel Makkah offers premium accommodation with stunning views of the Holy Haram. Experience luxury and comfort in close proximity to the sacred mosque.',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Free WiFi', description: 'High-speed internet' },
        { icon: Wind, name: 'Air Conditioning', description: 'Climate control' },
        { icon: Utensils, name: 'Multiple Restaurants', description: 'International cuisine' },
        { icon: Coffee, name: '24/7 Room Service', description: 'Round-the-clock service' },
        { icon: Car, name: 'Valet Parking', description: 'Premium parking' },
        { icon: Dumbbell, name: 'Fitness Center', description: 'Modern gym' },
        { icon: Tv, name: 'Smart TV', description: 'Premium channels' },
        { icon: Shield, name: 'Security', description: '24/7 surveillance' }
      ],
      roomTypes: [
        { type: 'Superior Room', capacity: '2-3 People', size: '32 sqm', price: 85000 },
        { type: 'Deluxe Haram View', capacity: '2-3 People', size: '38 sqm', price: 125000 },
        { type: 'Executive Suite', capacity: '2-4 People', size: '55 sqm', price: 165000 }
      ],
      features: [
        '24/7 Concierge',
        'Prayer Room',
        'Spa & Wellness',
        'Business Center',
        'Meeting Rooms',
        'Laundry & Dry Cleaning',
        'Luxury Amenities',
        'Express Check-in/out'
      ],
      nearbyPlaces: [
        { name: 'Masjid al-Haram', distance: '300m', time: '4 min walk' },
        { name: 'Clock Tower', distance: '500m', time: '6 min walk' },
        { name: 'Zamzam Well', distance: '350m', time: '5 min walk' }
      ]
    },
    'hilton-suites-makkah': {
      name: 'Hilton Suites Makkah',
      stars: 5,
      distance: 'Walking Distance to Haram',
      city: 'Makkah',
      address: 'Jabal Omar, Makkah 24231, Saudi Arabia',
      price: 125000,
      rating: 4.9,
      reviews: 3200,
      description: 'Hilton Suites Makkah provides unparalleled luxury with direct access to the Holy Haram. Enjoy 5-star amenities and breathtaking views.',
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Premium WiFi', description: 'Ultra-fast internet' },
        { icon: Wind, name: 'Smart Climate', description: 'Intelligent AC' },
        { icon: Utensils, name: 'Fine Dining', description: 'Gourmet restaurants' },
        { icon: Coffee, name: 'Butler Service', description: 'Personal butler' },
        { icon: Car, name: 'Luxury Transfer', description: 'Premium vehicles' },
        { icon: Dumbbell, name: 'Premium Gym', description: 'State-of-the-art' },
        { icon: Tv, name: 'Entertainment', description: 'Premium streaming' },
        { icon: Sparkles, name: 'VIP Lounge', description: 'Exclusive access' }
      ],
      roomTypes: [
        { type: 'Deluxe Suite', capacity: '2 People', size: '45 sqm', price: 125000 },
        { type: 'Haram View Suite', capacity: '2-3 People', size: '60 sqm', price: 185000 },
        { type: 'Royal Suite', capacity: '2-4 People', size: '85 sqm', price: 265000 }
      ],
      features: [
        'VIP Concierge',
        'Private Prayer Room',
        'Luxury Spa',
        'Executive Lounge',
        'Personal Shopping',
        'Private Chef Available',
        'Chauffeur Service',
        'Priority Services'
      ],
      nearbyPlaces: [
        { name: 'Masjid al-Haram', distance: '150m', time: '2 min walk' },
        { name: 'King Abdullah Gate', distance: '100m', time: '1 min walk' },
        { name: 'Shopping District', distance: '200m', time: '3 min walk' }
      ]
    },
    'pullman-zamzam-makkah': {
      name: 'Pullman Zamzam Makkah',
      stars: 5,
      distance: '150m from Haram',
      city: 'Makkah',
      address: 'Abraj Al Bait, Makkah 24231, Saudi Arabia',
      price: 145000,
      rating: 4.8,
      reviews: 2450,
      description: 'Prestigious hotel offering unparalleled luxury and direct views of the Holy Mosque with world-class amenities.',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Premium WiFi', description: 'Ultra-fast internet' },
        { icon: Wind, name: 'Smart Climate', description: 'Intelligent AC' },
        { icon: Utensils, name: 'Fine Dining', description: 'Gourmet restaurants' },
        { icon: Coffee, name: 'Concierge Service', description: '24/7 service' },
        { icon: Car, name: 'Valet Parking', description: 'Premium parking' },
        { icon: Dumbbell, name: 'Spa & Wellness', description: 'Full spa' },
        { icon: Tv, name: 'Entertainment System', description: 'Premium streaming' },
        { icon: Sparkles, name: 'VIP Services', description: 'Exclusive amenities' }
      ],
      roomTypes: [
        { type: 'Deluxe Room', capacity: '2-3 People', size: '40 sqm', price: 145000 },
        { type: 'Haram View Suite', capacity: '2-3 People', size: '55 sqm', price: 195000 },
        { type: 'Royal Suite', capacity: '2-4 People', size: '75 sqm', price: 275000 }
      ],
      features: [
        'VIP Concierge',
        'Private Prayer Room',
        'Luxury Spa & Wellness',
        'Executive Lounge',
        'Premium Dining',
        'Valet Service',
        'Express Check-in/out',
        'Personal Butler Available'
      ],
      nearbyPlaces: [
        { name: 'Masjid al-Haram', distance: '150m', time: '2 min walk' },
        { name: 'Clock Tower', distance: '100m', time: '1 min walk' },
        { name: 'Shopping Mall', distance: '300m', time: '4 min walk' }
      ]
    },
    'dar-al-tawhid-intercontinental': {
      name: 'Dar Al Tawhid Intercontinental',
      stars: 5,
      distance: '250m from Haram',
      city: 'Makkah',
      address: 'Al Masjid Al Haram Road, Makkah 24231, Saudi Arabia',
      price: 110000,
      rating: 4.6,
      reviews: 1890,
      description: 'Elegant accommodation with traditional hospitality and modern facilities, offering premium comfort near the Holy Mosque.',
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Free WiFi', description: 'High-speed internet' },
        { icon: Wind, name: 'Air Conditioning', description: 'Climate control' },
        { icon: Utensils, name: 'Multiple Restaurants', description: 'International cuisine' },
        { icon: Coffee, name: 'Room Service', description: '24/7 available' },
        { icon: Car, name: 'Parking', description: 'Secure parking' },
        { icon: Dumbbell, name: 'Fitness Center', description: 'Modern gym' },
        { icon: Tv, name: 'Smart TV', description: 'Premium channels' },
        { icon: Shield, name: 'Security', description: '24/7 surveillance' }
      ],
      roomTypes: [
        { type: 'Superior Room', capacity: '2-3 People', size: '35 sqm', price: 110000 },
        { type: 'Deluxe Haram View', capacity: '2-3 People', size: '42 sqm', price: 145000 },
        { type: 'Executive Suite', capacity: '2-4 People', size: '60 sqm', price: 185000 }
      ],
      features: [
        '24/7 Concierge',
        'Prayer Facilities',
        'Business Center',
        'Meeting Rooms',
        'Laundry & Dry Cleaning',
        'Currency Exchange',
        'Express Check-in',
        'Tour Desk'
      ],
      nearbyPlaces: [
        { name: 'Masjid al-Haram', distance: '250m', time: '3 min walk' },
        { name: 'Abraj Al Bait', distance: '400m', time: '5 min walk' },
        { name: 'Makkah Museum', distance: '2km', time: '7 min drive' }
      ]
    },
    'anjum-hotel-makkah': {
      name: 'Anjum Hotel Makkah',
      stars: 4,
      distance: '500m from Haram',
      city: 'Makkah',
      address: 'Ibrahim Al Khalil Road, Makkah 24231, Saudi Arabia',
      price: 75000,
      rating: 4.4,
      reviews: 1120,
      description: 'Comfortable 4-star hotel offering great value with excellent service and amenities, perfect for pilgrims.',
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Free WiFi', description: 'High-speed internet' },
        { icon: Wind, name: 'Air Conditioning', description: 'Climate control' },
        { icon: Utensils, name: 'Restaurant', description: 'On-site dining' },
        { icon: Coffee, name: 'Cafe', description: 'Coffee shop' },
        { icon: Car, name: 'Shuttle Service', description: 'Free transport' },
        { icon: Tv, name: 'Satellite TV', description: 'Multiple channels' },
        { icon: Bath, name: 'Private Bathroom', description: 'En-suite' },
        { icon: Shield, name: 'Safe Deposit', description: 'Secure storage' }
      ],
      roomTypes: [
        { type: 'Standard Room', capacity: '2-3 People', size: '28 sqm', price: 75000 },
        { type: 'Deluxe Room', capacity: '2-4 People', size: '35 sqm', price: 95000 },
        { type: 'Family Suite', capacity: '4-6 People', size: '50 sqm', price: 135000 }
      ],
      features: [
        '24/7 Front Desk',
        'Prayer Room',
        'Laundry Service',
        'Currency Exchange',
        'Baggage Storage',
        'Elevator Access',
        'Daily Housekeeping',
        'Tour Information'
      ],
      nearbyPlaces: [
        { name: 'Masjid al-Haram', distance: '500m', time: '7 min walk' },
        { name: 'Shopping Area', distance: '800m', time: '10 min walk' },
        { name: 'Local Market', distance: '1km', time: '12 min walk' }
      ]
    },
    'elaf-kinda-hotel': {
      name: 'Elaf Kinda Hotel',
      stars: 4,
      distance: '600m from Haram',
      city: 'Makkah',
      address: 'Ajyad Street, Makkah 24231, Saudi Arabia',
      price: 68000,
      rating: 4.2,
      reviews: 950,
      description: 'Well-appointed hotel with modern rooms and friendly staff, perfect for pilgrims seeking comfort and convenience.',
      images: [
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
        'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Free WiFi', description: 'Fast internet' },
        { icon: Wind, name: 'AC', description: 'Climate control' },
        { icon: Coffee, name: 'Cafe', description: 'On-site cafe' },
        { icon: Utensils, name: 'Dining', description: 'Breakfast included' },
        { icon: Car, name: 'Transport', description: 'Shuttle available' },
        { icon: Tv, name: 'TV', description: 'Cable channels' },
        { icon: Bath, name: 'Bathroom', description: 'Private' },
        { icon: Shield, name: 'Safety', description: 'Safe box' }
      ],
      roomTypes: [
        { type: 'Standard Room', capacity: '2-3 People', size: '25 sqm', price: 68000 },
        { type: 'Deluxe Room', capacity: '2-4 People', size: '32 sqm', price: 85000 },
        { type: 'Family Room', capacity: '4-5 People', size: '45 sqm', price: 115000 }
      ],
      features: [
        '24/7 Reception',
        'Prayer Facilities',
        'Laundry',
        'Currency Exchange',
        'Luggage Storage',
        'Lift',
        'Daily Cleaning',
        'Helpful Staff'
      ],
      nearbyPlaces: [
        { name: 'Masjid al-Haram', distance: '600m', time: '8 min walk' },
        { name: 'Markets', distance: '500m', time: '6 min walk' },
        { name: 'Restaurants', distance: '300m', time: '4 min walk' }
      ]
    },
    'shaza-makkah': {
      name: 'Shaza Makkah',
      stars: 4,
      distance: '700m from Haram',
      city: 'Makkah',
      address: 'King Fahd Road, Makkah 24231, Saudi Arabia',
      price: 62000,
      rating: 4.3,
      reviews: 880,
      description: 'Contemporary hotel featuring spacious accommodations and quality dining options near the Holy Mosque.',
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
        'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80',
        'https://images.unsplash.com/photo-1631049307255-80e4e4c75d31?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'WiFi', description: 'Free internet' },
        { icon: Wind, name: 'AC', description: 'Central cooling' },
        { icon: Utensils, name: 'Restaurant', description: 'Breakfast included' },
        { icon: Coffee, name: 'Room Service', description: 'Available' },
        { icon: Car, name: 'Parking', description: 'Free parking' },
        { icon: Tv, name: 'TV', description: 'Satellite' },
        { icon: Bath, name: 'Bath', description: 'Modern' },
        { icon: Shield, name: 'Security', description: '24/7' }
      ],
      roomTypes: [
        { type: 'Standard Room', capacity: '2-3 People', size: '27 sqm', price: 62000 },
        { type: 'Superior Room', capacity: '2-4 People', size: '34 sqm', price: 78000 },
        { type: 'Suite', capacity: '4-5 People', size: '48 sqm', price: 105000 }
      ],
      features: [
        'Front Desk',
        'Prayer Room',
        'Laundry',
        'Exchange',
        'Storage',
        'Elevator',
        'Cleaning',
        'Support'
      ],
      nearbyPlaces: [
        { name: 'Masjid al-Haram', distance: '700m', time: '9 min walk' },
        { name: 'Shopping', distance: '1km', time: '12 min walk' },
        { name: 'Dining', distance: '400m', time: '5 min walk' }
      ]
    },
    'makkah-hotel': {
      name: 'Makkah Hotel',
      stars: 3,
      distance: '1.2km from Haram',
      city: 'Makkah',
      address: 'Al Aziziyah District, Makkah 24231, Saudi Arabia',
      price: 38000,
      rating: 4.0,
      reviews: 650,
      description: 'Simple and affordable accommodation with essential amenities for a comfortable stay, ideal for budget pilgrims.',
      images: [
        'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80',
        'https://images.unsplash.com/photo-1631049307255-80e4e4c75d31?w=800&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'WiFi', description: 'Free' },
        { icon: Wind, name: 'AC', description: 'Cooling' },
        { icon: Coffee, name: 'Cafe', description: 'Coffee shop' },
        { icon: Car, name: 'Shuttle', description: 'Transport' },
        { icon: Tv, name: 'TV', description: 'Basic' },
        { icon: Bath, name: 'Bath', description: 'Private' },
        { icon: Bed, name: 'Beds', description: 'Comfortable' },
        { icon: Shield, name: 'Safe', description: 'Storage' }
      ],
      roomTypes: [
        { type: 'Budget Room', capacity: '2-3 People', size: '20 sqm', price: 38000 },
        { type: 'Standard Room', capacity: '2-4 People', size: '28 sqm', price: 52000 },
        { type: 'Family Room', capacity: '4-6 People', size: '40 sqm', price: 75000 }
      ],
      features: [
        'Reception',
        'Prayer Space',
        'Laundry',
        'Storage',
        'Elevator',
        'Cleaning',
        'Basic Amenities',
        'Helpful Staff'
      ],
      nearbyPlaces: [
        { name: 'Masjid al-Haram', distance: '1.2km', time: '15 min walk' },
        { name: 'Bus Stop', distance: '200m', time: '3 min walk' },
        { name: 'Market', distance: '500m', time: '6 min walk' }
      ]
    }
  },
  madinah: {
    'al-eiman-royal': {
      name: 'Al Eiman Royal',
      stars: 3,
      distance: '500m from Masjid Nabawi',
      city: 'Madinah',
      address: 'King Faisal Road, Madinah 42311, Saudi Arabia',
      price: 42000,
      rating: 4.3,
      reviews: 980,
      description: 'Al Eiman Royal offers comfortable and affordable accommodation near the Prophet\'s Mosque. Ideal for pilgrims seeking quality service.',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Free WiFi', description: 'High-speed internet' },
        { icon: Wind, name: 'Air Conditioning', description: 'Climate control' },
        { icon: Utensils, name: 'Restaurant', description: 'On-site dining' },
        { icon: Coffee, name: 'Room Service', description: '24/7 service' },
        { icon: Car, name: 'Shuttle Service', description: 'Free transport' },
        { icon: Tv, name: 'Cable TV', description: 'Multiple channels' },
        { icon: Bath, name: 'Private Bath', description: 'En-suite' },
        { icon: Shield, name: 'Safe Box', description: 'In-room safe' }
      ],
      roomTypes: [
        { type: 'Standard Room', capacity: '2-3 People', size: '25 sqm', price: 42000 },
        { type: 'Deluxe Room', capacity: '2-4 People', size: '32 sqm', price: 58000 },
        { type: 'Family Room', capacity: '4-6 People', size: '48 sqm', price: 85000 }
      ],
      features: [
        '24/7 Reception',
        'Prayer Facilities',
        'Laundry Service',
        'Currency Exchange',
        'Baggage Storage',
        'Elevator',
        'Daily Cleaning',
        'Tour Desk'
      ],
      nearbyPlaces: [
        { name: 'Masjid Nabawi', distance: '500m', time: '7 min walk' },
        { name: 'Quba Mosque', distance: '5km', time: '12 min drive' },
        { name: 'Al Noor Mall', distance: '3km', time: '8 min drive' }
      ]
    },
    'crowne-plaza-madinah': {
      name: 'Crowne Plaza Madinah',
      stars: 4,
      distance: '200m from Masjid Nabawi',
      city: 'Madinah',
      address: 'Al Madinah Road, Madinah 42311, Saudi Arabia',
      price: 78000,
      rating: 4.7,
      reviews: 1850,
      description: 'Crowne Plaza Madinah offers premium hospitality with magnificent views of the Prophet\'s Mosque. Experience comfort and convenience.',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Premium WiFi', description: 'Fast internet' },
        { icon: Wind, name: 'Central AC', description: 'Climate control' },
        { icon: Utensils, name: 'Dining Options', description: 'Multiple restaurants' },
        { icon: Coffee, name: 'Room Service', description: '24/7 available' },
        { icon: Car, name: 'Parking', description: 'Secure parking' },
        { icon: Dumbbell, name: 'Gym', description: 'Fitness center' },
        { icon: Tv, name: 'Smart TV', description: 'HD channels' },
        { icon: Shield, name: 'Security', description: '24/7 security' }
      ],
      roomTypes: [
        { type: 'Superior Room', capacity: '2-3 People', size: '30 sqm', price: 78000 },
        { type: 'Nabawi View', capacity: '2-3 People', size: '36 sqm', price: 115000 },
        { type: 'Executive Suite', capacity: '2-4 People', size: '52 sqm', price: 145000 }
      ],
      features: [
        'Concierge Service',
        'Prayer Room',
        'Business Center',
        'Meeting Facilities',
        'Laundry Service',
        'Express Check-in',
        'Premium Toiletries',
        'Minibar'
      ],
      nearbyPlaces: [
        { name: 'Masjid Nabawi', distance: '200m', time: '3 min walk' },
        { name: 'Qiblatain Mosque', distance: '4km', time: '10 min drive' },
        { name: 'Dates Market', distance: '1.5km', time: '5 min drive' }
      ]
    },
    'oberoi-madinah': {
      name: 'Oberoi Madinah',
      stars: 5,
      distance: 'Walking Distance to Masjid Nabawi',
      city: 'Madinah',
      address: 'King Abdul Aziz Road, Madinah 42311, Saudi Arabia',
      price: 115000,
      rating: 4.9,
      reviews: 2800,
      description: 'Oberoi Madinah epitomizes luxury and elegance with premium services and stunning views of the Prophet\'s Mosque. An unparalleled experience.',
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Ultra-Fast WiFi', description: 'Fiber optic' },
        { icon: Wind, name: 'Smart Climate', description: 'AI-controlled AC' },
        { icon: Utensils, name: 'Fine Dining', description: 'Gourmet cuisine' },
        { icon: Coffee, name: 'Butler Service', description: 'Personal butler' },
        { icon: Car, name: 'Luxury Cars', description: 'Premium transport' },
        { icon: Dumbbell, name: 'Spa & Gym', description: 'Wellness center' },
        { icon: Tv, name: 'Entertainment', description: '4K streaming' },
        { icon: Sparkles, name: 'VIP Services', description: 'Exclusive amenities' }
      ],
      roomTypes: [
        { type: 'Luxury Suite', capacity: '2 People', size: '42 sqm', price: 115000 },
        { type: 'Nabawi View Suite', capacity: '2-3 People', size: '58 sqm', price: 175000 },
        { type: 'Presidential Suite', capacity: '2-4 People', size: '80 sqm', price: 245000 }
      ],
      features: [
        'Personal Concierge',
        'Private Prayer Hall',
        'Luxury Spa',
        'Private Dining',
        'Chauffeur Service',
        'Shopping Service',
        'Priority Check-in',
        'Exclusive Lounge'
      ],
      nearbyPlaces: [
        { name: 'Masjid Nabawi', distance: '120m', time: '2 min walk' },
        { name: 'Uhud Mountain', distance: '6km', time: '15 min drive' },
        { name: 'Museum', distance: '2km', time: '6 min drive' }
      ]
    },
    'anwar-al-madinah-movenpick': {
      name: 'Anwar Al Madinah Mövenpick',
      stars: 5,
      distance: '150m from Masjid-e-Nabawi',
      city: 'Madinah',
      address: 'King Fahd Road, Madinah 42311, Saudi Arabia',
      price: 120000,
      rating: 4.8,
      reviews: 2350,
      description: 'Luxurious hotel with exceptional views of the Prophet\'s Mosque and premium facilities offering world-class service.',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Premium WiFi', description: 'Ultra-fast internet' },
        { icon: Wind, name: 'Smart Climate', description: 'AI-controlled AC' },
        { icon: Utensils, name: 'Fine Dining', description: 'Gourmet restaurants' },
        { icon: Coffee, name: 'Butler Service', description: 'Personal butler' },
        { icon: Car, name: 'Luxury Transfer', description: 'Premium vehicles' },
        { icon: Dumbbell, name: 'Spa & Wellness', description: 'Full wellness center' },
        { icon: Tv, name: 'Entertainment', description: '4K streaming' },
        { icon: Sparkles, name: 'VIP Lounge', description: 'Exclusive access' }
      ],
      roomTypes: [
        { type: 'Deluxe Room', capacity: '2 People', size: '40 sqm', price: 120000 },
        { type: 'Nabawi View Suite', capacity: '2-3 People', size: '55 sqm', price: 165000 },
        { type: 'Royal Suite', capacity: '2-4 People', size: '75 sqm', price: 225000 }
      ],
      features: [
        'VIP Concierge',
        'Private Prayer Hall',
        'Luxury Spa',
        'Executive Lounge',
        'Personal Shopping',
        'Valet Service',
        'Priority Check-in',
        'Premium Services'
      ],
      nearbyPlaces: [
        { name: 'Masjid Nabawi', distance: '150m', time: '2 min walk' },
        { name: 'Qiblatain Mosque', distance: '4km', time: '10 min drive' },
        { name: 'Dates Market', distance: '1km', time: '4 min drive' }
      ]
    },
    'pullman-zamzam-madina': {
      name: 'Pullman Zamzam Madina',
      stars: 5,
      distance: '200m from Masjid-e-Nabawi',
      city: 'Madinah',
      address: 'Prince Abdulmohsen Bin Abdulaziz Road, Madinah 42311, Saudi Arabia',
      price: 125000,
      rating: 4.7,
      reviews: 2100,
      description: 'Modern luxury hotel offering world-class amenities and stunning mosque views with exceptional hospitality.',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Premium WiFi', description: 'High-speed internet' },
        { icon: Wind, name: 'Central AC', description: 'Climate control' },
        { icon: Utensils, name: 'Restaurants', description: 'Multiple dining options' },
        { icon: Coffee, name: 'Room Service', description: '24/7 service' },
        { icon: Car, name: 'Parking', description: 'Valet parking' },
        { icon: Dumbbell, name: 'Fitness Center', description: 'Modern gym' },
        { icon: Tv, name: 'Smart TV', description: 'Premium channels' },
        { icon: Shield, name: 'Security', description: '24/7 surveillance' }
      ],
      roomTypes: [
        { type: 'Superior Room', capacity: '2-3 People', size: '38 sqm', price: 125000 },
        { type: 'Nabawi View', capacity: '2-3 People', size: '45 sqm', price: 165000 },
        { type: 'Executive Suite', capacity: '2-4 People', size: '62 sqm', price: 205000 }
      ],
      features: [
        '24/7 Concierge',
        'Prayer Facilities',
        'Business Center',
        'Meeting Rooms',
        'Spa Services',
        'Laundry Service',
        'Express Check-in',
        'Premium Amenities'
      ],
      nearbyPlaces: [
        { name: 'Masjid Nabawi', distance: '200m', time: '3 min walk' },
        { name: 'Quba Mosque', distance: '5km', time: '12 min drive' },
        { name: 'Shopping Center', distance: '2km', time: '6 min drive' }
      ]
    },
    'elaf-taiba-hotel': {
      name: 'Elaf Taiba Hotel',
      stars: 4,
      distance: '500m from Masjid-e-Nabawi',
      city: 'Madinah',
      address: 'Al Madinah Al Munawwarah Road, Madinah 42311, Saudi Arabia',
      price: 72000,
      rating: 4.4,
      reviews: 1250,
      description: 'Comfortable 4-star hotel offering excellent value and quality service for pilgrims visiting the Holy Mosque.',
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Free WiFi', description: 'High-speed internet' },
        { icon: Wind, name: 'Air Conditioning', description: 'Climate control' },
        { icon: Utensils, name: 'Restaurant', description: 'On-site dining' },
        { icon: Coffee, name: 'Cafe', description: 'Coffee shop' },
        { icon: Car, name: 'Shuttle Service', description: 'Free transport' },
        { icon: Tv, name: 'Satellite TV', description: 'Multiple channels' },
        { icon: Bath, name: 'Private Bath', description: 'En-suite' },
        { icon: Shield, name: 'Safe Box', description: 'In-room safe' }
      ],
      roomTypes: [
        { type: 'Standard Room', capacity: '2-3 People', size: '28 sqm', price: 72000 },
        { type: 'Deluxe Room', capacity: '2-4 People', size: '35 sqm', price: 92000 },
        { type: 'Family Suite', capacity: '4-6 People', size: '50 sqm', price: 130000 }
      ],
      features: [
        '24/7 Front Desk',
        'Prayer Room',
        'Laundry Service',
        'Currency Exchange',
        'Baggage Storage',
        'Elevator Access',
        'Daily Housekeeping',
        'Tour Information'
      ],
      nearbyPlaces: [
        { name: 'Masjid Nabawi', distance: '500m', time: '7 min walk' },
        { name: 'Shopping Area', distance: '1km', time: '12 min walk' },
        { name: 'Local Market', distance: '800m', time: '10 min walk' }
      ]
    },
    'shaza-al-madina': {
      name: 'Shaza Al Madina',
      stars: 4,
      distance: '600m from Masjid-e-Nabawi',
      city: 'Madinah',
      address: 'King Fahd Road, Madinah 42311, Saudi Arabia',
      price: 65000,
      rating: 4.3,
      reviews: 980,
      description: 'Contemporary hotel with modern amenities and warm, welcoming atmosphere, ideal for pilgrims.',
      images: [
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
        'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Free WiFi', description: 'Fast internet' },
        { icon: Wind, name: 'AC', description: 'Climate control' },
        { icon: Coffee, name: 'Cafe', description: 'On-site cafe' },
        { icon: Utensils, name: 'Dining', description: 'Breakfast included' },
        { icon: Car, name: 'Transport', description: 'Shuttle available' },
        { icon: Tv, name: 'TV', description: 'Cable channels' },
        { icon: Bath, name: 'Bathroom', description: 'Private' },
        { icon: Shield, name: 'Safety', description: 'Safe box' }
      ],
      roomTypes: [
        { type: 'Standard Room', capacity: '2-3 People', size: '26 sqm', price: 65000 },
        { type: 'Deluxe Room', capacity: '2-4 People', size: '33 sqm', price: 82000 },
        { type: 'Family Room', capacity: '4-5 People', size: '46 sqm', price: 110000 }
      ],
      features: [
        '24/7 Reception',
        'Prayer Facilities',
        'Laundry',
        'Currency Exchange',
        'Luggage Storage',
        'Lift',
        'Daily Cleaning',
        'Helpful Staff'
      ],
      nearbyPlaces: [
        { name: 'Masjid Nabawi', distance: '600m', time: '8 min walk' },
        { name: 'Markets', distance: '700m', time: '9 min walk' },
        { name: 'Restaurants', distance: '400m', time: '5 min walk' }
      ]
    },
    'al-aqeeq-hotel': {
      name: 'Al Aqeeq Hotel',
      stars: 4,
      distance: '700m from Masjid-e-Nabawi',
      city: 'Madinah',
      address: 'Sultan Road, Madinah 42311, Saudi Arabia',
      price: 58000,
      rating: 4.2,
      reviews: 820,
      description: 'Well-appointed hotel providing comfortable stays with friendly staff and quality amenities.',
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
        'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80',
        'https://images.unsplash.com/photo-1631049307255-80e4e4c75d31?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'WiFi', description: 'Free internet' },
        { icon: Wind, name: 'AC', description: 'Central cooling' },
        { icon: Utensils, name: 'Restaurant', description: 'Breakfast included' },
        { icon: Coffee, name: 'Room Service', description: 'Available' },
        { icon: Car, name: 'Parking', description: 'Free parking' },
        { icon: Tv, name: 'TV', description: 'Satellite' },
        { icon: Bath, name: 'Bath', description: 'Modern' },
        { icon: Shield, name: 'Security', description: '24/7' }
      ],
      roomTypes: [
        { type: 'Standard Room', capacity: '2-3 People', size: '24 sqm', price: 58000 },
        { type: 'Superior Room', capacity: '2-4 People', size: '31 sqm', price: 73000 },
        { type: 'Suite', capacity: '4-5 People', size: '44 sqm', price: 98000 }
      ],
      features: [
        'Front Desk',
        'Prayer Room',
        'Laundry',
        'Exchange',
        'Storage',
        'Elevator',
        'Cleaning',
        'Support'
      ],
      nearbyPlaces: [
        { name: 'Masjid Nabawi', distance: '700m', time: '9 min walk' },
        { name: 'Shopping', distance: '1.2km', time: '14 min walk' },
        { name: 'Dining', distance: '500m', time: '6 min walk' }
      ]
    },
    'madinah-hilton-hotel': {
      name: 'Madinah Hilton Hotel',
      stars: 4,
      distance: '800m from Masjid-e-Nabawi',
      city: 'Madinah',
      address: 'King Abdullah Road, Madinah 42311, Saudi Arabia',
      price: 78000,
      rating: 4.5,
      reviews: 1450,
      description: 'Upscale hotel featuring spacious accommodations and quality facilities with excellent service.',
      images: [
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
        'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80',
        'https://images.unsplash.com/photo-1631049307255-80e4e4c75d31?w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'Premium WiFi', description: 'High-speed internet' },
        { icon: Wind, name: 'Central AC', description: 'Climate control' },
        { icon: Utensils, name: 'Restaurant', description: 'International cuisine' },
        { icon: Coffee, name: 'Room Service', description: '24/7 available' },
        { icon: Car, name: 'Parking', description: 'Secure parking' },
        { icon: Dumbbell, name: 'Pool & Gym', description: 'Fitness facilities' },
        { icon: Tv, name: 'Smart TV', description: 'HD channels' },
        { icon: Shield, name: 'Security', description: '24/7 security' }
      ],
      roomTypes: [
        { type: 'Standard Room', capacity: '2-3 People', size: '32 sqm', price: 78000 },
        { type: 'Deluxe Room', capacity: '2-4 People', size: '40 sqm', price: 105000 },
        { type: 'Suite', capacity: '4-5 People', size: '58 sqm', price: 145000 }
      ],
      features: [
        'Concierge Service',
        'Prayer Room',
        'Business Center',
        'Pool',
        'Laundry Service',
        'Express Check-in',
        'Premium Toiletries',
        'Minibar'
      ],
      nearbyPlaces: [
        { name: 'Masjid Nabawi', distance: '800m', time: '10 min walk' },
        { name: 'Quba Mosque', distance: '6km', time: '14 min drive' },
        { name: 'Shopping Mall', distance: '2.5km', time: '7 min drive' }
      ]
    },
    'madinah-plaza-hotel': {
      name: 'Madinah Plaza Hotel',
      stars: 3,
      distance: '1.2km from Masjid-e-Nabawi',
      city: 'Madinah',
      address: 'Al Aziziyah District, Madinah 42311, Saudi Arabia',
      price: 35000,
      rating: 4.0,
      reviews: 580,
      description: 'Affordable accommodation providing essential amenities for a comfortable stay, perfect for budget travelers.',
      images: [
        'https://images.unsplash.com/photo-1631049307255-80e4e4c75d31?w=800&q=80',
        'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'
      ],
      amenities: [
        { icon: Wifi, name: 'WiFi', description: 'Free' },
        { icon: Wind, name: 'AC', description: 'Cooling' },
        { icon: Coffee, name: 'Cafe', description: 'Coffee shop' },
        { icon: Car, name: 'Shuttle', description: 'Transport' },
        { icon: Tv, name: 'TV', description: 'Basic' },
        { icon: Bath, name: 'Bath', description: 'Private' },
        { icon: Bed, name: 'Beds', description: 'Comfortable' },
        { icon: Shield, name: 'Safe', description: 'Storage' }
      ],
      roomTypes: [
        { type: 'Budget Room', capacity: '2-3 People', size: '20 sqm', price: 35000 },
        { type: 'Standard Room', capacity: '2-4 People', size: '28 sqm', price: 48000 },
        { type: 'Family Room', capacity: '4-6 People', size: '42 sqm', price: 70000 }
      ],
      features: [
        'Reception',
        'Prayer Space',
        'Laundry',
        'Storage',
        'Elevator',
        'Cleaning',
        'Basic Amenities',
        'Helpful Staff'
      ],
      nearbyPlaces: [
        { name: 'Masjid Nabawi', distance: '1.2km', time: '15 min walk' },
        { name: 'Bus Stop', distance: '300m', time: '4 min walk' },
        { name: 'Market', distance: '600m', time: '7 min walk' }
      ]
    }
  }
};
// from this the hotel detail page start
interface BackendHotel {
  _id: string;
  name: string;
  star: number;
  type: 'Makkah' | 'Madina';
  location: string;
  distance?: string;
  images?: string[];
  amenities?: string[];
  description?: string;
  availableBedTypes?: string[];
  standardRoomPrice?: number;
  deluxeRoomPrice?: number;
  familySuitPrice?: number;
  transportPrice?: number;
  mealsPrice?: number;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

export function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(0);
  const [hotel, setHotel] = useState<BackendHotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [hotelId, setHotelId] = useState<string>("");

  // Generate slug from hotel name
  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  // Fetch hotel from backend by matching slug
  useEffect(() => {
    const findHotel = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const result = await fetchAllHotelsAction();
        if (result?.data && Array.isArray(result.data)) {
          // Find hotel by matching id
          const foundHotel = result.data.find((h: any) => h._id === id);
          
          if (foundHotel) {
            setHotel(foundHotel as BackendHotel);
            setHotelId(foundHotel._id);
          } else {
            console.warn(`Hotel not found for id: ${id}`);
            setHotel(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };
    findHotel();
  }, [id]); 

  const cityIcon = hotel?.type === 'Makkah' ? makkahIcon : madinaIcon;
  const cityName = hotel?.type === 'Makkah' ? 'Makkah' : 'Madinah';

  const nextImage = () => {
    if (hotel?.images && hotel.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % hotel.images!.length);
    }
  };

  const prevImage = () => {
    if (hotel?.images && hotel.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + hotel.images!.length) % hotel.images!.length);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl text-gray-900 mb-2">Loading hotel...</h2>
        </div>
      </div>
    );
  }

  // Not found state
  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">Hotel Not Found</h2>
          <p className="text-gray-600 mb-6">The hotel you're looking for doesn't exist.</p>
          <Link href="/umrah-packages">
            <Button>Browse Packages</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Default values for missing data
  const hotelImages = hotel.images && hotel.images.length > 0 ? hotel.images : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'];
  const hotelAmenities = hotel.amenities || [];
  const hotelDescription = hotel.description || 'Comfortable accommodation with excellent amenities.';
  const hotelAddress = hotel.contact?.address || hotel.location || 'Address not available';
  
  // Room types with prices from backend
  const roomTypes = [
    { 
      type: 'Standard Room', 
      capacity: '2-3 People', 
      size: '25 sqm', 
      price: hotel.standardRoomPrice || 50000 
    },
    { 
      type: 'Deluxe Room', 
      capacity: '2-4 People', 
      size: '35 sqm', 
      price: hotel.deluxeRoomPrice || 75000 
    },
    { 
      type: 'Family Suite', 
      capacity: '4-6 People', 
      size: '50 sqm', 
      price: hotel.familySuitPrice || 100000 
    }
  ].filter(room => room.price > 0); // Only show rooms with valid prices
  
  // Fallback: if no valid prices, show at least standard room with default price
  const displayRoomTypes = roomTypes.length > 0 ? roomTypes : [
    { type: 'Standard Room', capacity: '2-3 People', size: '25 sqm', price: 50000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section with Image Gallery */}
      <div className="relative bg-gray-900">
        <div className="relative h-[500px] overflow-hidden">
          <ImageWithFallback
            src={hotelImages[currentImageIndex]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Navigation Arrows - Only show if multiple images */}
          {hotelImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {hotelImages.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <div className="container mx-auto">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-white hover:bg-white/20 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={cityIcon.src} alt={cityName} className="w-8 h-8" />
                    <Badge className="bg-blue-600 text-white">
                      {cityName}
                    </Badge>
                    <div className="flex">
                      {[...Array(hotel.star || 0)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-3">{hotel.name}</h1>
                  <div className="flex items-center gap-4 text-white/90 flex-wrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{hotel.distance || hotel.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right bg-white/10 backdrop-blur-md p-6 rounded-lg">
                  <p className="text-white/80 text-sm mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-white">PKR {displayRoomTypes[0].price.toLocaleString()}</p>
                  <p className="text-white/70 text-sm">per night</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Hotel</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{hotelDescription}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{hotelAddress}</span>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {hotelAmenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotelAmenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{amenity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Room Types */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Room Types & Pricing</h2>
                <div className="space-y-4">
                  {displayRoomTypes.map((room: any, index: number) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      className={`p-5 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedRoomType === index
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedRoomType(index)}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">{room.type}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{room.capacity}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              <span>{room.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            PKR {room.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">per night</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Bed Types */}
            {hotel.availableBedTypes && hotel.availableBedTypes.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Bed Types</h2>
                  <div className="flex flex-wrap gap-2">
                    {hotel.availableBedTypes.map((bedType: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-sm p-2">
                        {bedType}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-blue-600">
                      PKR {displayRoomTypes[selectedRoomType]?.price.toLocaleString() || displayRoomTypes[0]?.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/night</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {displayRoomTypes[selectedRoomType]?.type || displayRoomTypes[0]?.type}
                  </p>
                </div>

                {/* Quick Info */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-semibold text-gray-900">2:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-semibold text-gray-900">12:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Distance</span>
                    <span className="font-semibold text-gray-900">{hotel.distance || hotel.location}</span>
                  </div>
                </div>

                {/* Booking Actions */}
                <div className="space-y-3">
                  {user ? (
                    hotelId ? (
                      <HotelBookingDialog
                        hotelId={hotelId}
                        hotelName={hotel.name}
                        user={user}
                        hotel={{
                          standardRoomPrice: hotel.standardRoomPrice,
                          deluxeRoomPrice: hotel.deluxeRoomPrice,
                          familySuitPrice: hotel.familySuitPrice,
                          transportPrice: hotel.transportPrice || 10000,
                          mealsPrice: hotel.mealsPrice || 5000,
                        }}
                        selectedRoomType={selectedRoomType}
                        trigger={
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-6">
                            <Calendar className="w-5 h-5 mr-2" />
                            Book Hotel
                          </Button>
                        }
                      />
                    ) : (
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-6"
                        disabled
                        title="Hotel ID not found. Please contact support."
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Book Hotel (Unavailable)
                      </Button>
                    )
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-6"
                      onClick={() => {
                        // Show login dialog or redirect to login
                        alert("Please login to book a hotel");
                      }}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Hotel
                    </Button>
                  )}
                  
                  <Link href="/customize-umrah" className="block">
                    <Button variant="outline" className="w-full py-6">
                      <Calendar className="w-5 h-5 mr-2" />
                      Book with Package
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full py-6">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Us
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Secure Booking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>Instant Confirmation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span>Best Price Guarantee</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-3">Need help? Contact us:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">+92 300 1234567</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">info@telusumrah.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        {hotel.contact && (hotel.contact.phone || hotel.contact.email) && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                {hotel.contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900">{hotel.contact.phone}</span>
                  </div>
                )}
                {hotel.contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900">{hotel.contact.email}</span>
                  </div>
                )}
                {hotel.contact.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900">{hotel.contact.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

