import { Modal } from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', isDestructive = true }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="mb-10">
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">{message}</p>
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
        <button 
          onClick={onCancel} 
          className="w-full sm:w-auto px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-[1.5rem] transition-all" 
          data-testid="btn-cancel-confirm"
        >
          Cancelar
        </button>
        <button 
          onClick={onConfirm} 
          className={`w-full sm:w-auto px-10 py-4 text-xs font-black uppercase tracking-widest text-white rounded-[1.5rem] shadow-xl transition-all active:scale-95 ${
            isDestructive ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'
          }`}
          data-testid="btn-accept-confirm"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
