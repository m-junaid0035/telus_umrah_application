import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import telusUmrahLogo from '@/assets/telusUmrahLogo.png';
import iataLogo from '@/assets/44ef5c6ec3045ea085ceaddcef7fbb8f2515c014.png';
import bbbLogo from '@/assets/b711db395614cbcb996756ed291a7626740b6387.png';
import travelAssociationLogo from '@/assets/ce778b366133b437fd922787fd579366f984e6a0.png';
import taapLogo from '@/assets/6995a250b2ba12c7621346bbaac407e97bf8f98b.png';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img 
                src={telusUmrahLogo.src} 
                alt="Telus Umrah - Complete Spiritual Journey" 
                className="h-14 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted travel partner for seamless flight and hotel bookings worldwide.
            </p>
            <div className="flex gap-3 mb-6">
              <a href="/" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="/" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="/" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="/" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="/umrah-packages" className="hover:text-blue-400 transition-colors">Umrah Packages</a></li>
              <li><a href="/customize-umrah" className="hover:text-blue-400 transition-colors">Custom Package</a></li>
              <li><a href="/hotel-flights" className="hover:text-blue-400 transition-colors">Hotel & Flights</a></li>
              <li><a href="/faq" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-400 transition-colors">Flight Booking</a></li>
              <li><a href="/" className="hover:text-blue-400 transition-colors">Hotel Reservation</a></li>
              <li><a href="/" className="hover:text-blue-400 transition-colors">Travel Packages</a></li>
              <li><a href="/" className="hover:text-blue-400 transition-colors">Visa Services</a></li>
              <li><a href="/" className="hover:text-blue-400 transition-colors">Umrah Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-blue-400" />
                <span>UG-14, Lucky center, 7-8 Jail Road, Lahore, 54000 Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Toll Free: 080033333</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Cell: (+92) 3004554040</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@telusumrah.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          {/* Links Section */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
            <a href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
              Terms & Conditions
            </a>
            <span className="text-gray-600">|</span>
            <a href="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-600">|</span>
            <a href="/faq" className="text-gray-400 hover:text-blue-400 transition-colors">
              FAQ
            </a>
          </div>
          
          {/* Copyright Section with Logos */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Side - Certification Logos */}
            <div className="flex gap-3 flex-wrap justify-center md:justify-start">
              <img 
                src={iataLogo.src} 
                alt="IATA Member" 
                className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <img 
                src={travelAssociationLogo.src} 
                alt="Travel Association" 
                className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <img 
                src={taapLogo.src} 
                alt="TAAP - Travel Agents Association of Pakistan" 
                className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
            
            {/* Center - Copyright Text */}
            <p className="text-sm text-gray-400 text-center">
              &copy; 2025 Telus Umrah. All rights reserved. Powered by Multi Travel Pvt. Ltd
            </p>
            
            {/* Right Side - Certification Logos */}
            <div className="flex gap-3 flex-wrap justify-center md:justify-end">
              <img 
                src={iataLogo.src} 
                alt="IATA Member" 
                className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <img 
                src={travelAssociationLogo.src} 
                alt="Travel Association" 
                className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <img 
                src={taapLogo.src} 
                alt="TAAP - Travel Agents Association of Pakistan" 
                className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
