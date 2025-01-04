import { LucideIcon } from 'lucide-react';

export interface UserSession {
  user?: {
    name?: string;
    image?: string;
  };
}

export interface MenuItem {
  id: string;
  icon?: LucideIcon;
  label: string;
  color?: string;
  hasDropdown?: boolean;
  subItems?: MenuItem[];
}

export interface DashboardProps {
  onError?: (error: Error) => void;
}

export interface DashboardState {
  isProfileOpen: boolean;
  showWelcome: boolean;
  isNavCollapsed: boolean;
  isLoading: boolean;
  activeSection: string;
  activeSubSection: string;
  isSettingsOpen: boolean;
  isInspectionOpen: boolean;
}

export interface MenuItemType {
  id: string;
  icon?: LucideIcon;
  label: string;
  color?: string;
  hasDropdown?: boolean;
  subItems?: MenuItemType[];
}

// Constants
export const WELCOME_SHOWN_KEY = 'welcome_shown';
export const ANIMATION_DURATION = 300;
export const SCROLL_THRESHOLD = 50;