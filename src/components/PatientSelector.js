import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const PatientSelector = ({ patients, onPatientSelected, onBack }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  const getScenarioDescription = (scenario) => {
    const descriptions = {
      renewal_needed: 'Medicaid renewal deadline approaching',
      work_compliance: 'Work requirement verification needed',
      documents_missing: 'Required documentation incomplete',
      multilingual: 'Non-English language preference',
      compliant: 'All requirements currently met'
    };
    return descriptions[scenario] || 'Standard case';
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleContinue = () => {
    if (selectedPatient) {
      onPatientSelected(selectedPatient);
    }
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
          Select Patient Case
        </h1>
        <p className="text-lg text-gray-600">
          Choose a patient to process through the AI workflow
        </p>
      </motion.div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient, index) => (
          <motion.div
            key={patient.id}
            className={`patient-card cursor-pointer transition-all duration-200 ${
              selectedPatient?.id === patient.id 
                ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                : `${getScenarioColor(patient.scenario)} hover:shadow-md`
            }`}
            onClick={() => handlePatientClick(patient)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-6">
              {/* Patient Header */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{getScenarioIcon(patient.scenario)}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {patient.id}</p>
                </div>
              </div>

              {/* Scenario Description */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Case Type:</p>
                <p className="text-sm text-gray-600">{getScenarioDescription(patient.scenario)}</p>
              </div>

              {/* Patient Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">
                    {patient.eligibility.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <GlobeAltIcon className="h-4 w-4 mr-1" />
                    Language:
                  </span>
                  <span className="font-medium">{patient.contact.language}</span>
                </div>

                {patient.workRequirement.required && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-1" />
                      Work Hours:
                    </span>
                    <span className="font-medium">
                      {patient.workRequirement.hoursReported}/80
                    </span>
                  </div>
                )}

                {patient.eligibility.requiredDocuments.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      Documents:
                    </span>
                    <span className="font-medium">
                      {patient.eligibility.requiredDocuments.length} required
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Renewal:
                  </span>
                  <span className="font-medium text-xs">
                    {new Date(patient.eligibility.renewalDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedPatient?.id === patient.id && (
                <motion.div 
                  className="mt-4 p-2 bg-blue-100 rounded-lg text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-blue-800 font-medium text-sm">✓ Selected</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Patient Details */}
      {selectedPatient && (
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <UserIcon className="h-6 w-6 mr-2" />
            Selected Patient: {selectedPatient.firstName} {selectedPatient.lastName}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Patient Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Full Name:</span> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                <p><span className="text-gray-600">Patient ID:</span> {selectedPatient.id}</p>
                <p><span className="text-gray-600">Language:</span> {selectedPatient.contact.language}</p>
                <p><span className="text-gray-600">Contact Method:</span> {selectedPatient.contact.preferredContactMethod}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Case Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Eligibility Status:</span> {selectedPatient.eligibility.status.replace('_', ' ')}</p>
                <p><span className="text-gray-600">Renewal Date:</span> {new Date(selectedPatient.eligibility.renewalDate).toLocaleDateString()}</p>
                <p><span className="text-gray-600">Work Required:</span> {selectedPatient.workRequirement.required ? 'Yes' : 'No'}</p>
                <p><span className="text-gray-600">Documents Needed:</span> {selectedPatient.eligibility.requiredDocuments.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={onBack}
          className="btn-secondary flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </motion.button>

        <motion.button
          onClick={handleContinue}
          disabled={!selectedPatient}
          className={`flex items-center space-x-2 ${
            selectedPatient 
              ? 'btn-primary' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed py-3 px-6 rounded-lg'
          }`}
          whileHover={selectedPatient ? { scale: 1.02 } : {}}
          whileTap={selectedPatient ? { scale: 0.98 } : {}}
        >
          <span>Continue to Workflow</span>
          <ArrowRightIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default PatientSelector;