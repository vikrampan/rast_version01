'use client';

import { CheckCircle, Clock, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PartyPopper = ({ className = "", style = {} }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`w-8 h-8 ${className}`} 
    style={style}
  >
    <g className="animate-spin origin-bottom-right" style={{ transformBox: 'fill-box' }}>
      <path 
        d="M40 80 L45 40 L50 80 Z" 
        fill="#FFD700" 
        className="animate-bounce"
      />
      {/* Confetti pieces */}
      <g className="animate-confetti">
        <circle cx="45" cy="40" r="2" fill="#FF6B6B"/>
        <circle cx="50" cy="35" r="2" fill="#4ECDC4"/>
        <circle cx="40" cy="45" r="2" fill="#45B7D1"/>
        <circle cx="55" cy="40" r="2" fill="#96CEB4"/>
        <rect x="42" y="38" width="3" height="3" fill="#FF6B6B" transform="rotate(45)"/>
        <rect x="48" y="42" width="3" height="3" fill="#4ECDC4" transform="rotate(-45)"/>
      </g>
    </g>
  </svg>
);

export default function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] relative overflow-hidden animate-fadeIn">
      {/* Existing Background Code */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}>
        </div>
      </div>

      {/* Party Poppers */}
      <div className="absolute inset-0 pointer-events-none">
        <PartyPopper 
          className="absolute top-20 left-20 transform -rotate-45" 
          style={{ animationDuration: '3s' }}
        />
        <PartyPopper 
          className="absolute top-20 right-20 transform rotate-45" 
          style={{ animationDuration: '2.5s' }}
        />
        <PartyPopper 
          className="absolute bottom-20 left-20 transform -rotate-12" 
          style={{ animationDuration: '3.5s' }}
        />
        <PartyPopper 
          className="absolute bottom-20 right-20 transform rotate-12" 
          style={{ animationDuration: '4s' }}
        />
      </div>

      {/* Content Container */}
      <div className="max-w-xl w-full mx-4 animate-slideInFromBottom">
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
          {/* Success Icon */}
          <div className="text-center mb-8 relative">
            <div className="inline-block animate-fadeInDown">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-green-500/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="w-20 h-20 rounded-full border-4 border-green-500/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center relative">
                  <CheckCircle className="w-8 h-8 text-white animate-bounce" />
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the existing content remains the same */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white animate-fadeInDown" style={{ animationDelay: '200ms' }}>
              Registration Pending
            </h2>
            <p className="text-xl text-gray-300 animate-fadeInDown" style={{ animationDelay: '300ms' }}>
              Your registration request has been submitted successfully
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 animate-fadeInDown" style={{ animationDelay: '400ms' }}>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <Clock className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Current Status</h3>
                  <p className="text-gray-400 text-sm">
                    Your account is pending administrator approval. We'll review your application within 1-2 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 animate-fadeInDown" style={{ animationDelay: '500ms' }}>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/10 rounded-lg p-3">
                  <Mail className="w-6 h-6 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Next Steps</h3>
                  <p className="text-gray-400 text-sm">
                    You will receive an email notification once your account has been reviewed and approved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 relative animate-fadeInDown" style={{ animationDelay: '600ms' }}>
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-800"></div>
            <div className="space-y-6">
              <div className="relative flex items-center">
                <div className="absolute left-0 w-16 h-px bg-green-500"></div>
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <p className="ml-8 text-sm text-green-400">Registration Submitted</p>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-0 w-16 h-px bg-blue-500/50"></div>
                <div className="w-4 h-4 bg-blue-500/50 rounded-full animate-pulse"></div>
                <p className="ml-8 text-sm text-blue-400">Under Review</p>
              </div>
              <div className="relative flex items-center opacity-50">
                <div className="absolute left-0 w-16 h-px bg-gray-700"></div>
                <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                <p className="ml-8 text-sm text-gray-500">Account Activation</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center animate-fadeInDown" style={{ animationDelay: '700ms' }}>
            <Link 
              href="/auth/login" 
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 
                transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Return to Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Existing Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-purple-500 rounded-full animate-pulse" 
          style={{ animationDelay: '300ms' }}></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-green-500 rounded-full animate-pulse" 
          style={{ animationDelay: '600ms' }}></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" 
          style={{ animationDelay: '900ms' }}></div>
      </div>
    </div>
  );
}