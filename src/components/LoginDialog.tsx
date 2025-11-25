import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  X,
  Loader2,
  Phone,
  LogIn,
  UserPlus,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { useAuth } from './AuthContext';
import { CountryCodeSelector, Country } from './CountryCodeSelector';

import { forgotPasswordAction } from '@/actions/authActions';
import { toast } from '@/hooks/use-toast';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'signup';
}

export function LoginDialog({ open, onOpenChange, defaultMode = 'login' }: LoginDialogProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [usePhone, setUsePhone] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();

  const { login, loginWithPhone, signup } = useAuth();

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setError(null);
      setSuccess(null);
      setUsePhone(false);
      setSelectedCountry(undefined);
    }
  }, [open, defaultMode]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        if (usePhone) {
          if (!formData.phone || !selectedCountry || !formData.password) {
            setError('Phone number, country code, and password are required');
            setLoading(false);
            return;
          }
          await loginWithPhone(formData.phone, formData.password);
        } else {
          if (!formData.email || !formData.password) {
            setError('Email and password are required');
            setLoading(false);
            return;
          }
          await login(formData.email, formData.password);
        }

        onOpenChange(false);
        setFormData({ name: '', email: '', phone: '', password: '' });

      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.phone || !selectedCountry) {
          setError('Name, email, phone with country code, and password are required');
          setLoading(false);
          return;
        }

        await signup(
          formData.name,
          formData.email,
          formData.password,
          formData.phone,
          selectedCountry.code
        );

        onOpenChange(false);
        setFormData({ name: '', email: '', phone: '', password: '' });
        setSelectedCountry(undefined);
      }
    } catch (error: any) {
      const errorMessage = error?.message || (mode === 'login'
        ? 'Invalid credentials. Please try again.'
        : 'Signup failed. Please try again.'
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const fd = new FormData();
      fd.append('email', formData.email);

      const result = await forgotPasswordAction({}, fd);

      if (result.error) {
        setError(result.error.message?.[0] || 'Failed to send password reset email');
      } else {
        setSuccess('Password reset link has been sent to your email.');
        toast({
          title: 'Email Sent',
          description: 'Password reset link has been sent to your email.',
        });
      }
    } catch (error: any) {
      setError(error?.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setFormData({ name: '', email: '', phone: '', password: '' });
    setError(null);
    setSuccess(null);
    setUsePhone(false);
    setSelectedCountry(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {mode === 'login'
              ? 'Welcome Back'
              : mode === 'signup'
              ? 'Create Account'
              : 'Reset Password'}
          </DialogTitle>

          <DialogDescription className="text-center">
            {mode === 'login'
              ? 'Sign in to your account'
              : mode === 'signup'
              ? 'Create a new account'
              : 'Enter your email to receive a reset link'}
          </DialogDescription>
        </DialogHeader>

        {mode === 'forgot-password' ? (
          <form onSubmit={handleForgotPassword} className="space-y-6 pt-4">
            <div>
              <Label htmlFor="forgot-email">Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-gray-400" />
                <Input
                  id="forgot-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
                setFormData({ name: '', email: '', phone: '', password: '' });
              }}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            {/* Signup Name Field */}
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Label>Full Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-gray-400" />
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={mode === 'signup'}
                      className="pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email / Phone Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label>{mode === 'login' ? 'Email or Phone' : 'Email Address'}</Label>
                {mode === 'login' && (
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setUsePhone(false)}
                      className={`px-2 py-1 text-xs rounded ${
                        !usePhone ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsePhone(true)}
                      className={`px-2 py-1 text-xs rounded ${
                        usePhone ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                      }`}
                    >
                      Phone
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {mode === 'login' && usePhone ? (
                  <motion.div key="phone">
                    <CountryCodeSelector
                      selectedCountry={selectedCountry}
                      onCountryChange={setSelectedCountry}
                      phoneNumber={formData.phone}
                      onPhoneChange={(p) => setFormData({ ...formData, phone: p })}
                      required
                    />
                  </motion.div>
                ) : (
                  <motion.div key="email">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-gray-400" />
                      <Input
                        name="email"
                        type="email"
                        required={!usePhone}
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="you@example.com"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Signup Phone Field */}
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div>
                  <Label>Phone Number</Label>
                  <CountryCodeSelector
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    phoneNumber={formData.phone}
                    onPhoneChange={(p) => setFormData({ ...formData, phone: p })}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Field */}
            <div>
              <Label>Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-gray-400" />
                <Input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Forgot Password */}
            {mode === 'login' && (
              <div className="flex justify-between text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" /> Remember me
                </label>

                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" /> Create Account
                </>
              )}
            </Button>

            {/* Switch login/signup */}
            <div className="text-center text-sm">
              {mode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}{' '}
              <button type="button" onClick={toggleMode} className="text-blue-600 font-semibold">
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
