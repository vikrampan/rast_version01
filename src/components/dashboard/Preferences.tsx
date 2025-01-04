import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, Plus, Save, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PreferencesState {
  measurementUnit: 'Metric' | 'Imperial';
  reportFormat: 'Word' | 'Excel';
  gridMode: boolean;
  colorMatch: boolean;
  customFormats: string[];
  textColor: string;
  backgroundColor: string;
  tubeOutlineColor: string;
  rowLineInterval: number;
  columnLineInterval: number;
  keyboardShortcuts: {
    nextTube: string;
    prevTube: string;
    selectTube: string;
    deselectTube: string;
  };
}

export const Preferences = () => {
  const initialState: PreferencesState = {
    measurementUnit: 'Imperial',
    reportFormat: 'Word',
    gridMode: true,
    colorMatch: true,
    customFormats: ['T1.02', 'AA-BB'],
    textColor: 'white',
    backgroundColor: 'gray',
    tubeOutlineColor: 'lime',
    rowLineInterval: 1,
    columnLineInterval: 1,
    keyboardShortcuts: {
      nextTube: 'Tab',
      prevTube: 'Shift + Tab',
      selectTube: 'Space',
      deselectTube: 'Escape'
    }
  };

  const [preferences, setPreferences] = useState<PreferencesState>(initialState);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('tubesheet-preferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tubesheet-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const handleInputChange = (key: keyof PreferencesState, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddCustomFormat = () => {
    const newFormat = `Format-${preferences.customFormats.length + 1}`;
    setPreferences(prev => ({
      ...prev,
      customFormats: [...prev.customFormats, newFormat]
    }));
  };

  const handleReset = () => {
    setPreferences(initialState);
  };

  // Custom Toggle Switch Component
  const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div 
      className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
        checked ? 'bg-blue-600' : 'bg-zinc-800'
      }`}
      onClick={onChange}
    >
      <div 
        className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`} 
      />
    </div>
  );

  return (
    <Card className="w-full bg-black border-zinc-800">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-zinc-100">Preferences</CardTitle>
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => localStorage.setItem('tubesheet-preferences', JSON.stringify(preferences))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        {/* Measurement Unit */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">Measurement Unit</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
              <input
                type="radio"
                name="unit"
                value="Metric"
                checked={preferences.measurementUnit === 'Metric'}
                onChange={(e) => handleInputChange('measurementUnit', e.target.value)}
                className="form-radio text-blue-600"
              />
              Metric
            </label>
            <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
              <input
                type="radio"
                name="unit"
                value="Imperial"
                checked={preferences.measurementUnit === 'Imperial'}
                onChange={(e) => handleInputChange('measurementUnit', e.target.value)}
                className="form-radio text-blue-600"
              />
              Imperial
            </label>
          </div>
        </div>

        {/* Row/Tube Numbering Format */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">Row/Tube Numbering Format</h3>
          <div className="space-y-2">
            {preferences.customFormats.map((format, index) => (
              <label key={index} className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={format}
                  className="form-radio text-blue-600"
                />
                {format}
              </label>
            ))}
            <button
              onClick={handleAddCustomFormat}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors mt-2"
            >
              <Plus className="w-4 h-4" />
              Add Customized Alphanumeric
            </button>
          </div>
        </div>

        {/* Report Format */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">Report Format</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
              <input
                type="radio"
                name="report"
                value="Word"
                checked={preferences.reportFormat === 'Word'}
                onChange={(e) => handleInputChange('reportFormat', e.target.value)}
                className="form-radio text-blue-600"
              />
              Word
            </label>
            <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
              <input
                type="radio"
                name="report"
                value="Excel"
                checked={preferences.reportFormat === 'Excel'}
                onChange={(e) => handleInputChange('reportFormat', e.target.value)}
                className="form-radio text-blue-600"
              />
              Excel
            </label>
          </div>
        </div>

        {/* Tubesheet View */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">Tubesheet View</h3>
          <div className="space-y-4">
            <button 
              onClick={() => setIsKeyboardShortcutsOpen(true)}
              className="flex items-center gap-2 p-2 bg-zinc-900 rounded-lg text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <Keyboard className="w-5 h-5" />
              <span>Keyboard Shortcuts</span>
            </button>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4">
                <span className="text-zinc-400">Grid Mode</span>
                <Switch 
                  checked={preferences.gridMode} 
                  onChange={() => handleInputChange('gridMode', !preferences.gridMode)} 
                />
              </label>

              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-zinc-400">Text Color:</span>
                  <select 
                    value={preferences.textColor}
                    onChange={(e) => handleInputChange('textColor', e.target.value)}
                    className="bg-zinc-900 text-zinc-200 p-2 rounded border border-zinc-700 focus:outline-none focus:border-zinc-600"
                  >
                    <option value="white">White</option>
                    <option value="black">Black</option>
                  </select>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-zinc-400">Background Color:</span>
                  <select 
                    value={preferences.backgroundColor}
                    onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                    className="bg-zinc-900 text-zinc-200 p-2 rounded border border-zinc-700 focus:outline-none focus:border-zinc-600"
                  >
                    <option value="gray">Gray</option>
                    <option value="black">Black</option>
                    <option value="dark-blue">Dark Blue</option>
                  </select>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-zinc-400">Tube Outline Color:</span>
                  <div className="flex items-center gap-4">
                    <select 
                      value={preferences.tubeOutlineColor}
                      onChange={(e) => handleInputChange('tubeOutlineColor', e.target.value)}
                      className="bg-zinc-900 text-zinc-200 p-2 rounded border border-zinc-700 focus:outline-none focus:border-zinc-600"
                    >
                      <option value="lime">Lime</option>
                      <option value="yellow">Yellow</option>
                      <option value="cyan">Cyan</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">Color match probability</span>
                      <Switch 
                        checked={preferences.colorMatch} 
                        onChange={() => handleInputChange('colorMatch', !preferences.colorMatch)} 
                      />
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-zinc-400">Row Line Interval:</span>
                  <input 
                    type="number" 
                    min={1}
                    max={10}
                    value={preferences.rowLineInterval} 
                    onChange={(e) => handleInputChange('rowLineInterval', parseInt(e.target.value))}
                    className="bg-zinc-900 text-zinc-200 p-2 rounded w-20 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-zinc-400">Column Line Interval:</span>
                  <input 
                    type="number"
                    min={1}
                    max={10}
                    value={preferences.columnLineInterval} 
                    onChange={(e) => handleInputChange('columnLineInterval', parseInt(e.target.value))}
                    className="bg-zinc-900 text-zinc-200 p-2 rounded w-20 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Keyboard Shortcuts Modal */}
      {isKeyboardShortcutsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-xl w-96 border border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-4">
              {Object.entries(preferences.keyboardShortcuts).map(([action, shortcut]) => (
                <div key={action} className="flex justify-between items-center">
                  <span className="text-zinc-400 capitalize">
                    {action.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <kbd className="px-2 py-1 bg-zinc-900 rounded text-zinc-200 border border-zinc-700">
                    {shortcut}
                  </kbd>
                </div>
              ))}
              <button
                onClick={() => setIsKeyboardShortcutsOpen(false)}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Preferences;