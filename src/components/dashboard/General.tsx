/**
 * General.tsx
 * This component handles the general settings and configuration of the application.
 * It includes project management, connection settings, and report configuration.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Settings2, PlayCircle, FolderOpen, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define TypeScript interfaces for better type safety
interface GeneralSettings {
  projectFolder: string;
  projectName: string;
  tableFormat: string;
  reportFileName: string;
  reportLocation: string;
}

interface ConnectionState {
  isConnected: boolean;
  isLoading: boolean;
}

// Default values for the settings
const DEFAULT_SETTINGS: GeneralSettings = {
  projectFolder: 'C:/Users/admin/Documents',
  projectName: 'draft',
  tableFormat: 'Static Row Cell',
  reportFileName: 'Report.mob',
  reportLocation: '/reports/2024/',
};

// Available options for table format
const TABLE_FORMAT_OPTIONS = [
  'Static Row Cell',
  'Dynamic Row Cell',
  'Custom Format',
] as const;

/**
 * Helper function to validate file paths
 * Ensures paths are safe and properly formatted
 */
const isValidPath = (path: string): boolean => {
  try {
    return !path.includes('..') && 
           path.length > 0 && 
           !path.includes('<') && 
           !path.includes('>');
  } catch (error) {
    console.error('Path validation error:', error);
    return false;
  }
};

