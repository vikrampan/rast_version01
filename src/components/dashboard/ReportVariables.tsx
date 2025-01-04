import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Edit2, 
  Trash2,
  Download,
  Upload,
  RotateCcw,
  X,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Variable {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'boolean';
}

interface Section {
  id: string;
  label: string;
  isExpanded?: boolean;
  variables: Variable[];
}

// Custom Modal Component
const Modal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-black border border-zinc-800 text-left shadow-xl transition-all w-full max-w-lg">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h3 className="text-lg font-medium text-zinc-100">{title}</h3>
          </div>
          
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export function ReportVariables() {
  const [sections, setSections] = useState<Section[]>([
    { 
      id: 'client', 
      label: 'Client Information',
      variables: [
        { id: 'client-name', name: 'Client Name', value: 'ACME Corp', type: 'text' },
        { id: 'client-id', name: 'Client ID', value: '12345', type: 'text' }
      ]
    },
    { 
      id: 'report', 
      label: 'Report Information',
      variables: [
        { id: 'report-id', name: 'Report ID', value: 'REP2024-001', type: 'text' },
        { id: 'report-date', name: 'Report Date', value: '2024-03-20', type: 'date' }
      ]
    },
    { 
      id: 'inspection', 
      label: 'Inspection Information',
      variables: []
    },
    { 
      id: 'equipment', 
      label: 'Equipment Information',
      variables: []
    },
    { 
      id: 'tube', 
      label: 'Tube Information',
      variables: []
    },
    { 
      id: 'company', 
      label: 'Inspection Company Information',
      variables: []
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSections, setFilteredSections] = useState<Section[]>(sections);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | null>(null);
  const [newVariable, setNewVariable] = useState<Partial<Variable>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSections(sections);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = sections.map(section => ({
      ...section,
      variables: section.variables.filter(variable => 
        variable.name.toLowerCase().includes(query) ||
        variable.value.toLowerCase().includes(query)
      ),
      isExpanded: true
    })).filter(section => 
      section.label.toLowerCase().includes(query) || section.variables.length > 0
    );

    setFilteredSections(filtered);
  }, [searchQuery, sections]);

  const showNotification = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const toggleSection = (id: string) => {
    setSections(sections.map(section => 
      section.id === id 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const handleAddVariable = (sectionId: string) => {
    setSelectedSection(sectionId);
    setDialogType('add');
    setNewVariable({});
    setShowDialog(true);
  };

  const handleEditVariable = (sectionId: string, variable: Variable) => {
    setSelectedSection(sectionId);
    setDialogType('edit');
    setNewVariable(variable);
    setShowDialog(true);
  };

  const handleSaveVariable = () => {
    if (!selectedSection || !newVariable.name || !newVariable.value) {
      showNotification('Please fill in all required fields');
      return;
    }

    setSections(sections.map(section => {
      if (section.id !== selectedSection) return section;

      const variables = dialogType === 'add' 
        ? [...section.variables, { ...newVariable, id: Date.now().toString() } as Variable]
        : section.variables.map(v => v.id === newVariable.id ? { ...newVariable } as Variable : v);

      return { ...section, variables };
    }));

    setShowDialog(false);
    showNotification(dialogType === 'add' ? 'Variable added successfully' : 'Variable updated successfully');
  };

  const handleDeleteVariable = (sectionId: string, variableId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId
        ? { ...section, variables: section.variables.filter(v => v.id !== variableId) }
        : section
    ));
    showNotification('Variable deleted successfully');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            setSections(importedData);
            showNotification('Variables imported successfully');
          } catch (error) {
            showNotification('Error importing file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const data = JSON.stringify(sections, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report-variables.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Variables exported successfully');
  };

  const handleClear = () => {
    setSections(sections.map(section => ({ ...section, variables: [] })));
    showNotification('All variables cleared');
  };

  const handleReset = () => {
    setSections(sections.map(section => ({ ...section, isExpanded: false })));
    showNotification('Settings reset to default');
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="w-full bg-black border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Report Variables</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
            <button 
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search variables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-700 text-zinc-100 placeholder-zinc-500"
            />
          </div>

          {/* Table Content */}
          <div className="space-y-2">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                className="border border-zinc-800 rounded-lg overflow-hidden"
              >
                <div 
                  className="flex items-center gap-2 p-4 bg-zinc-900 cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <ChevronRight 
                    className={`w-4 h-4 text-zinc-400 transform transition-transform ${
                      section.isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                  <span className="text-zinc-100">{section.label}</span>
                  <span className="text-zinc-500 text-sm">({section.variables.length})</span>
                </div>
                
                {section.isExpanded && (
                  <div className="p-4 bg-black">
                    {section.variables.length === 0 ? (
                      <div className="text-sm text-zinc-500 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        No variables added yet
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {section.variables.map((variable) => (
                          <div
                            key={variable.id}
                            className="grid grid-cols-3 gap-4 items-center p-2 rounded-lg hover:bg-zinc-900"
                          >
                            <div className="text-zinc-100">{variable.name}</div>
                            <div className="text-zinc-400">{variable.value}</div>
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => handleEditVariable(section.id, variable)}
                                className="p-1 hover:bg-zinc-800 rounded transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-zinc-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteVariable(section.id, variable.id)}
                                className="p-1 hover:bg-zinc-800 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-zinc-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => handleAddVariable(section.id)}
                      className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Variable
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Variable Dialog */}
      <Modal
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        title={dialogType === 'add' ? 'Add New Variable' : 'Edit Variable'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-zinc-400 mb-1">Variable Name</label>
            <input
              type="text"
              value={newVariable.name || ''}
              onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-700 text-zinc-100"
              placeholder="Enter variable name"
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 mb-1">Type</label>
                            <select
                value={newVariable.value || 'false'}
                onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-700 text-zinc-100"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : (
              <input
                type={newVariable.type === 'date' ? 'date' : newVariable.type === 'number' ? 'number' : 'text'}
                value={newVariable.value || ''}
                onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-700 text-zinc-100"
                placeholder={`Enter variable value (${newVariable.type})`}
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setShowDialog(false)}
              className="px-4 py-2 bg-zinc-800 text-zinc-100 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveVariable}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {dialogType === 'add' ? 'Add Variable' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Side Action Buttons */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 bg-black p-2 rounded-lg border border-zinc-800 z-10">
        <button 
          className="p-2 bg-zinc-900 text-zinc-400 rounded hover:bg-zinc-800 transition-colors group" 
          title="Move Up"
        >
          <ArrowUp className="w-4 h-4 group-hover:text-blue-500" />
        </button>
        
        <button 
          className="p-2 bg-zinc-900 text-zinc-400 rounded hover:bg-zinc-800 transition-colors group" 
          title="Move Down"
        >
          <ArrowDown className="w-4 h-4 group-hover:text-blue-500" />
        </button>

        <div className="w-full h-px bg-zinc-800 my-1" />
        
        <button 
          className="p-2 bg-zinc-900 text-zinc-400 rounded hover:bg-zinc-800 transition-colors group" 
          title="Edit Section"
        >
          <Edit2 className="w-4 h-4 group-hover:text-blue-500" />
        </button>
        
        <button 
          className="p-2 bg-zinc-900 text-zinc-400 rounded hover:bg-zinc-800 transition-colors group" 
          title="Delete Section"
        >
          <Trash2 className="w-4 h-4 group-hover:text-blue-500" />
        </button>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert variant="default" className="bg-black border-blue-500">
            <AlertDescription className="text-zinc-100">
              {alertMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}

export default ReportVariables;