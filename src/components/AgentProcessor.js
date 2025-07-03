import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  CogIcon,
  ArrowLeftIcon,
  DocumentCheckIcon,
  BriefcaseIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const AgentProcessor = ({ patient, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [workflowState, setWorkflowState] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);

  const agents = [
    {
      id: 'eligibility',
      name: 'Eligibility Verification',
      icon: DocumentCheckIcon,
      description: 'Analyzing member status and requirements',
      color: 'blue',
      duration: 1200
    },
    {
      id: 'documents',
      name: 'Document Intelligence',
      icon: DocumentCheckIcon,
      description: 'AI-powered document validation and processing',
      color: 'green',
      duration: 2100
    },
    {
      id: 'work',
      name: 'Work Compliance',
      icon: BriefcaseIcon,
      description: 'Automated work requirement verification',
      color: 'purple',
      duration: 800
    },
    {
      id: 'notifications',
      name: 'Smart Notifications',
      icon: BellIcon,
      description: 'Personalized, multilingual communications',
      color: 'yellow',
      duration: 500
    },
    {
      id: 'language',
      name: 'Language Services',
      icon: GlobeAltIcon,
      description: 'Real-time translation and cultural adaptation',
      color: 'indigo',
      duration: 1000
    },
    {
      id: 'compliance',
      name: 'Compliance Assurance',
      icon: ShieldCheckIcon,
      description: 'Regulatory compliance and audit trail generation',
      color: 'emerald',
      duration: 300
    }
  ];

  useEffect(() => {
    const startProcessing = async () => {
      setIsProcessing(true);
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
            if (patient.eligibility.requiredDocuments.length > 0) {
              newState.documentsRequired = patient.eligibility.requiredDocuments;
            }
            newState.interactions.push({
              timestamp,
              agent: 'eligibility_verification',
              action: 'verify_status',
              result: 'verified',
              confidence: 0.97,
              processingTime: '1.2s',
              details: `Status: ${patient.eligibility.status}, Renewal: ${patient.eligibility.renewalDate}`
            });
            break;
            
          case 1: // Document Intelligence
            const documentsSubmitted = patient.eligibility.requiredDocuments.slice(0, 
              Math.floor(patient.eligibility.requiredDocuments.length * 0.7));
            newState.documentsSubmitted = documentsSubmitted;
            newState.interactions.push({
              timestamp,
              agent: 'document_intelligence',
              action: 'validate_documents',
              result: 'processed',
              confidence: 0.94,
              processingTime: '2.1s',
              details: `Processed ${documentsSubmitted.length}/${patient.eligibility.requiredDocuments.length} documents`
            });
            break;
            
          case 2: // Work Compliance
            if (patient.workRequirement.required) {
              newState.workRequirementsMet = patient.workRequirement.hoursReported >= 80;
              newState.interactions.push({
                timestamp,
                agent: 'work_compliance',
                action: 'verify_hours',
                result: newState.workRequirementsMet ? 'compliant' : 'non_compliant',
                confidence: 0.99,
                processingTime: '0.8s',
                details: `Hours: ${patient.workRequirement.hoursReported}/80`
              });
            } else {
              newState.workRequirementsMet = true;
              newState.interactions.push({
                timestamp,
                agent: 'work_compliance',
                action: 'verify_hours',
                result: 'exempt',
                confidence: 1.0,
                processingTime: '0.8s',
                details: 'Work requirements not applicable'
              });
            }
            break;
            
          case 3: // Smart Notifications
            const reminders = [];
            if (patient.eligibility.status === 'renewal_needed') {
              reminders.push('Renewal reminder generated');
            }
            if (newState.documentsRequired.length > newState.documentsSubmitted.length) {
              reminders.push('Document submission reminder');
            }
            if (patient.workRequirement.required && !newState.workRequirementsMet) {
              reminders.push('Work hours reporting reminder');
            }
            newState.reminders = reminders;
            newState.interactions.push({
              timestamp,
              agent: 'smart_notifications',
              action: 'generate_reminders',
              result: 'sent',
              confidence: 0.96,
              processingTime: '0.5s',
              details: `Generated ${reminders.length} personalized reminders`
            });
            break;
            
          case 4: // Language Services
            if (patient.contact.language !== 'English') {
              newState.multilingualSupported = true;
              newState.interactions.push({
                timestamp,
                agent: 'language_services',
                action: 'translate_content',
                result: 'translated',
                confidence: 0.98,
                processingTime: '1.0s',
                details: `Content translated to ${patient.contact.language}`
              });
            } else {
              newState.multilingualSupported = false;
              newState.interactions.push({
                timestamp,
                agent: 'language_services',
                action: 'language_check',
                result: 'no_translation_needed',
                confidence: 1.0,
                processingTime: '1.0s',
                details: 'English language - no translation required'
              });
            }
            break;
            
          case 5: // Compliance Assurance
            const complianceIssues = [];
            if (patient.workRequirement.required && !newState.workRequirementsMet) {
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
              processingTime: '0.3s',
              details: complianceIssues.length === 0 ? 'All compliance requirements met' : `${complianceIssues.length} issues identified`
            });
            break;
            
          default:
            // Default case for any unexpected step
            break;
        }
        
        setWorkflowState(newState);
        setCompletedSteps(prev => [...prev, i]);
      }
      
      // Complete workflow
      setCurrentStep(-1);
      setIsProcessing(false);
      setProcessingComplete(true);
      
      setTimeout(() => {
        onComplete(workflowState);
      }, 1000);
    };

    // Auto-start processing when component mounts
    const timer = setTimeout(() => {
      startProcessing();
    }, 1000);

    return () => clearTimeout(timer);
  }, [patient, onComplete]);

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

  const progressPercentage = completedSteps.length / agents.length * 100;

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
          AI Workflow Processing
        </h1>
        <p className="text-lg text-gray-600">
          Processing {patient.firstName} {patient.lastName} through the AI workflow
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Processing Progress</h3>
          <span className="text-lg font-semibold text-blue-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Step {completedSteps.length + (isProcessing ? 1 : 0)} of {agents.length}</span>
          <span>{completedSteps.length} agents completed</span>
        </div>
      </motion.div>

      {/* Agent Processing */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">🤖 AI Agent Execution</h3>
        
        <div className="space-y-4">
          {agents.map((agent, index) => {
            const status = getStepStatus(index);
            const isActive = status === 'processing';
            
            return (
              <motion.div
                key={agent.id}
                className={`agent-card border-l-4 ${getStepColor(agent, status)} ${
                  isActive ? 'shadow-lg scale-105' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1,
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
                        {workflowState.interactions[index]?.details && (
                          <p className="text-xs text-gray-600 mt-1">
                            {workflowState.interactions[index].details}
                          </p>
                        )}
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
      </motion.div>

      {/* Processing Complete */}
      {processingComplete && (
        <motion.div 
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircleIcon className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Processing Complete!</h3>
          <p className="text-green-100">
            All AI agents have successfully processed {patient.firstName} {patient.lastName}'s case
          </p>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={onBack}
          disabled={isProcessing}
          className={`flex items-center space-x-2 ${
            isProcessing 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'btn-secondary'
          } py-3 px-6 rounded-lg`}
          whileHover={!isProcessing ? { scale: 1.02 } : {}}
          whileTap={!isProcessing ? { scale: 0.98 } : {}}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Workflow</span>
        </motion.button>

        {processingComplete && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="text-sm text-gray-600"
          >
            Redirecting to results...
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AgentProcessor;