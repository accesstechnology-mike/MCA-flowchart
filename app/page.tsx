"use client";

import { useState, useEffect } from 'react';
import { FlowchartData, Node } from '@/types';
import flowchartData from '@/data/flowchart.json';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertCircle, Calendar, Download, Info, AlertTriangle, ShieldAlert, ArrowRight, HelpCircle, Star } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DecisionTree() {
  const data = flowchartData as FlowchartData;
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [currentNodeId, setCurrentNodeId] = useState<string>(data.startNodeId);
  const [history, setHistory] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from history state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if there's existing state in history
    const existingState = window.history.state;
    
    if (existingState && existingState.node) {
      // Restore from history state
      setCurrentNodeId(existingState.node);
      if (existingState.history) {
        setHistory(existingState.history);
      }
      if (existingState.showWelcome !== undefined) {
        setShowWelcome(existingState.showWelcome);
      } else {
        setShowWelcome(false);
      }
    } else {
      // Initialize with default state
      const initialState = {
        node: data.startNodeId,
        history: [],
        showWelcome: true,
      };
      window.history.replaceState(initialState, '', window.location.pathname);
    }
    
    setIsInitialized(true);
  }, [data.startNodeId]);

  // Update history state when navigation changes (but not on initial mount)
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;
    
    const state = { node: currentNodeId, history, showWelcome };
    // Use clean URL without query parameters
    window.history.pushState(state, '', window.location.pathname);
  }, [currentNodeId, history, showWelcome, isInitialized]);

  // Handle browser back/forward navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        const { node, history: hist, showWelcome: welcome } = event.state;
        if (node) setCurrentNodeId(node);
        if (hist) setHistory(hist);
        if (welcome !== undefined) setShowWelcome(welcome);
      } else {
        // No state found, reset to initial state
        setCurrentNodeId(data.startNodeId);
        setHistory([]);
        setShowWelcome(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [data.startNodeId]);

  const handleOptionClick = (nextNodeId: string) => {
    const newHistory = [...history, currentNodeId];
    setHistory(newHistory);
    setCurrentNodeId(nextNodeId);
  };

  const handleBack = () => {
    // Always use browser's back button - it will go back through history including welcome page
    window.history.back();
  };

  const handleRestart = () => {
    setHistory([]);
    setCurrentNodeId(data.startNodeId);
    setShowWelcome(true);
  };

  const handleStartAssessment = () => {
    // Push a new history entry when starting assessment so back button can return to welcome
    const assessmentState = {
      node: data.startNodeId,
      history: [],
      showWelcome: false,
    };
    window.history.pushState(assessmentState, '', window.location.pathname);
    setShowWelcome(false);
    setHistory([]);
    setCurrentNodeId(data.startNodeId);
  };

  // Show welcome screen first
  if (showWelcome) {
    return (
      <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 lg:py-20">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left Column: Brand, Intro, CTA */}
            <div className="space-y-8 md:space-y-10">
              {/* Header/Brand */}
              <div className="flex items-center gap-3">
                <img 
                  src="/android-chrome-192x192.png" 
                  alt="access: technology logo" 
                  className="h-10 w-10 md:h-12 md:w-12 object-contain shrink-0 rounded-lg shadow-sm"
                />
                <div>
                  <h2 className="font-bold text-slate-900 text-lg md:text-xl tracking-tight">
                    access: technology
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    MCA Decision Making Pathway
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                  MCA Decision <br className="hidden lg:block" />
                  <span className="text-blue-600">Making Pathway</span>
                </h1>
                
                <div className="prose prose-lg text-slate-600 leading-relaxed">
                  <p>
                    This decision-making tool has been developed to support professionals in applying the core principles of the Mental Capacity Act (MCA) within everyday practice. It provides a structured framework to guide reflective, lawful, and ethically robust decision-making. This tool is designed to be applied on a client and decision specific basis.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleStartAssessment}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg shadow-blue-200 font-semibold text-lg group"
                  >
                    Begin Assessment
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                  
                  <a 
                    href="/MCA%20Decision%20Making%20Pathway.pdf"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium text-lg"
                  >
                    <Download size={20} />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Important Notices */}
            <div className="space-y-6 lg:pt-8">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-amber-600 mb-2">
                  <AlertTriangle size={24} />
                  <h3 className="font-semibold text-lg">Important Notice</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  This tool is intended to complement, not replace, professional judgement. It must not be used as a substitute for legal advice or formal legal procedures. Where there is uncertainty, complexity, or potential disagreement in relation to matters involving the MCA, professionals should seek independent legal advice to ensure that decisions remain fully compliant with current legislation and relevant case law.
                </p>
              </div>

              <div className="bg-red-50 rounded-2xl p-6 md:p-8 border border-red-100 space-y-4">
                <div className="flex items-center gap-3 text-red-700 mb-2">
                  <ShieldAlert size={24} />
                  <h3 className="font-semibold text-lg">Safeguarding Warning</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Any concerns regarding risk of harm, abuse, neglect, or exploitation must be acted upon immediately and managed in accordance with relevant safeguarding legislation, statutory guidance, and local safeguarding procedures, including escalation through the appropriate safeguarding authorities where required.
                </p>
              </div>

              <div className="text-center text-slate-400 text-sm py-4">
                Mental Capacity Act (2005) • <a href="https://accesstechnology.co.uk" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">access: technology</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const currentNode = data.nodes[currentNodeId];

  if (!currentNode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Assessment Error</h2>
          <p className="text-slate-600 mb-6">The current step could not be found. This may happen if the assessment structure has been updated.</p>
          <button 
            onClick={handleRestart}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2 w-full"
          >
            <RotateCcw size={18} /> Restart Assessment
          </button>
        </div>
      </div>
    );
  }

  const isResult = currentNode.type === 'result';
  const isCapacity = currentNode.status === 'capacity';

  const lackingCapacityNodes = [
    'q10', 'r-delay-decision', 'q7', 'r-seek-views', 
    'q6', 'r-hold-meeting', 'q8', 'r-dol-warning', 
    'q8b', 'r-consider-alternatives', 'q9', 'r-least-restrictive-needed', 
    'q-documentation', 'r-documentation-needed', 'q-review-date', 'r-schedule-review', 'r-process-complete'
  ];

  const hiddenStatusNodes = ['q1', 'q-safeguarding', 'r-under-16', 'r-safeguarding'];
  
  const isLackingCapacity = lackingCapacityNodes.includes(currentNodeId);
  const shouldShowStatus = !hiddenStatusNodes.includes(currentNodeId);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <img 
              src="/android-chrome-192x192.png" 
              alt="access: technology logo" 
              className="h-6 w-6 md:h-8 md:w-8 object-contain shrink-0"
            />
            <h1 className="text-base md:text-xl font-bold text-white tracking-wide">
              access: technology <span className="font-normal text-slate-400 text-xs md:text-sm ml-1 md:ml-2 hidden sm:inline">MCA Decision Making Pathway</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {!showWelcome && (
              <>
                <button 
                  onClick={handleBack}
                  className="text-slate-300 hover:text-white transition-colors flex items-center text-sm gap-1 md:gap-2"
                  title="Back"
                >
                  <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
                </button>
                <button 
                  onClick={handleRestart}
                  className="text-slate-300 hover:text-white transition-colors flex items-center text-sm gap-1 md:gap-2"
                  title="Restart Assessment"
                >
                  <RotateCcw size={16} /> <span className="hidden sm:inline">Restart</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 min-h-[440px] flex flex-col">
          
          <div className="space-y-4 animate-in fade-in duration-500 flex-grow">
            <div className="flex items-start gap-4">
               {isResult ? (
                  currentNode.id === 'r-schedule-review' ? (
                    <Calendar className="text-red-500 shrink-0" size={32} />
                  ) : currentNode.id === 'r-process-complete' ? (
                    <Star className="text-amber-500 fill-amber-500 shrink-0" size={32} />
                  ) : isCapacity ? (
                    <CheckCircle className="text-green-500 shrink-0" size={32} />
                  ) : (
                    currentNode.text.startsWith('Action:') || currentNode.text.startsWith('Action Required:') ? (
                      <div className="bg-red-500 p-2 rounded-full shrink-0">
                        <ArrowRight className="text-white shrink-0" size={24} />
                      </div>
                    ) : (
                      <XCircle className="text-red-500 shrink-0" size={32} />
                    )
                  )
               ) : (
                  <div className="bg-blue-600 p-2 rounded-full shrink-0">
                    <span className="text-white font-bold text-2xl w-8 h-8 flex items-center justify-center">?</span>
                  </div>
               )}
               
               <div className="space-y-2">
                  <h2 className={cn(
                    "text-2xl font-semibold leading-tight",
                    isResult ? (currentNode.id === 'r-process-complete' ? "text-amber-500" : isCapacity ? "text-green-700" : "text-red-700") : "text-slate-800"
                  )}>
                    {currentNode.text}
                  </h2>
                  {currentNode.details && (
                    <div className={cn(
                      "text-slate-600 leading-relaxed text-lg space-y-4",
                      !isResult ? "bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8" : ""
                    )}>
                      {!isResult && (
                        <div className="flex gap-2 text-blue-700 mb-4 items-center font-semibold">
                           <Info size={20} />
                           <span>Guidance</span>
                        </div>
                      )}
                      {currentNode.id === 'q3' || currentNode.id === 'r-unwise-decision' || currentNode.id === 'q8b' || currentNode.id === 'r-consider-alternatives' || currentNode.id === 'r-least-restrictive-needed' || currentNode.id === 'r-delay-decision' || currentNode.id === 'r-schedule-review' || currentNode.id === 'r-process-complete' || currentNode.id === 'r-capacity-confirmed' || currentNode.id === 'r-seek-views' || currentNode.id === 'r-hold-meeting' || currentNode.id === 'r-dol-warning' || currentNode.id === 'q9' || currentNode.id === 'r-documentation-needed' ? (
                        <>
                          {currentNode.details.split('\n\n').filter((para, idx) => {
                            if (currentNode.id === 'r-consider-alternatives' || currentNode.id === 'r-least-restrictive-needed' || currentNode.id === 'r-delay-decision' || currentNode.id === 'r-process-complete' || currentNode.id === 'r-capacity-confirmed' || currentNode.id === 'r-seek-views' || currentNode.id === 'r-hold-meeting' || currentNode.id === 'r-dol-warning' || currentNode.id === 'q9' || currentNode.id === 'r-documentation-needed') {
                              const paraText = para.trim();
                              return !paraText.includes('•') && paraText.length > 0;
                            } else {
                              const paraText = para.trim();
                              return !paraText.startsWith('•') && paraText.length > 0;
                            }
                          }).map((para, idx) => (
                             para.trim() && <p key={idx} dangerouslySetInnerHTML={{ __html: para }} />
                          ))}
                          
                          {(currentNode.id === 'r-consider-alternatives' || currentNode.id === 'r-least-restrictive-needed' || currentNode.id === 'r-delay-decision' || currentNode.id === 'r-process-complete' || currentNode.id === 'r-capacity-confirmed' || currentNode.id === 'r-seek-views' || currentNode.id === 'r-hold-meeting' || currentNode.id === 'r-dol-warning' || currentNode.id === 'q9' || currentNode.id === 'r-documentation-needed') && currentNode.details.includes('<b>') && (
                             (() => {
                               const boldBlocks = currentNode.details.split('\n\n').filter(p => p.includes('<b>'));
                               if (boldBlocks.length > 0) {
                                 return boldBlocks.map((block, idx) => {
                                    if (block.includes('•') && currentNode.id !== 'r-dol-warning') {
                                      // For nodes where bold is a header for bullets in the same block (legacy structure)
                                      const introMatch = block.match(/<b>([^•]+):/);
                                      if (introMatch) {
                                        return <p key={idx} className="font-bold mb-2">{introMatch[1].replace(/<\/?b>/g, '').trim()}:</p>;
                                      }
                                    }
                                    return null;
                                 });
                               }
                               return null;
                             })()
                          )}

                          <div className="space-y-3">
                            {currentNode.details.split('\n').filter(line => {
                              const trimmed = line.trim();
                              return trimmed.includes('•');
                            }).map((line, index) => {
                              let text = line.replace(/^.*•\s*/, '').trim();
                              text = text.replace(/<\/?b>/g, '').trim();
                              return (
                                <div key={index} className="flex items-start gap-3">
                                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                                  <span>{text}</span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        currentNode.details.split('\n\n').map((paragraph, index) => (
                          <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))
                      )}
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid gap-4 pt-8 mt-auto">
            {currentNode.options?.map((option, idx) => {
              const isYes = option.label === 'Yes' || option.label === "It's possible";
              const isNo = option.label === 'No' || option.label === "It's unlikely";
              
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option.nextNodeId)}
                  className={cn(
                    "w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium text-lg flex items-center justify-between group",
                    isYes 
                      ? "border-slate-200 hover:border-green-500 hover:bg-green-50 hover:text-green-700" 
                      : isNo 
                        ? "border-slate-200 hover:border-red-500 hover:bg-red-50 hover:text-red-700"
                        : "border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                  )}
                >
                  <span className="flex items-center gap-3">
                    {isYes && <CheckCircle className={cn("w-6 h-6", isYes ? "text-green-600 group-hover:text-green-700" : "")} />}
                    {isNo && <XCircle className={cn("w-6 h-6", isNo ? "text-red-600 group-hover:text-red-700" : "")} />}
                    {option.label}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-200">
                    →
                  </span>
                </button>
              );
            })}

            {isResult && (
              <button
                onClick={handleRestart}
                className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
              >
                <RotateCcw size={18} /> Start New Assessment
              </button>
            )}
          </div>

        </div>

        {/* Capacity Status Indicator */}
        {shouldShowStatus && (
          <div className={cn(
            "w-full px-6 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300 border-t",
            isLackingCapacity 
              ? "bg-red-50 text-red-800 border-red-200" 
              : "bg-green-50 text-green-700 border-green-100"
          )}>
            {isLackingCapacity ? (
              <>
                <AlertCircle size={16} />
                <span>Current Status: Client Lacks Capacity (Best Interests Framework)</span>
              </>
            ) : (
               <>
                <Info size={16} />
                <span>Current Status: Presumption of Capacity Applies</span>
              </>
            )}
          </div>
        )}

        {/* Progress / Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex md:grid md:grid-cols-3 justify-between md:justify-normal items-center gap-4 text-sm text-slate-500">
          <div className="md:justify-self-start">
            Step {history.length + 1}
          </div>
          
          <div className="justify-self-center font-medium text-slate-700 order-first md:order-none hidden md:block">
            Mental Capacity Act (2005)
          </div>

          <div className="flex items-center gap-4 md:justify-self-end">
            <a 
              href="/MCA%20Decision%20Making%20Pathway.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-slate-800 transition-colors"
              title="Download PDF Version"
            >
              <Download size={14} />
              <span className="hidden sm:inline">PDF</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
