"use client";

import { useState, useEffect } from 'react';
import { FlowchartData, Node } from '@/types';
import flowchartData from '@/data/flowchart.json';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertCircle, Calendar, Download, Info, AlertTriangle, ShieldAlert, ArrowRight, HelpCircle, Star, Copy, Check, FileText, ChevronRight } from 'lucide-react';
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

  // Show welcome screen first
  if (showWelcome) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] selection:bg-[#C9A962]/30">
        {/* Subtle background pattern */}
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16 lg:py-24">
          
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left Column: Brand, Intro, CTA */}
            <div className="space-y-10 md:space-y-12 animate-fade-up">
              {/* Header/Brand */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#C9A962]/20 rounded-xl blur-xl" />
                  <img 
                    src="/android-chrome-192x192.png" 
                    alt="access: technology logo" 
                    className="relative h-12 w-12 md:h-14 md:w-14 object-contain shrink-0 rounded-xl shadow-luxury"
                  />
                </div>
                <div>
                  <h2 className="font-display text-xl md:text-2xl text-[#1C1C1E] tracking-wide">
                    access: technology
                  </h2>
                  <p className="text-[#8E8E93] text-sm tracking-wider uppercase">
                    Professional Standards
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[#C9A962] text-sm font-medium tracking-[0.2em] uppercase">
                    Decision Making Framework
                  </p>
                  <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1C1C1E] tracking-tight leading-[1.05]">
                    Mental Capacity<br />
                    <span className="text-gradient-gold">Act Pathway</span>
                  </h1>
                </div>
                
                <div className="text-lg text-[#3A3A3C] leading-relaxed max-w-xl">
                  <p>
                    A structured framework designed to support professionals in applying the core principles of the Mental Capacity Act within everyday practice—ensuring reflective, lawful, and ethically robust decision-making.
                  </p>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleStartAssessment}
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1C1C1E] text-white rounded-xl hover:bg-[#2C2C2E] transition-all duration-300 shadow-luxury hover-lift font-medium text-lg tracking-wide"
                  >
                    Begin Assessment
                    <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                  </button>
                  
                  <a 
                    href="/MCA%20Decision%20Making%20Pathway.pdf"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-[#1C1C1E] border-2 border-[#1C1C1E]/10 rounded-xl hover:border-[#C9A962] hover:text-[#C9A962] transition-all duration-300 font-medium text-lg tracking-wide"
                  >
                    <Download size={18} />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Important Notices */}
            <div className="space-y-6 lg:pt-16 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-luxury border border-[#C9A962]/10 space-y-5">
                <div className="flex items-center gap-3 text-[#B8963E]">
                  <div className="p-2 bg-[#C9A962]/10 rounded-lg">
                    <AlertTriangle size={22} />
                  </div>
                  <h3 className="font-display text-xl tracking-wide">Important Notice</h3>
                </div>
                <p className="text-[#3A3A3C] leading-relaxed">
                  This tool is intended to complement, not replace, professional judgement. It must not be used as a substitute for legal advice or formal legal procedures. Where there is uncertainty, complexity, or potential disagreement, professionals should seek independent legal advice.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#9B2C2C]/5 to-[#9B2C2C]/10 rounded-2xl p-8 md:p-10 border border-[#9B2C2C]/10 space-y-5">
                <div className="flex items-center gap-3 text-[#9B2C2C]">
                  <div className="p-2 bg-[#9B2C2C]/10 rounded-lg">
                    <ShieldAlert size={22} />
                  </div>
                  <h3 className="font-display text-xl tracking-wide">Safeguarding Warning</h3>
                </div>
                <p className="text-[#3A3A3C] leading-relaxed">
                  Any concerns regarding risk of harm, abuse, neglect, or exploitation must be acted upon immediately and managed in accordance with relevant safeguarding legislation, statutory guidance, and local procedures.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 text-[#8E8E93] text-sm py-6">
                <span className="h-px w-8 bg-[#8E8E93]/30" />
                <span className="tracking-wider">Mental Capacity Act (2005)</span>
                <span className="h-px w-8 bg-[#8E8E93]/30" />
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
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="text-center p-10 bg-white rounded-2xl shadow-luxury-lg border border-[#C9A962]/10 max-w-md animate-fade-up">
          <h2 className="font-display text-2xl text-[#9B2C2C] mb-4">Assessment Error</h2>
          <p className="text-[#3A3A3C] mb-8 leading-relaxed">The current step could not be found. This may happen if the assessment structure has been updated.</p>
          <button 
            onClick={handleRestart}
            className="px-8 py-4 bg-[#1C1C1E] text-white rounded-xl hover:bg-[#2C2C2E] transition-all duration-300 font-medium flex items-center justify-center gap-3 w-full shadow-luxury hover-lift"
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
    <main className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 md:p-6">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-luxury-lg overflow-hidden border border-[#C9A962]/10 animate-fade-up">
        
        {/* Header */}
        <div className="bg-luxury-gradient px-5 md:px-8 py-4 md:py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
            <img 
              src="/android-chrome-192x192.png" 
              alt="access: technology logo" 
              className="h-8 w-8 md:h-10 md:w-10 object-contain shrink-0 rounded-lg"
            />
            <div className="min-w-0">
              <h1 className="font-display text-lg md:text-xl text-white tracking-wide truncate">
                access: technology
              </h1>
              <p className="text-[#8E8E93] text-xs md:text-sm tracking-wide hidden sm:block">MCA Decision Making Pathway</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            {!showWelcome && (
              <>
                <button 
                  onClick={handleBack}
                  className="text-[#8E8E93] hover:text-white transition-colors duration-300 flex items-center text-sm gap-2"
                  title="Back"
                >
                  <ArrowLeft size={16} /> <span className="hidden sm:inline tracking-wide">Back</span>
                </button>
                <button 
                  onClick={handleRestart}
                  className="text-[#8E8E93] hover:text-white transition-colors duration-300 flex items-center text-sm gap-2"
                  title="Restart Assessment"
                >
                  <RotateCcw size={16} /> <span className="hidden sm:inline tracking-wide">Restart</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 min-h-[440px] flex flex-col">
          
          <div className="space-y-5 flex-grow">
            <div className="flex items-start gap-5">
               {isResult ? (
                  currentNode.id === 'r-schedule-review' ? (
                    <div className="p-3 bg-[#9B2C2C]/10 rounded-xl shrink-0">
                      <Calendar className="text-[#9B2C2C]" size={28} />
                    </div>
                  ) : currentNode.id === 'r-process-complete' ? (
                    <div className="p-3 bg-[#C9A962]/10 rounded-xl shrink-0">
                      <Star className="text-[#C9A962] fill-[#C9A962]" size={28} />
                    </div>
                  ) : isCapacity ? (
                    <div className="p-3 bg-[#2D6A4F]/10 rounded-xl shrink-0">
                      <CheckCircle className="text-[#2D6A4F]" size={28} />
                    </div>
                  ) : (
                    currentNode.text.startsWith('Action:') || currentNode.text.startsWith('Action Required:') ? (
                      <div className="bg-[#9B2C2C] p-3 rounded-xl shrink-0">
                        <ArrowRight className="text-white" size={24} />
                      </div>
                    ) : (
                      <div className="p-3 bg-[#9B2C2C]/10 rounded-xl shrink-0">
                        <XCircle className="text-[#9B2C2C]" size={28} />
                      </div>
                    )
                  )
               ) : (
                  <div className="bg-[#1C1C1E] p-3 rounded-xl shrink-0">
                    <span className="text-white font-display text-2xl w-7 h-7 flex items-center justify-center">?</span>
                  </div>
               )}
               
               <div className="space-y-3 flex-1">
                  <h2 className={cn(
                    "font-display text-2xl md:text-3xl leading-tight tracking-wide",
                    isResult ? (currentNode.id === 'r-process-complete' ? "text-[#B8963E]" : isCapacity ? "text-[#2D6A4F]" : "text-[#9B2C2C]") : "text-[#1C1C1E]"
                  )}>
                    {currentNode.text}
                  </h2>
                  {currentNode.details && (
                    <div className={cn(
                      "text-[#3A3A3C] leading-relaxed text-base md:text-lg space-y-4",
                      !isResult ? "bg-[#FAF8F5] p-6 md:p-8 rounded-xl border border-[#C9A962]/10 mt-6" : "mt-4"
                    )}>
                      {!isResult && (
                        <div className="flex gap-2 text-[#B8963E] mb-5 items-center font-medium tracking-wide">
                           <Info size={18} />
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
                                // Collect bullet lines
                                const bulletLines = trimmed.split('\n').filter(l => l.trim().startsWith('•'));
                                currentBullets.push(...bulletLines);
                              } else if (trimmed.length > 0) {
                                // Render any collected bullets first
                                if (currentBullets.length > 0) {
                                  elements.push(
                                    <div key={`bullets-${idx}`} className="space-y-3 mb-5">
                                      {currentBullets.map((line, bIdx) => {
                                        let text = line.replace(/^.*•\s*/, '').trim();
                                        text = text.replace(/<\/?b>/g, '').trim();
                                        return (
                                          <div key={bIdx} className="flex items-start gap-3">
                                            <CheckCircle className="text-[#2D6A4F] shrink-0 mt-0.5" size={18} />
                                            <span>{text}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                  currentBullets = [];
                                }
                                // Render the text section
                                elements.push(<p key={idx} dangerouslySetInnerHTML={{ __html: trimmed }} />);
                              }
                            });
                            
                            // Render any remaining bullets
                            if (currentBullets.length > 0) {
                              elements.push(
                                <div key="bullets-final" className="space-y-3">
                                  {currentBullets.map((line, bIdx) => {
                                    let text = line.replace(/^.*•\s*/, '').trim();
                                    text = text.replace(/<\/?b>/g, '').trim();
                                    return (
                                      <div key={bIdx} className="flex items-start gap-3">
                                        <CheckCircle className="text-[#2D6A4F] shrink-0 mt-0.5" size={18} />
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
                          {currentNode.details.split('\n\n').filter((para, idx) => {
                            if (currentNode.id === 'r-consider-alternatives' || currentNode.id === 'r-least-restrictive-needed' || currentNode.id === 'r-delay-decision' || currentNode.id === 'r-process-complete' || currentNode.id === 'r-capacity-confirmed' || currentNode.id === 'r-seek-views' || currentNode.id === 'r-dol-warning' || currentNode.id === 'q9' || currentNode.id === 'r-documentation-needed') {
                              const paraText = para.trim();
                              return !paraText.includes('•') && paraText.length > 0;
                            } else {
                              const paraText = para.trim();
                              return !paraText.startsWith('•') && paraText.length > 0;
                            }
                          }).map((para, idx) => (
                             para.trim() && <p key={idx} dangerouslySetInnerHTML={{ __html: para }} />
                          ))}
                          
                          {(currentNode.id === 'r-consider-alternatives' || currentNode.id === 'r-least-restrictive-needed' || currentNode.id === 'r-delay-decision' || currentNode.id === 'r-process-complete' || currentNode.id === 'r-capacity-confirmed' || currentNode.id === 'r-seek-views' || currentNode.id === 'r-dol-warning' || currentNode.id === 'q9' || currentNode.id === 'r-documentation-needed') && currentNode.details.includes('<b>') && (
                             (() => {
                               const boldBlocks = currentNode.details.split('\n\n').filter(p => p.includes('<b>'));
                               if (boldBlocks.length > 0) {
                                 return boldBlocks.map((block, idx) => {
                                    if (block.includes('•') && currentNode.id !== 'r-dol-warning') {
                                      // For nodes where bold is a header for bullets in the same block (legacy structure)
                                      const introMatch = block.match(/<b>([^•]+):/);
                                      if (introMatch) {
                                        return <p key={idx} className="font-semibold mb-2">{introMatch[1].replace(/<\/?b>/g, '').trim()}:</p>;
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
                                  <CheckCircle className="text-[#2D6A4F] shrink-0 mt-0.5" size={18} />
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
          <div className="grid gap-4 pt-10 mt-auto">
            {currentNode.options?.map((option, idx) => {
              const isYes = option.label === 'Yes' || option.label === "It's possible";
              const isNo = option.label === 'No' || option.label === "It's unlikely";
              
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option.nextNodeId)}
                  className={cn(
                    "group w-full text-left px-6 py-5 rounded-xl border-2 transition-all duration-300 font-medium text-lg flex items-center justify-between hover-lift",
                    isYes 
                      ? "border-[#2D6A4F]/20 hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5 text-[#1C1C1E] hover:text-[#2D6A4F]" 
                      : isNo 
                        ? "border-[#9B2C2C]/20 hover:border-[#9B2C2C] hover:bg-[#9B2C2C]/5 text-[#1C1C1E] hover:text-[#9B2C2C]"
                        : "border-[#C9A962]/20 hover:border-[#C9A962] hover:bg-[#C9A962]/5 text-[#1C1C1E] hover:text-[#B8963E]"
                  )}
                >
                  <span className="flex items-center gap-4">
                    {isYes && <CheckCircle className="w-5 h-5 text-[#2D6A4F]" />}
                    {isNo && <XCircle className="w-5 h-5 text-[#9B2C2C]" />}
                    {option.label}
                  </span>
                  <ChevronRight className="opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300" size={20} />
                </button>
              );
            })}

            {isResult && (
              <>
                <button
                  onClick={() => setIsSummaryOpen(true)}
                  className="mt-10 w-full flex items-center justify-center gap-3 px-6 py-5 bg-white border-2 border-[#1C1C1E]/10 text-[#1C1C1E] rounded-xl hover:border-[#C9A962] hover:text-[#B8963E] transition-all duration-300 font-medium text-lg group hover-lift"
                >
                  <FileText className="group-hover:scale-110 transition-transform duration-300" size={20} /> 
                  View Assessment Summary
                </button>

                <button
                  onClick={handleRestart}
                  className="mt-2 w-full flex items-center justify-center gap-3 px-6 py-5 bg-[#1C1C1E] text-white rounded-xl hover:bg-[#2C2C2E] transition-all duration-300 font-medium text-lg shadow-luxury hover-lift"
                >
                  <RotateCcw size={18} /> Start New Assessment
                </button>

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

        {/* Capacity Status Indicator */}
        {shouldShowStatus && (
          <div className={cn(
            "w-full px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300 border-t tracking-wide",
            isLackingCapacity 
              ? "bg-[#9B2C2C]/5 text-[#9B2C2C] border-[#9B2C2C]/10" 
              : "bg-[#2D6A4F]/5 text-[#2D6A4F] border-[#2D6A4F]/10"
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
        <div className="bg-[#FAF8F5] px-6 py-4 border-t border-[#C9A962]/10 flex md:grid md:grid-cols-3 justify-between md:justify-normal items-center gap-4 text-sm text-[#8E8E93]">
          <div className="md:justify-self-start tracking-wide">
            Step {history.length + 1}
          </div>
          
          <div className="justify-self-center font-display text-[#3A3A3C] order-first md:order-none hidden md:block tracking-wide">
            Mental Capacity Act (2005)
          </div>

          <div className="flex items-center gap-4 md:justify-self-end">
            <a 
              href="/MCA%20Decision%20Making%20Pathway.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#B8963E] transition-colors duration-300 tracking-wide"
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
