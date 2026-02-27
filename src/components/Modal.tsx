import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${sizeClasses[size]}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-start sm:items-center justify-between p-3 sm:p-6 border-b border-slate-200 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex-1 break-words">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={20} className="sm:size-24 text-slate-500" />
          </button>
        </div>
        <div className="p-3 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
