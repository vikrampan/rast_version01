'use client';

import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.isAdmin || data.user.isSuperAdmin) {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = `w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-gray-800
    focus:ring-2 focus:ring-gray-900/50 focus:border-gray-900 transition-all duration-300
    hover:border-gray-900/50 transform hover:-translate-y-[1px] hover:shadow-sm
    ${activeField ? 'border-gray-900 shadow-lg shadow-gray-900/20' : 'border-gray-200'}`;

  return (
    <div className="min-h-screen flex bg-[#1a1a1a] animate-fadeIn">
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 lg:p-8">
        <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-8 animate-slideInFromLeft">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8 animate-fadeInDown">
            <div className="transition-all duration-500 transform hover:scale-110 mb-4 group">
              <Image 
                src="/images/logo.png"
                alt="Company Logo"
                width={96}
                height={96}
                className="w-20 h-20 object-contain group-hover:animate-pulse"
                priority
              />
            </div>
            <span className="text-3xl font-bold text-gray-900 tracking-tight mt-4">
              RAST
            </span>
          </div>

          {/* Form Header */}
          <div className="text-center space-y-2 mb-8 animate-fadeInDown" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-2 animate-fadeInDown" style={{ animationDelay: '300ms' }}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField('')}
                    className={inputClasses}
                    placeholder="Enter your email"
                  />
                  <LogIn className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 
                    group-hover:text-gray-900 transition-colors duration-300" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 animate-fadeInDown" style={{ animationDelay: '400ms' }}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setActiveField('password')}
                    onBlur={() => setActiveField('')}
                    className={inputClasses}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                      hover:text-gray-900 transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Additional Options */}
              <div className="flex items-center justify-between pt-2 animate-fadeInDown" 
                style={{ animationDelay: '500ms' }}
              >
                <label className="flex items-center space-x-2 group">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-gray-900 
                      focus:ring-gray-900 transition-colors duration-300"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 
                    transition-colors duration-300">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-gray-900 hover:text-gray-700 
                    transition-colors duration-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 
                text-white rounded-xl shadow-lg focus:ring-4 focus:ring-gray-900/50 
                disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 
                hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-900/20
                animate-fadeInDown"
              style={{ animationDelay: '600ms' }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent 
                    rounded-full animate-spin mr-2">
                  </div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4 animate-fadeInDown" style={{ animationDelay: '700ms' }}>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/auth/signup" 
                  className="text-gray-900 hover:text-gray-700 font-medium 
                    transition-colors duration-300 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Enhanced Design */}
      <div className="hidden lg:block w-1/2 bg-[#121212] relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="max-w-lg text-center space-y-6 animate-slideInFromRight">
            {/* Main Content */}
            <div className="animate-fadeInDown" style={{ animationDelay: '300ms' }}>
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to RAST
              </h2>
              <p className="text-lg text-gray-300">
                Making industrial inspections smarter, effective and efficient through cutting-edge technology and innovation.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl transform 
                hover:scale-105 transition-all duration-300 animate-fadeInDown cursor-pointer
                border border-white/5 hover:border-white/10 hover:bg-black/30"
                style={{ animationDelay: '400ms' }}
              >
                <h3 className="text-white font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-gray-400 text-sm">
                  Track inspections and receive instant updates
                </p>
              </div>

              <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl transform 
                hover:scale-105 transition-all duration-300 animate-fadeInDown cursor-pointer
                border border-white/5 hover:border-white/10 hover:bg-black/30"
                style={{ animationDelay: '500ms' }}
              >
                <h3 className="text-white font-semibold mb-2">Smart Analytics</h3>
                <p className="text-gray-400 text-sm">
                  Data-driven insights for better decisions
                </p>
              </div>

              <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl transform 
                hover:scale-105 transition-all duration-300 animate-fadeInDown cursor-pointer
                border border-white/5 hover:border-white/10 hover:bg-black/30"
                style={{ animationDelay: '600ms' }}
              >
                <h3 className="text-white font-semibold mb-2">Team Collaboration</h3>
                <p className="text-gray-400 text-sm">
                  Work together seamlessly on inspections
                </p>
              </div>

              <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl transform 
                hover:scale-105 transition-all duration-300 animate-fadeInDown cursor-pointer
                border border-white/5 hover:border-white/10 hover:bg-black/30"
                style={{ animationDelay: '700ms' }}
              >
                <h3 className="text-white font-semibold mb-2">Mobile Access</h3>
                <p className="text-gray-400 text-sm">
                  Access your workspace from anywhere
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex justify-between items-center mt-8 px-4">
              <div className="text-center animate-fadeInDown" style={{ animationDelay: '800ms' }}>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400 mt-1">Active Users</div>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div className="text-center animate-fadeInDown" style={{ animationDelay: '900ms' }}>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400 mt-1">Inspections</div>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div className="text-center animate-fadeInDown" style={{ animationDelay: '1000ms' }}>
                <div className="text-3xl font-bold text-white">99%</div>
                <div className="text-sm text-gray-400 mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
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