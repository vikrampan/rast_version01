import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  FilePlus, 
  Copy, 
  Edit2, 
  Trash2,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface LegendItem {
  id: string;
  symbol: string;
  description: string;
  type: 'MACRO' | 'COUNTER';
}

export const Legends = () => {
  const [legends, setLegends] = useState<LegendItem[]>([
    { id: '1', symbol: '●', description: 'Tube Count', type: 'MACRO' },
    { id: '2', symbol: '○', description: 'Number inspected', type: 'MACRO' },
    { id: '3', symbol: '○', description: 'NOK', type: 'COUNTER' },
    { id: '4', symbol: '○', description: '0-15.9%', type: 'COUNTER' },
    { id: '5', symbol: '○', description: '20-29.9%', type: 'COUNTER' }
  ]);

  const [editingLegend, setEditingLegend] = useState<LegendItem | null>(null);
  const [isNewLegendModalOpen, setIsNewLegendModalOpen] = useState(false);
  const [newLegend, setNewLegend] = useState<Partial<LegendItem>>({
    symbol: '',
    description: '',
    type: 'COUNTER'
  });

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
            const importedLegends = JSON.parse(e.target?.result as string);
            setLegends(importedLegends);
          } catch (error) {
            alert('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(legends, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'legends.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNew = () => {
    setIsNewLegendModalOpen(true);
    setNewLegend({
      symbol: '',
      description: '',
      type: 'COUNTER'
    });
  };

  const handleSaveNew = () => {
    if (newLegend.symbol && newLegend.description) {
      setLegends([...legends, {
        id: Date.now().toString(),
        symbol: newLegend.symbol,
        description: newLegend.description,
        type: newLegend.type as 'MACRO' | 'COUNTER'
      }]);
      setIsNewLegendModalOpen(false);
      setNewLegend({ symbol: '', description: '', type: 'COUNTER' });
    }
  };

  const handleDuplicate = (legend: LegendItem) => {
    const newLegendItem = {
      ...legend,
      id: Date.now().toString(),
      description: `${legend.description} (Copy)`
    };
    setLegends([...legends, newLegendItem]);
  };

  const handleEdit = (legend: LegendItem) => {
    setEditingLegend(legend);
  };

  const handleSaveEdit = () => {
    if (editingLegend) {
      setLegends(legends.map(l => 
        l.id === editingLegend.id ? editingLegend : l
      ));
      setEditingLegend(null);
    }
  };

  const handleRemove = (id: string) => {
    setLegends(legends.filter(legend => legend.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newLegends = [...legends];
      [newLegends[index], newLegends[index - 1]] = [newLegends[index - 1], newLegends[index]];
      setLegends(newLegends);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < legends.length - 1) {
      const newLegends = [...legends];
      [newLegends[index], newLegends[index + 1]] = [newLegends[index + 1], newLegends[index]];
      setLegends(newLegends);
    }
  };

  return (
    <Card className="w-full bg-black border-zinc-800">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-4 border-b border-zinc-800">
        <button 
          onClick={handleImport}
          className="flex flex-col items-center p-2 hover:bg-zinc-800 rounded-lg transition-colors duration-200 text-zinc-400"
        >
          <Upload className="w-5 h-5" />
          <span className="text-xs mt-1">Import</span>
        </button>
        <button 
          onClick={handleExport}
          className="flex flex-col items-center p-2 hover:bg-zinc-800 rounded-lg transition-colors duration-200 text-zinc-400"
        >
          <Download className="w-5 h-5" />
          <span className="text-xs mt-1">Export</span>
        </button>
        <button 
          onClick={handleNew}
          className="flex flex-col items-center p-2 hover:bg-zinc-800 rounded-lg transition-colors duration-200 text-zinc-400"
        >
          <FilePlus className="w-5 h-5" />
          <span className="text-xs mt-1">New</span>
        </button>
      </div>

      {/* Legends Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-zinc-200 border-b border-zinc-800">
              <th className="p-4 font-medium w-12">Symbol</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {legends.map((legend, index) => (
              <tr key={legend.id} className="border-b border-zinc-800 text-zinc-400">
                <td className="p-4">
                  {editingLegend?.id === legend.id ? (
                    <input
                      type="text"
                      value={editingLegend.symbol}
                      onChange={(e) => setEditingLegend({...editingLegend, symbol: e.target.value})}
                      className="bg-zinc-900 text-zinc-200 p-2 rounded w-16 border border-zinc-700 focus:outline-none focus:border-zinc-500"
                    />
                  ) : (
                    <span className="text-xl">{legend.symbol}</span>
                  )}
                </td>
                <td className="p-4">
                  {editingLegend?.id === legend.id ? (
                    <input
                      type="text"
                      value={editingLegend.description}
                      onChange={(e) => setEditingLegend({...editingLegend, description: e.target.value})}
                      className="bg-zinc-900 text-zinc-200 p-2 rounded w-full border border-zinc-700 focus:outline-none focus:border-zinc-500"
                    />
                  ) : (
                    legend.description
                  )}
                </td>
                <td className="p-4">
                  {editingLegend?.id === legend.id ? (
                    <select
                      value={editingLegend.type}
                      onChange={(e) => setEditingLegend({...editingLegend, type: e.target.value as 'MACRO' | 'COUNTER'})}
                      className="bg-zinc-900 text-zinc-200 p-2 rounded border border-zinc-700 focus:outline-none focus:border-zinc-500"
                    >
                      <option value="MACRO">MACRO</option>
                      <option value="COUNTER">COUNTER</option>
                    </select>
                  ) : (
                    legend.type
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleMoveUp(index)}
                      className="p-1 hover:bg-zinc-800 rounded transition-colors"
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleMoveDown(index)}
                      className="p-1 hover:bg-zinc-800 rounded transition-colors"
                      disabled={index === legends.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {editingLegend?.id === legend.id ? (
                      <button 
                        onClick={handleSaveEdit}
                        className="p-1 hover:bg-zinc-800 rounded transition-colors text-emerald-500"
                      >
                        Save
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleEdit(legend)}
                        className="p-1 hover:bg-zinc-800 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDuplicate(legend)}
                      className="p-1 hover:bg-zinc-800 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleRemove(legend.id)}
                      className="p-1 hover:bg-zinc-800 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Legend Modal */}
      {isNewLegendModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl w-96 border border-zinc-800">
            <h2 className="text-xl text-zinc-200 mb-4">New Legend</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-1">Symbol</label>
                <input
                  type="text"
                  value={newLegend.symbol}
                  onChange={(e) => setNewLegend({...newLegend, symbol: e.target.value})}
                  className="w-full bg-zinc-800 text-zinc-200 p-2 rounded border border-zinc-700 focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <input
                  type="text"
                  value={newLegend.description}
                  onChange={(e) => setNewLegend({...newLegend, description: e.target.value})}
                  className="w-full bg-zinc-800 text-zinc-200 p-2 rounded border border-zinc-700 focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Type</label>
                <select
                  value={newLegend.type}
                  onChange={(e) => setNewLegend({...newLegend, type: e.target.value as 'MACRO' | 'COUNTER'})}
                  className="w-full bg-zinc-800 text-zinc-200 p-2 rounded border border-zinc-700 focus:outline-none focus:border-zinc-500"
                >
                  <option value="MACRO">MACRO</option>
                  <option value="COUNTER">COUNTER</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsNewLegendModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:bg-zinc-800 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="p-4 text-sm text-zinc-400 border-t border-zinc-800">
        <p>The Legend Editor tool enables you to assign color codes to the elements in your legend seamlessly from backstage, saving valuable time. Our Analysis Details Table, available in the FrontStage, merges the legend and dataset, providing clear identification of quantities associated with each element to create a detailed and easy-to-interpret defect report.</p>
      </div>
    </Card>
  );
};

export default Legends;