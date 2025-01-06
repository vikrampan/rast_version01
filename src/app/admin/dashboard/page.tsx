'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, 
  User, 
  LogOut, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Users, 
  AlertCircle, 
  ChevronDown, 
  Settings, 
  HelpCircle,
  Activity, 
  Shield, 
  Search, 
  Filter, 
  ChevronLeft, 
  Settings2
} from 'lucide-react';
import Link from 'next/link';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

const slideIn = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' }
};

const notificationPanel = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 }
};

// Interfaces
interface DetailedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization: string;
  accessLevel: string;
  lastLogin: Date;
  isActive: boolean;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByAccessLevel: {
    [key: string]: number;
  };
}

interface PendingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  accessLevel: string;
  registrationDate: string;
  status: string;
  isActive: boolean; // Added to match DetailedUser interface
}

interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

type Section = 'Users' | 'Access' | 'Activity' | 'Settings';
type ViewMode = 'all' | 'active' | 'pending';
type FilterStatus = 'all' | 'active' | 'inactive';

// Helper functions
const maskEmail = (email: string) => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [notifications, setNotifications] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string>('');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('Users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    usersByAccessLevel: {}
  });
  const [detailedUsers, setDetailedUsers] = useState<DetailedUser[]>([]);
  const [activeDetailedUsers, setActiveDetailedUsers] = useState<DetailedUser[]>([]);

  const menuItems = [
    { id: 'Users', icon: Users, label: 'User Management', color: 'text-[#FFC857]' },
    { id: 'Access', icon: Shield, label: 'Access Control', color: 'text-[#FFC857]' },
    { id: 'Activity', icon: Activity, label: 'User Activity', color: 'text-[#FFC857]' },
    { id: 'Settings', icon: Settings2, label: 'Admin Settings', color: 'text-[#4A90E2]' },
  ];

  useEffect(() => {
    checkAuth();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const fetchTimer = setInterval(() => {
      fetchPendingUsers();
      fetchUserStats();
      fetchDetailedUsers();
      fetchActiveUsers();
    }, 300000); // Every 5 minutes

    // Initial fetch
    fetchUserStats();
    fetchDetailedUsers();
    fetchActiveUsers();

    return () => {
      clearInterval(timer);
      clearInterval(fetchTimer);
    };
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/admin/user-stats');
      const data = await response.json();
      
      if (data.success) {
        setUserStats(data.data);
      } else {
        setError('Failed to fetch user statistics');
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setError('Failed to load user statistics');
    }
  };

  const fetchDetailedUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/detailed-users');
      const data = await response.json();
      
      if (data.success) {
        setDetailedUsers(data.users);
      } else {
        setError('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/active-users');
      const data = await response.json();
      
      if (data.success) {
        setActiveDetailedUsers(data.users);
      } else {
        setError('Failed to fetch active users');
      }
    } catch (error) {
      console.error('Error fetching active users:', error);
      setError('Failed to load active users');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check-session');
      if (!response.ok) {
        throw new Error('Session check failed');
      }
      
      const data = await response.json();

      if (!data.success || !data.user.isAdmin) {
        router.push('/auth/login');
        return;
      }

      setUser(data.user);
      await fetchPendingUsers();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/pending-users');
      const data = await response.json();
      
      if (data.success) {
        setPendingUsers(data.users);
        setNotifications(data.users.length);
      } else {
        setError(data.message || 'Failed to fetch pending users');
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
      setError('Failed to load pending users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        await fetchPendingUsers();
        await fetchUserStats();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to approve user');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      setError('Failed to approve user');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/reject-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        await fetchPendingUsers();
        await fetchUserStats();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reject user');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      setError('Failed to reject user');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        router.push('/auth/login');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to logout');
    }
  };

  const getUsersToDisplay = () => {
    switch (viewMode) {
      case 'active':
        return activeDetailedUsers;
      case 'pending':
        return pendingUsers;
      default:
        return detailedUsers;
    }
  };

  const getTableTitle = () => {
    switch (viewMode) {
      case 'active':
        return 'Active Users';
      case 'pending':
        return 'Pending Users';
      default:
        return 'All Users';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#181818]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC857]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#181818]">
      {/* Sidebar */}
      <motion.nav
        initial={false}
        animate={{ width: isNavCollapsed ? '4rem' : '16rem' }}
        className="bg-gradient-to-r from-[#181818] to-[#1E1E1E] h-screen fixed left-0 top-0 border-r border-[#282828] z-20 shadow-xl"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#282828] bg-gradient-to-r from-[#1E1E1E] to-[#282828]">
          <AnimatePresence mode="wait">
            {!isNavCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-xl font-bold bg-gradient-to-r from-[#FFC857] to-[#4A90E2] bg-clip-text text-transparent"
              >
                Admin Panel
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            className="p-1.5 rounded-lg hover:bg-[#282828] transition-colors"
          >
            <ChevronLeft 
              className={`w-5 h-5 text-[#E0E0E0] transform transition-transform duration-300 
                ${isNavCollapsed ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>

        <div className="px-2 py-6 h-[calc(100vh-4rem)] overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <motion.li 
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => setActiveSection(item.id as Section)}
                  className={`flex w-full items-center gap-3 py-3 rounded-lg transition-all duration-200 group 
                    ${activeSection === item.id ? 'bg-gradient-to-r from-[#282828] to-[#1E1E1E] text-[#E0E0E0] shadow-lg' : 'text-[#9A9A9A] hover:bg-[#282828]/50'}
                    ${!isNavCollapsed ? 'px-4' : 'justify-center px-2'}`}
                >
                  <div className={`relative ${activeSection === item.id ? 'text-[#FFC857]' : item.color}`}>
                    <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    {activeSection === item.id && !isNavCollapsed && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#FFC857] rounded-r-full"
                      />
                    )}
                  </div>
                  {!isNavCollapsed && (
                    <span className={`flex-1 truncate ${activeSection === item.id ? 'font-medium' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className={`flex-1 ${isNavCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <motion.header
          initial={false}
          animate={{ width: `calc(100% - ${isNavCollapsed ? '4rem' : '16rem'})` }}
          className="fixed right-0 bg-gradient-to-r from-[#181818] to-[#1E1E1E] h-16 flex items-center justify-between px-6 border-b border-[#282828] shadow-lg z-10 backdrop-blur-sm bg-opacity-95"
        >
          {/* Left side - Title */}
          <div className="flex items-center">
            <h2 className="text-[#E0E0E0] text-lg font-medium">{getTableTitle()}</h2>
          </div>

          {/* Right side - Time, Date, Notifications, and Profile */}
          <div className="flex items-center gap-4">
            {/* Time and Date Section */}
            <div className="flex items-center space-x-4 text-[#9A9A9A]">
              <div className="flex items-center px-3 py-1.5 bg-[#282828] rounded-lg">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center px-3 py-1.5 bg-[#282828] rounded-lg">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">{currentTime.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#9A9A9A] hover:bg-[#282828] rounded-full transition-all duration-200 hover:text-[#E0E0E0]"
            >
              <Bell className="h-6 w-6" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFC857] rounded-full animate-pulse" />
              )}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-[#9A9A9A] hover:bg-[#282828] rounded-lg transition-all duration-200 hover:text-[#E0E0E0]"
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-[#FFC857] to-[#4A90E2] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#E0E0E0]" />
                </div>
                <span className="font-medium hidden md:block">
                  {user.firstName} {user.lastName}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={fadeInUp.initial}
                    animate={fadeInUp.animate}
                    exit={fadeInUp.exit}
                    className="absolute right-0 mt-2 w-48 bg-[#1E1E1E] rounded-lg shadow-xl border border-[#282828] overflow-hidden"
                  >
                    <div className="p-3 border-b border-[#383838]">
                      <p className="text-sm font-medium text-[#E0E0E0]">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-[#9A9A9A]">Administrator</p>
                    </div>
                    <div className="py-1">
                      <Link href="/admin/settings" 
                        className="flex items-center gap-2 px-4 py-2 text-[#9A9A9A] hover:bg-[#282828] hover:text-[#E0E0E0] transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <Link href="/admin/help" 
                        className="flex items-center gap-2 px-4 py-2 text-[#9A9A9A] hover:bg-[#282828] hover:text-[#E0E0E0] transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>Help</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-[#282828] hover:text-red-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="pt-20 p-6">
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                exit={fadeInUp.exit}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg"
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeSection === 'Users' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Users Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-b from-[#1E1E1E] to-[#181818] rounded-lg p-6 border border-[#282828] transition-all duration-300 cursor-pointer
                    ${viewMode === 'all' ? 'border-[#FFC857]' : 'hover:border-[#FFC857]/50'}`}
                  onClick={() => setViewMode('all')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#9A9A9A]">Total Users</p>
                      <h3 className="text-2xl font-bold text-[#E0E0E0] mt-1">{userStats.totalUsers}</h3>
                    </div>
                    <div className="w-12 h-12 bg-[#FFC857]/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#FFC857]" />
                    </div>
                  </div>
                </motion.div>

                {/* Active Users Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-b from-[#1E1E1E] to-[#181818] rounded-lg p-6 border border-[#282828] transition-all duration-300 cursor-pointer
                    ${viewMode === 'active' ? 'border-green-500' : 'hover:border-green-500/50'}`}
                  onClick={() => setViewMode('active')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#9A9A9A]">Active Users</p>
                      <h3 className="text-2xl font-bold text-[#E0E0E0] mt-1">{userStats.activeUsers}</h3>
                      <p className="text-xs text-[#9A9A9A] mt-1">Currently online</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </motion.div>

                {/* Pending Requests Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-b from-[#1E1E1E] to-[#181818] rounded-lg p-6 border border-[#282828] transition-all duration-300 cursor-pointer
                    ${viewMode === 'pending' ? 'border-yellow-500' : 'hover:border-yellow-500/50'}`}
                  onClick={() => setViewMode('pending')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#9A9A9A]">Pending Requests</p>
                      <h3 className="text-2xl font-bold text-[#E0E0E0] mt-1">{notifications}</h3>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                </motion.div>

                {/* System Status Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] rounded-lg p-6 border border-[#282828] hover:border-[#4A90E2]/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#9A9A9A]">System Status</p>
                      <h3 className="text-2xl font-bold text-[#E0E0E0] mt-1">Active</h3>
                    </div>
                    <div className="w-12 h-12 bg-[#4A90E2]/10 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-[#4A90E2]" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Main Users Table Card */}
              <div className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] rounded-lg border border-[#282828]">
                <div className="p-6 border-b border-[#282828]">
                  <h2 className="text-xl font-semibold text-[#E0E0E0] mb-2">{getTableTitle()}</h2>
                  <p className="text-[#9A9A9A] mb-4">Manage user accounts and permissions</p>

                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A9A9A] w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#282828] border border-[#383838] rounded-lg text-[#E0E0E0] placeholder-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#FFC857]/50 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div className="relative w-full sm:w-48">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                        className="w-full appearance-none pl-4 pr-10 py-2 bg-[#282828] border border-[#383838] rounded-lg text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#FFC857]/50 focus:border-transparent transition-all duration-300"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9A9A9A] w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#282828]">
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">Name</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">Email</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">Organization</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">Access Level</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">Status</th>
                        {viewMode === 'pending' && (
                          <th className="text-left px-6 py-3 text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#282828]">
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFC857]"></div>
                            </div>
                          </td>
                        </tr>
                      ) : getUsersToDisplay().length > 0 ? (
                        getUsersToDisplay().map((user) => (
                          <tr 
                            key={user._id}
                            className="hover:bg-[#282828]/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-[#FFC857]/10 flex items-center justify-center">
                                  <User className="h-4 w-4 text-[#FFC857]" />
                                </div>
                                <span className="text-[#E0E0E0] font-medium">{user.firstName} {user.lastName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#E0E0E0]">{maskEmail(user.email)}</td>
                            <td className="px-6 py-4 text-[#E0E0E0]">{user.organization}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/20">
                                {user.accessLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span 
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  viewMode === 'pending'
                                    ? 'bg-yellow-500/10 text-yellow-500'
                                    : user.isActive
                                      ? 'bg-green-500/10 text-green-500'
                                      : 'bg-red-500/10 text-red-500'
                                }`}
                              >
                                {viewMode === 'pending' ? 'Pending' : user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            {viewMode === 'pending' && (
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleApprove(user._id)}
                                    className="p-1.5 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                                    title="Approve User"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleReject(user._id)}
                                    className="p-1.5 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                                    title="Reject User"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6}>
                            <div className="text-center py-12">
                              <AlertCircle className="mx-auto h-12 w-12 text-[#9A9A9A]" />
                              <h3 className="mt-4 text-lg font-medium text-[#E0E0E0]">No users found</h3>
                              <p className="mt-2 text-sm text-[#9A9A9A]">
                                {viewMode === 'pending' 
                                  ? 'No pending approval requests'
                                  : viewMode === 'active'
                                  ? 'No active users at the moment'
                                  : 'Try adjusting your search or filter'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Other section content can be added here */}
          {activeSection === 'Access' && (
            <div className="text-[#E0E0E0]">Access Control content will be displayed here</div>
          )}
          {activeSection === 'Activity' && (
            <div className="text-[#E0E0E0]">User Activity content will be displayed here</div>
          )}
          {activeSection === 'Settings' && (
            <div className="text-[#E0E0E0]">Settings content will be displayed here</div>
          )}
        </main>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={notificationPanel.initial}
            animate={notificationPanel.animate}
            exit={notificationPanel.exit}
            className="fixed top-16 right-0 w-80 bg-[#1E1E1E] border-l border-[#282828] h-screen overflow-y-auto shadow-xl z-30"
          >
            <div className="p-4 border-b border-[#282828]">
              <h3 className="text-lg font-semibold text-[#E0E0E0]">Notifications</h3>
              <p className="text-sm text-[#9A9A9A]">You have {notifications} new notifications</p>
            </div>
            <div className="divide-y divide-[#282828]">
              {pendingUsers.map((user) => (
                <motion.div 
                  key={user._id}
                  initial={slideIn.initial}
                  animate={slideIn.animate}
                  exit={slideIn.exit}
                  className="p-4 hover:bg-[#282828]/50 transition-colors"
                >
                  <p className="text-sm text-[#E0E0E0]">
                    New registration request from {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-[#9A9A9A] mt-1">
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="flex-1 px-2 py-1 text-xs text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user._id)}
                      className="flex-1 px-2 py-1 text-xs text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}

              {pendingUsers.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-sm text-[#9A9A9A]">No new notifications</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}