import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  PlayIcon,
  ClockIcon,
  UserIcon,
  DocumentCheckIcon,
  BriefcaseIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CogIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const WorkflowStepper = ({ patient, onStartProcessing, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState('autonomous');

  const agents = [
    {
      id: 'eligibility',
      name: 'Eligibility Verification',
      icon: DocumentCheckIcon,
      description: 'Verify patient eligibility status and requirements',
      color: 'blue',
      estimatedTime: '1.2s',
      tasks: [
        'Check current eligibility status',
        'Verify renewal deadlines',
        'Identify required documentation',
        'Assess program compliance'
      ]
    },
    {
      id: 'documents',
      name: 'Document Intelligence',
      icon: DocumentCheckIcon,
      description: 'AI-powered document validation and processing',
      color: 'green',
      estimatedTime: '2.1s',
      tasks: [
        'Scan submitted documents',
        'Validate document authenticity',
        'Extract key information',
        'Identify missing documents'
      ]
    },
    {
      id: 'work',
      name: 'Work Compliance',
      icon: BriefcaseIcon,
      description: 'Verify work requirement compliance',
      color: 'purple',
      estimatedTime: '0.8s',
      tasks: [
        'Check work hour requirements',
        'Verify reported hours',
        'Process exemption requests',
        'Update compliance status'
      ]
    },
    {
      id: 'notifications',
      name: 'Smart Notifications',
      icon: BellIcon,
      description: 'Generate personalized communications',
      color: 'yellow',
      estimatedTime: '0.5s',
      tasks: [
        'Generate renewal reminders',
        'Create document requests',
        'Schedule follow-up communications',
        'Customize message content'
      ]
    },
    {
      id: 'language',
      name: 'Language Services',
      icon: GlobeAltIcon,
      description: 'Multilingual support and translation',
      color: 'indigo',
      estimatedTime: '1.0s',
      tasks: [
        'Detect language preference',
        'Translate communications',
        'Adapt cultural context',
        'Ensure accessibility compliance'
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance Assurance',
      icon: ShieldCheckIcon,
      description: 'Regulatory compliance and audit trail',
      color: 'emerald',
      estimatedTime: '0.3s',
      tasks: [
        'Generate audit logs',
        'Verify regulatory compliance',
        'Create compliance reports',
        'Ensure data security'
      ]
    }
  ];

  const getStepColor = (agent, isActive = false) => {
    if (isActive) return `text-${agent.color}-600 bg-${agent.color}-50 border-${agent.color}-200`;
    return 'text-gray-400 bg-gray-50 border-gray-200';
  };

  const totalEstimatedTime = agents.reduce((total, agent) => {
    return total + parseFloat(agent.estimatedTime.replace('s', ''));
  }, 0);

  const handleStartProcessing = () => {
    onStartProcessing(selectedMode);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          AI Workflow Configuration
        </h1>
        <p className="text-lg text-gray-600">
          Configure and review the automated workflow for {patient.firstName} {patient.lastName}
        </p>
      </motion.div>

      {/* Workflow Mode Selection */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <CogIcon className="h-6 w-6 mr-2" />
          Select Workflow Mode
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedMode === 'autonomous' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-gray-50 hover:border-blue-300'
            }`}
            onClick={() => setSelectedMode('autonomous')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center mb-3">
              <CogIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">🤖 Autonomous AI Mode</h4>
                <p className="text-sm text-gray-600">Fully automated processing</p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete automation from start to finish</li>
              <li>• Fastest processing time (~{totalEstimatedTime.toFixed(1)}s)</li>
              <li>• Ideal for high-volume processing</li>
              <li>• 99.7% accuracy rate</li>
            </ul>
          </motion.div>
          
          <motion.div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedMode === 'hitl' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 bg-gray-50 hover:border-purple-300'
            }`}
            onClick={() => setSelectedMode('hitl')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center mb-3">
              <UserGroupIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">👤 Human-in-the-Loop Mode</h4>
                <p className="text-sm text-gray-600">Step-by-step with human oversight</p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Manual approval for each agent step</li>
              <li>• Review AI recommendations before proceeding</li>
              <li>• Override AI decisions when needed</li>
              <li>• Enhanced compliance and audit trail</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Patient Summary */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <UserIcon className="h-6 w-6 mr-2" />
          Patient Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Patient Information</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">Name:</span> {patient.firstName} {patient.lastName}</p>
              <p><span className="text-gray-600">ID:</span> {patient.id}</p>
              <p><span className="text-gray-600">Language:</span> {patient.contact.language}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Eligibility Status</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">Status:</span> {patient.eligibility.status.replace('_', ' ')}</p>
              <p><span className="text-gray-600">Renewal:</span> {new Date(patient.eligibility.renewalDate).toLocaleDateString()}</p>
              <p><span className="text-gray-600">Documents:</span> {patient.eligibility.requiredDocuments.length} required</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Work Requirements</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">Required:</span> {patient.workRequirement.required ? 'Yes' : 'No'}</p>
              {patient.workRequirement.required && (
                <p><span className="text-gray-600">Hours:</span> {patient.workRequirement.hoursReported}/80</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Workflow Steps */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Workflow Steps Preview</h3>
        
        <div className="space-y-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              className={`workflow-step border-l-4 ${getStepColor(agent, currentStep === index)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
              onHoverStart={() => setCurrentStep(index)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${
                  currentStep === index ? `bg-${agent.color}-100` : 'bg-gray-100'
                }`}>
                  <agent.icon className={`h-6 w-6 ${
                    currentStep === index ? `text-${agent.color}-600` : 'text-gray-400'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                    <span className="text-sm text-gray-500 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {agent.estimatedTime}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                  
                  {currentStep === index && (
                    <motion.div 
                      className="space-y-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Tasks:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {agent.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentStep === index 
                    ? `bg-${agent.color}-100 text-${agent.color}-800` 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  Step {index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workflow Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">Workflow Summary</h4>
              <p className="text-sm text-blue-700">
                {agents.length} AI agents will process this case in {selectedMode} mode
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">
                {selectedMode === 'autonomous' ? `${totalEstimatedTime.toFixed(1)}s` : 'Variable'}
              </p>
              <p className="text-sm text-blue-700">
                {selectedMode === 'autonomous' ? 'Total estimated time' : 'Depends on review time'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Capabilities */}
      <motion.div 
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Agent Capabilities</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            '🧠 Natural Language Processing',
            '👁️ Computer Vision (OCR)',
            '🔍 Predictive Analytics',
            '🌐 Real-time Translation',
            '📊 Risk Assessment',
            '🛡️ Fraud Detection',
            '📱 Omnichannel Communication',
            '⚡ Real-time Processing'
          ].map((capability, index) => (
            <motion.div
              key={capability}
              className="flex items-center text-gray-700 p-2 bg-white rounded-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
            >
              <span className="text-xs">{capability}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={onBack}
          className="btn-secondary flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Patient Selection</span>
        </motion.button>

        <motion.button
          onClick={handleStartProcessing}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlayIcon className="h-5 w-5" />
          <span>Start {selectedMode === 'autonomous' ? 'Autonomous' : 'HITL'} Processing</span>
        </motion.button>
      </div>
    </div>
  );
};

export default WorkflowStepper;