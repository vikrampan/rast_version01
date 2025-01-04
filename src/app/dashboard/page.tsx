'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Box,
  Box3 as ThreeDIcon,
  Eye,
  Settings,
  Settings2,
  FileSpreadsheet,
  LineChart,
  Lock,
  HelpCircle,
  LogOut,
  Clock,
  Calendar,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { ErrorBoundary}  from '@/components/shared/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { DashboardState, MenuItem } from '@/types/dashboard';

// Lazy load components
const General = React.lazy(() => import('@/components/dashboard/General'));
const Tubesheet = React.lazy(() => import('@/components/dashboard/Tubesheet/Tubesheet'));
const ReportVariables = React.lazy(() => import('@/components/dashboard/ReportVariables'));
const Legends = React.lazy(() => import('@/components/dashboard/Legends'));
const Preferences = React.lazy(() => import('@/components/dashboard/Preferences'));
const License = React.lazy(() => import('@/components/dashboard/License'));
const Help = React.lazy(() => import('@/components/dashboard/Help'));
const ProVis = React.lazy(() => import('@/components/dashboard/Inspection/ProVis'));
const BoroVis = React.lazy(() => import('@/components/dashboard/Inspection/BoroVis'));
const CaliPro = React.lazy(() => import('@/components/dashboard/Inspection/CaliPro'));

// Menu Items Configuration
const MENU_ITEMS = {
  main: [
    { id: 'Reporting', icon: FileText, label: 'Reporting', color: 'text-[#FFC857]' },
    { id: 'Tubesheet', icon: Box, label: 'Tubesheet', color: 'text-[#FFC857]' },
    { id: '3D Model', icon: Box, label: '3D Model', color: 'text-[#FFC857]' },
    {
      id: 'Inspection',
      icon: Eye,
      label: 'Inspection',
      color: 'text-[#FFC857]',
      hasDropdown: true,
      subItems: [
        { id: 'ProVis', label: 'ProVis' },
        { id: 'BoroVis', label: 'BoroVis' },
        { id: 'CaliPro', label: 'CaliPro' }
      ]
    },
    {
      id: 'Settings',
      icon: Settings,
      label: 'Settings',
      color: 'text-[#4A90E2]',
      hasDropdown: true,
      subItems: [
        { id: 'General', icon: Settings2, label: 'General' },
        { id: 'Report-Variables', icon: FileSpreadsheet, label: 'Report Variables' },
        { id: 'Legends', icon: LineChart, label: 'Legends' },
        { id: 'Preferences', icon: Settings, label: 'Preferences' },
        { id: 'License', icon: Lock, label: 'License' },
        { id: 'Help', icon: HelpCircle, label: 'Help' }
      ]
    }
  ]
};

