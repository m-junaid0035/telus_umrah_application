import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import telusUmrahLogo from '@/assets/telus-umrah-white.png';
import iataLogo from '@/assets/iata-logo.png';
import travelAssociationLogo from '@/assets/pata-logo.png';
import taapLogo from '@/assets/taap-logo.png';
import visaLogo from '@/assets/payment-icons/Visa.svg';
import mastercardLogo from '@/assets/payment-icons/Mastercard.svg';
import amexLogo from '@/assets/payment-icons/Amex.svg';
import paypalLogo from '@/assets/payment-icons/PayPal.svg';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <img 
              src={telusUmrahLogo.src} 
              alt="Telus Umrah - Complete Spiritual Journey" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm mb-4">
              Your trusted partner for memorable spiritual journeys.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="/umrah-packages" className="hover:text-blue-400 transition-colors">Umrah Packages</a></li>
              <li><a href="/customize-umrah" className="hover:text-blue-400 transition-colors">Customize Package</a></li>
              <li><a href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Flight Booking</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Hotel Reservation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Visa Assistance</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-blue-400" />
                <span>UG-14, Lucky Center, Jail Road, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>Toll Free: 0800 33333</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>support@telusumrah.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Legal Links */}
          <div className="flex justify-center gap-4 text-xs text-gray-400 mb-4">
            <a href="/terms" className="hover:text-white">
              Terms & Conditions
            </a>
            <span>|</span>
            <a href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Accreditations */}
            <div className="flex gap-6 items-center">
              <img src={iataLogo.src} alt="IATA Member" className="h-8" />
              <img
                src={travelAssociationLogo.src}
                alt="Travel Association"
                className="h-8"
              />
              <img src={taapLogo.src} alt="TAAP Member" className="h-8" />
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-500 text-center">
              &copy; {new Date().getFullYear()} Telus Umrah. All Rights Reserved.
              Powered by Multi Travel Pvt. Ltd.
            </p>

            {/* Payment Methods */}
            <div className="flex gap-4 items-center">
              <img src={visaLogo.src} alt="Visa" className="h-6" />
              <img src={mastercardLogo.src} alt="Mastercard" className="h-6" />
              <img src={amexLogo.src} alt="American Express" className="h-6" />
              <img src={paypalLogo.src} alt="PayPal" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

