import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';

export function PrivacyPage() {
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
            <Shield className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl">Privacy Policy</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-blue-100 text-lg"
          >
            Last updated: January 19, 2026
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
                At Telus Umrah, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our travel booking services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">1. Personal Information</h3>
                  <p className="leading-relaxed mb-2">
                    We collect personal information that you provide to us when booking our services, including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Full name, date of birth, and gender</li>
                    <li>Contact information (email, phone number, address)</li>
                    <li>Passport details and nationality</li>
                    <li>Payment information (credit card details, billing address)</li>
                    <li>Travel preferences and special requirements</li>
                    <li>Emergency contact information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">2. Booking Information</h3>
                  <p className="leading-relaxed">
                    Details about your travel bookings including flight dates, destinations, hotel preferences, package selections, and any additional services requested.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">3. Technical Information</h3>
                  <p className="leading-relaxed">
                    When you visit our website, we automatically collect certain information including IP address, browser type, device information, and browsing behavior through cookies and similar technologies.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed mb-2">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To process and manage your travel bookings and reservations</li>
                  <li>To communicate with you about your bookings, including confirmations and updates</li>
                  <li>To process payments and prevent fraudulent transactions</li>
                  <li>To provide customer support and respond to your inquiries</li>
                  <li>To assist with visa applications and travel documentation</li>
                  <li>To send you promotional offers and marketing communications (with your consent)</li>
                  <li>To improve our services and website functionality</li>
                  <li>To comply with legal obligations and regulatory requirements</li>
                  <li>To analyze website usage and user behavior for business insights</li>
                </ul>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Information Sharing & Disclosure
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed mb-2">
                  We may share your information with:
                </p>
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">1. Service Providers</h3>
                  <p className="leading-relaxed">
                    Airlines, hotels, tour operators, visa processing agencies, and other travel service providers necessary to fulfill your booking requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">2. Payment Processors</h3>
                  <p className="leading-relaxed">
                    Secure payment gateway providers to process your transactions. We do not store complete credit card information on our servers.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">3. Government Authorities</h3>
                  <p className="leading-relaxed">
                    When required by law or regulation, including visa authorities, immigration departments, and law enforcement agencies.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg mb-2">4. Business Partners</h3>
                  <p className="leading-relaxed">
                    Trusted partners who assist us in operating our website, conducting business, or serving our customers, under strict confidentiality agreements.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Data Security
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Encryption of sensitive data during transmission (SSL/TLS)</li>
                  <li>Secure servers and firewalls</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication procedures</li>
                  <li>Employee training on data protection practices</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Your Rights
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed mb-2">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request access to your personal data we hold</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                  <li><strong>Objection:</strong> Object to processing of your personal data for marketing purposes</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  To exercise any of these rights, please contact us using the information provided below.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Cookies & Tracking Technologies
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookie settings through your browser preferences.
                </p>
                <p className="leading-relaxed">
                  Types of cookies we use include essential cookies for website functionality, analytics cookies to understand usage patterns, and marketing cookies for personalized advertising (with your consent).
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Data Retention
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. Booking records are typically retained for 7 years for accounting and legal purposes.
                </p>
              </div>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Third-Party Links
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to read the privacy policies of any third-party sites you visit.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Children's Privacy
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </div>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Changes to This Privacy Policy
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6 text-blue-600" />
                Contact Us
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p><strong>Telus Umrah</strong></p>
                  <p>UG-14, Lucky Center, 7-8 Jail Road</p>
                  <p>Lahore, 54000 Pakistan</p>
                  <p>Toll Free: 0800 33333</p>
                  <p>Email: support@telusumrah.com</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
