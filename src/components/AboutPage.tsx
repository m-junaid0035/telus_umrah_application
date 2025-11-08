import { motion } from 'framer-motion';
import { Target, Users, Award, Globe, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ceoImage from '@/assets/7830625fc0a0f45d00d03b5f69e747307fb93a9e.png';

const stats = [
  { number: '10M+', label: 'Happy Travelers' },
  { number: '500+', label: 'Destinations' },
  { number: '50K+', label: 'Hotels' },
  { number: '200+', label: 'Airlines' },
];

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To make travel accessible and affordable for everyone, connecting people to their dream destinations seamlessly.',
  },
  {
    icon: Users,
    title: 'Our Team',
    description:
      'A dedicated group of travel enthusiasts and technology experts committed to revolutionizing your booking experience.',
  },
  {
    icon: Award,
    title: 'Our Excellence',
    description:
      'Award-winning service recognized globally for innovation, reliability, and customer satisfaction.',
  },
  {
    icon: Globe,
    title: 'Our Reach',
    description:
      'Global network spanning 500+ destinations with partnerships with the world\'s leading airlines and hotels.',
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDJjLTQuNDE4IDAtOC0zLjU4Mi04LThzMy41ODItOCA4LTggOCAzLjU4MiA4IDgtMy41ODIgOC04IDh6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-white mb-4 text-5xl md:text-6xl">About Telus Umrah</h1>
            <p className="text-white/90 text-xl max-w-3xl mx-auto">
              Your trusted partner in creating unforgettable travel experiences since 2015
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2015, Telus Umrah began with a simple vision: to make travel
                  booking effortless and accessible to everyone. What started as a small
                  startup has grown into a global platform serving millions of travelers
                  worldwide.
                </p>
                <p>
                  Our founders, passionate travelers themselves, recognized the challenges
                  people faced when planning trips. They set out to create a platform that
                  would simplify the entire process, from finding the best deals to booking
                  complete travel packages.
                </p>
                <p>
                  Today, we're proud to be one of the leading online travel agencies,
                  partnering with hundreds of airlines and thousands of hotels to bring you
                  the best travel experiences at competitive prices.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1635073630004-97c3587ebcbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhaXJwb3J0JTIwdGVybWluYWx8ZW58MXx8fHwxNzYxOTkxNjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Airport"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our core values shape everything we do and guide our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Message from Founder */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <Quote className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 mb-4">Message from the Founder</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A personal note from the visionary behind Telus Umrah
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Decorative Corner Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-transparent rounded-bl-full" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Column - Full Height */}
                  <div className="relative w-full h-full min-h-[500px] lg:min-h-full overflow-hidden group">
                    <motion.img
                      src={ceoImage.src}
                      alt="Ikram ul Haq - CEO & Founder"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      initial={{ scale: 1.1 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Decorative Frame */}
                    <div className="absolute inset-6 border-2 border-white/20 rounded-2xl pointer-events-none" />
                    
                    {/* Name Badge */}
                    <div className="absolute bottom-8 left-8 right-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                          <h3 className="text-white text-3xl mb-1">Ikram ul Haq</h3>
                          <p className="text-white/90 text-lg mb-1">CEO & Founder</p>
                          <p className="text-white/80 text-sm mb-3">Telus Umrah</p>
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
                            <div className="h-1 w-8 bg-white/40 rounded-full" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="p-8 lg:p-12 xl:p-14 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50/50">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <Quote className="w-12 h-12 text-blue-600/20" />
                    </div>

                    {/* Message */}
                    <div className="space-y-5 text-gray-600 leading-relaxed">
                      <p className="text-xl text-gray-900">
                        Dear Valued Traveler,
                      </p>
                      <p className="text-base">
                        When I founded Telus Umrah in 2015, my vision was simple yet ambitious: to create a travel platform that treats every journey as a personal adventure and every customer as family.
                      </p>
                      <p className="text-base">
                        Having experienced the frustrations of complicated booking processes and unreliable service myself, I was determined to build something different. Today, I'm proud to say that we've helped millions of travelers explore the world with confidence and ease.
                      </p>
                      <p className="text-base">
                        Our commitment goes beyond just booking flights and hotels. We're here to turn your travel dreams into reality, whether it's a business trip, family vacation, or a once-in-a-lifetime adventure.
                      </p>
                      <p className="text-base">
                        Thank you for trusting us with your journey. We promise to continue innovating and delivering the exceptional service you deserve.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Shadow Element */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-r from-transparent via-blue-600/10 to-transparent blur-xl rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
