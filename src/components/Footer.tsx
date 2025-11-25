import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import telusUmrahLogo from '@/assets/telus-umrah-white.png';
import iataLogo from '@/assets/iata-logo.png';
import bbbLogo from '@/assets/bbb-logo.png';
import travelAssociationLogo from '@/assets/pata-logo.png';
import taapLogo from '@/assets/taap-logo.png';
import visaLogo from '@/assets/payment-icons/Visa.svg';
import mastercardLogo from '@/assets/payment-icons/Mastercard.svg';
import amexLogo from '@/assets/payment-icons/Amex.svg';
import paypalLogo from '@/assets/payment-icons/PayPal.svg';
import stripeLogo from '@/assets/payment-icons/Stripe.svg';
import applePayLogo from '@/assets/payment-icons/ApplePay.svg';
import googlePayLogo from '@/assets/payment-icons/GooglePay.svg';
import bitpayLogo from '@/assets/payment-icons/Bitpay.svg';

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
          {/* Copyright Section with Logos */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Side - Copyright Text */}
            <p className="text-sm text-gray-400 text-left">
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
        <div className="bg-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap flex-col sm:flex-row items-center justify-center md:justify-between">
            <div>
              <p className="text-sm text-gray-400 text-left mb-2">
                We accept all major credit and debit cards
              </p>
              <div className="flex flex-wrap justify-start gap-4 text-xs">
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
            </div>
            <div className="flex items-center flex-wrap justify-center md:justify-end gap-4 mt-4 sm:mt-0">
              <img src={visaLogo.src} alt="Visa" className="h-8" />
              <img src={mastercardLogo.src} alt="Mastercard" className="h-8" />
              <img src={amexLogo.src} alt="American Express" className="h-8" />
              <img src={paypalLogo.src} alt="PayPal" className="h-8" />
              <img src={stripeLogo.src} alt="Stripe" className="h-8" />
              <img src={applePayLogo.src} alt="Apple Pay" className="h-8" />
              <img src={googlePayLogo.src} alt="Google Pay" className="h-8" />
              <img src={bitpayLogo.src} alt="Bitpay" className="h-8" />
            </div>
          </div>
        </div>
    </footer>
  );
}

