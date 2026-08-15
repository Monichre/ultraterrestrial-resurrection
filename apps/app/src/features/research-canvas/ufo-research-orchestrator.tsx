import React, { useState, useEffect } from 'react';
import { Play, Users, Settings, Terminal, ChevronDown, ChevronRight, X, Clock, CheckCircle, Zap, BarChart3, Eye, Radar, Shield, Star, Target, Globe } from 'lucide-react';

const UFOResearchOrchestrator = () => {
  const [config, setConfig] = useState({
    numAgents: 4,
    selectedAgents: ['master-orchestrator', 'evidence-evaluator', 'historical-analyst', 'ner-extractor'],
    executionParadigm: 'hierarchical',
    roles: {},
    scenario: 'ufo-investigation',
    credibilityThreshold: 0.7,
    alertLevel: 'standard'
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uiMode, setUiMode] = useState('investigation');
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    agents: true,
    credibility: true,
    roles: true
  });
  
  const [investigationMetrics, setInvestigationMetrics] = useState({
    documentsAnalyzed: 0,
    entitiesExtracted: 0,
    credibilityScore: 0,
    hoaxIndicators: 0,
    witnessesVerified: 0,
    patternsDetected: 0,
    physicalEvidence: 0,
    governmentSources: 0,
    correlationScore: 0,
    threatLevel: 'low'
  });
  
  const [realTimeAlerts, setRealTimeAlerts] = useState([]);
  const [extractedEntities, setExtractedEntities] = useState([]);
  const [credibilityAnalysis, setCredibilityAnalysis] = useState([]);
  const [agentOutputs, setAgentOutputs] = useState([]);
  const [finalIntelligence, setFinalIntelligence] = useState([]);

  const ufoAgentTypes = {
    'master-orchestrator': { 
      name: 'Master Orchestrator', 
      icon: '🎯', 
      capabilities: ['query-routing', 'agent-coordination', 'quality-control'],
      tier: 'controller'
    },
    'evidence-evaluator': { 
      name: 'Evidence Evaluator', 
      icon: '🔬', 
      capabilities: ['forensic-analysis', 'hoax-detection', 'authenticity-verification'],
      tier: 'specialist'
    },
    'historical-analyst': { 
      name: 'Historical Analyst', 
      icon: '📚', 
      capabilities: ['project-blue-book', 'declassified-docs', 'pattern-correlation'],
      tier: 'specialist'
    },
    'ner-extractor': { 
      name: 'NER Extraction Engine', 
      icon: '🗃️', 
      capabilities: ['entity-extraction', 'relationship-mapping', 'vector-embeddings'],
      tier: 'processor'
    },
    'geospatial-analyst': { 
      name: 'Geospatial Analyst', 
      icon: '🗺️', 
      capabilities: ['hotspot-detection', 'flight-path-analysis', 'military-correlation'],
      tier: 'specialist'
    },
    'pattern-recognition': { 
      name: 'Pattern Recognition', 
      icon: '📊', 
      capabilities: ['temporal-analysis', 'behavioral-patterns', 'flap-detection'],
      tier: 'analyst'
    },
    'real-time-monitor': { 
      name: 'Real-Time Monitor', 
      icon: '📡', 
      capabilities: ['breaking-events', 'social-monitoring', 'alert-system'],
      tier: 'monitor'
    },
    'strategic-synthesizer': { 
      name: 'Strategic Synthesizer', 
      icon: '🧠', 
      capabilities: ['meta-analysis', 'predictive-modeling', 'scenario-planning'],
      tier: 'controller'
    }
  };

  const ufoScenarios = {
    'ufo-investigation': {
      name: 'UFO Case Investigation',
      defaultAgents: ['master-orchestrator', 'evidence-evaluator', 'historical-analyst', 'ner-extractor'],
      defaultParadigm: 'hierarchical'
    },
    'real-time-event': {
      name: 'Breaking UFO Event Response',
      defaultAgents: ['real-time-monitor', 'evidence-evaluator', 'pattern-recognition', 'strategic-synthesizer'],
      defaultParadigm: 'parallel'
    },
    'pattern-analysis': {
      name: 'UFO Pattern Analysis',
      defaultAgents: ['pattern-recognition', 'geospatial-analyst', 'historical-analyst', 'strategic-synthesizer'],
      defaultParadigm: 'collaborative'
    }
  };

  const credibilityTiers = {
    tier1: { name: 'Tier 1 (9-10)', description: 'Military pilots, astronauts', threshold: 0.9 },
    tier2: { name: 'Tier 2 (7-8)', description: 'Commercial pilots, scientists', threshold: 0.7 },
    tier3: { name: 'Tier 3 (5-6)', description: 'Multiple civilians', threshold: 0.5 },
    tier4: { name: 'Tier 4 (3-4)', description: 'Single civilian', threshold: 0.3 },
    tier5: { name: 'Tier 5 (1-2)', description: 'Anonymous sources', threshold: 0.1 }
  };

  const evidenceTypes = {
    physical: { name: 'Physical Evidence', weight: 1.0 },
    sensor: { name: 'Sensor Data', weight: 0.8 },
    visual: { name: 'Visual Documentation', weight: 0.6 },
    witness: { name: 'Witness Testimony', weight: 0.4 },
    documentary: { name: 'Documentary Evidence', weight: 0.2 }
  };

  const alertLevels = {
    flash: { name: 'FLASH ALERT', color: 'red' },
    priority: { name: 'PRIORITY ALERT', color: 'orange' },
    standard: { name: 'STANDARD ALERT', color: 'yellow' },
    watch: { name: 'WATCH ALERT', color: 'blue' }
  };

  const executionParadigms = {
    sequential: { name: 'Sequential', description: 'Agents work one after another' },
    parallel: { name: 'Parallel', description: 'All agents work simultaneously' },
    hierarchical: { name: 'Hierarchical', description: 'Tree-like delegation structure' },
    collaborative: { name: 'Collaborative', description: 'Agents discuss and iterate together' }
  };

  useEffect(() => {
    if (config.selectedAgents.includes('real-time-monitor')) {
      const interval = setInterval(() => {
        const alerts = [
          { id: Date.now(), type: 'sighting', location: 'Phoenix, AZ', credibility: 0.85, time: new Date().toLocaleTimeString() },
          { id: Date.now() + 1, type: 'radar', location: 'RAF Lakenheath', credibility: 0.92, time: new Date().toLocaleTimeString() }
        ];
        
        if (Math.random() > 0.8) {
          setRealTimeAlerts(prev => [alerts[Math.floor(Math.random() * alerts.length)], ...prev.slice(0, 3)]);
        }
      }, 15000);
      
      return () => clearInterval(interval);
    }
  }, [config.selectedAgents]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateConfig = (key, value) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      
      if (key === 'scenario' && ufoScenarios[value]) {
        const scenario = ufoScenarios[value];
        newConfig.selectedAgents = scenario.defaultAgents;
        newConfig.numAgents = scenario.defaultAgents.length;
        newConfig.executionParadigm = scenario.defaultParadigm;
      }
      
      return newConfig;
    });
  };

  const addAgent = (agentType) => {
    if (!config.selectedAgents.includes(agentType)) {
      setConfig(prev => ({
        ...prev,
        selectedAgents: [...prev.selectedAgents, agentType],
        numAgents: prev.numAgents + 1
      }));
    }
  };

  const removeAgent = (agentType) => {
    setConfig(prev => ({
      ...prev,
      selectedAgents: prev.selectedAgents.filter(a => a !== agentType),
      numAgents: prev.numAgents - 1
    }));
  };

  const generateUFOOutput = (agent, step, prompt) => {
    const outputs = {
      'master-orchestrator': {
        type: 'orchestration_analysis',
        title: 'Master Orchestration Assessment',
        content: `🎯 Strategic Analysis for: "${prompt}"\n\nQuery Classification:\n• Complexity Level: ${Math.random() > 0.5 ? 'High' : 'Medium'}\n• Credibility Threshold: ${config.credibilityThreshold}\n• Alert Priority: ${config.alertLevel.toUpperCase()}\n\nAgent Deployment:\n• ${config.selectedAgents.length} specialized agents activated\n• Execution paradigm: ${config.executionParadigm}\n• Quality control: Enhanced credibility framework\n\nInitial Assessment:\n• Government involvement: ${Math.random() > 0.6 ? 'Detected' : 'None'}\n• Historical pattern match: ${Math.random() > 0.4 ? 'Confirmed' : 'Analyzing'}\n• Hoax probability: ${(Math.random() * 0.3).toFixed(2)} (Low risk)`,
        data: {
          agentsDeployed: config.selectedAgents.length,
          credibilityFramework: 'active',
          hoaxRisk: (Math.random() * 0.3).toFixed(2)
        }
      },
      'evidence-evaluator': {
        type: 'evidence_analysis',
        title: 'Forensic Evidence Assessment',
        content: `🔬 Evidence Evaluation Report for: "${prompt}"\n\nEvidence Hierarchy Analysis:\n• Tier 1 (Physical): ${Math.floor(Math.random() * 3)} items\n• Tier 2 (Sensor): ${Math.floor(Math.random() * 5)} data points\n• Tier 3 (Visual): ${Math.floor(Math.random() * 8)} media files\n• Tier 4 (Witness): ${Math.floor(Math.random() * 12)} testimonies\n• Tier 5 (Documentary): ${Math.floor(Math.random() * 6)} documents\n\nAuthentication Results:\n• Chain of custody: ${Math.random() > 0.7 ? 'Verified' : 'Partial'}\n• Metadata integrity: ${(Math.random() * 100).toFixed(1)}% authentic\n• Hoax indicators: ${Math.floor(Math.random() * 3)} flags\n• Expert credibility: ${(0.7 + Math.random() * 0.3).toFixed(2)}`,
        data: {
          evidenceItems: Math.floor(Math.random() * 20) + 5,
          authenticationScore: (0.7 + Math.random() * 0.3).toFixed(2),
          hoaxFlags: Math.floor(Math.random() * 3)
        }
      },
      'historical-analyst': {
        type: 'historical_correlation',
        title: 'Historical Pattern Analysis',
        content: `📚 Historical Analysis for: "${prompt}"\n\nDatabase Cross-Reference:\n• Project Blue Book matches: ${Math.floor(Math.random() * 8)} cases\n• MUFON database correlation: ${Math.floor(Math.random() * 15)} reports\n• NUFORC pattern analysis: ${Math.floor(Math.random() * 12)} matches\n• Declassified documents: ${Math.floor(Math.random() * 5)} FOIA releases\n\nHistorical Context:\n• Flap period correlation: ${Math.random() > 0.6 ? '1967 Wave' : '1973 Wave'}\n• Witness patterns: ${Math.random() > 0.5 ? 'Military personnel' : 'Civilian pilots'}\n• Geographic status: ${Math.random() > 0.4 ? 'Known hotspot' : 'New location'}\n• Technology progression: ${Math.random() > 0.7 ? 'Advanced' : 'Standard'}`,
        data: {
          bluebookMatches: Math.floor(Math.random() * 8),
          mufonCorrelations: Math.floor(Math.random() * 15),
          foiaDocuments: Math.floor(Math.random() * 5)
        }
      },
      'ner-extractor': {
        type: 'entity_extraction',
        title: 'Advanced Entity Extraction Results',
        content: `🗃️ NER Analysis for: "${prompt}"\n\nEntity Extraction Summary:\n• Personnel/Witnesses: ${Math.floor(Math.random() * 12) + 3} identified\n• Events/Sightings: ${Math.floor(Math.random() * 8) + 2} catalogued\n• Organizations: ${Math.floor(Math.random() * 6) + 1} mapped\n• Locations: ${Math.floor(Math.random() * 10) + 2} geotagged\n• Evidence/Artifacts: ${Math.floor(Math.random() * 5) + 1} documented\n\nCredibility Scoring:\n• Average credibility: ${(0.6 + Math.random() * 0.4).toFixed(2)}\n• Source reliability: ${(0.7 + Math.random() * 0.3).toFixed(2)}\n• Cross-validation: ${(Math.random() * 100).toFixed(1)}% confirmed\n• Relationship confidence: ${(0.8 + Math.random() * 0.2).toFixed(2)}`,
        data: {
          entitiesExtracted: Math.floor(Math.random() * 40) + 20,
          credibilityAverage: (0.6 + Math.random() * 0.4).toFixed(2),
          relationships: Math.floor(Math.random() * 30) + 15
        }
      }
    };

    return outputs[agent] || {
      type: 'generic_ufo_output',
      title: 'UFO Analysis Output',
      content: `${ufoAgentTypes[agent]?.name || 'Agent'} completed analysis for: "${prompt}"`,
      data: {}
    };
  };

  const simulateUFOInvestigation = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setMessages([]);
    setAgentOutputs([]);
    setFinalIntelligence([]);
    setExtractedEntities([]);
    setCredibilityAnalysis([]);
    
    setInvestigationMetrics({
      documentsAnalyzed: Math.floor(Math.random() * 50) + 10,
      entitiesExtracted: Math.floor(Math.random() * 100) + 25,
      credibilityScore: (0.6 + Math.random() * 0.4).toFixed(2),
      hoaxIndicators: Math.floor(Math.random() * 3),
      witnessesVerified: Math.floor(Math.random() * 15) + 5,
      patternsDetected: Math.floor(Math.random() * 8) + 2,
      physicalEvidence: Math.floor(Math.random() * 5),
      governmentSources: Math.floor(Math.random() * 3),
      correlationScore: (Math.random() * 100).toFixed(1),
      threatLevel: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low'
    });
    
    const steps = generateUFOExecutionSteps();
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const agentOutput = generateUFOOutput(steps[i].agent, i + 1, prompt);
      
      setMessages(prev => [...prev, {
        id: Date.now() + i,
        step: i + 1,
        agent: steps[i].agent,
        action: steps[i].action,
        message: steps[i].message,
        timestamp: new Date().toLocaleTimeString(),
        status: 'completed',
        output: agentOutput
      }]);
      
      if (steps[i].agent !== 'system') {
        setAgentOutputs(prev => [...prev, {
          ...agentOutput,
          agent: steps[i].agent,
          step: i + 1,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
      
      if (steps[i].agent === 'ner-extractor') {
        const entities = Array.from({length: 5}, (_, idx) => ({
          id: Date.now() + idx,
          name: ['David Fravor', 'USS Nimitz', 'Tic Tac Object', 'FLIR1 Video', 'Chad Underwood'][idx],
          type: ['PERSON', 'ORGANIZATION', 'EVENT', 'EVIDENCE', 'PERSON'][idx],
          credibility: (0.5 + Math.random() * 0.5).toFixed(2),
          confidence: (0.7 + Math.random() * 0.3).toFixed(2)
        }));
        setExtractedEntities(entities);
      }
      
      if (steps[i].agent === 'evidence-evaluator') {
        const credibilityData = Array.from({length: 5}, (_, idx) => ({
          id: idx,
          source: ['Military Pilot', 'Radar Operator', 'Commercial Pilot', 'Civilian Witness', 'Anonymous Report'][idx],
          tier: idx + 1,
          credibility: [0.95, 0.85, 0.75, 0.45, 0.15][idx],
          evidence: ['Flight logs, radar data', 'Technical recordings', 'Professional testimony', 'Cell phone video', 'Social media post'][idx]
        }));
        setCredibilityAnalysis(credibilityData);
      }
    }
    
    const intelligence = [{
      type: 'final_synthesis',
      title: 'Comprehensive UFO Intelligence Report',
      summary: `Complete multi-agent UFO investigation with ${config.selectedAgents.length} specialized analysts`,
      status: 'completed',
      priority: 'critical'
    }];
    setFinalIntelligence(intelligence);
    
    setIsRunning(false);
    setMessages(prev => [...prev, {
      id: Date.now(),
      step: steps.length + 1,
      agent: 'system',
      action: 'completion',
      message: `UFO investigation completed! Generated intelligence reports from ${config.selectedAgents.length} specialized agents.`,
      timestamp: new Date().toLocaleTimeString(),
      status: 'success'
    }]);
  };

  const generateUFOExecutionSteps = () => {
    const steps = [];
    const agents = config.selectedAgents;
    
    if (agents.includes('master-orchestrator')) {
      steps.push({
        agent: 'master-orchestrator',
        action: 'initialize',
        message: `Master Orchestrator initializing UFO investigation protocol with ${config.credibilityThreshold} credibility threshold...`
      });
    }
    
    agents.filter(a => a !== 'master-orchestrator').forEach(agent => {
      steps.push({
        agent,
        action: 'execute',
        message: `${ufoAgentTypes[agent].name} conducting specialized UFO analysis...`
      });
    });
    
    return steps;
  };

  const MonitoringDashboard = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Radar className="w-5 h-5 text-blue-600" />
          UFO Monitoring Dashboard
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            config.alertLevel === 'flash' ? 'bg-red-100 text-red-700' :
            config.alertLevel === 'priority' ? 'bg-orange-100 text-orange-700' :
            config.alertLevel === 'standard' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {alertLevels[config.alertLevel]?.name || 'STANDARD ALERT'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Investigation Metrics
            </h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-white p-3 rounded">
                <div className="text-gray-600 text-xs">Documents</div>
                <div className="font-bold text-lg">{investigationMetrics.documentsAnalyzed}</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-gray-600 text-xs">Entities</div>
                <div className="font-bold text-lg">{investigationMetrics.entitiesExtracted}</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-gray-600 text-xs">Credibility</div>
                <div className="font-bold text-lg">{investigationMetrics.credibilityScore}</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-gray-600 text-xs">Witnesses</div>
                <div className="font-bold text-lg">{investigationMetrics.witnessesVerified}</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-gray-600 text-xs">Patterns</div>
                <div className="font-bold text-lg">{investigationMetrics.patternsDetected}</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-gray-600 text-xs">Evidence</div>
                <div className="font-bold text-lg">{investigationMetrics.physicalEvidence}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2 text-red-700">
              <Shield className="w-4 h-4" />
              Live Alerts
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {realTimeAlerts.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-2">No active alerts</div>
              ) : (
                realTimeAlerts.map(alert => (
                  <div key={alert.id} className="border rounded p-2 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {alert.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <div className="text-sm font-medium">{alert.location}</div>
                    <div className="text-xs text-gray-600">
                      Credibility: {(alert.credibility * 100).toFixed(0)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-700">
              <Target className="w-4 h-4" />
              Threat Assessment
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Level:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  investigationMetrics.threatLevel === 'high' ? 'bg-red-100 text-red-700' :
                  investigationMetrics.threatLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {investigationMetrics.threatLevel.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hoax Indicators:</span>
                <span className="font-medium">{investigationMetrics.hoaxIndicators}</span>
              </div>
              <div className="flex justify-between">
                <span>Gov Sources:</span>
                <span className="font-medium">{investigationMetrics.governmentSources}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InvestigationInterface = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">UFO Investigation Interface</h3>
      </div>
      
      <div className="h-96 border rounded-lg p-4 overflow-y-auto bg-gray-50 mb-4">
        {messages.length === 0 && !isRunning && (
          <div className="text-gray-500 text-center mt-20">
            Submit a UFO investigation query to begin analysis
          </div>
        )}
        
        {messages.map(msg => (
          <div key={msg.id} className="mb-3 p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                Step {msg.step}
              </span>
              <span className="font-medium text-sm">
                {msg.agent === 'system' ? '🔧 System' : `${ufoAgentTypes[msg.agent]?.icon} ${ufoAgentTypes[msg.agent]?.name}`}
              </span>
              <span className="text-xs text-gray-500">{msg.timestamp}</span>
              {msg.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {msg.status === 'success' && <Zap className="w-4 h-4 text-yellow-500" />}
            </div>
            <p className="text-sm text-gray-700">{msg.message}</p>
            {msg.output && (
              <div className="mt-3 border-t pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">
                    {msg.output.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-sm font-medium">{msg.output.title}</span>
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{msg.output.content}</pre>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isRunning && (
          <div className="mb-3 p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
              <span className="text-sm text-purple-700">UFO analysis agents investigating...</span>
            </div>
          </div>
        )}
      </div>
      
      {(extractedEntities.length > 0 || credibilityAnalysis.length > 0 || finalIntelligence.length > 0) && (
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            Investigation Results
          </h4>
          
          {extractedEntities.length > 0 && (
            <div className="mb-6">
              <h5 className="font-medium mb-3">Extracted Entities</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {extractedEntities.map((entity) => (
                  <div key={entity.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        entity.type === 'PERSON' ? 'bg-blue-100 text-blue-800' :
                        entity.type === 'ORGANIZATION' ? 'bg-green-100 text-green-800' :
                        entity.type === 'EVENT' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {entity.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(entity.credibility * 100).toFixed(0)}% credible
                      </span>
                    </div>
                    <h6 className="font-medium text-sm mb-1">{entity.name}</h6>
                    <div className="text-xs text-gray-600">
                      Confidence: {(entity.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {credibilityAnalysis.length > 0 && (
            <div className="mb-6">
              <h5 className="font-medium mb-3">Credibility Assessment Matrix</h5>
              <div className="space-y-2">
                {credibilityAnalysis.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.tier === 1 ? 'bg-green-500' :
                        item.tier === 2 ? 'bg-blue-500' :
                        item.tier === 3 ? 'bg-yellow-500' :
                        item.tier === 4 ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <span className="text-sm font-medium">{item.source}</span>
                        <div className="text-xs text-gray-500">{item.evidence}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{(item.credibility * 100).toFixed(0)}%</div>
                      <div className="text-xs text-gray-500">Tier {item.tier}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {agentOutputs.length > 0 && (
            <div className="mb-6">
              <h5 className="font-medium mb-3">Specialized Agent Outputs</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agentOutputs.map((output, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        {ufoAgentTypes[output.agent]?.icon} {ufoAgentTypes[output.agent]?.name}
                      </span>
                      <span className="text-xs text-gray-500">{output.timestamp}</span>
                    </div>
                    <h6 className="font-medium text-sm mb-1">{output.title}</h6>
                    <p className="text-xs text-gray-600 mb-2">{output.content.substring(0, 200)}...</p>
                    {output.data && Object.keys(output.data).length > 0 && (
                      <div className="text-xs text-gray-500">
                        <strong>Key Data:</strong> {Object.entries(output.data).slice(0, 3).map(([key, value]) => 
                          `${key}: ${value}`
                        ).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {finalIntelligence.length > 0 && (
            <div>
              <h5 className="font-medium mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Final Intelligence Reports
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {finalIntelligence.map((intel, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        intel.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        intel.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {intel.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <h6 className="font-medium text-sm mb-1">{intel.title}</h6>
                    <p className="text-xs text-gray-600">{intel.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter UFO investigation query (e.g., 'Analyze the USS Nimitz encounter', 'Pattern analysis for 2004 incidents')..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isRunning}
        />
        <button
          onClick={simulateUFOInvestigation}
          disabled={isRunning || !prompt.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Investigate
        </button>
      </div>
    </div>
  );

  const TerminalInterface = () => (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 text-green-400 font-mono">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="w-5 h-5" />
        <h3 className="text-lg font-semibold">UFO Research Terminal</h3>
      </div>
      
      <div className="h-96 bg-black rounded p-4 overflow-y-auto text-sm">
        <div className="text-green-300 mb-2">$ UFO Research Orchestration System v3.0</div>
        <div className="text-green-300 mb-4">
          Initialized with {config.numAgents} agents | Credibility threshold: {config.credibilityThreshold} | Alert level: {config.alertLevel}
        </div>
        
        {messages.map(msg => (
          <div key={msg.id} className="mb-2">
            <span className="text-yellow-400">[{msg.timestamp}]</span>
            <span className="text-blue-400"> {msg.agent}:</span>
            <span className="text-green-400"> {msg.message}</span>
            {msg.output && msg.output.data && (
              <div className="ml-4 text-cyan-400 text-xs">
                Data: {Object.entries(msg.output.data).slice(0, 2).map(([k, v]) => `${k}=${v}`).join(', ')}
              </div>
            )}
          </div>
        ))}
        
        {isRunning && (
          <div className="text-yellow-400 animate-pulse">
            {'>'} Executing UFO investigation step {currentStep + 1}...
          </div>
        )}
        
        {!isRunning && (
          <div className="mt-4">
            <span className="text-green-300">ufo-research$ </span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="investigate <query>"
              className="bg-transparent outline-none text-green-400 flex-1"
              disabled={isRunning}
              onKeyPress={(e) => e.key === 'Enter' && simulateUFOInvestigation()}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            🛸 UFO Research Multi-Agent Orchestration System
          </h1>
          <p className="text-gray-600">Advanced AI-powered UFO investigation platform with credibility assessment and pattern recognition</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                UFO Investigation Scenarios
              </h3>
              <div className="space-y-2">
                {Object.entries(ufoScenarios).map(([key, scenario]) => (
                  <button
                    key={key}
                    onClick={() => updateConfig('scenario', key)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      config.scenario === key 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{scenario.name}</div>
                    <div className="text-sm text-gray-500">{scenario.defaultAgents.length} specialized agents</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  UFO Research Agents
                </h3>
                <button onClick={() => toggleSection('agents')}>
                  {expandedSections.agents ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
              
              {expandedSections.agents && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Selected UFO Agents</label>
                    <div className="space-y-2">
                      {config.selectedAgents.map(agentType => (
                        <div key={agentType} className="flex items-center justify-between p-2 border rounded">
                          <span className="flex items-center gap-2">
                            <span>{ufoAgentTypes[agentType]?.icon}</span>
                            <div>
                              <span className="font-medium">{ufoAgentTypes[agentType]?.name}</span>
                              <div className="text-xs text-gray-500">{ufoAgentTypes[agentType]?.tier}</div>
                            </div>
                          </span>
                          <button
                            onClick={() => removeAgent(agentType)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-2">
                      <select
                        onChange={(e) => e.target.value && addAgent(e.target.value)}
                        value=""
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Add UFO Agent...</option>
                        {Object.entries(ufoAgentTypes)
                          .filter(([key]) => !config.selectedAgents.includes(key))
                          .map(([key, agent]) => (
                            <option key={key} value={key}>{agent.icon} {agent.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Credibility Framework
                </h3>
                <button onClick={() => toggleSection('credibility')}>
                  {expandedSections.credibility ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
              
              {expandedSections.credibility && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Credibility Threshold: {config.credibilityThreshold}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={config.credibilityThreshold}
                      onChange={(e) => updateConfig('credibilityThreshold', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Alert Level</label>
                    <select
                      value={config.alertLevel}
                      onChange={(e) => updateConfig('alertLevel', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {Object.entries(alertLevels).map(([key, level]) => (
                        <option key={key} value={key}>{level.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Execution Paradigm</label>
                    <select
                      value={config.executionParadigm}
                      onChange={(e) => updateConfig('executionParadigm', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {Object.entries(executionParadigms).map(([key, paradigm]) => (
                        <option key={key} value={key}>{paradigm.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 mb-2">Credibility Tiers</h4>
                    <div className="space-y-1 text-xs">
                      {Object.entries(credibilityTiers).map(([key, tier]) => (
                        <div key={key} className="flex justify-between">
                          <span>{tier.name}:</span>
                          <span className="text-gray-600">{tier.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <MonitoringDashboard />
            
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUiMode('investigation')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    uiMode === 'investigation' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Investigation Interface
                </button>
                <button
                  onClick={() => setUiMode('terminal')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    uiMode === 'terminal' 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  Research Terminal
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{config.numAgents} agents</span>
                <span>{config.executionParadigm} mode</span>
                <span>Credibility ≥ {config.credibilityThreshold}</span>
                {isRunning && (
                  <div className="flex items-center gap-1 text-purple-600">
                    <Clock className="w-4 h-4 animate-spin" />
                    Investigating
                  </div>
                )}
              </div>
            </div>

            {uiMode === 'investigation' ? <InvestigationInterface /> : <TerminalInterface />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UFOResearchOrchestrator;
                      