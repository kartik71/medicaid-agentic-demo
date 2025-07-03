import React from 'react';
import { motion } from 'framer-motion';
import { 
  CpuChipIcon, 
  CloudIcon, 
  CodeBracketIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const TechnologyStack = () => {
  const techCategories = [
    {
      title: '🤖 AI & Machine Learning',
      icon: CpuChipIcon,
      color: 'blue',
      technologies: [
        'Large Language Models (LLMs)',
        'Computer Vision & OCR',
        'Natural Language Processing',
        'Predictive Analytics',
        'Multi-Agent Orchestration',
        'Real-time Decision Making'
      ]
    },
    {
      title: '🏗️ Infrastructure & Security',
      icon: ShieldCheckIcon,
      color: 'green',
      technologies: [
        'Cloud-Native Architecture',
        'HIPAA Compliant Infrastructure',
        'End-to-End Encryption',
        'SOC 2 Type II Certified',
        '99.9% Uptime SLA',
        'Auto-scaling & Load Balancing'
      ]
    },
    {
      title: '🔗 Integration & APIs',
      icon: CodeBracketIcon,
      color: 'purple',
      technologies: [
        'RESTful API Architecture',
        'Real-time Webhooks',
        'HL7 FHIR Compliance',
        'State Medicaid System Integration',
        'Third-party Document Providers',
        'Microservices Architecture'
      ]
    }
  ];

  const performanceMetrics = [
    { label: 'Processing Speed', value: '< 10 seconds', improvement: '98% faster' },
    { label: 'Accuracy Rate', value: '99.7%', improvement: '15% improvement' },
    { label: 'Cost Reduction', value: '$138/case', improvement: '92% savings' },
    { label: 'Availability', value: '99.9%', improvement: '24/7 operation' }
  ];

  return (
    <motion.section 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          🛠️ Enterprise Technology Stack
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Built on cutting-edge AI and cloud technologies to deliver unparalleled performance, 
          security, and scalability for healthcare organizations.
        </motion.p>
      </div>

      {/* Technology Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {techCategories.map((category, index) => (
          <motion.div
            key={category.title}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-full bg-${category.color}-100 mr-4`}>
                <category.icon className={`h-8 w-8 text-${category.color}-600`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
            </div>
            
            <ul className="space-y-3">
              {category.technologies.map((tech, techIndex) => (
                <motion.li
                  key={tech}
                  className="flex items-center text-gray-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 + techIndex * 0.05, duration: 0.3 }}
                >
                  <span className={`w-2 h-2 bg-${category.color}-500 rounded-full mr-3 flex-shrink-0`}></span>
                  <span className="text-sm">{tech}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">⚡ Performance Benchmarks</h3>
          <p className="text-blue-100">Industry-leading metrics that drive real business value</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
            >
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold mb-2">{metric.value}</p>
                <p className="text-sm text-blue-100 mb-1">{metric.label}</p>
                <p className="text-xs text-green-300 font-medium">{metric.improvement}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Architecture Highlights */}
      <motion.div 
        className="bg-white rounded-xl p-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🏛️ Architecture Highlights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CloudIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Cloud-Native</h4>
            <p className="text-sm text-gray-600">Scalable, resilient infrastructure that grows with your needs</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CogIcon className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Event-Driven</h4>
            <p className="text-sm text-gray-600">Real-time processing with intelligent workflow orchestration</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <GlobeAltIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">API-First</h4>
            <p className="text-sm text-gray-600">Seamless integration with existing healthcare systems</p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default TechnologyStack;