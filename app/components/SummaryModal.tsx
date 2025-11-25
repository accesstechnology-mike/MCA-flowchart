import React, { useState, useEffect } from 'react';
import { X, Copy, Check, FileText, CheckCircle, AlertCircle, Mail } from 'lucide-react';

interface PathItem {
  question: string;
  answer: string;
  statement?: string;
}

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pathItems: PathItem[];
  outcome: string;
  emailTemplate?: string;
  status?: 'capacity' | 'incapacity';
}

export default function SummaryModal({ isOpen, onClose, pathItems, outcome, emailTemplate, status }: SummaryModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const statements = pathItems
      .map(item => item.statement || `${item.question} - ${item.answer}`)
      .join('\n');

    const statusText = status 
      ? `\n\nCurrent Status: ${status === 'capacity' ? 'Presumption of Capacity Applies' : 'Client Lacks Capacity (Best Interests Framework)'}`
      : '';
    
    const textToCopy = `Assessment Summary:\n\n${statements}${statusText}\n\nFinal Outcome: ${outcome}\n\n${emailTemplate || ''}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-[840px] rounded-lg shadow-xl flex flex-col max-h-[90vh] border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600" size={20} />
            <h2 className="font-semibold text-lg text-slate-900">Assessment Summary</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-md transition-colors"
            aria-label="Close summary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-6">
            
            {/* Status Banner */}
            {status && (
               <div className={`px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium border ${
                 status === 'capacity' 
                   ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                   : 'bg-red-50 text-red-700 border-red-200'
               }`}>
                 {status === 'capacity' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                 {status === 'capacity' 
                   ? 'Current Status: Presumption of Capacity Applies' 
                   : 'Current Status: Client Lacks Capacity (Best Interests Framework)'
                 }
               </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Established Facts
              </h3>
              <ul className="space-y-2">
                {pathItems.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                    <CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={14} />
                    <span>{item.statement || `${item.question} (${item.answer})`}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-lg space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Final Outcome
                </h3>
                <p className="font-semibold text-base leading-snug">
                  {outcome}
                </p>
              </div>
              
              {emailTemplate && (
                <div className="pt-4 border-t border-slate-700">
                   <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                     <Mail size={12} /> Suggested Action / Communication
                   </h3>
                   <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                     {emailTemplate}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-white hover:text-slate-900 rounded-md transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy Summary'}
          </button>
        </div>
      </div>
    </div>
  );
}
