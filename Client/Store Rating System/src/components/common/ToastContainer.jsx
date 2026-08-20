import React from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-success-600 shrink-0" />,
  error: <XCircle className="h-5 w-5 text-danger-600 shrink-0" />,
  info: <Info className="h-5 w-5 text-primary-600 shrink-0" />
};

const STYLES = {
  success: 'border-success-100 bg-success-50',
  error: 'border-danger-100 bg-danger-50',
  info: 'border-primary-100 bg-primary-50'
};

const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-popover animate-in ${STYLES[t.type] || STYLES.info}`}
        >
          {ICONS[t.type] || ICONS.info}
          <p className="flex-1 text-sm font-medium text-ink-800">{t.message}</p>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-ink-400 hover:text-ink-600"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
