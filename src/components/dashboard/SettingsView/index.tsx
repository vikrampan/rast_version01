'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Lock, HelpCircle, Save } from 'lucide-react';

interface SettingsViewProps {
  activeSubSection: string;
}

const SettingsView: React.FC<SettingsViewProps> = ({ activeSubSection }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
    dataRetention: '30',
    language: 'en'
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[#E0E0E0] flex items-center gap-2">
          <Settings2 className="w-5 h-5" />
          General Settings
        </h3>
        
        {/* Theme Selection */}
        <div className="space-y-2">
          <label className="text-sm text-[#9A9A9A]">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            className="w-full bg-[#282828] border border-[#383838] rounded-lg p-2 text-[#E0E0E0]"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#9A9A9A]">Enable Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#383838] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFC857]"></div>
          </label>
        </div>

        {/* Auto Save */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#9A9A9A]">Auto Save</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#383838] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFC857]"></div>
          </label>
        </div>

        {/* Data Retention */}
        <div className="space-y-2">
          <label className="text-sm text-[#9A9A9A]">Data Retention (days)</label>
          <select
            value={settings.dataRetention}
            onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
            className="w-full bg-[#282828] border border-[#383838] rounded-lg p-2 text-[#E0E0E0]"
          >
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
          </select>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="text-sm text-[#9A9A9A]">Language</label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="w-full bg-[#282828] border border-[#383838] rounded-lg p-2 text-[#E0E0E0]"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <button className="flex items-center gap-2 px-4 py-2 bg-[#FFC857] text-[#282828] rounded-lg hover:bg-[#FFD857] transition-colors">
        <Save className="w-4 h-4" />
        Save Changes
      </button>
    </div>
  );

  const renderLicenseSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-medium text-[#E0E0E0]">
        <Lock className="w-5 h-5" />
        License Information
      </div>
      
      <div className="bg-[#282828] p-4 rounded-lg border border-[#383838]">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#9A9A9A]">License Key</label>
            <input
              type="text"
              value="XXXX-XXXX-XXXX-XXXX"
              readOnly
              className="w-full bg-[#383838] border border-[#484848] rounded-lg p-2 mt-1 text-[#E0E0E0]"
            />
          </div>
          
          <div>
            <label className="text-sm text-[#9A9A9A]">Status</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                Active
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#9A9A9A]">Expiration</label>
            <p className="text-[#E0E0E0] mt-1">January 5, 2026</p>
          </div>

          <div>
            <label className="text-sm text-[#9A9A9A]">Features</label>
            <ul className="mt-1 space-y-1 text-[#E0E0E0]">
              <li>✓ Pro Vis Inspection</li>
              <li>✓ Cali Pro Analysis</li>
              <li>✓ Boro Vis Integration</li>
              <li>✓ Advanced Reporting</li>
            </ul>
          </div>
        </div>
      </div>

      <button className="flex items-center gap-2 px-4 py-2 bg-[#FFC857] text-[#282828] rounded-lg hover:bg-[#FFD857] transition-colors">
        <Lock className="w-4 h-4" />
        Update License
      </button>
    </div>
  );

  const renderHelpSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-medium text-[#E0E0E0]">
        <HelpCircle className="w-5 h-5" />
        Help & Support
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Documentation Section */}
        <div className="bg-[#282828] p-4 rounded-lg border border-[#383838]">
          <h4 className="text-[#E0E0E0] font-medium mb-2">Documentation</h4>
          <p className="text-[#9A9A9A] text-sm mb-4">
            Access comprehensive guides and documentation for ProTube X features.
          </p>
          <button className="text-[#FFC857] hover:text-[#FFD857] transition-colors text-sm">
            View Documentation →
          </button>
        </div>

        {/* Video Tutorials */}
        <div className="bg-[#282828] p-4 rounded-lg border border-[#383838]">
          <h4 className="text-[#E0E0E0] font-medium mb-2">Video Tutorials</h4>
          <p className="text-[#9A9A9A] text-sm mb-4">
            Watch step-by-step video tutorials for using ProTube X effectively.
          </p>
          <button className="text-[#FFC857] hover:text-[#FFD857] transition-colors text-sm">
            Watch Tutorials →
          </button>
        </div>

        {/* FAQ Section */}
        <div className="bg-[#282828] p-4 rounded-lg border border-[#383838]">
          <h4 className="text-[#E0E0E0] font-medium mb-2">FAQs</h4>
          <p className="text-[#9A9A9A] text-sm mb-4">
            Find answers to commonly asked questions about ProTube X.
          </p>
          <button className="text-[#FFC857] hover:text-[#FFD857] transition-colors text-sm">
            View FAQs →
          </button>
        </div>

        {/* Support */}
        <div className="bg-[#282828] p-4 rounded-lg border border-[#383838]">
          <h4 className="text-[#E0E0E0] font-medium mb-2">Technical Support</h4>
          <p className="text-[#9A9A9A] text-sm mb-4">
            Contact our support team for technical assistance.
          </p>
          <button className="text-[#FFC857] hover:text-[#FFD857] transition-colors text-sm">
            Contact Support →
          </button>
        </div>
      </div>

      {/* Version Information */}
      <div className="mt-8 pt-4 border-t border-[#383838]">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9A9A9A]">Version</span>
          <span className="text-[#E0E0E0]">2.0.1</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-[#9A9A9A]">Last Updated</span>
          <span className="text-[#E0E0E0]">January 5, 2025</span>
        </div>
      </div>
    </div>
  );

  // Render the appropriate section based on activeSubSection
  const renderContent = () => {
    switch (activeSubSection) {
      case 'General':
        return renderGeneralSettings();
      case 'License':
        return renderLicenseSettings();
      case 'Help':
        return renderHelpSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      {renderContent()}
    </motion.div>
  );
};

export default SettingsView;