import React from 'react';

const ACCENTS = {
  primary: 'bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 ring-1 ring-primary-500/20',
  success: 'bg-gradient-to-br from-success-50 to-success-100 text-success-600 ring-1 ring-success-500/20',
  warning: 'bg-gradient-to-br from-warning-50 to-warning-100 text-warning-600 ring-1 ring-warning-500/20',
  ink: 'bg-gradient-to-br from-ink-50 to-ink-100 text-ink-600 ring-1 ring-ink-500/20',
  secondary: 'bg-gradient-to-br from-secondary-50 to-secondary-100 text-secondary-600 ring-1 ring-secondary-500/20'
};

const StatCard = ({ label, value, icon: Icon, accent = 'primary', helper }) => (
  <div className="card group relative overflow-hidden flex items-center justify-between gap-4 p-6 transition-all duration-300 hover:-translate-y-1">
    <div className="relative z-10">
      <p className="text-sm font-medium text-ink-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-ink-900">{value}</p>
      {helper && <p className="mt-1 text-xs font-medium text-ink-400">{helper}</p>}
    </div>
    {Icon && (
      <div className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${ACCENTS[accent]} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="h-6 w-6" />
      </div>
    )}
    <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40 ${
      accent === 'primary' ? 'bg-primary-500' : 
      accent === 'success' ? 'bg-success-500' :
      accent === 'warning' ? 'bg-warning-500' :
      accent === 'secondary' ? 'bg-secondary-500' : 'bg-ink-500'
    }`} />
  </div>
);

export default StatCard;
