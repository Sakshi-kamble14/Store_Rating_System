import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Forbidden = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-6 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-50">
      <ShieldAlert className="h-8 w-8 text-danger-600" />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Access denied</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        You don&apos;t have permission to view this page. If you think this is a mistake, contact an administrator.
      </p>
    </div>
    <Link to="/" className="btn-primary">
      Back to safety
    </Link>
  </div>
);

export default Forbidden;
