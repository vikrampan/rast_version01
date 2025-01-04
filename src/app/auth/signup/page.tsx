'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Mail, Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getEmailError } from '@/utils/emailValidation';
import Image from 'next/image';

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organization: string;
  accessLevel: 'inspection' | 'maintenance' | 'leadership' | '';
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [activeField, setActiveField] = useState('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organization: '',
    accessLevel: ''
  });

  const router = useRouter();
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    const error = getEmailError(email);
    setEmailError(error);
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    if (password.length < 8) {
      setPasswordStrength('Too short');
    } else if (!/[A-Z]/.test(password)) {
      setPasswordStrength('Need uppercase');
    } else if (!/[a-z]/.test(password)) {
      setPasswordStrength('Need lowercase');
    } else if (!/[0-9]/.test(password)) {
      setPasswordStrength('Need number');
    } else if (!/[!@#$%^&*]/.test(password)) {
      setPasswordStrength('Need special char');
    } else {
      setPasswordStrength('Strong');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emailValidationError = getEmailError(formData.email);
    if (emailValidationError) {
      setError(emailValidationError);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push('/auth/pending-approval');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = `w-full px-3 py-2 bg-white/5 border-2 rounded-lg text-gray-800
    focus:ring-2 focus:ring-gray-900/50 focus:border-gray-900 transition-all duration-300
    hover:border-gray-900/50 transform hover:-translate-y-[1px] hover:shadow-sm
    ${activeField ? 'border-gray-900 shadow-lg' : 'border-gray-200'}`;

  return (
    <div className="h-screen flex bg-[#1a1a1a] animate-fadeIn">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 animate-slideInFromLeft">
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column - Logo and Title */}
            <div className="col-span-4 pr-4 border-r flex flex-col items-center justify-center animate-fadeInDown">
              <div className="transition-all duration-500 transform hover:scale-110 mb-4 group">
                <Image 
                  src="/images/logo.png"
                  alt="Company Logo"
                  width={80}
                  height={80}
                  className="w-16 h-16 object-contain group-hover:animate-pulse"
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 text-center mb-2 animate-fadeInDown">
                RAST
              </span>
              <p className="text-sm text-gray-600 text-center animate-fadeInDown">
                Create your account to get started
              </p>
            </div>

            {/* Right Column - Form */}
            <div className="col-span-8 pl-4">
              <form onSubmit={handleSubmit} className="space-y-4 animate-fadeInUp">
                {error && (
                  <div className="text-xs text-red-600 p-2 bg-red-50 rounded-lg animate-shake">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {/* First Name */}
                  <div className="animate-fadeInDown" style={{ animationDelay: '200ms' }}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        onFocus={() => setActiveField('firstName')}
                        onBlur={() => setActiveField('')}
                        className={inputClasses}
                        required
                      />
                      <User className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 
                        transition-colors duration-300 group-hover:text-gray-900" />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="animate-fadeInDown" style={{ animationDelay: '300ms' }}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        onFocus={() => setActiveField('lastName')}
                        onBlur={() => setActiveField('')}
                        className={inputClasses}
                        required
                      />
                      <User className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 
                        transition-colors duration-300 group-hover:text-gray-900" />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="animate-fadeInDown" style={{ animationDelay: '400ms' }}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Organization Email
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField('')}
                      className={`${inputClasses} ${emailError ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="example@organization.com"
                      required
                    />
                    <Mail className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 
                      transition-colors duration-300 group-hover:text-gray-900" />
                  </div>
                  {emailError && (
                    <div className="text-xs text-red-500 mt-1 animate-fadeIn">
                      {emailError}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Organization */}
                  <div className="animate-fadeInDown" style={{ animationDelay: '500ms' }}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                        onFocus={() => setActiveField('organization')}
                        onBlur={() => setActiveField('')}
                        className={inputClasses}
                        required
                      />
                      <Building2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 
                        transition-colors duration-300 group-hover:text-gray-900" />
                    </div>
                  </div>

                  {/* Access Level */}
                  <div className="animate-fadeInDown" style={{ animationDelay: '600ms' }}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Access Level
                    </label>
                    <div className="relative group">
                      <select
                        value={formData.accessLevel}
                        onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value as FormData['accessLevel'] }))}
                        onFocus={() => setActiveField('accessLevel')}
                        onBlur={() => setActiveField('')}
                        className={`${inputClasses} appearance-none`}
                        required
                      >
                        <option value="">Select level</option>
                        <option value="inspection">Inspection</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="leadership">Leadership</option>
                      </select>
                      <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 
                        transition-transform duration-300 group-hover:rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="animate-fadeInDown" style={{ animationDelay: '700ms' }}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onFocus={() => setActiveField('password')}
                      onBlur={() => setActiveField('')}
                      className={inputClasses}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 
                        hover:text-gray-900 transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordStrength && (
                    <div className={`text-xs mt-1 animate-fadeIn ${
                      passwordStrength === 'Strong' ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {passwordStrength}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !!emailError}
                  className="w-full py-2 bg-gray-900 hover:bg-gray-800 
                    text-white rounded-lg shadow-lg focus:ring-2 focus:ring-gray-900/50 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                    transform hover:scale-[1.02] hover:shadow-xl animate-fadeInDown"
                  style={{ animationDelay: '800ms' }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center text-sm animate-fadeInDown" style={{ animationDelay: '900ms' }}>
                  <span className="text-gray-600">Already have an account?</span>{' '}
                  <Link 
                    href="/auth/login" 
                    className="text-gray-900 hover:text-gray-700 font-medium hover:underline
                      transition-colors duration-300"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>

      {/* Right Panel */}
      <div className="hidden lg:block w-1/2 bg-[#121212] relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="max-w-lg text-center space-y-6 animate-slideInFromRight">
            <h2 className="text-4xl font-bold text-white animate-fadeInDown" style={{ animationDelay: '300ms' }}>
              Welcome to RAST
            </h2>
            <p className="text-lg text-gray-300 animate-fadeInDown" style={{ animationDelay: '500ms' }}>
              Making industrial inspections smarter, effective and efficient through cutting-edge technology and innovation.
            </p>
            
            {/* Additional Features Section */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {/* Feature 1 */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl 
                transform hover:scale-105 transition-all duration-300 animate-fadeInDown" 
                style={{ animationDelay: '600ms' }}
              >
                <h3 className="text-white text-lg font-semibold mb-2">Smart Inspection</h3>
                <p className="text-gray-400 text-sm">
                  Advanced AI-powered tools for precise and efficient inspections
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl 
                transform hover:scale-105 transition-all duration-300 animate-fadeInDown" 
                style={{ animationDelay: '700ms' }}
              >
                <h3 className="text-white text-lg font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-gray-400 text-sm">
                  Instant insights and analysis for better decision making
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl 
                transform hover:scale-105 transition-all duration-300 animate-fadeInDown" 
                style={{ animationDelay: '800ms' }}
              >
                <h3 className="text-white text-lg font-semibold mb-2">Collaboration</h3>
                <p className="text-gray-400 text-sm">
                  Seamless team coordination and communication tools
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl 
                transform hover:scale-105 transition-all duration-300 animate-fadeInDown" 
                style={{ animationDelay: '900ms' }}
              >
                <h3 className="text-white text-lg font-semibold mb-2">Reporting</h3>
                <p className="text-gray-400 text-sm">
                  Comprehensive reports and documentation management
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center space-x-6 mt-8 animate-fadeInDown" 
              style={{ animationDelay: '1000ms' }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">100k+</div>
                <div className="text-sm text-gray-400">Inspections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
          <div className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}>
          </div>
        </div>
      </div>
    </div>
  );
}
