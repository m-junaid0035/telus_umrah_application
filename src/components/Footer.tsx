import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import telusUmrahLogo from '@/assets/38af052b7ba388561a7dda5e437b3035c02ec0c6.png';
import iataLogo from '@/assets/44ef5c6ec3045ea085ceaddcef7fbb8f2515c014.png';
import bbbLogo from '@/assets/b711db395614cbcb996756ed291a7626740b6387.png';
import travelAssociationLogo from '@/assets/ce778b366133b437fd922787fd579366f984e6a0.png';
import taapLogo from '@/assets/6995a250b2ba12c7621346bbaac407e97bf8f98b.png';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image
                src={telusUmrahLogo}
                alt="Telus Umrah - Complete Spiritual Journey"
                className="h-14 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted travel partner for seamless flight and hotel bookings worldwide.
            </p>
            <div className="flex gap-3 mb-6">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            {/* Certification Logos */}
            <div className="flex gap-3 flex-wrap">
              <Image
                src={iataLogo}
                alt="IATA Member"
                className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <Image
                src={travelAssociationLogo}
                alt="Travel Association"
                className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <Image
                src={taapLogo}
                alt="TAAP - Travel Agents Association of Pakistan"
                className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Destinations</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#flight-booking" className="hover:text-blue-400 transition-colors">Flight Booking</a></li>
              <li><a href="#hotel-reservation" className="hover:text-blue-400 transition-colors">Hotel Reservation</a></li>
              <li><a href="#travel-packages" className="hover:text-blue-400 transition-colors">Travel Packages</a></li>
              <li><a href="#visa-services" className="hover:text-blue-400 transition-colors">Visa Services</a></li>
              <li><a href="#umrah-service" className="hover:text-blue-400 transition-colors">Umrah Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-blue-400" />
                <span>UG-14, Lucky center, 7-8 Jail Road, PO. Box 717 GPO, Lahore, 54000 Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Toll Free no.: 080033333</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Tel: (+92) 42 37595151</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Cell: (+92) 3004554040</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>multitravel@hotmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Telus Umrah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
