'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Eye,
  Settings,
  LogOut,
  Clock,
  User,
  ChevronDown,
  ChevronLeft,
  Microscope,
  Layout,
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useScrollHeader } from '@/hooks/useScrollHeader';

// Fixed Types
interface ScreenConfig {
  id: string;
  title: string;
}

type AreaType = "TubeSheet" | "Riser";

interface InspectionArea {
  id: string;
  name: string;
  type: AreaType;
  screens: ScreenConfig[];
}

interface ReportingArea {
  id: string;
  name: string;
  type: AreaType;
}

interface SubMethod {
  id: string;
  name: string;
  areas: InspectionArea[];
  reportingAreas?: ReportingArea[];
}

interface MenuItem {
  id: string;
  icon: any;
  label: string;
  color: string;
  subMethods?: SubMethod[];
}

interface DashboardState {
  isProfileOpen: boolean;
  showWelcome: boolean;
  isNavCollapsed: boolean;
  isLoading: boolean;
  activeSection: string;
  activeMethod?: string;
  activeArea?: InspectionArea | ReportingArea;
  expandedMenus: Record<string, boolean>;
  expandedSubMenus: Record<string, boolean>;
  user: {
    name: string;
    accessLevel: string;
    avatar?: string;
  };
  isProfileDropdownOpen: boolean;
  currentTime?: Date;
}

// Updated Component Props Interfaces
interface QuadrantLayoutProps {
  method: string;
  screenType: AreaType;
  screens: ScreenConfig[];
}

interface ReportingViewProps {
  activeMethod: string;
  activeArea: ReportingArea;
  activeSubSection: string;  // Added this required prop
}

interface SettingsViewProps {
  activeSubSection: string;
}

// Constants
const DEFAULT_SCREENS: ScreenConfig[] = [
  { id: '3d-model', title: '3D Model' },
  { id: 'inspection-area', title: 'Inspection Area' },
  { id: 'live-images', title: 'Live Images' },
  { id: 'inspection-variation', title: 'Inspected Variation' }
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'Inspection',
    icon: Microscope,
    label: 'Inspection',
    color: 'text-[#FFC857]',
    subMethods: [
      {
        id: 'ProVis',
        name: 'Pro Vis',
        areas: [
          {
            id: 'tubesheet',
            name: 'TubeSheet Area',
            type: 'TubeSheet',
            screens: DEFAULT_SCREENS
          },
          {
            id: 'riser',
            name: 'Riser Area',
            type: 'Riser',
            screens: DEFAULT_SCREENS
          }
        ],
        reportingAreas: [
          {
            id: 'tubesheet-report',
            name: 'TubeSheet Report',
            type: 'TubeSheet'
          },
          {
            id: 'riser-report',
            name: 'Riser Report',
            type: 'Riser'
          }
        ]
      },
      {
        id: 'CaliPro',
        name: 'Cali Pro',
        areas: [
          {
            id: 'tubesheet',
            name: 'TubeSheet Area',
            type: 'TubeSheet',
            screens: DEFAULT_SCREENS
          }
        ],
        reportingAreas: [
          {
            id: 'tubesheet-report',
            name: 'TubeSheet Report',
            type: 'TubeSheet'
          }
        ]
      },
      {
        id: 'BoroVis',
        name: 'Boro Vis',
        areas: [
          {
            id: 'tubesheet',
            name: 'TubeSheet Area',
            type: 'TubeSheet',
            screens: DEFAULT_SCREENS
          }
        ],
        reportingAreas: [
          {
            id: 'tubesheet-report',
            name: 'TubeSheet Report',
            type: 'TubeSheet'
          }
        ]
      }
    ]
  },
  {
    id: 'Reporting',
    icon: FileText,
    label: 'Reporting',
    color: 'text-[#4A90E2]',
    subMethods: [
      {
        id: 'ProVis',
        name: 'Pro Vis',
        areas: [],
        reportingAreas: [
          {
            id: 'tubesheet-report',
            name: 'TubeSheet Report',
            type: 'TubeSheet'
          },
          {
            id: 'riser-report',
            name: 'Riser Report',
            type: 'Riser'
          }
        ]
      },
      {
        id: 'CaliPro',
        name: 'Cali Pro',
        areas: [],
        reportingAreas: [
          {
            id: 'tubesheet-report',
            name: 'TubeSheet Report',
            type: 'TubeSheet'
          }
        ]
      },
      {
        id: 'BoroVis',
        name: 'Boro Vis',
        areas: [],
        reportingAreas: [
          {
            id: 'tubesheet-report',
            name: 'TubeSheet Report',
            type: 'TubeSheet'
          }
        ]
      }
    ]
  },
  {
    id: 'Settings',
    icon: Settings,
    label: 'Settings',
    color: 'text-[#4A90E2]'
  }
];

