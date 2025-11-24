"use client";

import { useState } from 'react';
import { FlowchartData, Node } from '@/types';
import flowchartData from '@/data/flowchart.json';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertCircle, Calendar, Download, ExternalLink, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
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

  const handleOptionClick = (nextNodeId: string) => {
    setHistory((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(nextNodeId);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevNodeId = newHistory.pop();
    setHistory(newHistory);
    if (prevNodeId) setCurrentNodeId(prevNodeId);
  };

  const handleRestart = () => {
    setHistory([]);
    setCurrentNodeId(data.startNodeId);
  };

  const handleStartAssessment = () => {
    setShowWelcome(false);
  };

  // Show welcome screen first
  if (showWelcome) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="bg-slate-900 px-4 md:px-6 py-3 md:py-4 flex items-center gap-2 md:gap-3">
            <img 
              src="/android-chrome-192x192.png" 
              alt="access: technology logo" 
              className="h-6 w-6 md:h-8 md:w-8 object-contain shrink-0"
            />
            <h1 className="text-base md:text-xl font-bold text-white tracking-wide">
              access: technology <span className="font-normal text-slate-400 text-xs md:text-sm ml-1 md:ml-2 hidden sm:inline">MCA Decision Making Pathway</span>
            </h1>
          </div>

          {/* Welcome Content */}
          <div className="p-8 md:p-10 space-y-6">
            <div className="flex items-start gap-4">
              <Info className="text-blue-500 shrink-0 mt-1" size={32} />
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-800 leading-tight">
                  Welcome to the MCA Decision Making Pathway
                </h2>
                <div className="text-slate-600 leading-relaxed text-lg space-y-4">
                  <p>
                    This decision-making tool has been developed to support professionals in applying the core principles of the Mental Capacity Act (MCA) within everyday practice. It provides a structured framework to guide reflective, lawful, and ethically robust decision-making.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-slate-200">
              <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={32} />
              <div className="text-slate-600 leading-relaxed text-lg space-y-4">
                <p>
                  This tool is intended to complement, not replace, professional judgement. It must not be used as a substitute for legal advice or formal legal procedures. Where there is uncertainty, complexity, or potential disagreement in relation to matters involving the MCA, professionals should seek independent legal advice to ensure that decisions remain fully compliant with current legislation and relevant case law.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-slate-200">
              <ShieldAlert className="text-red-600 shrink-0 mt-1" size={32} />
              <div className="flex-1">
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
                  <p className="text-slate-700 leading-relaxed text-lg font-medium">
                    Any concerns regarding risk of harm, abuse, neglect, or exploitation must be acted upon immediately and managed in accordance with relevant safeguarding legislation, statutory guidance, and local safeguarding procedures, including escalation through the appropriate safeguarding authorities where required.
                  </p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-6">
              <button
                onClick={handleStartAssessment}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium text-lg"
              >
                Continue to Assessment
                <span className="ml-2">→</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center text-sm text-slate-500">
            <div className="font-medium text-slate-700">
              Mental Capacity Act (2005)
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
            {history.length > 0 && (
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
                  isCapacity ? (
                    currentNode.id === 'r-schedule-review' ? (
                      <Calendar className="text-blue-500 shrink-0" size={32} />
                    ) : (
                      <CheckCircle className="text-green-500 shrink-0" size={32} />
                    )
                  ) : (
                    <XCircle className="text-red-500 shrink-0" size={32} />
                  )
               ) : (
                  <AlertCircle className="text-blue-500 shrink-0" size={32} />
               )}
               
               <div className="space-y-2">
                  <h2 className={cn(
                    "text-2xl font-semibold leading-tight",
                    isResult ? (isCapacity ? (currentNode.id === 'r-schedule-review' ? "text-blue-700" : "text-green-700") : "text-red-700") : "text-slate-800"
                  )}>
                    {currentNode.text}
                  </h2>
                  {currentNode.details && (
                    <div className="text-slate-600 leading-relaxed text-lg space-y-4">
                      {currentNode.details.split('\n\n').map((paragraph, index) => (
                        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                      ))}
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid gap-4 pt-8 mt-auto">
            {currentNode.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option.nextNodeId)}
                className="w-full text-left px-6 py-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium text-lg flex items-center justify-between group"
              >
                {option.label}
                <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-200">
                  →
                </span>
              </button>
            ))}

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
            <span className="w-px h-3 bg-slate-300 hidden sm:block"></span>
            <a 
              href="https://miro.com/app/board/uXjVJp0nMIE=/?share_link_id=685157992485"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-slate-800 transition-colors"
              title="View Online Mindmap"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Miro Board</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
