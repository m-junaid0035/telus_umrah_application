import { motion } from 'framer-motion';
import { Hotel, Star, MapPin, Navigation, Wifi, Coffee, UtensilsCrossed, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { Button } from './ui/button';

interface Hotel {
  id: number;
  name: string;
  stars: number;
  distanceFromHaram: string;
  price: number;
  image: string;
  amenities: string[];
  description: string;
  featured?: boolean;
  slug: string;
}

const makkahHotels: Hotel[] = [
  {
    id: 1,
    name: 'Swissotel Makkah',
    stars: 4,
    distanceFromHaram: '300m from Haram',
    price: 450,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant', 'Room Service'],
    description: 'Luxurious 5-star hotel with stunning Haram views, premium amenities, and exceptional service.',
    featured: true,
    slug: 'swissotel-makkah'
  },
  {
    id: 2,
    name: 'Hilton Suites Makkah',
    stars: 5,
    distanceFromHaram: 'Walking Distance to Haram',
    price: 420,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant', 'Gym'],
    description: 'Modern hotel with spacious rooms, excellent dining options, and close proximity to Haram.',
    featured: true,
    slug: 'hilton-suites-makkah'
  },
  {
    id: 3,
    name: 'Pullman Zamzam Makkah',
    stars: 5,
    distanceFromHaram: '150m from Haram',
    price: 500,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant', 'Spa'],
    description: 'Prestigious hotel offering unparalleled luxury and direct views of the Holy Mosque.',
    featured: true,
    slug: 'pullman-zamzam-makkah'
  },
  {
    id: 4,
    name: 'Dar Al Tawhid Intercontinental',
    stars: 5,
    distanceFromHaram: '250m from Haram',
    price: 380,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant', 'Parking'],
    description: 'Elegant accommodation with traditional hospitality and modern facilities.',
    slug: 'dar-al-tawhid-intercontinental'
  },
  {
    id: 5,
    name: 'Anjum Hotel Makkah',
    stars: 4,
    distanceFromHaram: '500m from Haram',
    price: 280,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant'],
    description: 'Comfortable 4-star hotel offering great value with excellent service and amenities.',
    slug: 'anjum-hotel-makkah'
  },
  {
    id: 6,
    name: 'Elaf Kinda Hotel',
    stars: 4,
    distanceFromHaram: '600m from Haram',
    price: 250,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Cafe'],
    description: 'Well-appointed hotel with modern rooms and friendly staff, perfect for pilgrims.',
    slug: 'elaf-kinda-hotel'
  },
  {
    id: 7,
    name: 'Shaza Makkah',
    stars: 4,
    distanceFromHaram: '700m from Haram',
    price: 220,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant'],
    description: 'Contemporary hotel featuring spacious accommodations and quality dining.',
    slug: 'shaza-makkah'
  },
  {
    id: 8,
    name: 'Al Safwah Royal Orchid',
    stars: 3,
    distanceFromHaram: '800m from Haram',
    price: 150,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    amenities: ['Free WiFi', 'Breakfast Included'],
    description: 'Budget-friendly hotel providing clean, comfortable rooms for pilgrims.',
    slug: 'al-safwah-royal-orchid'
  },
  {
    id: 9,
    name: 'Makkah Hotel',
    stars: 3,
    distanceFromHaram: '1.2km from Haram',
    price: 130,
    image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800',
    amenities: ['Free WiFi', 'Cafe'],
    description: 'Simple and affordable accommodation with essential amenities for a comfortable stay.',
    slug: 'makkah-hotel'
  },
];

export function MakkahHotelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 5 | 4 | 3>('all');

  const filteredHotels = selectedCategory === 'all' 
    ? makkahHotels 
    : makkahHotels.filter(hotel => hotel.stars === selectedCategory);

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Filter Section */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-[rgb(30,58,109)] text-xl mb-4">Filter by Category</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all' as const, label: 'All Hotels' },
                { value: 5 as const, label: '5 Star Hotels' },
                { value: 4 as const, label: '4 Star Hotels' },
                { value: 3 as const, label: '3 Star Hotels' },
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    selectedCategory === category.value
                      ? 'bg-[rgb(30,58,109)] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} in Makkah
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {hotel.featured && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
                  Featured
                </div>
              )}
              
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Stars */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl text-gray-900 mb-2 group-hover:text-[rgb(30,58,109)] transition-colors">
                  {hotel.name}
                </h3>
                
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{hotel.distanceFromHaram}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {hotel.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 3).map((amenity, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-500">Starting from</div>
                    <div className="text-2xl text-[rgb(30,58,109)]">
                      ${hotel.price}<span className="text-sm text-gray-500">/night</span>
                    </div>
                  </div>
                  <Link href={`/makkah-hotels/makkah/${hotel.slug}`}>
                    <Button className="bg-[rgb(30,58,109)] hover:bg-[rgb(40,70,130)]">
                      Book Now
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center py-16">
            <Hotel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hotels found in this category</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[rgb(30,58,109)] to-[rgb(40,70,130)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white text-3xl mb-4">Need Help Choosing a Hotel?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Our travel experts are here to help you find the perfect accommodation for your sacred journey.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-[rgb(0,0,0)] hover:bg-white hover:text-[rgb(30,58,109)]">
                Contact Our Experts
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
