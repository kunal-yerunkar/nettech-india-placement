
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
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

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center sm:p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300">
      {/* 
          On Mobile (<sm): h-full, w-full, rounded-none, border-none (Full Screen)
          On Desktop (>=sm): max-h-[90vh], max-w-3xl, rounded-[2rem], shadow-2xl
      */}
      <div className="bg-white dark:bg-[#0a0f18] h-full w-full sm:h-auto sm:max-w-3xl sm:max-h-[90vh] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in slide-in-from-bottom-4 sm:zoom-in duration-300 border-none sm:border sm:border-white/10">

        {/* Modal Header - Fixed at top */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 shrink-0">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{title}</h3>
          <button
            onClick={onClose}
            className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-[#0a0f18]">
          <div className="max-w-2xl mx-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
