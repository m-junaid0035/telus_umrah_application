"use client";
import { useState, useEffect } from 'react';
import { Plane, Menu, X, Phone, Mail, MapPin, ChevronDown, Globe, DollarSign, LogOut, BookmarkPlus, Package, Sparkles, Hotel, Info, HelpCircle, LogIn, UserPlus, ArrowUp, MessageSquare } from 'lucide-react';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import telusUmrahLogo from '@/assets/telus-umrah-blue.png';
import telusUmrahLogoWhite from '@/assets/telus-umrah-white.png';
import makkahIcon from '@/assets/makkah-icon.png';
import madinaIcon from '@/assets/madina-icon.png';
import whatsappIcon from '@/assets/whatsapp-icon.svg';

export function Header() {
  const currentPage = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [umrahPackagesOpen, setUmrahPackagesOpen] = useState(false);
  const [hotelsOpen, setHotelsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'login' | 'signup'>('login');
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrencyByCode, availableCurrencies } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t.header.home, path: '/' },
  ];

  const aboutItems = [
    { name: t.header.aboutUs, path: '/about', icon: Info },
    { name: t.header.faq, path: '/faq', icon: HelpCircle },
  ];

  const umrahPackageItems = [
    { name: t.header.browsePackages, path: '/umrah-packages', icon: Package },
    { name: t.header.customizeUmrah, path: '/customize-umrah', icon: Sparkles },
  ];

  const hotelItems = [
    { name: 'All Hotels', path: '/hotels', icon: Hotel },
    { name: t.header.makkahHotels, path: '/hotels?city=Makkah' },
    { name: t.header.madinaHotels, path: '/hotels?city=Madina' },
  ];

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'AR', name: 'العربية', flag: '🇸🇦' },
    { code: 'ZH', name: '中文', flag: '🇨🇳' },
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
                <span>{t.header.tollFree}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>support@telusumrah.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>UG-14, Lucky center, 7-8 Jail Road, Lahore, 54000 Pakistan</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 hover:text-blue-200 transition-colors cursor-pointer focus:outline-none">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language}</span>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-xl rounded-lg">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as typeof language)}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm text-gray-700">{lang.name}</span>
                      {language === lang.code && (
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
                  <span>{currency.code}</span>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-xl rounded-lg">
                  {availableCurrencies.map((c) => (
                    <DropdownMenuItem
                      key={c.code}
                      onClick={() => setCurrencyByCode(c.code)}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{c.symbol}</span>
                      <span className="text-sm text-gray-700">{c.code}</span>
                      {currency.code === c.code && (
                        <span className="text-blue-600 ml-2">•</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-4 w-px bg-white/30" />
              <span className="text-blue-200">{t.header.customerSupport}</span>
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
                <button className={`px-5 py-2 rounded-lg transition-all flex items-center gap-1 group ${
                  (currentPage === '/umrah-packages' || currentPage === '/customize-umrah' || currentPage === '/custom-umrah')
                    ? (shouldShowWhiteBg ? 'text-blue-600' : 'text-white')
                    : (shouldShowWhiteBg ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white')
                }`}>
                  
                  <span>{t.header.umrahPackages}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${umrahPackagesOpen ? 'rotate-180' : ''}`} />
                  {(currentPage === '/umrah-packages' || currentPage === '/customize-umrah' || currentPage === '/custom-umrah') && (
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
                <button className={`px-5 py-2 rounded-lg transition-all flex items-center gap-1 group ${
                  (currentPage === '/hotels')
                    ? (shouldShowWhiteBg ? 'text-blue-600' : 'text-white')
                    : (shouldShowWhiteBg ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white')
                }`}>
                  <span>{t.header.hotels}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${hotelsOpen ? 'rotate-180' : ''}`} />
                  {(currentPage === '/hotels') && (
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
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={item.path}
                              href={item.path}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                            >
                              {IconComponent && <IconComponent className="w-5 h-5 text-blue-600" />}
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
                <button className={`px-5 py-2 rounded-lg transition-all flex items-center gap-1 group ${
                  (currentPage === '/about' || currentPage === '/faq')
                    ? (shouldShowWhiteBg ? 'text-blue-600' : 'text-white')
                    : (shouldShowWhiteBg ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white')
                }`}>
                  <span>{t.header.about}</span>
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
                    currentPage === '/contact'
                      ? (shouldShowWhiteBg ? 'text-blue-600' : 'text-white')
                      : (shouldShowWhiteBg ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white')
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
                          {t.header.myBookings}
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        {t.header.signOut}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      // Auto open dropdown on hover
                      const trigger = document.querySelector('[data-register-trigger]');
                      if (trigger) {
                        trigger.dispatchEvent(new Event('click', { bubbles: true }));
                      }
                    }}
                    onMouseLeave={() => {
                      // Optionally close on hover out
                    }}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        data-register-trigger
                        className={`px-4 py-2 rounded-lg transition-all cursor-pointer text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl`}
                      >
                        {t.header.registerNow}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => {
                            setDialogMode('login');
                            setLoginDialogOpen(true);
                          }}
                          className="cursor-pointer flex items-center"
                        >
                          <LogIn className="w-4 h-4 mr-2 text-blue-600" />
                          <span>{t.header.login}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDialogMode('signup');
                            setLoginDialogOpen(true);
                          }}
                          className="cursor-pointer flex items-center"
                        >
                          <UserPlus className="w-4 h-4 mr-2 text-green-600" />
                          <span>{t.header.signUp}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
                  <div className="text-xs text-gray-500 px-4 py-2">{t.header.umrahPackages}</div>
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
                  <div className="text-xs text-gray-500 px-4 py-2">{t.header.hotels}</div>
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
                  <div className="text-xs text-gray-500 px-4 py-2">{t.header.about}</div>
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
                    {t.header.contact}
                  </Link>
                </div>

                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <Link href="/contact#contact-form" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-600 text-blue-600"
                    >
                      {t.header.getQuote}
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
                          {t.header.myBookings}
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
                        {t.header.signOut}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center shadow font-medium">
                          {t.header.registerNow}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setDialogMode('login');
                              setLoginDialogOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-center cursor-pointer"
                          >
                            <LogIn className="w-4 h-4 mr-2 text-blue-600" />
                            <span>{t.header.login}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDialogMode('signup');
                              setLoginDialogOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-center cursor-pointer"
                          >
                            <UserPlus className="w-4 h-4 mr-2 text-green-600" />
                            <span>{t.header.signUp}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                          <span className="text-sm text-gray-700">{t.header.language}</span>
                        </div>
                        <span className="text-sm text-gray-900">{language}</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-xl rounded-lg">
                        {languages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => setLanguage(lang.code as typeof language)}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="text-sm text-gray-700">{lang.name}</span>
                            {language === lang.code && (
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
                          <span className="text-sm text-gray-700">{t.header.currency}</span>
                        </div>
                        <span className="text-sm text-gray-900">{currency.code}</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-xl rounded-lg">
                        {availableCurrencies.map((c) => (
                          <DropdownMenuItem
                            key={c.code}
                            onClick={() => setCurrencyByCode(c.code)}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                          >
                            <span className="text-sm text-gray-700">{c.symbol}</span>
                            <span className="text-sm text-gray-700">{c.code}</span>
                            {currency.code === c.code && (
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
                    <span>support@telusumrah.com</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating Icons */}
      <div className={`fixed bottom-8 right-8 flex flex-col gap-4 z-50 transition-opacity duration-300 ${
        scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Back to Top Icon */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowUp size={24} />
        </button>

          {/* WhatsApp Icon */}
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors"
          >
            <img src={whatsappIcon.src} alt="WhatsApp" className="w-6 h-6" />
          </a>
      </div>
      {/* Login Dialog */}
      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen} 
        defaultMode={dialogMode}
      />
    </div>
  );
}

