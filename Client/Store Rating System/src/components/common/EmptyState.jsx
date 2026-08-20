import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-200 bg-white px-6 py-14 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100">
      <Icon className="h-6 w-6 text-ink-400" />
    </div>
    <div>
      <p className="text-sm font-semibold text-ink-800">{title}</p>
      {message && <p className="mt-1 text-sm text-ink-500">{message}</p>}
    </div>
    {action}
  </div>
);

export default EmptyState;
