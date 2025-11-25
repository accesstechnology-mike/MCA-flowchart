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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1C1E]/60 backdrop-blur-sm animate-fade-up">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-luxury-lg flex flex-col max-h-[90vh] border border-[#C9A962]/10"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#C9A962]/10">
          <div className="flex items-center gap-3 text-[#1C1C1E]">
            <div className="p-2 bg-[#C9A962]/10 rounded-lg">
              <FileText className="text-[#B8963E]" size={20} />
            </div>
            <h2 className="font-display text-xl tracking-wide">Assessment Summary</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-[#FAF8F5] p-2 rounded-lg transition-colors duration-300"
            aria-label="Close summary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-8">
            
            {/* Status Banner */}
            {status && (
               <div className={`px-5 py-4 rounded-xl flex items-center gap-3 text-sm font-medium tracking-wide border ${
                 status === 'capacity' 
                   ? 'bg-[#2D6A4F]/5 text-[#2D6A4F] border-[#2D6A4F]/10' 
                   : 'bg-[#9B2C2C]/5 text-[#9B2C2C] border-[#9B2C2C]/10'
               }`}>
                 {status === 'capacity' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                 {status === 'capacity' 
                   ? 'Current Status: Presumption of Capacity Applies' 
                   : 'Current Status: Client Lacks Capacity (Best Interests Framework)'
                 }
               </div>
            )}

            <div>
              <h3 className="text-xs font-medium text-[#8E8E93] uppercase tracking-[0.15em] mb-4">
                Established Facts
              </h3>
              <ul className="space-y-3">
                {pathItems.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-[#3A3A3C] leading-relaxed bg-[#FAF8F5] p-4 rounded-xl border border-[#C9A962]/10 text-sm">
                    <CheckCircle className="text-[#2D6A4F] shrink-0 mt-0.5" size={16} />
                    <span>{item.statement || `${item.question} (${item.answer})`}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-luxury-gradient text-white p-6 rounded-xl space-y-4">
              <div>
                <h3 className="text-xs font-medium text-[#8E8E93] uppercase tracking-[0.15em] mb-2">
                  Final Outcome
                </h3>
                <p className="font-display text-xl leading-snug tracking-wide">
                  {outcome}
                </p>
              </div>
              
              {emailTemplate && (
                <div className="pt-4 border-t border-white/10">
                   <h3 className="text-xs font-medium text-[#8E8E93] uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                     <Mail size={12} /> Suggested Action / Communication
                   </h3>
                   <div className="text-[#C9C9C9] text-sm leading-relaxed whitespace-pre-wrap">
                     {emailTemplate}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#C9A962]/10 bg-[#FAF8F5] rounded-b-2xl flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-[#3A3A3C] font-medium hover:bg-white rounded-xl transition-colors duration-300 tracking-wide"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-6 py-3 bg-[#1C1C1E] text-white font-medium rounded-xl hover:bg-[#2C2C2E] transition-all duration-300 shadow-luxury hover-lift tracking-wide"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied to Clipboard' : 'Copy Summary'}
          </button>
        </div>
      </div>
    </div>
  );
}
