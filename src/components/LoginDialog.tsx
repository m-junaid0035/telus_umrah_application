import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, X, Loader2, Phone, LogIn, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from './AuthContext';
import { CountryCodeSelector, Country } from './CountryCodeSelector';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'signup';
}

export function LoginDialog({ open, onOpenChange, defaultMode = 'login' }: LoginDialogProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usePhone, setUsePhone] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const { login, loginWithPhone, signup } = useAuth();
  
  // Reset mode when dialog opens with new defaultMode
  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setError(null);
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
        await signup(formData.name, formData.email, formData.password, formData.phone, selectedCountry.code);
        onOpenChange(false);
        setFormData({ name: '', email: '', phone: '', password: '' });
        setSelectedCountry(undefined);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      const errorMessage = error?.message || (mode === 'login' 
        ? 'Invalid credentials. Please check and try again.' 
        : 'Signup failed. Please try again.');
      setError(errorMessage);
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
    setUsePhone(false);
    setSelectedCountry(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === 'login' 
              ? 'Sign in to your account to continue booking your spiritual journey' 
              : 'Create a new account to start planning your Umrah journey'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Name Field - Signup Only */}
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required={mode === 'signup'}
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 h-10"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Field - Always shown in signup, toggle in login */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                {mode === 'login' ? 'Email or Phone' : 'Email Address'}
              </Label>
              {mode === 'login' && (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUsePhone(false)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                      !usePhone
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 inline mr-1" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setUsePhone(true)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                      usePhone
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 inline mr-1" />
                    Phone
                  </button>
                </div>
              )}
            </div>
            <AnimatePresence mode="wait">
              {mode === 'login' && usePhone ? (
                <motion.div
                  key="phone-login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <CountryCodeSelector
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    phoneNumber={formData.phone}
                    onPhoneChange={(phone) => setFormData({ ...formData, phone })}
                    placeholder="300 1234567"
                    required={true}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="email-login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required={!usePhone}
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 h-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Field - Signup Only */}
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Phone Number
                </Label>
                <CountryCodeSelector
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                  phoneNumber={formData.phone}
                  onPhoneChange={(phone) => setFormData({ ...formData, phone })}
                  placeholder="300 1234567"
                  required={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 h-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Remember & Forgot Password - Login Only */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-colors">
                <input type="checkbox" className="rounded border-gray-300 w-4 h-4" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button with Icon */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                {mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </>
            )}
          </Button>

          {/* Toggle Mode */}
          <div className="text-center text-sm pt-2">
            <span className="text-gray-600">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <Button type="button" variant="outline" className="h-10">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button type="button" variant="outline" className="h-10">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Facebook
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
