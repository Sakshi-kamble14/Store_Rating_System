export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatRating = (value) => {
  if (value === null || value === undefined || value === '') return 'No ratings yet';
  const n = Number(value);
  if (Number.isNaN(n) || n === 0) return 'No ratings yet';
  return n.toFixed(1);
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const roleBadgeColor = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-primary-100 text-primary-700';
    case 'OWNER':
      return 'bg-warning-100 text-warning-600';
    default:
      return 'bg-ink-100 text-ink-600';
  }
};
