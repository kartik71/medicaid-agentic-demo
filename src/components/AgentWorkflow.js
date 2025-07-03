import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  CogIcon,
  DocumentCheckIcon,
  BriefcaseIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const AgentWorkflow = ({ member, isProcessing, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [workflowState, setWorkflowState] = useState({});

  const agents = [
    {
      name: 'Eligibility Verification',
      icon: DocumentCheckIcon,
      description: 'Analyzing member status and requirements',
      color: 'blue',
      duration: 1200
    },
    {
      name: 'Document Intelligence',
      icon: DocumentCheckIcon,
      description: 'AI-powered document validation and processing',
      color: 'green',
      duration: 2100
    },
    {
      name: 'Work Compliance',
      icon: BriefcaseIcon,
      description: 'Automated work requirement verification',
      color: 'purple',
      duration: 800
    },
    {
      name: 'Smart Notifications',
      icon: BellIcon,
      description: 'Personalized, multilingual communications',
      color: 'yellow',
      duration: 500
    },
    {
      name: 'Language Services',
      icon: GlobeAltIcon,
      description: 'Real-time translation and cultural adaptation',
      color: 'indigo',
      duration: 1000
    },
    {
      name: 'Compliance Assurance',
      icon: ShieldCheckIcon,
      description: 'Regulatory compliance and audit trail generation',
      color: 'emerald',
      duration: 300
    }
  ];

  useEffect(() => {
    if (isProcessing && member) {
      runWorkflow();
    }
  }, [isProcessing, member]);

  const runWorkflow = async () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setWorkflowState({
      interactions: [],
      auditLog: [],
      eligibilityVerified: false,
      documentsRequired: [],
      documentsSubmitted: [],
      workRequirementsMet: false,
      reminders: [],
      multilingualSupported: false,
      complianceStatus: 'pending'
    });

    for (let i = 0; i < agents.length; i++) {
      setCurrentStep(i);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, agents[i].duration));
      
      // Update workflow state based on agent
      const newState = { ...workflowState };
      const timestamp = new Date().toISOString();
      
      switch (i) {
        case 0: // Eligibility Verification
          newState.eligibilityVerified = true;
          if (member.eligibility.requiredDocuments.length > 0) {
            newState.documentsRequired = member.eligibility.requiredDocuments;
          }
          newState.interactions.push({
            timestamp,
            agent: 'eligibility_verification',
            action: 'verify_status',
            result: 'verified',
            confidence: 0.97,
            processingTime: '1.2s'
          });
          break;
          
        case 1: // Document Intelligence
          const documentsSubmitted = member.eligibility.requiredDocuments.slice(0, 
            Math.floor(member.eligibility.requiredDocuments.length * 0.7));
          newState.documentsSubmitted = documentsSubmitted;
          newState.interactions.push({
            timestamp,
            agent: 'document_intelligence',
            action: 'validate_documents',
            result: 'processed',
            confidence: 0.94,
            processingTime: '2.1s'
          });
          break;
          
        case 2: // Work Compliance
          if (member.workRequirement.required) {
            newState.workRequirementsMet = member.workRequirement.hoursReported >= 80;
            newState.interactions.push({
              timestamp,
              agent: 'work_compliance',
              action: 'verify_hours',
              result: newState.workRequirementsMet ? 'compliant' : 'non_compliant',
              confidence: 0.99,
              processingTime: '0.8s'
            });
          }
          break;
          
        case 3: // Smart Notifications
          const reminders = [];
          if (member.eligibility.status === 'renewal_needed') {
            reminders.push('Renewal reminder generated');
          }
          if (newState.documentsRequired.length > newState.documentsSubmitted.length) {
            reminders.push('Document submission reminder');
          }
          newState.reminders = reminders;
          newState.interactions.push({
            timestamp,
            agent: 'smart_notifications',
            action: 'generate_reminders',
            result: 'sent',
            confidence: 0.96,
            processingTime: '0.5s'
          });
          break;
          
        case 4: // Language Services
          if (member.contact.language !== 'English') {
            newState.multilingualSupported = true;
            newState.interactions.push({
              timestamp,
              agent: 'language_services',
              action: 'translate_content',
              result: 'translated',
              confidence: 0.98,
              processingTime: '1.0s'
            });
          }
          break;
          
        case 5: // Compliance Assurance
          const complianceIssues = [];
          if (member.workRequirement.required && !newState.workRequirementsMet) {
            complianceIssues.push('Work requirements not met');
          }
          if (newState.documentsRequired.length > newState.documentsSubmitted.length) {
            complianceIssues.push('Missing required documents');
          }
          
          newState.complianceStatus = complianceIssues.length === 0 ? 'compliant' : 'non_compliant';
          newState.complianceIssues = complianceIssues;
          newState.interactions.push({
            timestamp,
            agent: 'compliance_assurance',
            action: 'verify_compliance',
            result: newState.complianceStatus,
            confidence: 1.0,
            processingTime: '0.3s'
          });
          break;
      }
      
      setWorkflowState(newState);
      setCompletedSteps(prev => [...prev, i]);
    }
    
    // Complete workflow
    setTimeout(() => {
      onComplete(workflowState);
    }, 500);
  };

  const getStepStatus = (index) => {
    if (completedSteps.includes(index)) return 'completed';
    if (currentStep === index && isProcessing) return 'processing';
    return 'pending';
  };

  const getStepColor = (agent, status) => {
    if (status === 'completed') return 'text-green-600 bg-green-50 border-green-200';
    if (status === 'processing') return `text-${agent.color}-600 bg-${agent.color}-50 border-${agent.color}-200`;
    return 'text-gray-400 bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">🤖 Agentic AI Workflow</h3>
        
        {!isProcessing && completedSteps.length === 0 && (
          <div className="text-center py-12">
            <CogIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Ready to process member case</p>
            <p className="text-gray-400">Click "Execute Agentic AI Workflow" to begin</p>
          </div>
        )}

        <div className="space-y-4">
          {agents.map((agent, index) => {
            const status = getStepStatus(index);
            const isActive = status === 'processing';
            
            return (
              <motion.div
                key={agent.name}
                className={`agent-card border-l-4 ${getStepColor(agent, status)} ${
                  isActive ? 'shadow-lg scale-105' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isProcessing || completedSteps.includes(index) ? 1 : 0.6,
                  x: 0,
                  scale: isActive ? 1.02 : 1
                }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.3,
                  scale: { duration: 0.2 }
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    status === 'completed' ? 'bg-green-100' :
                    status === 'processing' ? `bg-${agent.color}-100` : 'bg-gray-100'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    ) : status === 'processing' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <CogIcon className={`h-6 w-6 text-${agent.color}-600`} />
                      </motion.div>
                    ) : (
                      <ClockIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                    <p className="text-sm text-gray-600">{agent.description}</p>
                    
                    {status === 'processing' && (
                      <motion.div 
                        className="mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((dot) => (
                              <motion.div
                                key={dot}
                                className={`w-2 h-2 bg-${agent.color}-500 rounded-full`}
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: dot * 0.2
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">Processing...</span>
                        </div>
                      </motion.div>
                    )}
                    
                    {status === 'completed' && workflowState.interactions && (
                      <motion.div 
                        className="mt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>✅ Completed</span>
                          <span>⚡ {workflowState.interactions[index]?.processingTime || 'N/A'}</span>
                          <span>🎯 {((workflowState.interactions[index]?.confidence || 0) * 100).toFixed(0)}% confidence</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    status === 'completed' ? 'bg-green-100 text-green-800' :
                    status === 'processing' ? `bg-${agent.color}-100 text-${agent.color}-800` :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {status === 'completed' ? 'Complete' :
                     status === 'processing' ? 'Processing' : 'Pending'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Workflow Progress</span>
              <span>{Math.round(((completedSteps.length + (currentStep >= 0 ? 1 : 0)) / agents.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((completedSteps.length + (currentStep >= 0 ? 1 : 0)) / agents.length) * 100}%` 
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AgentWorkflow;