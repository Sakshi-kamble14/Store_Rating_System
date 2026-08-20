import React from 'react';

const ACCENTS = {
  primary: 'bg-primary-50 text-primary-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  ink: 'bg-ink-100 text-ink-600'
};

const StatCard = ({ label, value, icon: Icon, accent = 'primary', helper }) => (
  <div className="card flex items-center justify-between gap-4 p-5">
    <div>
      <p className="text-sm font-medium text-ink-500">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-ink-900">{value}</p>
      {helper && <p className="mt-1 text-xs font-medium text-ink-400">{helper}</p>}
    </div>
    {Icon && (
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ACCENTS[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
    )}
  </div>
);

export default StatCard;
