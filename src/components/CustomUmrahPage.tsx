import { motion } from 'framer-motion';
import { CustomUmrahForm } from './CustomUmrahForm';
import { Phone, Mail } from 'lucide-react';

export function CustomUmrahPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-40 pb-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-white mb-4">Customize Your Umrah Package</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Create your perfect spiritual journey with our comprehensive customization options. 
            Fill in your preferences and we'll design the ideal Umrah package for you.
          </p>
        </motion.div>

        {/* Form */}
        <div className="max-w-6xl mx-auto">
          <CustomUmrahForm />
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mt-12 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <p className="text-white/90">
              Need help? Our travel experts are available 24/7 to assist you.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-4 text-white/80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>UAN: 080033333</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Cell: (+92) 3004554040</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>multitravel@hotmail.com</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
