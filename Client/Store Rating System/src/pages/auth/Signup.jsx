import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Mail, MapPin, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import PasswordInput from '../../components/common/PasswordInput.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { validateName, validateEmail, validateAddress, validatePassword } from '../../utils/validators.js';

const Signup = () => {
  const { signup, roleHome } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password)
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await signup(form);
      toast.success(`Welcome to StoreRating, ${user.name.split(' ')[0]}!`);
      navigate(roleHome(user.role), { replace: true });
    } catch (err) {
      toast.error(err.message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
            <Star className="h-4 w-4 fill-white text-white" />
          </div>
          <span className="text-lg font-bold text-ink-900">StoreRating</span>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold text-ink-900">Create your account</h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Join to discover and rate stores near you.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            <div>
              <label htmlFor="name" className="label">
                Full name
              </label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name (20-60 characters)"
                  className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && <p className="field-error">{errors.name}</p>}
              <p className="mt-1 text-xs text-ink-400">{form.name.trim().length}/60 characters (min 20)</p>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="address" className="label">
                Address
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-ink-400" />
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Street, city, state"
                  className={`input resize-none pl-10 ${errors.address ? 'input-error' : ''}`}
                  aria-invalid={!!errors.address}
                />
              </div>
              {errors.address && <p className="field-error">{errors.address}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                error={errors.password}
              />
              <p className="mt-1 text-xs text-ink-400">
                8-16 characters, at least one uppercase letter and one special character
              </p>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting && <LoadingSpinner size="sm" className="text-white" />}
              Create Account
            </button>

            <p className="text-center text-sm text-ink-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
