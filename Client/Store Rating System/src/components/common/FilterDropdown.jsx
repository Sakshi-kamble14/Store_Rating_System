import React from 'react';
import { ChevronDown } from 'lucide-react';

const FilterDropdown = ({ label, value, onChange, options, className = '' }) => (
  <div className={`relative ${className}`}>
    {label && <span className="sr-only">{label}</span>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input appearance-none cursor-pointer pr-9 font-medium"
      aria-label={label}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
  </div>
);

export default FilterDropdown;