export default function Dashboard() {
  // State
  const [state, setState] = useState<DashboardState>({
    isProfileOpen: false,
    showWelcome: false,
    isNavCollapsed: false,
    isLoading: true,
    activeSection: 'Reporting',
    activeSubSection: '',
    isSettingsOpen: false,
    isInspectionOpen: false
  });

  const [error, setError] = useState<string>('');
  const isHeaderVisible = useScrollHeader();
  const router = useRouter();
  // Effects
  useEffect(() => {
    checkAuth();
    
    const hasShownWelcome = localStorage.getItem('welcome_shown');
    if (!hasShownWelcome) {
      setState(prev => ({ ...prev, showWelcome: true }));
      localStorage.setItem('welcome_shown', 'true');
      const timer = setTimeout(() => 
        setState(prev => ({ ...prev, showWelcome: false })), 
        5000
      );
      return () => clearTimeout(timer);
    }
  }, []);

  // Auth check
  const checkAuth = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await fetch('/api/auth/check-session');
      const data = await response.json();

      if (!data.success) {
        router.push('/auth/login');
        return;
      }

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login');
    }
  };

  // Handlers
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/auth/login');
      }
    } catch (error) {
      setError('Failed to logout');
      console.error('Logout failed:', error);
    }
  };

  const handleMenuClick = (item: MenuItem) => {
    try {
      if (item.id === 'Settings') {
        setState(prev => ({ ...prev, isSettingsOpen: !prev.isSettingsOpen }));
      } else if (item.id === 'Inspection') {
        setState(prev => ({ ...prev, isInspectionOpen: !prev.isInspectionOpen }));
      } else {
        setState(prev => ({
          ...prev,
          activeSection: item.id,
          activeSubSection: item.id,
          isSettingsOpen: false,
          isInspectionOpen: false
        }));
      }
    } catch (error) {
      console.error('Menu click error:', error);
    }
  };

  // Render helper functions
  const renderMenuItem = (item: MenuItem, isSubItem = false) => {
    const isActive = state.activeSection === item.id || state.activeSubSection === item.id;
    const paddingLeft = isSubItem ? 'pl-8' : 'pl-4';

    return (
      <motion.li 
        key={item.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={() => handleMenuClick(item)}
          className={`flex w-full items-center gap-3 ${paddingLeft} py-3 rounded-lg transition-all duration-200 group 
            ${isActive ? 'bg-gradient-to-r from-[#282828] to-[#1E1E1E] text-[#E0E0E0] shadow-lg' : 'text-[#9A9A9A] hover:bg-[#282828]/50'}
            ${!state.isNavCollapsed ? 'px-4' : 'justify-center px-2'}`}
          aria-expanded={isActive}
          aria-haspopup={item.hasDropdown}
        >
          <div className={`relative ${isActive ? 'text-[#FFC857]' : item.color}`}>
            {item.icon && <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />}
            {isActive && !state.isNavCollapsed && (
              <motion.div
                layoutId="active-indicator"
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#FFC857] rounded-r-full"
              />
            )}
          </div>
          {!state.isNavCollapsed && (
            <span className={`flex-1 truncate ${isActive ? 'font-medium' : ''}`}>
              {item.label}
            </span>
          )}
          {item.hasDropdown && !state.isNavCollapsed && (
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-300 
                ${(item.id === 'Settings' && state.isSettingsOpen) || 
                  (item.id === 'Inspection' && state.isInspectionOpen) ? 'rotate-180' : ''}`} 
            />
          )}
        </button>

        {item.subItems && !state.isNavCollapsed && (
          <AnimatePresence>
            {((item.id === 'Settings' && state.isSettingsOpen) || 
              (item.id === 'Inspection' && state.isInspectionOpen)) && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
                role="menu"
              >
                {item.subItems.map(subItem => renderMenuItem(subItem, true))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </motion.li>
    );
  };

  const renderActiveSection = () => {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorBoundary onError={(error) => setError(error.message)}>
          {(() => {
            switch (state.activeSection) {
              case 'General':
                return <General />;
              case 'Tubesheet':
                return <Tubesheet />;
              case 'Report-Variables':
                return <ReportVariables />;
              case 'Legends':
                return <Legends />;
              case 'Preferences':
                return <Preferences />;
              case 'License':
                return <License />;
              case 'Help':
                return <Help />;
              case 'ProVis':
                return <ProVis />;
              case 'BoroVis':
                return <BoroVis />;
              case 'CaliPro':
                return <CaliPro />;
              default:
                return (
                  <div className="text-center py-8 text-gray-500">
                    Select a section from the menu
                  </div>
                );
            }
          })()}
        </ErrorBoundary>
      </Suspense>
    );
  };
  if (state.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen bg-[#181818]">
      {/* Sidebar */}
      <motion.nav
        animate={{ width: state.isNavCollapsed ? '4rem' : '16rem' }}
        className="bg-gradient-to-r from-[#181818] to-[#1E1E1E] h-screen fixed left-0 top-0 border-r border-[#282828] z-20 shadow-xl"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#282828] bg-gradient-to-r from-[#1E1E1E] to-[#282828]">
          <AnimatePresence mode="wait">
            {!state.isNavCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-xl font-bold bg-gradient-to-r from-[#FFC857] to-[#4A90E2] bg-clip-text text-transparent"
              >
                Dashboard
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={() => setState(prev => ({ ...prev, isNavCollapsed: !prev.isNavCollapsed }))}
            className="p-1.5 rounded-lg hover:bg-[#282828] transition-colors"
          >
            <ChevronLeft 
              className={`w-5 h-5 text-[#E0E0E0] transform transition-transform ${
                state.isNavCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        <div className="px-2 py-6 h-[calc(100vh-4rem)] overflow-y-auto">
          <ul className="space-y-2">
            {MENU_ITEMS.main.map(item => renderMenuItem(item))}
          </ul>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div 
        className={`flex-1 ${state.isNavCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}
      >
        {/* Header */}
        <motion.header
          initial={false}
          animate={{ 
            width: `calc(100% - ${state.isNavCollapsed ? '4rem' : '16rem'})`,
            y: isHeaderVisible ? 0 : '-100%'
          }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 bg-gradient-to-r from-[#181818] to-[#1E1E1E] h-16 flex items-center justify-between px-6 border-b border-[#282828] shadow-lg z-10 backdrop-blur-sm bg-opacity-95"
        >
          <div className="flex items-center space-x-6 text-[#9A9A9A]">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {state.showWelcome && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#FFC857] text-black px-4 py-2 rounded-lg"
                >
                  Welcome to the dashboard!
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-[#9A9A9A] hover:bg-[#282828] rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="pt-20 p-6">
          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Content */}
          <div className="bg-[#1E1E1E] rounded-lg border border-[#282828] p-6">
            <h1 className="text-2xl font-bold text-[#E0E0E0] mb-6">
              {state.activeSection}
            </h1>
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
}