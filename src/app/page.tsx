'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
};

export default function Home() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-1/3 h-1/3 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-indigo-100/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative h-full flex items-center justify-center">
        <motion.div 
          className="w-full max-w-6xl px-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Logo Section */}
          <motion.div 
            variants={itemVariants} 
            className="flex justify-center mb-10"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/images/logo.png"
                alt="RAST Logo"
                width={120}
                height={120}
                className="drop-shadow-xl"
              />
            </motion.div>
          </motion.div>

          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
              Welcome to RAST
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Making industrial inspections smarter, effective and efficient through cutting-edge technology and innovation.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            {[
              {
                title: "Real-time Monitoring",
                description: "Track inspections and receive instant updates",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Smart Analytics",
                description: "Data-driven insights for better decisions",
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                title: "Team Collaboration",
                description: "Work together seamlessly on inspections",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Mobile Access",
                description: "Access your workspace from anywhere",
                gradient: "from-indigo-500 to-indigo-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`}></div>
                </div>
                <h3 className="font-semibold text-gray-800 text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Buttons Section */}
          <motion.div variants={itemVariants} className="flex justify-center gap-6">
            <Link href="/auth/signup">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-200"
              >
                Sign Up
              </motion.button>
            </Link>
            
            <Link href="/auth/login">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-10 py-3 bg-white text-gray-700 rounded-xl font-medium shadow-lg hover:shadow-xl border border-gray-200 transform transition-all duration-200"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}