import { motion } from 'framer-motion';
import { ScrollText, ChevronRight } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[rgb(30,58,109)] to-[rgb(20,40,80)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <ScrollText className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl">Terms & Conditions</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-blue-100 text-lg"
          >
            Last updated: November 13, 2025
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-blue max-w-none"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Telus Umrah. These Terms and Conditions ("Terms") govern your use of our travel booking services, including flight bookings, hotel reservations, travel packages, visa services, and Umrah services. By accessing or using our services, you agree to be bound by these Terms.
              </p>
            </section>

            {/* Booking Terms */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Booking Terms
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">1. Booking Confirmation</h3>
                  <p className="leading-relaxed">
                    All bookings are subject to availability and confirmation. A booking is only confirmed once you receive a confirmation email or booking reference from Telus Umrah.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">2. Payment Terms</h3>
                  <p className="leading-relaxed">
                    Full payment or deposit must be received as per the payment terms specified at the time of booking. Failure to make payment by the due date may result in cancellation of your booking.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">3. Pricing</h3>
                  <p className="leading-relaxed">
                    All prices are quoted in Pakistani Rupees (PKR) unless otherwise stated. Prices are subject to change without notice until booking is confirmed and paid for. Additional charges may apply for extra services, baggage, or amendments.
                  </p>
                </div>
              </div>
            </section>

            {/* Cancellation & Refunds */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Cancellation & Refunds
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">1. Cancellation Policy</h3>
                  <p className="leading-relaxed">
                    Cancellation policies vary depending on the airline, hotel, and package provider. Specific cancellation terms will be communicated at the time of booking. Service fees charged by Telus Umrah are generally non-refundable.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">2. Refund Processing</h3>
                  <p className="leading-relaxed">
                    Refunds, where applicable, will be processed within 30-45 business days from the date of approved cancellation. Refund amounts are subject to airline, hotel, and supplier policies, and may include deductions for service fees and penalties.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">3. Amendment Fees</h3>
                  <p className="leading-relaxed">
                    Changes to bookings may incur amendment fees charged by airlines, hotels, or service providers, in addition to Telus Umrah's service fee. All amendments are subject to availability.
                  </p>
                </div>
              </div>
            </section>

            {/* Travel Documents */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Travel Documents & Visas
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  It is your responsibility to ensure you have valid travel documents including passport, visas, and health certificates. Telus Umrah can assist with visa applications but does not guarantee visa approval. Visa fees are non-refundable regardless of application outcome.
                </p>
                <p className="leading-relaxed">
                  Passports must be valid for at least 6 months from the date of travel. Ensure all names on bookings match exactly with passport details to avoid issues during travel.
                </p>
              </div>
            </section>

            {/* Liability */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Liability & Responsibilities
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Telus Umrah acts as an intermediary between you and travel service providers (airlines, hotels, etc.). We are not liable for delays, cancellations, accidents, loss, damage, or injury caused by third-party service providers.
                </p>
                <p className="leading-relaxed">
                  We strongly recommend purchasing comprehensive travel insurance to cover medical emergencies, trip cancellations, lost baggage, and other unforeseen circumstances.
                </p>
                <p className="leading-relaxed">
                  Telus Umrah is not responsible for any changes in government regulations, flight schedules, hotel conditions, or force majeure events including natural disasters, pandemics, wars, or civil unrest.
                </p>
              </div>
            </section>

            {/* Umrah Services */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Umrah Services
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Our Umrah packages are designed according to Saudi Arabia's ministry regulations. All pilgrims must comply with Saudi Arabian laws and regulations during their stay.
                </p>
                <p className="leading-relaxed">
                  Umrah visas are subject to approval by Saudi Arabian authorities. Telus Umrah cannot guarantee visa approval and all visa processing fees are non-refundable.
                </p>
                <p className="leading-relaxed">
                  Package inclusions (hotels, transport, Zaiarat) are subject to availability and may be substituted with equivalent alternatives if necessary.
                </p>
              </div>
            </section>

            {/* Customer Conduct */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Customer Conduct
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Customers are expected to behave responsibly and respectfully. Any misconduct during travel or dealing with our staff may result in termination of services without refund.
                </p>
                <p className="leading-relaxed">
                  You are responsible for complying with all laws and regulations of countries you visit, including customs, immigration, and health requirements.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Intellectual Property
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  All content on our website including text, graphics, logos, images, and software is the property of Telus Umrah and protected by copyright laws. Unauthorized use is prohibited.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Changes to Terms
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Telus Umrah reserves the right to modify these Terms at any time. Changes will be posted on our website and become effective immediately upon posting. Continued use of our services constitutes acceptance of modified Terms.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Contact Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  For questions regarding these Terms and Conditions, please contact us at:
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p><strong>Telus Umrah</strong></p>
                  <p>UG-14, Lucky Center, 7-8 Jail Road</p>
                  <p>PO. Box 717 GPO, Lahore, 54000 Pakistan</p>
                  <p>Phone: (+92) 42 37595151</p>
                  <p>Email: multitravel@hotmail.com</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
