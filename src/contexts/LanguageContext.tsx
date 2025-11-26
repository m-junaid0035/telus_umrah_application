"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'EN' | 'ES' | 'FR' | 'DE' | 'AR' | 'ZH';

interface Translations {
  header: {
    home: string;
    umrahPackages: string;
    browsePackages: string;
    customizeUmrah: string;
    hotels: string;
    makkahHotels: string;
    madinaHotels: string;
    hotelList: string;
    about: string;
    aboutUs: string;
    faq: string;
    contact: string;
    getQuote: string;
    registerNow: string;
    login: string;
    signUp: string;
    myBookings: string;
    signOut: string;
    language: string;
    currency: string;
    customerSupport: string;
    tollFree: string;
  };
}

const translations: Record<Language, Translations> = {
  EN: {
    header: {
      home: 'Home',
      umrahPackages: 'Umrah Packages',
      browsePackages: 'Browse Packages',
      customizeUmrah: 'Customize Umrah',
      hotels: 'Hotels',
      makkahHotels: 'Makkah Hotels',
      madinaHotels: 'Madina Hotels',
      hotelList: 'Hotel List',
      about: 'About',
      aboutUs: 'About Us',
      faq: 'FAQ',
      contact: 'Contact',
      getQuote: 'Get Quote',
      registerNow: 'Register Now',
      login: 'Login',
      signUp: 'Sign Up',
      myBookings: 'My Bookings',
      signOut: 'Sign Out',
      language: 'Language',
      currency: 'Currency',
      customerSupport: '24/7 Customer Support',
      tollFree: 'Toll Free: 080033333',
    },
  },
  ES: {
    header: {
      home: 'Inicio',
      umrahPackages: 'Paquetes de Umrah',
      browsePackages: 'Explorar Paquetes',
      customizeUmrah: 'Personalizar Umrah',
      hotels: 'Hoteles',
      makkahHotels: 'Hoteles de La Meca',
      madinaHotels: 'Hoteles de Medina',
      hotelList: 'Lista de Hoteles',
      about: 'Acerca de',
      aboutUs: 'Acerca de Nosotros',
      faq: 'Preguntas Frecuentes',
      contact: 'Contacto',
      getQuote: 'Obtener Cotización',
      registerNow: 'Registrarse Ahora',
      login: 'Iniciar Sesión',
      signUp: 'Registrarse',
      myBookings: 'Mis Reservas',
      signOut: 'Cerrar Sesión',
      language: 'Idioma',
      currency: 'Moneda',
      customerSupport: 'Soporte al Cliente 24/7',
      tollFree: 'Línea Gratuita: 080033333',
    },
  },
  FR: {
    header: {
      home: 'Accueil',
      umrahPackages: 'Forfaits Omra',
      browsePackages: 'Parcourir les Forfaits',
      customizeUmrah: 'Personnaliser Omra',
      hotels: 'Hôtels',
      makkahHotels: 'Hôtels de La Mecque',
      madinaHotels: 'Hôtels de Médine',
      hotelList: 'Liste des Hôtels',
      about: 'À Propos',
      aboutUs: 'À Propos de Nous',
      faq: 'FAQ',
      contact: 'Contact',
      getQuote: 'Obtenir un Devis',
      registerNow: 'S\'inscrire Maintenant',
      login: 'Connexion',
      signUp: 'S\'inscrire',
      myBookings: 'Mes Réservations',
      signOut: 'Déconnexion',
      language: 'Langue',
      currency: 'Devise',
      customerSupport: 'Support Client 24/7',
      tollFree: 'Numéro Vert: 080033333',
    },
  },
  DE: {
    header: {
      home: 'Startseite',
      umrahPackages: 'Umrah-Pakete',
      browsePackages: 'Pakete Durchsuchen',
      customizeUmrah: 'Umrah Anpassen',
      hotels: 'Hotels',
      makkahHotels: 'Mekka Hotels',
      madinaHotels: 'Medina Hotels',
      hotelList: 'Hotelliste',
      about: 'Über',
      aboutUs: 'Über Uns',
      faq: 'FAQ',
      contact: 'Kontakt',
      getQuote: 'Angebot Anfordern',
      registerNow: 'Jetzt Registrieren',
      login: 'Anmelden',
      signUp: 'Registrieren',
      myBookings: 'Meine Buchungen',
      signOut: 'Abmelden',
      language: 'Sprache',
      currency: 'Währung',
      customerSupport: '24/7 Kundensupport',
      tollFree: 'Kostenlos: 080033333',
    },
  },
  AR: {
    header: {
      home: 'الرئيسية',
      umrahPackages: 'باقات العمرة',
      browsePackages: 'تصفح الباقات',
      customizeUmrah: 'تخصيص العمرة',
      hotels: 'الفنادق',
      makkahHotels: 'فنادق مكة',
      madinaHotels: 'فنادق المدينة',
      hotelList: 'قائمة الفنادق',
      about: 'حول',
      aboutUs: 'من نحن',
      faq: 'الأسئلة الشائعة',
      contact: 'اتصل بنا',
      getQuote: 'احصل على عرض سعر',
      registerNow: 'سجل الآن',
      login: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      myBookings: 'حجوزاتي',
      signOut: 'تسجيل الخروج',
      language: 'اللغة',
      currency: 'العملة',
      customerSupport: 'دعم العملاء على مدار الساعة',
      tollFree: 'مجاني: 080033333',
    },
  },
  ZH: {
    header: {
      home: '首页',
      umrahPackages: '朝觐套餐',
      browsePackages: '浏览套餐',
      customizeUmrah: '定制朝觐',
      hotels: '酒店',
      makkahHotels: '麦加酒店',
      madinaHotels: '麦地那酒店',
      hotelList: '酒店列表',
      about: '关于',
      aboutUs: '关于我们',
      faq: '常见问题',
      contact: '联系我们',
      getQuote: '获取报价',
      registerNow: '立即注册',
      login: '登录',
      signUp: '注册',
      myBookings: '我的预订',
      signOut: '退出',
      language: '语言',
      currency: '货币',
      customerSupport: '24/7 客户支持',
      tollFree: '免费电话: 080033333',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
      // Set initial HTML lang and dir attributes
      if (typeof document !== 'undefined') {
        document.documentElement.lang = savedLanguage.toLowerCase();
        if (savedLanguage === 'AR') {
          document.documentElement.dir = 'rtl';
        } else {
          document.documentElement.dir = 'ltr';
        }
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('selectedLanguage', lang);
    // Update HTML lang and dir attributes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang.toLowerCase();
      // Set RTL for Arabic
      if (lang === 'AR') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

