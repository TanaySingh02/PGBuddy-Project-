import React from 'react';
import { Home, Building2, Users, Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import PropertyCard from './components/PropertyCard';

function App() {
  const stats = [
    { number: '1200+', label: 'Listed Properties' },
    { number: '4500+', label: 'Happy Customers' },
    { number: '100+', label: 'Verified Owners' },
  ];

  const properties = [
    {
      id: 1,
      title: 'Modern PG in Koramangala',
      location: 'Koramangala, Bangalore',
      price: '12,000',
      beds: 3,
      area: '10x10 m',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'
    },
    {
      id: 2,
      title: 'Luxury PG in HSR Layout',
      location: 'HSR Layout, Bangalore',
      price: '15,000',
      beds: 2,
      area: '12x12 m',
      image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'
    },
    {
      id: 3,
      title: 'Student PG in BTM',
      location: 'BTM Layout, Bangalore',
      price: '10,000',
      beds: 4,
      area: '8x10 m',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-navy-50 to-white">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-6xl">
                Find A PG
                <br />
                That Suits You
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Want to find a PG? We are ready to help you find one that suits your lifestyle and needs
              </p>
              
              <div className="mt-10">
                <SearchBar />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-10 grid grid-cols-3 gap-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-navy-900">{stat.number}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                alt="Modern PG"
                className="rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Popular Properties Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-8"
          >
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">Popular PGs</h2>
            <button className="text-navy-600 hover:text-navy-700">
              Explore All →
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-navy-900 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <img
              className="mx-auto h-20 w-20 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              alt="Testimonial"
            />
            <blockquote className="mt-6">
              <p className="text-lg font-medium text-white">
                "Our business is built off of close relationships and we are glad that we are able to share our positive real estate experiences with our clients."
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="text-base font-medium text-white">XYZ</p>
              <p className="text-base text-navy-200">Founder, PG Finder</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;