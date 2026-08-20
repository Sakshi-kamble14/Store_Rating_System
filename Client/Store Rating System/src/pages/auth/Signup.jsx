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
    <div className="flex min-h-screen bg-ink-50">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-ink-950 px-16 lg:flex">
        <div className="absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-secondary-600/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-[400px] w-[400px] rounded-full bg-primary-600/30 blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-glow-secondary">
              <Star className="h-6 w-6 fill-white text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">StoreRating</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight text-white tracking-tight">
            Join the
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-primary-400">Community.</span>
          </h1>
          <p className="mt-6 max-w-sm text-lg text-ink-300">
            Sign up to share your voice, rate your favorite spots, and help others find the best stores.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-secondary-50/50 to-transparent pointer-events-none" />
        <div className="w-full max-w-sm relative z-10 animate-fade-in">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 shadow-glow">
              <Star className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-ink-900">StoreRating</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-ink-900">Create your account</h2>
          <p className="mt-2 text-base text-ink-500">
            Join to discover and rate stores near you.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="label">
                Full name
              </label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`input pl-11 ${errors.name ? 'input-error' : ''}`}
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && <p className="field-error">{errors.name}</p>}
              <p className="mt-1.5 text-xs font-medium text-ink-400">{form.name.trim().length}/60 characters (min 20)</p>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input pl-11 ${errors.email ? 'input-error' : ''}`}
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
                <MapPin className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-ink-400" />
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Street, city, state"
                  className={`input resize-none pl-11 ${errors.address ? 'input-error' : ''}`}
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
              <p className="mt-1.5 text-xs font-medium text-ink-400">
                8-16 characters, at least 1 uppercase & 1 special character
              </p>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base mt-2">
              {submitting && <LoadingSpinner size="sm" className="text-white mr-2" />}
              Create Account
            </button>

            <p className="text-center text-sm text-ink-500 pt-2">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
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
