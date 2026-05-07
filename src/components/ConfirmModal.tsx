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
      <div className="mb-6">
        <p className="text-gray-600">{message}</p>
      </div>
      <div className="flex justify-end space-x-3">
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" data-testid="btn-cancel-confirm">
          Cancelar
        </button>
        <button 
          onClick={onConfirm} 
          className={`px-4 py-2 text-white rounded-md transition-colors ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          data-testid="btn-accept-confirm"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}