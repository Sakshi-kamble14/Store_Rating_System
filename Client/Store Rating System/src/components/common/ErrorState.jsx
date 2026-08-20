import React from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong. Please try again.', onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-danger-100 bg-danger-50 px-6 py-14 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-100">
      <AlertTriangle className="h-6 w-6 text-danger-600" />
    </div>
    <div>
      <p className="text-sm font-semibold text-ink-800">We hit a snag</p>
      <p className="mt-1 max-w-sm text-sm text-ink-500">{message}</p>
    </div>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary">
        <RotateCw className="h-4 w-4" />
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
