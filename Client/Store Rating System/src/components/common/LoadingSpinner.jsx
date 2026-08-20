import React from 'react';
import { Loader2 } from 'lucide-react';

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-9 w-9'
};

const LoadingSpinner = ({ size = 'md', className = '' }) => (
  <Loader2 className={`animate-spin text-primary-600 ${SIZES[size]} ${className}`} aria-label="Loading" />
);

export default LoadingSpinner;
