import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Star, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import PasswordInput from '../../components/common/PasswordInput.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const Login = () => {
  const { login, isAuthenticated, user, roleHome } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(roleHome(user.role), { replace: true });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (searchParams.get('sessionExpired')) {
      toast.info('Your session expired. Please sign in again.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const loggedInUser = await login(form);
      toast.success(`Welcome back, ${loggedInUser.name.split(' ')[0]}!`);
      navigate(roleHome(loggedInUser.role), { replace: true });
    } catch (err) {
      toast.error(err.message || 'Incorrect email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-ink-950 px-16 lg:flex">
        <div className="absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-primary-600/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-[400px] w-[400px] rounded-full bg-secondary-600/30 blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-glow">
              <Star className="h-6 w-6 fill-white text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">StoreRating</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight text-white tracking-tight">
            Discover.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Rate. Improve.</span>
          </h1>
          <p className="mt-6 max-w-sm text-lg text-ink-300">
            Find the best stores around you and share your experience with others.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 bg-white relative">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary-50/50 to-transparent pointer-events-none" />
        <div className="w-full max-w-sm relative z-10 animate-fade-in">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 shadow-glow">
              <Star className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-ink-900">StoreRating</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-ink-900">Welcome back 👋</h2>
          <p className="mt-2 text-base text-ink-500">Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="label">
                  Password
                </label>
              </div>
              <PasswordInput
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                error={errors.password}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base mt-2">
              {submitting && <LoadingSpinner size="sm" className="text-white mr-2" />}
              Sign In
            </button>

            <p className="text-center text-sm text-ink-500 pt-4">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
