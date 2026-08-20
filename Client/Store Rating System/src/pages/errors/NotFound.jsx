import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-6 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
      <Compass className="h-8 w-8 text-primary-600" />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-ink-900">404 — Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
    </div>
    <Link to="/" className="btn-primary">
      Go home
    </Link>
  </div>
);

export default NotFound;
