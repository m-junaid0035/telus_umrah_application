import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Why choose Telus Umrah?',
    answer: 'At Telus Umrah, we appreciate the trust you place in us to help organize your sacred journey. We take that responsibility very seriously and have years of experience in providing excellent Umrah and travel services. We offer competitive prices, quality accommodations near Haram, reliable airlines, and 24/7 customer support to ensure your journey is comfortable and spiritually fulfilling.'
  },
  {
    question: 'How many types of Visas are available for travellers intending to perform Umrah?',
    answer: 'There are primarily two types of visas for Umrah: the Umrah visa (valid for 30 days from entry) and the tourist visa with Umrah (valid for 90 days). We assist with all documentation and processing for both visa types. The tourist visa allows you to perform Umrah and also explore Saudi Arabia\'s tourist attractions.'
  },
  {
    question: 'What does a typical pilgrim journey look like?',
    answer: 'A typical Umrah journey includes arrival in Jeddah/Madinah, transfer to your hotel in Madinah, performing prayers at Masjid-e-Nabawi, Zaiarat of holy sites in Madinah, travel to Makkah, check-in at Makkah hotel, performing Umrah rituals, prayers at Masjid al-Haram, Zaiarat of Makkah holy sites, and departure. The entire journey usually takes 7-15 days depending on your package.'
  },
  {
    question: 'What is included in your Umrah packages?',
    answer: 'Our Umrah packages include round-trip flights, hotel accommodations in Makkah and Madinah, Umrah visa processing, airport transfers, and Zaiarat (tours of holy sites). You can also add optional services such as meals, transport, eSIM connectivity, and guide services. All packages are customizable to meet your specific needs and budget.'
  },
  {
    question: 'How far are the hotels from Haram?',
    answer: 'We offer hotels at various distances from Haram to suit different budgets. Our 5-star hotels are typically within 200-500 meters walking distance from Haram. 4-star hotels are usually 500-1000 meters away, and 3-star hotels range from 1000-1500 meters. We provide detailed distance information for each hotel option.'
  },
  {
    question: 'Can I customize my Umrah package?',
    answer: 'Absolutely! We specialize in creating fully customized Umrah packages tailored to your preferences. You can choose your departure date, airline, flight class, hotel category, stay duration, room type, additional services, and more. Use our Custom Umrah Form on the website or contact us directly to create your perfect package.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including cash payments at our office, bank transfers, credit/debit cards, and online payment gateways. For larger packages, we also offer flexible payment plans with installment options. Full payment is typically required before travel documents are issued.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellation policies vary depending on the airline, hotel, and how close to the departure date you cancel. Generally, earlier cancellations receive better refunds. Our service fees are non-refundable. We strongly recommend purchasing comprehensive travel insurance to protect against unforeseen circumstances. Detailed cancellation terms are provided at the time of booking.'
  },
  {
    question: 'How long does visa processing take?',
    answer: 'Umrah visa processing typically takes 3-5 working days after submission of complete documentation. However, during peak seasons (Ramadan, Hajj period), it may take slightly longer. We recommend applying at least 2-3 weeks before your intended travel date to allow sufficient processing time and handle any potential delays.'
  },
  {
    question: 'What documents are required for an Umrah visa?',
    answer: 'Required documents include a valid passport (minimum 6 months validity), recent passport-size photographs, completed visa application form, polio vaccination certificate (for Pakistani nationals), Meningitis vaccination certificate, confirmed flight tickets, hotel bookings, and marriage certificate (for married women traveling with their spouse).'
  },
  {
    question: 'Which airlines do you work with?',
    answer: 'We work with all major airlines including Emirates, Qatar Airways, Turkish Airlines, Saudia, PIA (Pakistan International Airlines), Gulf Air, Serene Air, Etihad Airways, and many others. We can book flights on any airline based on your preference, budget, and desired route. We help you find the best flight options for your journey.'
  },
  {
    question: 'Is there a group discount for Umrah packages?',
    answer: 'Yes! We offer special discounts for group bookings, typically for 10 or more people traveling together. Group packages can include shared accommodations, group transport, dedicated group coordinator, and customized itineraries. Contact us with your group size and requirements for a detailed quotation.'
  },
  {
    question: 'Can I modify my booking after confirmation?',
    answer: 'Yes, modifications are possible subject to availability and airline/hotel policies. Changes should be requested as early as possible. Amendment fees may apply depending on the type of change, airline rules, and proximity to departure date. Some airlines charge higher fees for changes made close to travel dates.'
  },
  {
    question: 'Do you provide assistance during travel?',
    answer: 'Yes, we provide 24/7 customer support during your travels. Our dedicated team is available to assist with any issues, emergencies, or questions that may arise. We can help with flight changes, hotel issues, medical emergencies, lost documents, and any other travel-related concerns.'
  },
  {
    question: 'What should I pack for Umrah?',
    answer: 'Essential items include Ihram clothing (for men), modest clothing, comfortable walking shoes, prayer mat, Quran, prayer beads, toiletries, medications, photocopies of important documents, phone charger, power adapter, small backpack, water bottle, and umbrella. We provide a detailed packing checklist with your confirmation documents.'
  },
  {
    question: 'Are meals included in the packages?',
    answer: 'Meal inclusions vary by package type. Most packages include breakfast at the hotel. Full board (breakfast, lunch, and dinner) can be added for an additional cost. Many pilgrims prefer to explore local restaurants and food options near Haram, which offer authentic Saudi and international cuisines at reasonable prices.'
  },
  {
    question: 'Can I extend my stay in Saudi Arabia?',
    answer: 'Yes, you can extend your stay subject to visa validity and hotel availability. Extensions should be requested as early as possible. Additional charges will apply based on hotel rates and season. If extending beyond your visa validity, you may need to apply for a visa extension through Saudi authorities.'
  },
  {
    question: 'Do you provide Zaiarat tours?',
    answer: 'Yes, Zaiarat (tours of holy sites) are included in most of our Umrah packages. Tours typically cover important Islamic historical sites in both Makkah and Madinah, including Jabal-e-Noor, Cave of Hira, Jannat-ul-Baqi, Masjid-e-Quba, and other significant locations. Experienced guides provide historical and religious context at each site.'
  },
  {
    question: 'What is your refund processing time?',
    answer: 'Approved refunds are processed within 30-45 business days from the cancellation approval date. The timeline depends on airline refund policies, hotel cancellation terms, and your bank\'s processing time. We keep you updated throughout the refund process and provide written confirmation once processed.'
  },
  {
    question: 'How can I contact Telus Umrah for inquiries?',
    answer: 'You can reach us by phone at (+92) 42 37595151 or (+92) 300 4554040, WhatsApp at (+92) 300 4554040, toll-free at 080033333, email at multitravel@hotmail.com, or visit our office at UG-14, Lucky Center, Jail Road, Lahore. Our office hours are 9:00 AM to 6:00 PM, Monday to Saturday. Emergency support is available 24/7.'
  }
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white pt-32">
      {/* Hero Section with Background Image */}
      <div className="relative h-30 bg-[rgb(30,58,109)] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1704104501136-8f35402af395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtrYWglMjBrYWFiYSUyMG1vc3F1ZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjMyMTExOTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Makkah Architecture"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(30,58,109)]/60 to-[rgb(30,58,109)]/80" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-3xl md:text-4xl"
          >
            Frequently Asked Questions (FAQ)
          </motion.h1>
        </div>
      </div>

      {/* We're here to help Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-[rgb(30,58,109)] text-2xl md:text-3xl mb-4">
            We're here to help!
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-4xl">
            At Telus Umrah we appreciate the trust you place in us to help organize your sacred journey - and we take that responsibility very seriously. To help ensure you are thoroughly prepared for your trip or to answer any of your outstanding questions, we have provided you with some Frequently Asked Questions below. Need additional help? Contact us and we will be sure to assist you.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-3 mb-16"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.4 }}
              className="bg-gray-50 border-l-4 border-[rgb(30,58,109)] rounded-r-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 pr-4">
                  <span className="text-[rgb(30,58,109)] flex-shrink-0 mt-1">Q.</span>
                  <span className="text-gray-900">{index + 1}) {faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 text-[rgb(30,58,109)]"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pl-14 text-gray-700 leading-relaxed bg-white">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-gradient-to-br from-[rgb(30,58,109)] to-[rgb(40,70,130)] rounded-2xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl mb-3">Still have questions?</h2>
            <p className="text-blue-100 text-lg">
              Our dedicated team is here to help you with any inquiries. Contact us today!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a
              href="tel:+924237595151"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[rgb(30,58,109)] rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-xl transition-shadow"
            >
              <Phone className="w-8 h-8" />
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Call Us</div>
                <div>(+92) 42 37595151</div>
                <div className="text-sm">080033333 (Toll-Free)</div>
              </div>
            </motion.a>
            
            <motion.a
              href="mailto:multitravel@hotmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[rgb(30,58,109)] rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-xl transition-shadow"
            >
              <Mail className="w-8 h-8" />
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Email Us</div>
                <div className="text-sm">multitravel@hotmail.com</div>
              </div>
            </motion.a>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white text-[rgb(30,58,109)] rounded-xl p-6 flex flex-col items-center gap-3"
            >
              <MapPin className="w-8 h-8" />
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Visit Us</div>
                <div className="text-sm">UG-14, Lucky Center</div>
                <div className="text-sm">Jail Road, Lahore</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
