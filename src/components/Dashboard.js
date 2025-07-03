import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ShieldCheckIcon,
  PlayIcon,
  ChartBarIcon,
  CogIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = ({ processedCount, totalSavings, onStartWorkflow, onViewExecutiveDashboard, onViewTechnologyStack }) => {
  const metrics = [
    {
      title: 'Disenrollment Reduction',
      value: '94%',
      change: '+12%',
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Annual Cost Savings',
      value: '$2.4M',
      change: `+$${totalSavings.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Member Satisfaction',
      value: '87%',
      change: '+15%',
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Compliance Rate',
      value: '99.9%',
      change: '+4.2%',
      icon: ShieldCheckIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ];

  const roiData = [
    { name: 'Traditional Manual', cost: 150, color: '#ef4444' },
    { name: 'Agentic AI Solution', cost: 12, color: '#10b981' }
  ];

  const trendData = [
    { month: 'Jan', savings: 180000, efficiency: 85 },
    { month: 'Feb', savings: 195000, efficiency: 88 },
    { month: 'Mar', savings: 210000, efficiency: 91 },
    { month: 'Apr', savings: 225000, efficiency: 93 },
    { month: 'May', savings: 240000, efficiency: 96 },
    { month: 'Jun', savings: 255000, efficiency: 98 }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Executive Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Real-time insights into your Medicaid AI automation performance
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            onClick={onStartWorkflow}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlayIcon className="h-5 w-5" />
            <span>Start Patient Workflow</span>
          </motion.button>
          
          <motion.button
            onClick={onViewExecutiveDashboard}
            className="btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>Executive Analytics</span>
          </motion.button>
          
          <motion.button
            onClick={onViewTechnologyStack}
            className="btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CodeBracketIcon className="h-5 w-5" />
            <span>Technology Stack</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            className={`metric-card ${metric.bgColor} ${metric.borderColor} border-l-4`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                <p className="text-sm text-green-600 font-medium">{metric.change}</p>
              </div>
              <metric.icon className={`h-12 w-12 ${metric.color} opacity-80`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ROI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Comparison */}
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-2" />
            Cost Per Case Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
              <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-center text-green-800 font-semibold">
              💰 <span className="text-2xl">$1,656,000</span> Annual Savings
            </p>
            <p className="text-center text-green-600 text-sm mt-1">
              ROI: 1,380% | Payback Period: 2.3 months
            </p>
          </div>
        </motion.div>

        {/* Performance Trends */}
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="savings" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Workflow Modes */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <CogIcon className="h-6 w-6 mr-2" />
          Available Workflow Modes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🤖 Autonomous AI Mode</h4>
            <p className="text-blue-700 text-sm mb-3">
              Fully automated processing with AI agents working independently through all workflow steps.
            </p>
            <ul className="text-blue-600 text-xs space-y-1">
              <li>• Complete automation from start to finish</li>
              <li>• Fastest processing time (6-8 seconds)</li>
              <li>• Ideal for high-volume processing</li>
              <li>• 99.7% accuracy rate</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">👤 Human-in-the-Loop Mode</h4>
            <p className="text-purple-700 text-sm mb-3">
              Step-by-step processing with human oversight and approval at each agent stage.
            </p>
            <ul className="text-purple-600 text-xs space-y-1">
              <li>• Manual approval for each agent step</li>
              <li>• Review AI recommendations before proceeding</li>
              <li>• Override AI decisions when needed</li>
              <li>• Enhanced compliance and audit trail</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Live Stats */}
      {processedCount > 0 && (
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">🚀 Live Demo Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <p className="text-3xl font-bold">{processedCount}</p>
                <p className="text-blue-100">Cases Processed</p>
              </div>
              <div>
                <p className="text-3xl font-bold">${totalSavings.toLocaleString()}</p>
                <p className="text-blue-100">Total Savings</p>
              </div>
              <div>
                <p className="text-3xl font-bold">6.7s</p>
                <p className="text-blue-100">Avg Processing Time</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;