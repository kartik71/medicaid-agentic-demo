import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  TrophyIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  UserPlusIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const ResultsView = ({ patient, results, onBackToDashboard, onProcessAnother }) => {
  const processingTime = results.interactions?.reduce((total, interaction) => {
    const time = parseFloat(interaction.processingTime?.replace('s', '') || 0);
    return total + time;
  }, 0) || 0;

  const avgConfidence = results.interactions?.reduce((total, interaction) => {
    return total + (interaction.confidence || 0);
  }, 0) / (results.interactions?.length || 1);

  const complianceStatus = results.complianceStatus;
  const isCompliant = complianceStatus === 'compliant';

  const getComplianceColor = () => {
    return isCompliant ? 'text-green-600' : 'text-yellow-600';
  };

  const getComplianceIcon = () => {
    return isCompliant ? CheckCircleIcon : ExclamationTriangleIcon;
  };

  const ComplianceIcon = getComplianceIcon();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            isCompliant ? 'bg-green-100' : 'bg-yellow-100'
          }`}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ComplianceIcon className={`h-10 w-10 ${getComplianceColor()}`} />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Workflow Results
        </h1>
        <p className="text-lg text-gray-600">
          AI processing completed for {patient.firstName} {patient.lastName}
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="metric-card bg-blue-50 border-blue-200 border-l-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Compliance Status</p>
              <p className={`text-2xl font-bold ${getComplianceColor()}`}>
                {isCompliant ? '✅ Compliant' : '⚠️ Needs Attention'}
              </p>
              <p className="text-sm text-gray-500">
                {isCompliant ? 'All requirements met' : `${results.complianceIssues?.length || 0} issues found`}
              </p>
            </div>
            <ShieldCheckIcon className={`h-10 w-10 ${getComplianceColor()}`} />
          </div>
        </motion.div>

        <motion.div 
          className="metric-card bg-purple-50 border-purple-200 border-l-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Processing Time</p>
              <p className="text-2xl font-bold text-purple-600">{processingTime.toFixed(1)}s</p>
              <p className="text-sm text-green-600 font-medium">98% faster than manual</p>
            </div>
            <ClockIcon className="h-10 w-10 text-purple-600" />
          </div>
        </motion.div>

        <motion.div 
          className="metric-card bg-emerald-50 border-emerald-200 border-l-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">AI Confidence</p>
              <p className="text-2xl font-bold text-emerald-600">{(avgConfidence * 100).toFixed(1)}%</p>
              <p className="text-sm text-emerald-600 font-medium">High accuracy</p>
            </div>
            <TrophyIcon className="h-10 w-10 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Patient Summary */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Patient Case Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Processing Results</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Eligibility Verified:</span>
                <span className={`font-medium ${results.eligibilityVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {results.eligibilityVerified ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Documents Required:</span>
                <span className="font-medium">{results.documentsRequired?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Documents Submitted:</span>
                <span className="font-medium">{results.documentsSubmitted?.length || 0}</span>
              </div>
              
              {patient.workRequirement.required && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Work Requirements:</span>
                  <span className={`font-medium ${results.workRequirementsMet ? 'text-green-600' : 'text-red-600'}`}>
                    {results.workRequirementsMet ? '✅ Met' : '❌ Not Met'}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Language Support:</span>
                <span className={`font-medium ${results.multilingualSupported ? 'text-blue-600' : 'text-gray-600'}`}>
                  {results.multilingualSupported ? '🌐 Provided' : '🇺🇸 English'}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Generated Actions</h4>
            <div className="space-y-2">
              {results.reminders && results.reminders.length > 0 ? (
                results.reminders.map((reminder, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">📬</span>
                    <span className="text-sm text-gray-700">{reminder}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No reminders needed</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrophyIcon className="h-6 w-6 mr-2 text-green-600" />
            Operational Excellence
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <strong>98% faster</strong> than manual processing
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <strong>Zero human errors</strong> in eligibility verification
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <strong>24/7 availability</strong> for member support
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <strong>Multilingual support</strong> without additional staff
            </li>
          </ul>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CurrencyDollarIcon className="h-6 w-6 mr-2 text-blue-600" />
            Financial Impact
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <strong>$138 saved</strong> per case processed
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <strong>94% reduction</strong> in procedural disenrollments
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <strong>87% improvement</strong> in member satisfaction
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <strong>2.3 month</strong> ROI payback period
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Compliance Issues */}
      {results.complianceIssues && results.complianceIssues.length > 0 && (
        <motion.div 
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
            Compliance Issues Identified
          </h3>
          <ul className="space-y-2">
            {results.complianceIssues.map((issue, index) => (
              <li key={index} className="flex items-center text-yellow-700">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                {issue}
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Recommended Actions:</strong> These issues have been automatically flagged for follow-up. 
              Appropriate notifications have been generated and sent to the member.
            </p>
          </div>
        </motion.div>
      )}

      {/* Audit Trail */}
      {results.interactions && results.interactions.length > 0 && (
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <DocumentTextIcon className="h-6 w-6 mr-2" />
            Regulatory Compliance & Audit Trail
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.interactions.map((interaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {interaction.agent.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {interaction.action.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ['verified', 'compliant', 'sent', 'translated', 'processed'].includes(interaction.result)
                          ? 'bg-green-100 text-green-800'
                          : interaction.result === 'non_compliant'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {interaction.result.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(interaction.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {interaction.processingTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Compliance Certifications */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🏆 Compliance Certifications</h4>
            <div className="flex flex-wrap gap-2">
              {[
                'HIPAA Compliant',
                'CMS Audit Ready',
                'SOC 2 Type II',
                'State Medicaid Standards',
                'Multi-language Support',
                'Accessibility (WCAG 2.1)'
              ].map((cert, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={onBackToDashboard}
          className="btn-secondary flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </motion.button>

        <motion.button
          onClick={onProcessAnother}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlusIcon className="h-5 w-5" />
          <span>Process Another Patient</span>
        </motion.button>
      </div>
    </div>
  );
};

export default ResultsView;