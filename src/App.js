import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PatientSelector from './components/PatientSelector';
import WorkflowStepper from './components/WorkflowStepper';
import AgentProcessor from './components/AgentProcessor';
import ResultsView from './components/ResultsView';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import TechnologyStack from './components/TechnologyStack';
import { mockPatients } from './data/mockData';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [workflowResults, setWorkflowResults] = useState(null);
  const [processedPatients, setProcessedPatients] = useState([]);
  const [workflowMode, setWorkflowMode] = useState('autonomous'); // 'autonomous' or 'hitl'
  const [currentAgent, setCurrentAgent] = useState(0);
  const [agentResults, setAgentResults] = useState({});
  const [totalSavings, setTotalSavings] = useState(0);

  // Initialize with dashboard view
  useEffect(() => {
    setCurrentView('dashboard');
  }, []);

  const handleStartWorkflow = () => {
    setCurrentView('patient-selector');
    setWorkflowResults(null);
  };

  const handlePatientSelected = (patient) => {
    setSelectedPatient(patient);
    setCurrentView('workflow');
    setCurrentAgent(0);
    setAgentResults({});
  };

  const handleWorkflowComplete = (results) => {
    setWorkflowResults(results);
    setCurrentView('results');
    
    // Add to processed patients if not already processed
    if (!processedPatients.find(p => p.id === selectedPatient.id)) {
      const newProcessedPatient = { ...selectedPatient, results };
      setProcessedPatients(prev => [...prev, newProcessedPatient]);
      setTotalSavings(prev => prev + 138); // $138 savings per case
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedPatient(null);
    setWorkflowResults(null);
    setCurrentAgent(0);
    setAgentResults({});
  };

  const handleBackToPatientSelector = () => {
    setCurrentView('patient-selector');
    setSelectedPatient(null);
    setWorkflowResults(null);
    setCurrentAgent(0);
    setAgentResults({});
  };

  const handleStartProcessing = (mode) => {
    setWorkflowMode(mode);
    setCurrentView('processing');
    setCurrentAgent(0);
    setAgentResults({});
  };

  const handleAgentComplete = (agentIndex, result) => {
    setAgentResults(prev => ({
      ...prev,
      [agentIndex]: result
    }));
    
    if (workflowMode === 'hitl') {
      // In HITL mode, wait for user to proceed to next agent
      setCurrentAgent(agentIndex + 1);
    }
  };

  const handleProceedToNextAgent = () => {
    if (currentAgent < 5) { // 6 agents total (0-5)
      setCurrentAgent(currentAgent + 1);
    }
  };

  const handleViewExecutiveDashboard = () => {
    setCurrentView('executive-dashboard');
  };

  const handleViewTechnologyStack = () => {
    setCurrentView('technology-stack');
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
                totalSavings={totalSavings}
                onStartWorkflow={handleStartWorkflow}
                onViewExecutiveDashboard={handleViewExecutiveDashboard}
                onViewTechnologyStack={handleViewTechnologyStack}
              />
            </motion.div>
          )}

          {currentView === 'executive-dashboard' && (
            <motion.div
              key="executive-dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ExecutiveDashboard 
                processedCount={processedPatients.length}
                totalSavings={totalSavings}
              />
              <div className="mt-8 text-center">
                <button
                  onClick={handleBackToDashboard}
                  className="btn-secondary"
                >
                  Back to Main Dashboard
                </button>
              </div>
            </motion.div>
          )}

          {currentView === 'technology-stack' && (
            <motion.div
              key="technology-stack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <TechnologyStack />
              <div className="mt-8 text-center">
                <button
                  onClick={handleBackToDashboard}
                  className="btn-secondary"
                >
                  Back to Main Dashboard
                </button>
              </div>
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
                workflowMode={workflowMode}
                currentAgent={currentAgent}
                agentResults={agentResults}
                onComplete={handleWorkflowComplete}
                onAgentComplete={handleAgentComplete}
                onProceedToNextAgent={handleProceedToNextAgent}
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