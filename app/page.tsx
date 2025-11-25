"use client";

import { useState, useEffect } from 'react';
import { FlowchartData, Node } from '@/types';
import flowchartData from '@/data/flowchart.json';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertCircle, Calendar, Download, Info, AlertTriangle, ShieldAlert, ArrowRight, Star, FileText, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import SummaryModal from './components/SummaryModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DecisionTree() {
  const data = flowchartData as FlowchartData;
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [currentNodeId, setCurrentNodeId] = useState<string>(data.startNodeId);
  const [history, setHistory] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const existingState = window.history.state;
    if (existingState && existingState.node) {
      setCurrentNodeId(existingState.node);
      if (existingState.history) setHistory(existingState.history);
      if (existingState.showWelcome !== undefined) setShowWelcome(existingState.showWelcome);
      else setShowWelcome(false);
    } else {
      const initialState = { node: data.startNodeId, history: [], showWelcome: true };
      window.history.replaceState(initialState, '', window.location.pathname);
    }
    setIsInitialized(true);
  }, [data.startNodeId]);

  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;
    const state = { node: currentNodeId, history, showWelcome };
    window.history.pushState(state, '', window.location.pathname);
  }, [currentNodeId, history, showWelcome, isInitialized]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        const { node, history: hist, showWelcome: welcome } = event.state;
        if (node) setCurrentNodeId(node);
        if (hist) setHistory(hist);
        if (welcome !== undefined) setShowWelcome(welcome);
      } else {
        setCurrentNodeId(data.startNodeId);
        setHistory([]);
        setShowWelcome(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [data.startNodeId]);

  const handleOptionClick = (nextNodeId: string) => {
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextNodeId);
  };

  const handleBack = () => window.history.back();

  const handleRestart = () => {
    setHistory([]);
    setCurrentNodeId(data.startNodeId);
    setShowWelcome(true);
  };

  const handleStartAssessment = () => {
    const assessmentState = { node: data.startNodeId, history: [], showWelcome: false };
    window.history.pushState(assessmentState, '', window.location.pathname);
    setShowWelcome(false);
    setHistory([]);
    setCurrentNodeId(data.startNodeId);
  };

  const getPathSummary = () => {
    return history.map((nodeId, index) => {
      const node = data.nodes[nodeId];
      const nextNodeId = index < history.length - 1 ? history[index + 1] : currentNodeId;
      const selectedOption = node.options?.find(opt => opt.nextNodeId === nextNodeId);
      return {
        question: node.text,
        answer: selectedOption?.label || 'Unknown',
        statement: selectedOption?.statement
      };
    });
  };

  // Welcome screen
  if (showWelcome) {
    return (
      <main className="min-h-screen bg-white">
        {/* Nav bar */}
        <nav className="border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/android-chrome-192x192.png" 
                alt="access: technology" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-semibold text-slate-900">access: technology</span>
            </div>
            <a 
              href="/MCA%20Decision%20Making%20Pathway.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download PDF</span>
            </a>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 py-16 md:py-24 lg:py-32">
            {/* Left: Main content */}
            <div className="animate-fadeIn">
              <p className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-4">
                Decision Making Framework
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
                <span className="whitespace-nowrap">Mental Capacity Act</span><br />
                <span className="text-slate-400">Pathway</span>
              </h1>
              <div className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl space-y-3">
                <p>
                  A structured framework to guide professionals in applying the core principles of the Mental Capacity Act within everyday practice, supporting reflective, lawful and ethically robust decision making.
                </p>
                <p className="text-slate-900 font-semibold">
                  This tool is designed to be used with a specific client and specific decision in mind.
                </p>
              </div>
              <button
                onClick={handleStartAssessment}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white text-base font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                Begin Assessment
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Right: Info cards */}
            <div className="flex flex-col justify-end space-y-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Disclaimer</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      This tool does not constitute legal advice and must not be used as a substitute for professional legal guidance. Where there is any uncertainty, complexity or disagreement, independent legal advice must be sought.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Safeguarding Warning</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Do not delay. Any serious concerns about risk of harm, abuse, neglect or exploitation must be acted upon immediately in accordance with safeguarding legislation and frameworks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
            Mental Capacity Act (2005) · <a href="https://accesstechnology.co.uk" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700 transition-colors">access: technology</a>
          </div>
        </div>
      </main>
    );
  }

  const currentNode = data.nodes[currentNodeId];

  if (!currentNode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-slate-200 max-w-md animate-fadeIn">
          <h2 className="text-xl font-semibold text-red-600 mb-3">Assessment Error</h2>
          <p className="text-slate-600 mb-6">The current step could not be found.</p>
          <button 
            onClick={handleRestart}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2 w-full"
          >
            <RotateCcw size={16} /> Restart Assessment
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
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/android-chrome-192x192.png" 
              alt="access: technology" 
              className="h-7 w-7 object-contain"
            />
            <div className="hidden sm:block">
              <span className="text-white font-medium">access: technology</span>
              <span className="text-slate-500 mx-2">·</span>
              <span className="text-slate-400 text-sm">MCA Decision Making Pathway</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleBack}
              className="text-slate-400 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
            </button>
            <button 
              onClick={handleRestart}
              className="text-slate-400 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm"
            >
              <RotateCcw size={16} /> <span className="hidden sm:inline">Restart</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-slate-200 animate-fadeIn">
          
          {/* Content */}
          <div className="p-6 md:p-8 min-h-[400px] flex flex-col">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                {isResult ? (
                  currentNode.id === 'r-schedule-review' ? (
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <Calendar className="text-red-600" size={20} />
                    </div>
                  ) : currentNode.id === 'r-process-complete' ? (
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Star className="text-amber-600 fill-amber-600" size={20} />
                    </div>
                  ) : isCapacity ? (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="text-emerald-600" size={20} />
                    </div>
                  ) : (
                    currentNode.text.startsWith('Action:') || currentNode.text.startsWith('Action Required:') ? (
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                        <ArrowRight className="text-white" size={20} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <XCircle className="text-red-600" size={20} />
                      </div>
                    )
                  )
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">?</span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h2 className={cn(
                    "text-xl md:text-2xl font-semibold leading-snug",
                    isResult 
                      ? (currentNode.id === 'r-process-complete' ? "text-amber-700" : isCapacity ? "text-emerald-700" : "text-red-700") 
                      : "text-slate-900"
                  )}>
                    {currentNode.text}
                  </h2>
                  
                  {currentNode.details && (
                    <div className={cn(
                      "mt-4 text-slate-600 leading-relaxed space-y-4",
                      !isResult && "bg-slate-50 border border-slate-200 rounded-lg p-5"
                    )}>
                      {!isResult && (
                        <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-3">
                          <Info size={16} />
                          <span>Guidance</span>
                        </div>
                      )}
                      
                      {currentNode.id === 'r-hold-meeting' && currentNode.details ? (
                        <>
                          {(() => {
                            const sections = currentNode.details.split('\n\n');
                            const elements: React.ReactNode[] = [];
                            let currentBullets: string[] = [];
                            
                            sections.forEach((section, idx) => {
                              const trimmed = section.trim();
                              if (trimmed.startsWith('•') || trimmed.includes('\n•')) {
                                const bulletLines = trimmed.split('\n').filter(l => l.trim().startsWith('•'));
                                currentBullets.push(...bulletLines);
                              } else if (trimmed.length > 0) {
                                if (currentBullets.length > 0) {
                                  elements.push(
                                    <div key={`bullets-${idx}`} className="space-y-2 mb-4">
                                      {currentBullets.map((line, bIdx) => {
                                        let text = line.replace(/^.*•\s*/, '').trim().replace(/<\/?b>/g, '');
                                        return (
                                          <div key={bIdx} className="flex items-start gap-3 text-sm">
                                            <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                                            <span>{text}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                  currentBullets = [];
                                }
                                elements.push(<p key={idx} className="text-sm" dangerouslySetInnerHTML={{ __html: trimmed }} />);
                              }
                            });
                            
                            if (currentBullets.length > 0) {
                              elements.push(
                                <div key="bullets-final" className="space-y-2">
                                  {currentBullets.map((line, bIdx) => {
                                    let text = line.replace(/^.*•\s*/, '').trim().replace(/<\/?b>/g, '');
                                    return (
                                      <div key={bIdx} className="flex items-start gap-3 text-sm">
                                        <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                                        <span>{text}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            }
                            return elements;
                          })()}
                        </>
                      ) : currentNode.id === 'q3' || currentNode.id === 'r-unwise-decision' || currentNode.id === 'q8b' || currentNode.id === 'r-consider-alternatives' || currentNode.id === 'r-least-restrictive-needed' || currentNode.id === 'r-delay-decision' || currentNode.id === 'r-schedule-review' || currentNode.id === 'r-process-complete' || currentNode.id === 'r-capacity-confirmed' || currentNode.id === 'r-seek-views' || currentNode.id === 'r-dol-warning' || currentNode.id === 'q9' || currentNode.id === 'r-documentation-needed' ? (
                        <>
                          {currentNode.details.split('\n\n').filter((para) => {
                            if (currentNode.id === 'r-consider-alternatives' || currentNode.id === 'r-least-restrictive-needed' || currentNode.id === 'r-delay-decision' || currentNode.id === 'r-process-complete' || currentNode.id === 'r-capacity-confirmed' || currentNode.id === 'r-seek-views' || currentNode.id === 'r-dol-warning' || currentNode.id === 'q9' || currentNode.id === 'r-documentation-needed') {
                              return !para.trim().includes('•') && para.trim().length > 0;
                            } else {
                              return !para.trim().startsWith('•') && para.trim().length > 0;
                            }
                          }).map((para, idx) => (
                            para.trim() && <p key={idx} className="text-sm" dangerouslySetInnerHTML={{ __html: para }} />
                          ))}
                          
                          {(currentNode.id === 'r-consider-alternatives' || currentNode.id === 'r-least-restrictive-needed' || currentNode.id === 'r-delay-decision' || currentNode.id === 'r-process-complete' || currentNode.id === 'r-capacity-confirmed' || currentNode.id === 'r-seek-views' || currentNode.id === 'r-dol-warning' || currentNode.id === 'q9' || currentNode.id === 'r-documentation-needed') && currentNode.details.includes('<b>') && (
                            (() => {
                              const boldBlocks = currentNode.details.split('\n\n').filter(p => p.includes('<b>'));
                              if (boldBlocks.length > 0) {
                                return boldBlocks.map((block, idx) => {
                                  if (block.includes('•') && currentNode.id !== 'r-dol-warning') {
                                    const introMatch = block.match(/<b>([^•]+):/);
                                    if (introMatch) {
                                      return <p key={idx} className="font-semibold text-sm mb-2">{introMatch[1].replace(/<\/?b>/g, '').trim()}:</p>;
                                    }
                                  }
                                  return null;
                                });
                              }
                              return null;
                            })()
                          )}

                          <div className="space-y-2">
                            {currentNode.details.split('\n').filter(line => line.trim().includes('•')).map((line, index) => {
                              let text = line.replace(/^.*•\s*/, '').trim().replace(/<\/?b>/g, '');
                              return (
                                <div key={index} className="flex items-start gap-3 text-sm">
                                  <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                                  <span>{text}</span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        currentNode.details.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="text-sm" dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              {currentNode.options?.map((option, idx) => {
                const isYes = option.label === 'Yes' || option.label === "It's possible";
                const isNo = option.label === 'No' || option.label === "It's unlikely";
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option.nextNodeId)}
                    className={cn(
                      "group w-full text-left px-5 py-4 rounded-lg border transition-all flex items-center justify-between font-medium",
                      isYes 
                        ? "border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-900 hover:text-emerald-700" 
                        : isNo 
                          ? "border-slate-200 hover:border-red-500 hover:bg-red-50 text-slate-900 hover:text-red-700"
                          : "border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-900 hover:text-blue-700"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {isYes && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                      {isNo && <XCircle className="w-5 h-5 text-red-500" />}
                      {option.label}
                    </span>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                  </button>
                );
              })}

              {isResult && (
                <>
                  <div className="pt-6 space-y-3">
                    <button
                      onClick={() => setIsSummaryOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium"
                    >
                      <FileText size={18} /> 
                      View Assessment Summary
                    </button>

                    <button
                      onClick={handleRestart}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                    >
                      <RotateCcw size={18} /> Start New Assessment
                    </button>
                  </div>

                  <SummaryModal 
                    isOpen={isSummaryOpen}
                    onClose={() => setIsSummaryOpen(false)}
                    pathItems={getPathSummary()}
                    outcome={currentNode.text}
                    emailTemplate={currentNode.emailTemplate}
                    status={isLackingCapacity ? 'incapacity' : 'capacity'}
                  />
                </>
              )}
            </div>
          </div>

          {/* Status bar */}
          {shouldShowStatus && (
            <div className={cn(
              "px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 border-t",
              isLackingCapacity 
                ? "bg-red-50 text-red-700 border-red-100" 
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
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

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500 rounded-b-lg">
            <span>Step {history.length + 1}</span>
            <span className="hidden md:inline">Mental Capacity Act (2005)</span>
            <a 
              href="/MCA%20Decision%20Making%20Pathway.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-slate-700 transition-colors"
            >
              <Download size={14} />
              <span>PDF</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
