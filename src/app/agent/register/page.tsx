"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Lock, 
  Phone, 
  User, 
  Globe, 
  MapPin, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AgentRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '+92',
    
    // Company Info
    companyName: '',
    registrationType: 'Non-IATA',
    ptsNumber: '',
    
    // Business Address
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
        toast({
          title: "Error",
          description: "Please fill in all personal information fields.",
          variant: "destructive",
        });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match.",
          variant: "destructive",
        });
        return false;
      }
      if (formData.password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.companyName || !formData.ptsNumber) {
        toast({
          title: "Error",
          description: "Please fill in all company information fields.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      toast({
        title: "Error",
        description: "Please fill in all business address fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/agent/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: "Your application has been submitted for review. You'll receive an email once approved.",
        });
        router.push('/agent/login?registered=true');
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl shadow-xl">
              <Briefcase className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Become a Travel Agent Partner</h1>
          <p className="text-lg text-gray-600">Join Telus Umrah's network of trusted travel agents</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= stepNum 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > stepNum ? <CheckCircle className="w-6 h-6" /> : stepNum}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= stepNum ? 'text-purple-600' : 'text-gray-500'}`}>
                    {stepNum === 1 ? 'Personal' : stepNum === 2 ? 'Company' : 'Address'}
                  </span>
                </div>
                {stepNum < 3 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                    step > stepNum ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-xl">
              <CardTitle className="text-2xl">
                {step === 1 && 'Personal Information'}
                {step === 2 && 'Company Details'}
                {step === 3 && 'Business Address'}
              </CardTitle>
              <CardDescription className="text-purple-100">
                {step === 1 && 'Enter your personal details to get started'}
                {step === 2 && 'Tell us about your travel agency'}
                {step === 3 && 'Where is your business located?'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <User className="w-4 h-4 text-purple-600" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Mail className="w-4 h-4 text-purple-600" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="john@agency.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Phone className="w-4 h-4 text-purple-600" />
                        Phone Number
                      </Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.countryCode}
                          onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                            <SelectItem value="+44">🇬🇧 +44</SelectItem>
                            <SelectItem value="+92">🇵🇰 +92</SelectItem>
                            <SelectItem value="+966">🇸🇦 +966</SelectItem>
                            <SelectItem value="+971">🇦🇪 +971</SelectItem>
                            <SelectItem value="+91">🇮🇳 +91</SelectItem>
                            <SelectItem value="+20">🇪🇬 +20</SelectItem>
                            <SelectItem value="+62">🇮🇩 +62</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="3001234567"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                          <Lock className="w-4 h-4 text-purple-600" />
                          Password
                        </Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                          <Lock className="w-4 h-4 text-purple-600" />
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Company Information */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="companyName" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Building2 className="w-4 h-4 text-purple-600" />
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="ABC Travel Agency"
                        required
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                        <Shield className="w-4 h-4 text-purple-600" />
                        Registration Type
                      </Label>
                      <RadioGroup
                        value={formData.registrationType}
                        onValueChange={(value) => setFormData({ ...formData, registrationType: value })}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="IATA" id="iata" />
                          <Label htmlFor="iata" className="cursor-pointer font-normal flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="font-medium">IATA Registered</span>
                              <span className="text-xs text-gray-500">International Air Transport Association</span>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Non-IATA" id="non-iata" />
                          <Label htmlFor="non-iata" className="cursor-pointer font-normal flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="font-medium">Non-IATA</span>
                              <span className="text-xs text-gray-500">Not IATA registered</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="ptsNumber" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        PTS Registration Number
                      </Label>
                      <Input
                        id="ptsNumber"
                        name="ptsNumber"
                        type="text"
                        value={formData.ptsNumber}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="PTS-123456"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Pakistan Travel Services registration number
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Business Address */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="street" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        Street Address
                      </Label>
                      <Input
                        id="street"
                        name="street"
                        type="text"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="city" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                          <Globe className="w-4 h-4 text-purple-600" />
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Lahore"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="state" className="text-gray-700 font-medium mb-2 block">
                          State/Province
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          type="text"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Punjab"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="country" className="text-gray-700 font-medium mb-2 block">
                          Country
                        </Label>
                        <Input
                          id="country"
                          name="country"
                          type="text"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Pakistan"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="postalCode" className="text-gray-700 font-medium mb-2 block">
                          Postal Code
                        </Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="54000"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/agent/login" className="text-purple-600 hover:text-purple-700 font-medium">
                    Login here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
