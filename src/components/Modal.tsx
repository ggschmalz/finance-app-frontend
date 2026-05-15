import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 transition-opacity p-0 sm:p-4"
      data-testid="modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[95vh] sm:max-h-[90vh] flex flex-col border border-white/10"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-content"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight" data-testid="modal-title">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            data-testid="modal-close-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
