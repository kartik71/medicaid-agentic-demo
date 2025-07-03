import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <motion.header 
      className="gradient-bg text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <HeartIcon className="h-12 w-12 mr-3" />
            <h1 className="text-5xl font-bold">Medicaid Assist</h1>
          </motion.div>
          
          <motion.p 
            className="text-xl font-light mb-6 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Next-Generation Agentic AI for Healthcare Eligibility
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center space-x-8 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex items-center glass-effect px-4 py-2 rounded-full">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              <span>Reducing Disenrollments</span>
            </div>
            <div className="flex items-center glass-effect px-4 py-2 rounded-full">
              <GlobeAltIcon className="h-5 w-5 mr-2" />
              <span>Ensuring Compliance</span>
            </div>
            <div className="flex items-center glass-effect px-4 py-2 rounded-full">
              <span className="text-green-300 font-semibold">💰 Maximizing ROI</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;