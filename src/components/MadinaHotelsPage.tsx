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

const madinaHotels: Hotel[] = [
  {
    id: 1,
    name: 'Anwar Al Madinah Mövenpick',
    stars: 5,
    distanceFromHaram: '150m from Masjid-e-Nabawi',
    price: 380,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant', 'Room Service'],
    description: 'Luxurious hotel with exceptional views of the Prophet\'s Mosque and premium facilities.',
    featured: true,
    slug: 'anwar-al-madinah-movenpick'
  },
  {
    id: 2,
    name: 'Pullman Zamzam Madina',
    stars: 5,
    distanceFromHaram: '200m from Masjid-e-Nabawi',
    price: 420,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant', 'Gym'],
    description: 'Modern luxury hotel offering world-class amenities and stunning mosque views.',
    featured: true,
    slug: 'pullman-zamzam-madina'
  },
  {
    id: 3,
    name: 'Crowne Plaza Madinah',
    stars: 4,
    distanceFromHaram: '200m from Masjid Nabawi',
    price: 350,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant', 'Spa'],
    description: 'Elegant hotel with spacious rooms and excellent dining options near the Holy Mosque.',
    featured: true,
    slug: 'crowne-plaza-madinah'
  },
  {
    id: 4,
    name: 'Oberoi Madinah',
    stars: 5,
    distanceFromHaram: 'Walking Distance to Masjid Nabawi',
    price: 340,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant', 'Parking'],
    description: 'Prestigious accommodation combining traditional hospitality with modern comfort.',
    slug: 'oberoi-madinah'
  },
  {
    id: 5,
    name: 'Elaf Taiba Hotel',
    stars: 4,
    distanceFromHaram: '500m from Masjid-e-Nabawi',
    price: 250,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant'],
    description: 'Comfortable 4-star hotel offering excellent value and quality service for pilgrims.',
    slug: 'elaf-taiba-hotel'
  },
  {
    id: 6,
    name: 'Shaza Al Madina',
    stars: 4,
    distanceFromHaram: '600m from Masjid-e-Nabawi',
    price: 230,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Cafe'],
    description: 'Contemporary hotel with modern amenities and warm, welcoming atmosphere.',
    slug: 'shaza-al-madina'
  },
  {
    id: 7,
    name: 'Al Aqeeq Hotel',
    stars: 4,
    distanceFromHaram: '700m from Masjid-e-Nabawi',
    price: 210,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant'],
    description: 'Well-appointed hotel providing comfortable stays with friendly staff.',
    slug: 'al-aqeeq-hotel'
  },
  {
    id: 8,
    name: 'Madinah Hilton Hotel',
    stars: 4,
    distanceFromHaram: '800m from Masjid-e-Nabawi',
    price: 260,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    amenities: ['Free WiFi', 'Breakfast Included', 'Pool'],
    description: 'Upscale hotel featuring spacious accommodations and quality facilities.',
    slug: 'madinah-hilton-hotel'
  },
  {
    id: 9,
    name: 'Al Eiman Royal',
    stars: 3,
    distanceFromHaram: '500m from Masjid Nabawi',
    price: 140,
    image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800',
    amenities: ['Free WiFi', 'Breakfast Included'],
    description: 'Budget-friendly hotel with clean, comfortable rooms for pilgrims.',
    slug: 'al-eiman-royal'
  },
  {
    id: 10,
    name: 'Madinah Plaza Hotel',
    stars: 3,
    distanceFromHaram: '1.2km from Masjid-e-Nabawi',
    price: 120,
    image: 'https://images.unsplash.com/photo-1631049307255-80e4e4c75d31?w=800',
    amenities: ['Free WiFi', 'Cafe'],
    description: 'Affordable accommodation providing essential amenities for a comfortable stay.',
    slug: 'madinah-plaza-hotel'
  },
];

export function MadinaHotelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 5 | 4 | 3>('all');

  const filteredHotels = selectedCategory === 'all' 
    ? madinaHotels 
    : madinaHotels.filter(hotel => hotel.stars === selectedCategory);

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
            Showing {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} in Madina
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
                  <Link href={`/madina-hotels/madinah/${hotel.slug}`}>
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
