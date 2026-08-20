import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import PasswordInput from '../../components/common/PasswordInput.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { validatePassword } from '../../utils/validators.js';
import { initials, roleBadgeColor } from '../../utils/formatters.js';
import Badge from '../../components/common/Badge.jsx';

const INITIAL = { currentPassword: '', newPassword: '', confirmPassword: '' };

const AccountSettings = () => {
  const { user, updatePassword } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const next = {
      currentPassword: form.currentPassword ? '' : 'Current password is required',
      newPassword: validatePassword(form.newPassword),
      confirmPassword: form.confirmPassword !== form.newPassword ? 'Passwords do not match' : ''
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated successfully.');
      setForm(INITIAL);
    } catch (err) {
      toast.error(err.message || 'Could not update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Settings</h2>
        <p className="mt-1 text-sm text-ink-500">Manage your profile and account security.</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
            {initials(user?.name)}
          </div>
          <div>
            <p className="text-base font-semibold text-ink-900">{user?.name}</p>
            <p className="text-sm text-ink-500">{user?.email}</p>
            <Badge className={`mt-1.5 ${roleBadgeColor(user?.role)}`}>{user?.role}</Badge>
          </div>
        </div>
      </div>

      <div className="card max-w-lg p-6">
        <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink-800">
          <KeyRound className="h-4 w-4 text-ink-400" />
          Update Password
        </h3>
        <p className="mb-5 text-xs text-ink-500">
          8-16 characters, at least one uppercase letter and one special character.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="label" htmlFor="currentPassword">
              Current password
            </label>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              autoComplete="current-password"
              error={errors.currentPassword}
            />
          </div>

          <div>
            <label className="label" htmlFor="newPassword">
              New password
            </label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
              error={errors.newPassword}
            />
          </div>

          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirm new password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              error={errors.confirmPassword}
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting && <LoadingSpinner size="sm" className="text-white" />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
