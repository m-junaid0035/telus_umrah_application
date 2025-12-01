import { motion } from 'framer-motion';
import { Target, Users, Award, Globe, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ceoImage from '@/assets/ceo.jpeg';

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

const team = [
  {
    name: 'Ikram ul Haq',
    designation: 'CEO & Founder',
    image: ceoImage.src,
  },
  {
    name: 'Jane Smith',
    designation: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
  },
  {
    name: 'Peter Jones',
    designation: 'Head of Operations',
    image: 'https.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
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
      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-gray-900 text-4xl mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The passionate individuals behind our success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover shadow-xl"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-white shadow-inner" />
                </div>
                <h3 className="text-xl text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-semibold">{member.designation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