// Animation variants
const menuItemVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const submenuVariants = {
  initial: { height: 0, opacity: 0 },
  animate: { 
    height: 'auto', 
    opacity: 1,
    transition: { 
      height: { duration: 0.3, ease: 'easeOut' },
      opacity: { duration: 0.2, ease: 'easeOut' }
    }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: { 
      height: { duration: 0.3, ease: 'easeIn' },
      opacity: { duration: 0.2, ease: 'easeIn' }
    }
  }
};

// Lazy loaded components with proper types
const QuadrantLayout = React.lazy<React.ComponentType<QuadrantLayoutProps>>(() => 
  import('@/components/dashboard/QuadrantLayout')
);

const ReportingView = React.lazy<React.ComponentType<ReportingViewProps>>(() => 
  import('@/components/dashboard/ReportingView')
);

const SettingsView = React.lazy<React.ComponentType<SettingsViewProps>>(() => 
  import('@/components/dashboard/SettingsView')
);

let timeUpdateInterval: NodeJS.Timeout;

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    isProfileOpen: false,
    showWelcome: false,
    isNavCollapsed: false,
    isLoading: true,
    activeSection: '',
    expandedMenus: {},
    expandedSubMenus: {},
    user: {
      name: 'John Doe',
      accessLevel: 'Administrator',
      avatar: undefined
    },
    isProfileDropdownOpen: false
  });

  const [error, setError] = useState<string>('');
  const isHeaderVisible = useScrollHeader();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    initializeDashboard();
    startTimeUpdate();
    return () => {
      if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setState(prev => ({ ...prev, isProfileDropdownOpen: false }));
      }
    };

    if (state.isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [state.isProfileDropdownOpen]);

  const initializeDashboard = () => {
    const hasShownWelcome = localStorage.getItem('welcome_shown');
    if (!hasShownWelcome) {
      setState(prev => ({ ...prev, showWelcome: true }));
      localStorage.setItem('welcome_shown', 'true');
      setTimeout(() => setState(prev => ({ ...prev, showWelcome: false })), 5000);
    }
  };

  const startTimeUpdate = () => {
    timeUpdateInterval = setInterval(() => {
      setState(prev => ({ ...prev, currentTime: new Date() }));
    }, 1000);
  };

  const checkAuth = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await fetch('/api/auth/check-session');
      
      if (!response.ok) throw new Error('Session check failed');

      const data = await response.json();
      if (!data.success) {
        router.push('/auth/login');
        return;
      }

      if (data.user) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          user: {
            name: data.user.name,
            accessLevel: data.user.accessLevel,
            avatar: data.user.avatar
          }
        }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login');
    }
  };

  const handleLogout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }

      setState(prev => ({ ...prev, isProfileDropdownOpen: false }));
      localStorage.removeItem('welcome_shown');
      router.push('/auth/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to logout');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleProfileDropdown = () => {
    setState(prev => ({ ...prev, isProfileDropdownOpen: !prev.isProfileDropdownOpen }));
  };

  const handleMenuClick = (
    sectionId: string,
    methodId?: string,
    area?: InspectionArea | ReportingArea
  ) => {
    setState(prev => {
      const newState = { ...prev };
      
      if (methodId) {
        newState.expandedSubMenus = {
          ...newState.expandedSubMenus,
          [methodId]: !newState.expandedSubMenus[methodId]
        };
      } else {
        newState.expandedMenus = {
          ...newState.expandedMenus,
          [sectionId]: !newState.expandedMenus[sectionId]
        };
      }

      newState.activeSection = sectionId;
      newState.activeMethod = methodId;
      newState.activeArea = area;

      return newState;
    });
  };

  const renderArea = (methodId: string, area: InspectionArea | ReportingArea, isReporting: boolean = false) => {
    const isActive = state.activeArea?.id === area.id && state.activeMethod === methodId;
    
    return (
      <motion.li
        key={`${methodId}-${area.id}`}
        variants={menuItemVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <button
          onClick={() => handleMenuClick(state.activeSection, methodId, area)}
          className={`flex w-full items-center gap-3 py-2 pl-16 transition-colors
            ${isActive ? 'text-[#FFC857]' : 'text-[#9A9A9A]'}
            hover:text-[#FFC857]`}
        >
          {isReporting ? (
            <FileSpreadsheet className="w-4 h-4" />
          ) : (
            <Layout className="w-4 h-4" />
          )}
          <span className="flex-1 text-left">{area.name}</span>
        </button>
      </motion.li>
    );
  };

  const renderSubMethod = (parentItem: MenuItem, method: SubMethod) => {
    const isActive = state.activeMethod === method.id;
    const isExpanded = state.expandedSubMenus[method.id];
    const isReporting = parentItem.id === 'Reporting';
    
    return (
      <motion.li
        key={method.id}
        variants={menuItemVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <button
          onClick={() => handleMenuClick(parentItem.id, method.id)}
          className={`flex w-full items-center gap-3 py-2 pl-12 transition-colors
            ${isActive ? 'text-[#FFC857]' : 'text-[#9A9A9A]'}
            hover:text-[#FFC857]`}
        >
          <Eye className="w-4 h-4" />
          <span className="flex-1 text-left">{method.name}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 
            ${isExpanded ? 'rotate-180' : ''}`}/>
            </button>
    
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.ul
                  variants={submenuVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="overflow-hidden"
                >
                  {isReporting
                    ? method.reportingAreas?.map(area => renderArea(method.id, area, true))
                    : method.areas.map(area => renderArea(method.id, area))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.li>
        );
      };
    
      const renderMenuItem = (item: MenuItem) => {
        const isActive = state.activeSection === item.id;
        const isExpanded = state.expandedMenus[item.id];
        
        return (
          <motion.li
            key={item.id}
            layout
            variants={menuItemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <button
              onClick={() => handleMenuClick(item.id)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group 
                ${isActive ? 'bg-gradient-to-r from-[#282828] to-[#1E1E1E] text-[#E0E0E0] shadow-lg' : 'text-[#9A9A9A] hover:bg-[#282828]/50'}
                ${!state.isNavCollapsed ? 'px-4' : 'justify-center px-2'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#FFC857]' : item.color}`} />
              
              {!state.isNavCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.subMethods && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 
                      ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                  )}
                </>
              )}
            </button>
    
            <AnimatePresence mode="wait">
              {item.subMethods && isExpanded && !state.isNavCollapsed && (
                <motion.ul
                  variants={submenuVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="overflow-hidden mt-1"
                >
                  {item.subMethods.map(method => renderSubMethod(item, method))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.li>
        );
      };
    
      const renderActiveContent = () => {
        if (state.activeSection === 'Reporting' && state.activeArea) {
          return (
            <Suspense fallback={<LoadingSpinner />}>
              <ReportingView 
                activeMethod={state.activeMethod || ''}
                activeArea={state.activeArea as ReportingArea}
                activeSubSection={state.activeSection} // Added this prop
              />
            </Suspense>
          );
        }
    
        if (state.activeSection === 'Settings') {
          return (
            <Suspense fallback={<LoadingSpinner />}>
              <SettingsView 
                activeSubSection={state.activeMethod || ''} 
              />
            </Suspense>
          );
        }
    
        if (state.activeArea && 'screens' in state.activeArea) {
          return (
            <Suspense fallback={<LoadingSpinner />}>
              <QuadrantLayout
                method={state.activeMethod || ''}
                screenType={state.activeArea.type}
                screens={state.activeArea.screens}
              />
            </Suspense>
          );
        }
    
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 text-gray-500"
          >
            Select an inspection method and area from the menu
          </motion.div>
        );
      };
    
      if (state.isLoading) {
        return <LoadingSpinner />;
      }
    
      return (
        <div className="flex min-h-screen bg-[#181818]">
          {/* Sidebar */}
          <motion.nav
            layout
            animate={{ width: state.isNavCollapsed ? '4rem' : '16rem' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-gradient-to-r from-[#181818] to-[#1E1E1E] h-screen fixed left-0 top-0 border-r border-[#282828] z-20 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-[#282828] bg-gradient-to-r from-[#1E1E1E] to-[#282828]">
              <AnimatePresence mode="wait">
                {!state.isNavCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-xl font-bold bg-gradient-to-r from-[#FFC857] to-[#4A90E2] bg-clip-text text-transparent"
                  >
                    ProTube X
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setState(prev => ({ ...prev, isNavCollapsed: !prev.isNavCollapsed }))}
                className="p-1.5 rounded-lg hover:bg-[#282828] transition-colors"
              >
                <ChevronLeft className={`w-5 h-5 text-[#E0E0E0] transform transition-transform duration-300 ${
                  state.isNavCollapsed ? 'rotate-180' : ''
                }`} />
              </motion.button>
            </div>
    
            <div className="px-2 py-4 h-[calc(100vh-4rem)] overflow-y-auto">
              <motion.ul layout className="space-y-1">
                {MENU_ITEMS.map(item => renderMenuItem(item))}
              </motion.ul>
            </div>
          </motion.nav>
    
          {/* Main Content */}
          <motion.div
            layout
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
              {/* Simplified Breadcrumb Navigation */}
              <nav className="flex items-center gap-2 text-xs text-[#9A9A9A]">
                <Link href="/dashboard" className="hover:text-[#FFC857] transition-colors">
                  Dashboard
                </Link>
                {state.activeSection && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#E0E0E0]">{state.activeSection}</span>
                  </>
                )}
                {state.activeMethod && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#E0E0E0]">{state.activeMethod}</span>
                  </>
                )}
                {state.activeArea && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#E0E0E0]">{state.activeArea.name}</span>
                  </>
                )}
              </nav>
    
              {/* Right side - DateTime and Profile */}
              <div className="flex items-center gap-4">
                {/* DateTime Display */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center px-4 py-2 bg-[#282828] rounded-lg text-[#9A9A9A]"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </motion.div>
    
                {/* User Profile Section */}
                <div className="relative profile-dropdown">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-3 px-4 py-2 bg-[#282828] rounded-lg hover:bg-[#303030] transition-colors"
                  >
                    {state.user.avatar ? (
                      <motion.img 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={state.user.avatar} 
                        alt={state.user.name}
                        className="w-8 h-8 rounded-full border-2 border-[#FFC857]"
                      />
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-full bg-[#FFC857] flex items-center justify-center"
                      >
                        <User className="w-5 h-5 text-[#282828]" />
                      </motion.div>
                    )}
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-[#E0E0E0]">{state.user.name}</p>
                      <p className="text-xs text-[#9A9A9A]">{state.user.accessLevel}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#9A9A9A] transition-transform duration-300 ${
                      state.isProfileDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </motion.button>
    
                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {state.isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-lg shadow-lg border border-[#383838] overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-[#383838]">
                          <p className="text-sm font-medium text-[#E0E0E0]">{state.user.name}</p>
                          <p className="text-xs text-[#9A9A9A]">{state.user.accessLevel}</p>
                        </div>
                        <motion.button
                          whileHover={{ backgroundColor: '#383838' }}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[#9A9A9A] hover:bg-[#383838] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.header>
    
            {/* Main Content Area */}
            <main className="pt-16">
              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg mx-4"
                  >
                    <div className="flex items-center gap-2">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="inline-block w-2 h-2 bg-red-400 rounded-full"
                      />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
    
              {/* Dynamic Content */}
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#1E1E1E] min-h-[calc(100vh-4rem)]"
              >
                {/* Section Content */}
                <motion.div layout className="relative h-[calc(100vh-4rem)]">
                  {renderActiveContent()}
                </motion.div>
              </motion.div>
    
              {/* Footer */}
              <footer className="py-4 px-6 border-t border-[#282828]">
                <div className="flex items-center justify-between text-xs text-[#9A9A9A]">
                  <p>© 2025 ProTube X. All rights reserved.</p>
                  <div className="flex items-center gap-4">
                    <Link href="/terms" className="hover:text-[#FFC857] transition-colors">
                      Terms of Service
                    </Link>
                    <Link href="/privacy" className="hover:text-[#FFC857] transition-colors">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </footer>
            </main>
          </motion.div>
        </div>
      );
    }