const General: React.FC = () => {
  // Main state management
  const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_SETTINGS);
  const [connection, setConnection] = useState<ConnectionState>({
    isConnected: true,
    isLoading: false,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Load saved settings when component mounts
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('generalSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('generalSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  /**
   * Shows a notification message to the user
   * Automatically hides after 3 seconds
   */
  const showNotification = useCallback((message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    const timer = setTimeout(() => setShowAlert(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handles the folder selection process
   * Validates the path before updating
   */
  const handleFolderSelect = useCallback(async () => {
    try {
      const newFolder = prompt('Enter folder path:', settings.projectFolder);
      if (newFolder && isValidPath(newFolder)) {
        setSettings(prev => ({ ...prev, projectFolder: newFolder }));
        showNotification('Project folder updated successfully');
      } else if (newFolder) {
        throw new Error('Invalid path format');
      }
    } catch (error) {
      showNotification('Invalid folder path provided');
    }
  }, [settings.projectFolder, showNotification]);

  /**
   * Creates a new project with default settings
   */
  const handleNewProject = useCallback(() => {
    try {
      setSettings(prev => ({
        ...prev,
        projectName: 'new_project',
        reportFileName: 'New_Report.mob'
      }));
      showNotification('New project created');
    } catch (error) {
      showNotification('Error creating new project');
    }
  }, [showNotification]);

  /**
   * Opens an existing project
   * Validates the file name before proceeding
   */
  const handleOpenProject = useCallback(() => {
    try {
      const fileName = prompt('Enter project file name:');
      if (fileName && isValidPath(fileName)) {
        setSettings(prev => ({
          ...prev,
          projectName: fileName.replace('.saved', '')
        }));
        showNotification('Project opened successfully');
      } else if (fileName) {
        throw new Error('Invalid file name');
      }
    } catch (error) {
      showNotification('Error opening project');
    }
  }, [showNotification]);

  /**
   * Handles connection/disconnection to Magnifi
   * Simulates an API call with timeout
   */
  const handleConnection = useCallback(async () => {
    setConnection(prev => ({ ...prev, isLoading: true }));
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setConnection(prev => ({ 
        isLoading: false,
        isConnected: !prev.isConnected 
      }));
      showNotification(
        connection.isConnected 
          ? 'Disconnected from Magnifi' 
          : 'Connected to Magnifi'
      );
    } catch (error) {
      showNotification('Connection error occurred');
      setConnection(prev => ({ ...prev, isLoading: false }));
    }
  }, [connection.isConnected, showNotification]);

  /**
   * Tests the connection to Magnifi
   * Simulates an API call with timeout
   */
  const handleTestConnection = useCallback(async () => {
    setConnection(prev => ({ ...prev, isLoading: true }));
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Connection test successful');
    } catch (error) {
      showNotification('Connection test failed');
    } finally {
      setConnection(prev => ({ ...prev, isLoading: false }));
    }
  }, [showNotification]);

  // Memoized CSS classes for connection status
  const connectionStatusClasses = useMemo(() => ({
    container: `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      connection.isConnected 
        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' 
        : 'bg-red-900/30 text-red-400 border border-red-800'
    } transition-colors duration-300`,
    button: `w-full sm:w-auto px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
      connection.isConnected
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
    } ${connection.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`
  }), [connection.isConnected, connection.isLoading]);

  return (
    <div className="min-h-screen bg-black">
      <div className="grid grid-cols-1 gap-6 p-8 max-w-7xl mx-auto">
        {/* Alert Notification */}
        {showAlert && (
          <Alert 
            className="fixed top-4 right-4 z-50 max-w-md bg-zinc-900 border border-zinc-800 shadow-2xl"
            role="alert"
          >
            <AlertDescription className="text-zinc-200">
              {alertMessage}
            </AlertDescription>
            <button 
              onClick={() => setShowAlert(false)}
              className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-200 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </Alert>
        )}

        {/* Main Settings Card */}
        <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl border border-zinc-800 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-8">
            Project Settings
          </h3>
          
          {/* Project Folder Section */}
          <div className="mb-8">
            <label 
              htmlFor="projectFolder"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Project Folder:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="projectFolder"
                type="text"
                value={settings.projectFolder}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  projectFolder: e.target.value
                }))}
                className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-zinc-600"
                aria-label="Project folder path"
              />
              <button 
                onClick={handleFolderSelect}
                className="inline-flex items-center px-4 py-3 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-all duration-300"
                aria-label="Browse folders"
              >
                <FolderOpen className="w-5 h-5 mr-2" />
                Browse
              </button>
            </div>
          </div>

          {/* Project File Section */}
          <div className="mb-8">
            <label 
              htmlFor="projectName"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Project File:
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input
                    id="projectName"
                    type="text"
                    value={settings.projectName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      projectName: e.target.value
                    }))}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <span className="text-zinc-500">.saved</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleNewProject}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  New Project
                </button>
                <button
                  onClick={handleOpenProject}
                  className="px-6 py-3 bg-zinc-800 text-zinc-200 rounded-lg font-medium hover:bg-zinc-700 transition-all duration-300"
                >
                  Open
                </button>
              </div>
            </div>
          </div>

          {/* Connection Settings Section */}
          <div className="mt-12 border-t border-zinc-800 pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-white">
                Magnifi Connection
              </h3>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span className="text-sm text-zinc-400">Status:</span>
                <span className={connectionStatusClasses.container}>
                  {connection.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Table Format Selection */}
              <div>
                <label 
                  htmlFor="tableFormat"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Table Format:
                </label>
                <select
                  id="tableFormat"
                  value={settings.tableFormat}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    tableFormat: e.target.value
                  }))}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  {TABLE_FORMAT_OPTIONS.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Report File Input */}
              <div>
                <label 
                  htmlFor="reportFileName"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Report File:
                </label>
                <input
                  id="reportFileName"
                  type="text"
                  value={settings.reportFileName}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    reportFileName: e.target.value
                  }))}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Report Location Input */}
              <div>
                <label 
                  htmlFor="reportLocation"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Report Location:
                </label>
                <div className="flex gap-3">
                  <input
                    id="reportLocation"
                    type="text"
                    value={settings.reportLocation}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      reportLocation: e.target.value
                    }))}
                    className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <button 
                    onClick={() => {
                      const newLocation = prompt('Enter report location:', settings.reportLocation);
                      if (newLocation && isValidPath(newLocation)) {
                        setSettings(prev => ({
                          ...prev,
                          reportLocation: newLocation
                        }));
                      }
                    }}
                    className="p-3 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-all duration-300"
                    aria-label="Set report location"
                  >
                    <Settings2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Connection Control Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleConnection}
                disabled={connection.isLoading}
                className={connectionStatusClasses.button}
                aria-label={connection.isConnected ? 'Disconnect from Magnifi' : 'Connect to Magnifi'}
              >
                <PlayCircle className="w-5 h-5" />
                <span>{connection.isConnected ? 'Disconnect' : 'Connect'}</span>
              </button>
              <button
                onClick={handleTestConnection}
                disabled={connection.isLoading}
                className={`w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                  connection.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Test Magnifi connection"
              >
                Test Connection
              </button>
            </div>

            {/* Information Note */}
            <div className="mt-8 bg-zinc-950 rounded-lg border border-zinc-800">
              <p className="p-4 text-sm text-zinc-400">
                Note: This connection enables automatic synchronization between TubePro and Magnifi, 
                allowing seamless transfer of tubelists and monitoring of report file changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;