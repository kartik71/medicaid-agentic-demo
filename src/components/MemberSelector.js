import React from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, UserIcon, GlobeAltIcon, DocumentTextIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const MemberSelector = ({ members, selectedMember, onMemberSelect, onStartWorkflow, isProcessing }) => {
  const getScenarioIcon = (scenario) => {
    const icons = {
      renewal_needed: '🔄',
      work_compliance: '💼',
      documents_missing: '📄',
      multilingual: '🌐',
      compliant: '✅'
    };
    return icons[scenario] || '👤';
  };

  const getScenarioColor = (scenario) => {
    const colors = {
      renewal_needed: 'border-yellow-300 bg-yellow-50',
      work_compliance: 'border-blue-300 bg-blue-50',
      documents_missing: 'border-red-300 bg-red-50',
      multilingual: 'border-purple-300 bg-purple-50',
      compliant: 'border-green-300 bg-green-50'
    };
    return colors[scenario] || 'border-gray-300 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Demo Configuration</h3>
        <p className="text-gray-600 mb-6">
          Experience the power of autonomous AI agents working together to process Medicaid eligibility cases.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation Mode
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Autonomous AI</option>
              <option>Human-in-the-Loop</option>
            </select>
          </div>
          
          <motion.button
            className={`w-full btn-primary flex items-center justify-center space-x-2 ${
              isProcessing ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            onClick={onStartWorkflow}
            disabled={isProcessing || !selectedMember}
            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
          >
            <PlayIcon className="h-5 w-5" />
            <span>{isProcessing ? 'Processing...' : 'Execute Agentic AI Workflow'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Member Selection */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">👥 Select Member Case</h3>
        
        <div className="space-y-3">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedMember?.id === member.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : `${getScenarioColor(member.scenario)} hover:shadow-md`
              }`}
              onClick={() => onMemberSelect(member)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getScenarioIcon(member.scenario)}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {member.scenario.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Selected Member Profile */}
      {selectedMember && (
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <UserIcon className="h-6 w-6 mr-2" />
            Member Profile
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-semibold">{selectedMember.firstName} {selectedMember.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-mono text-sm">{selectedMember.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="capitalize font-medium">{selectedMember.eligibility.status.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Language:</span>
              <span className="flex items-center">
                <GlobeAltIcon className="h-4 w-4 mr-1" />
                {selectedMember.contact.language}
              </span>
            </div>
            {selectedMember.workRequirement.required && (
              <div className="flex justify-between">
                <span className="text-gray-600">Work Hours:</span>
                <span className="flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  {selectedMember.workRequirement.hoursReported}/80
                </span>
              </div>
            )}
            {selectedMember.eligibility.requiredDocuments.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Documents:</span>
                <span className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  {selectedMember.eligibility.requiredDocuments.length} required
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* AI Capabilities */}
      <motion.div 
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Agent Capabilities</h3>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
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
              className="flex items-center text-gray-700"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
            >
              <span>{capability}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MemberSelector;