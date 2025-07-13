
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-up"
        onClick={e => e.stopPropagation()}
        style={{
          animationName: 'fadeInUp',
          animationDuration: '0.3s',
          animationFillMode: 'forwards',
        }}
      >
        <h2 id="modal-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        <div>{children}</div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in-up {
          animation-name: fadeInUp;
          animation-duration: 0.3s;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;
