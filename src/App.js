import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PatientSelector from './components/PatientSelector';
import WorkflowStepper from './components/WorkflowStepper';
import AgentProcessor from './components/AgentProcessor';
import ResultsView from './components/ResultsView';
import { mockPatients } from './data/mockData';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [workflowResults, setWorkflowResults] = useState(null);
  const [processedPatients, setProcessedPatients] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize with dashboard view
  useEffect(() => {
    setCurrentView('dashboard');
  }, []);

  const handleStartWorkflow = () => {
    setCurrentView('patient-selector');
    setWorkflowStep(0);
    setWorkflowResults(null);
  };

  const handlePatientSelected = (patient) => {
    setSelectedPatient(patient);
    setCurrentView('workflow');
    setWorkflowStep(0);
  };

  const handleWorkflowComplete = (results) => {
    setWorkflowResults(results);
    setCurrentView('results');
    setIsProcessing(false);
    
    // Add to processed patients if not already processed
    if (!processedPatients.find(p => p.id === selectedPatient.id)) {
      setProcessedPatients(prev => [...prev, { ...selectedPatient, results }]);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedPatient(null);
    setWorkflowStep(0);
    setWorkflowResults(null);
    setIsProcessing(false);
  };

  const handleBackToPatientSelector = () => {
    setCurrentView('patient-selector');
    setSelectedPatient(null);
    setWorkflowStep(0);
    setWorkflowResults(null);
    setIsProcessing(false);
  };

  const handleStartProcessing = () => {
    setCurrentView('processing');
    setIsProcessing(true);
    setWorkflowStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Dashboard 
                processedCount={processedPatients.length}
                onStartWorkflow={handleStartWorkflow}
              />
            </motion.div>
          )}

          {currentView === 'patient-selector' && (
            <motion.div
              key="patient-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <PatientSelector
                patients={mockPatients}
                onPatientSelected={handlePatientSelected}
                onBack={handleBackToDashboard}
              />
            </motion.div>
          )}

          {currentView === 'workflow' && selectedPatient && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <WorkflowStepper
                patient={selectedPatient}
                onStartProcessing={handleStartProcessing}
                onBack={handleBackToPatientSelector}
              />
            </motion.div>
          )}

          {currentView === 'processing' && selectedPatient && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <AgentProcessor
                patient={selectedPatient}
                onComplete={handleWorkflowComplete}
                onBack={() => setCurrentView('workflow')}
              />
            </motion.div>
          )}

          {currentView === 'results' && workflowResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsView
                patient={selectedPatient}
                results={workflowResults}
                onBackToDashboard={handleBackToDashboard}
                onProcessAnother={handleBackToPatientSelector}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;