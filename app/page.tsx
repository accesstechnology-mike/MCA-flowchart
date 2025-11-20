"use client";

import { useState } from 'react';
import { FlowchartData, Node } from '@/types';
import flowchartData from '@/data/flowchart.json';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DecisionTree() {
  const data = flowchartData as FlowchartData;
  const [currentNodeId, setCurrentNodeId] = useState<string>(data.startNodeId);
  const [history, setHistory] = useState<string[]>([]);

  const currentNode = data.nodes[currentNodeId];

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

  const isResult = currentNode.type === 'result';
  const isCapacity = currentNode.status === 'capacity';

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-wide">
            access: technology <span className="font-normal text-slate-400 text-sm ml-2">Assessment Tool</span>
          </h1>
          {history.length > 0 && (
            <button 
              onClick={handleBack}
              className="text-slate-300 hover:text-white transition-colors flex items-center text-sm gap-1"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 space-y-8 min-h-[400px] flex flex-col justify-center">
          
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-start gap-4">
               {isResult ? (
                  isCapacity ? <CheckCircle className="text-green-500 shrink-0" size={32} /> : <XCircle className="text-red-500 shrink-0" size={32} />
               ) : (
                  <AlertCircle className="text-blue-500 shrink-0" size={32} />
               )}
               
               <div className="space-y-2">
                  <h2 className={cn(
                    "text-2xl font-semibold leading-tight",
                    isResult ? (isCapacity ? "text-green-700" : "text-red-700") : "text-slate-800"
                  )}>
                    {currentNode.text}
                  </h2>
                  {currentNode.details && (
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {currentNode.details}
                    </p>
                  )}
               </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid gap-4 pt-4">
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
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <span>Step {history.length + 1}</span>
          <span>Mental Capacity Act (2005)</span>
        </div>
      </div>
    </main>
  );
}
