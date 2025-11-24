import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, FileText, CheckCircle, AlertCircle, Mail } from 'lucide-react';

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

  // Prevent scrolling when modal is open
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900">
            <FileText className="text-blue-600" size={24} />
            <h2 className="font-bold text-lg">Assessment Summary</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
            aria-label="Close summary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-6">
            
            {/* Status Banner */}
            {status && (
               <div className={`px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium border ${
                 status === 'capacity' 
                   ? 'bg-green-50 text-green-800 border-green-100' 
                   : 'bg-red-50 text-red-800 border-red-100'
               }`}>
                 {status === 'capacity' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                 {status === 'capacity' 
                   ? 'Current Status: Presumption of Capacity Applies' 
                   : 'Current Status: Client Lacks Capacity (Best Interests Framework)'
                 }
               </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Established Facts
              </h3>
              <ul className="space-y-3">
                {pathItems.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                    <CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={16} />
                    <span>{item.statement || `${item.question} (${item.answer})`}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Final Outcome
                </h3>
                <p className="font-bold text-lg leading-snug">
                  {outcome}
                </p>
              </div>
              
              {emailTemplate && (
                <div className="pt-3 border-t border-slate-700/50">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                     <Mail size={12} /> Suggested Action / Communication
                   </h3>
                   <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                     {emailTemplate}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg shadow-blue-200"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied to Clipboard' : 'Copy Summary'}
          </button>
        </div>
      </div>
    </div>
  );
}
