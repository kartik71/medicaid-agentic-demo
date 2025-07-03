import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import AgentWorkflow from './components/AgentWorkflow';
import MemberSelector from './components/MemberSelector';
import ResultsPanel from './components/ResultsPanel';
import TechnologyStack from './components/TechnologyStack';
import { mockMembers } from './data/mockData';

function App() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [workflowResults, setWorkflowResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedMembers, setProcessedMembers] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    // Initialize with first member
    if (mockMembers.length > 0) {
      setSelectedMember(mockMembers[0]);
    }
  }, []);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setWorkflowResults(null);
  };

  const handleWorkflowComplete = (results) => {
    setWorkflowResults(results);
    setIsProcessing(false);
    
    // Add to processed members if not already processed
    if (!processedMembers.find(m => m.id === selectedMember.id)) {
      setProcessedMembers(prev => [...prev, selectedMember]);
      setTotalSavings(prev => prev + 138); // Cost savings per case
    }
  };

  const startWorkflow = () => {
    setIsProcessing(true);
    setWorkflowResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Executive Dashboard */}
        <ExecutiveDashboard 
          processedCount={processedMembers.length}
          totalSavings={totalSavings}
        />

        {/* Main Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Member Selection & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <MemberSelector
              members={mockMembers}
              selectedMember={selectedMember}
              onMemberSelect={handleMemberSelect}
              onStartWorkflow={startWorkflow}
              isProcessing={isProcessing}
            />
          </div>

          {/* Agent Workflow */}
          <div className="lg:col-span-2">
            <AgentWorkflow
              member={selectedMember}
              isProcessing={isProcessing}
              onComplete={handleWorkflowComplete}
            />
          </div>
        </div>

        {/* Results Panel */}
        <AnimatePresence>
          {workflowResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsPanel 
                results={workflowResults} 
                member={selectedMember}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technology Stack */}
        <TechnologyStack />
      </main>
    </div>
  );
}

export default App;