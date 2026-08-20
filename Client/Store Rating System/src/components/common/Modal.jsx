import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ open, onClose, title, children, footer, size = 'md' }) => {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Always keep the latest onClose function without
  // causing the modal effect to run on every render.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the dialog only when the modal opens.
    dialogRef.current?.focus();

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`relative w-full ${sizes[size]} rounded-[2rem] border border-white/60 bg-white/90 backdrop-blur-xl shadow-popover animate-slide-up outline-none`}
      >
        <div className="flex items-center justify-between border-b border-ink-100/50 px-6 py-5">
          <h2
            id="modal-title"
            className="text-base font-semibold text-ink-900"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-ink-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;