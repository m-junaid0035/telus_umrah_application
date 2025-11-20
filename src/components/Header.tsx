"use client";
import { useState, useEffect } from 'react';
import { Plane, Menu, X, Phone, Mail, MapPin, ChevronDown, Globe, DollarSign, LogOut, BookmarkPlus, Package, Sparkles, Hotel, Info, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from './AuthContext';
import { LoginDialog } from './LoginDialog';
import telusUmrahLogo from '@/assets/da561ea93488a57b45c1621c80c95e0815322c9e.png';
import telusUmrahLogoWhite from '@/assets/telusUmrahLogo.png';
import makkahIcon from '@/assets/ba6627702a0a2db3ec399c151ab739781dad0897.png';
import madinaIcon from '@/assets/4c0ebc2b4c4fd59170b1c28e046aa03ac40a6f01.png';

export function Header() {
  const currentPage = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [umrahPackagesOpen, setUmrahPackagesOpen] = useState(false);
  const [hotelsOpen, setHotelsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'login' | 'signup'>('login');
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
  ];

  const aboutItems = [
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'FAQ', path: '/faq', icon: HelpCircle },
  ];

  const umrahPackageItems = [
    { name: 'Browse Packages', path: '/umrah-packages', icon: Package },
    { name: 'Customize Umrah', path: '/customize-umrah', icon: Sparkles },
  ];

  const hotelItems = [
    { name: 'Makkah Hotels', path: '/makkah-hotels' },
    { name: 'Madina Hotels', path: '/madina-hotels' },
    { name: 'Hotel List', path: '/hotels' },
  ];

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'AR', name: 'العربية', flag: '🇸🇦' },
    { code: 'ZH', name: '中文', flag: '🇨🇳' },
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  ];

  const isHomePage = currentPage === '/';
  const shouldShowWhiteBg = !isHomePage || scrolled;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div 
        className={`bg-gradient-to-r from-blue-900 to-blue-800 text-white hidden lg:block transition-all duration-300 overflow-hidden ${
          (scrolled || !isHomePage) ? 'h-0 opacity-0 py-0' : 'h-9 opacity-100 py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>Toll Free: 080033333</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>support@telusumrah.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>Lahore, Pakistan</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 hover:text-blue-200 transition-colors cursor-pointer focus:outline-none">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{selectedLanguage}</span>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-xl rounded-lg">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm text-gray-700">{lang.name}</span>
                      {selectedLanguage === lang.code && (
                        <span className="ml-auto text-blue-600">•</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Currency Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 hover:text-blue-200 transition-colors cursor-pointer focus:outline-none">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{selectedCurrency}</span>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-xl rounded-lg">
                  {currencies.map((currency) => (
                    <DropdownMenuItem
                      key={currency.code}
                      onClick={() => setSelectedCurrency(currency.code)}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{currency.symbol}</span>
                      <span className="text-sm text-gray-700">{currency.code}</span>
                      <span className="text-xs text-gray-500 ml-auto">{currency.name}</span>
                      {selectedCurrency === currency.code && (
                        <span className="text-blue-600 ml-2">•</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-4 w-px bg-white/30" />
              <span className="text-blue-200">24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`backdrop-blur-md transition-all duration-300 ${
        shouldShowWhiteBg ? 'bg-white/98 shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img 
                src={shouldShowWhiteBg ? telusUmrahLogo.src : telusUmrahLogoWhite.src} 
                alt="Telus Umrah - Complete Spiritual Journey" 
                className="h-16 w-auto transition-all group-hover:scale-105"
              />
            </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`px-5 py-2 rounded-lg transition-all relative group ${
                      shouldShowWhiteBg
                        ? currentPage === item.path
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                        : currentPage === item.path
                          ? 'text-white'
                          : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.name}
                    {currentPage === item.path && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                          shouldShowWhiteBg ? 'bg-blue-600' : 'bg-white'
                        }`}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10 ${
                      shouldShowWhiteBg ? 'bg-blue-50' : 'bg-white/10'
                    }`} />
                  </motion.div>
                </Link>
              ))}

              {/* Umrah Packages Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setUmrahPackagesOpen(true)}
                onMouseLeave={() => setUmrahPackagesOpen(false)}
              >
                <button className={`px-5 py-2 rounded-lg transition-all flex items-center gap-1 group ${shouldShowWhiteBg
                    ? (currentPage === '/umrah-packages' || currentPage === '/customize-umrah')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                    : (currentPage === '/umrah-packages' || currentPage === '/customize-umrah')
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                  }`}>
                  
                  <span>Umrah Packages</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${umrahPackagesOpen ? 'rotate-180' : ''}`} />
                  {(currentPage === '/umrah-packages' || currentPage === '/customize-umrah') && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                        shouldShowWhiteBg ? 'bg-blue-600' : 'bg-white'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10 ${
                    shouldShowWhiteBg ? 'bg-blue-50' : 'bg-white/10'
                  }`} />
                </button>

                <AnimatePresence>
                  {umrahPackagesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {umrahPackageItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={item.path}
                              href={item.path}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                            >
                              <IconComponent className="w-5 h-5 text-blue-600" />
                              <span className="text-gray-700 group-hover:text-blue-600">
                                {item.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hotels Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setHotelsOpen(true)}
                onMouseLeave={() => setHotelsOpen(false)}
              >
                <button className={`px-5 py-2 rounded-lg transition-all flex items-center gap-1 group ${shouldShowWhiteBg
                    ? (currentPage === '/makkah-hotels' || currentPage === '/madina-hotels')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                    : (currentPage === '/makkah-hotels' || currentPage === '/madina-hotels')
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                }`}>
                  <span>Hotels</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${hotelsOpen ? 'rotate-180' : ''}`} />
                  {(currentPage === '/makkah-hotels' || currentPage === '/madina-hotels') && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                        shouldShowWhiteBg ? 'bg-blue-600' : 'bg-white'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10 ${
                    shouldShowWhiteBg ? 'bg-blue-50' : 'bg-white/10'
                  }`} />
                </button>

                <AnimatePresence>
                  {hotelsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {hotelItems.map((item) => {
                          return (
                            <Link
                              key={item.path}
                              href={item.path}
                              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                            >
                              <span className="text-gray-700 group-hover:text-blue-600">
                                {item.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button className={`px-5 py-2 rounded-lg transition-all flex items-center gap-1 group ${shouldShowWhiteBg
                    ? (currentPage === '/about' || currentPage === '/faq')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                    : (currentPage === '/about' || currentPage === '/faq')
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                }`}>
                  <span>About</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                  {(currentPage === '/about' || currentPage === '/faq') && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                        shouldShowWhiteBg ? 'bg-blue-600' : 'bg-white'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10 ${
                    shouldShowWhiteBg ? 'bg-blue-50' : 'bg-white/10'
                  }`} />
                </button>

                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {aboutItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={item.path}
                              href={item.path}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                            >
                              <IconComponent className="w-5 h-5 text-blue-600" />
                              <span className="text-gray-700 group-hover:text-blue-600">
                                {item.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Link */}
              <Link href="/contact">
                <motion.div
                  className={`px-5 py-2 rounded-lg transition-all relative group ${
                 shouldShowWhiteBg
                      ? currentPage === '/contact'
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                      : currentPage === '/contact'
                        ? 'text-white'
                        : 'text-white/90 hover:text-white'
                  }`}
                >
                  Contact
                  {currentPage === '/contact' && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                        shouldShowWhiteBg ? 'bg-blue-600' : 'bg-white'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10 ${
                    shouldShowWhiteBg ? 'bg-blue-50' : 'bg-white/10'
                  }`} />
                </motion.div>
              </Link>

              {/* CTA Buttons */}
              <div className={`flex items-center gap-3 ml-4 pl-4 border-l transition-colors ${
                shouldShowWhiteBg ? 'border-gray-200' : 'border-white/30'
              }`}>
                <Link href="/contact#contact-form">
                  <Button 
                    variant="outline" 
                    className={`transition-all ${
                      shouldShowWhiteBg 
                        ? 'border-blue-600 text-blue-600 hover:bg-blue-50' 
                        : 'border-white text-blue-600 hover:bg-white/10'
                    }`}
                  >
                    Get Quote
                  </Button>
                </Link>
                
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-blue-600 hover:ring-blue-700 transition-all">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-3 border-b">
                        <p className="text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link href="/my-bookings">
                        <DropdownMenuItem className="cursor-pointer">
                          <BookmarkPlus className="w-4 h-4 mr-2" />
                          My Bookings
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button 
                      onClick={() => {
                        setDialogMode('login');
                        setLoginDialogOpen(true);
                      }}
                      variant="outline"
                      className={`transition-all ${
                        shouldShowWhiteBg 
                          ? 'border-blue-600 text-blue-600 hover:bg-blue-50' 
                          : 'border-white text-blue-600 hover:bg-white/10'
                      }`}
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => {
                        setDialogMode('signup');
                        setLoginDialogOpen(true);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
                    >
                      Signup
                    </Button>
                  </>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${
                shouldShowWhiteBg ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 transition-colors ${shouldShowWhiteBg ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 transition-colors ${shouldShowWhiteBg ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-2 max-w-7xl mx-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
                      currentPage === item.path
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Umrah Packages */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500 px-4 py-2">Umrah Packages</div>
                  {umrahPackageItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          currentPage === item.path
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${
                          currentPage === item.path ? 'text-white' : 'text-blue-600'
                        }`} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Hotels */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500 px-4 py-2">Hotels</div>
                  {hotelItems.map((item) => {
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                          currentPage === item.path
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile About */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500 px-4 py-2">About</div>
                  {aboutItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          currentPage === item.path
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${
                          currentPage === item.path ? 'text-white' : 'text-blue-600'
                        }`} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Contact */}
                <div className="pt-2 border-t border-gray-200">
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
                      currentPage === '/contact'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Contact
                  </Link>
                </div>

                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <Link href="/contact#contact-form" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-600 text-blue-600"
                    >
                      Get Quote
                    </Button>
                  </Link>
                  
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <Link href="/my-bookings" className="w-full">
                        <Button variant="outline" className="w-full justify-start">
                          <BookmarkPlus className="w-4 h-4 mr-2" />
                          My Bookings
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline" 
                        className="w-full justify-start text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          setDialogMode('login');
                          setLoginDialogOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="flex-1 border-blue-600 text-blue-600"
                      >
                        Login
                      </Button>
                      <Button 
                        onClick={() => {
                          setDialogMode('signup');
                          setLoginDialogOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700"
                      >
                        Signup
                      </Button>
                    </div>
                  )}
                </div>

                {/* Mobile Language & Currency */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex gap-3">
                    {/* Language Selector */}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex-1 flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">Language</span>
                        </div>
                        <span className="text-sm text-gray-900">{selectedLanguage}</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-xl rounded-lg">
                        {languages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => setSelectedLanguage(lang.code)}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="text-sm text-gray-700">{lang.name}</span>
                            {selectedLanguage === lang.code && (
                              <span className="ml-auto text-blue-600">•</span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Currency Selector */}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex-1 flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">Currency</span>
                        </div>
                        <span className="text-sm text-gray-900">{selectedCurrency}</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-xl rounded-lg">
                        {currencies.map((currency) => (
                          <DropdownMenuItem
                            key={currency.code}
                            onClick={() => setSelectedCurrency(currency.code)}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                          >
                            <span className="text-sm text-gray-700">{currency.symbol}</span>
                            <span className="text-sm text-gray-700">{currency.code}</span>
                            {selectedCurrency === currency.code && (
                              <span className="ml-auto text-blue-600">•</span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Mobile Contact Info */}
                <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>UAN: 080033333</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>Cell: (+92) 3004554040</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>multitravel@hotmail.com</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Login Dialog */}
      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen} 
        defaultMode={dialogMode}
      />
    </div>
  );
}