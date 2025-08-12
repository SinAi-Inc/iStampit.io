'use client';

import { useState, useEffect } from 'react';
import { ExplorerManager, type ExplorerConfig as ExplorerConfigType } from '../lib/explorer';

export default function ExplorerConfig() {
  const [configs, setConfigs] = useState<Record<string, ExplorerConfigType>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [newExplorer, setNewExplorer] = useState({
    id: '',
    name: '',
    baseUrl: '',
    txPath: '/tx/',
    addressPath: '/address/',
    blockPath: '/block/',
    description: ''
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = () => {
    setConfigs(ExplorerManager.getConfig());
  };

  const toggleExplorer = (explorerId: string) => {
    const updatedConfigs = { ...configs };
    updatedConfigs[explorerId].enabled = !updatedConfigs[explorerId].enabled;
    ExplorerManager.saveConfig(updatedConfigs);
    setConfigs(updatedConfigs);
  };

  const moveExplorerUp = (explorerId: string) => {
    const keys = Object.keys(configs);
    const currentIndex = keys.indexOf(explorerId);
    if (currentIndex > 0) {
      const newKeys = [...keys];
      [newKeys[currentIndex - 1], newKeys[currentIndex]] = [newKeys[currentIndex], newKeys[currentIndex - 1]];
      ExplorerManager.reorderExplorers(newKeys);
      loadConfigs();
    }
  };

  const addCustomExplorer = () => {
    if (!newExplorer.id || !newExplorer.name || !newExplorer.baseUrl) {
      alert('Please fill in all required fields');
      return;
    }

    ExplorerManager.addCustomExplorer(newExplorer.id, {
      name: newExplorer.name,
      baseUrl: newExplorer.baseUrl,
      txPath: newExplorer.txPath,
      addressPath: newExplorer.addressPath,
      blockPath: newExplorer.blockPath,
      description: newExplorer.description
    });

    setNewExplorer({
      id: '',
      name: '',
      baseUrl: '',
      txPath: '/tx/',
      addressPath: '/address/',
      blockPath: '/block/',
      description: ''
    });
    setIsEditing(false);
    loadConfigs();
  };

  const resetToDefaults = () => {
    if (confirm('Reset to default explorer configuration? This will remove any custom explorers.')) {
      ExplorerManager.resetToDefaults();
      loadConfigs();
    }
  };

  const stats = ExplorerManager.getExplorerStats();

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Explorer Configuration</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
          <div className="font-medium text-blue-800">{stats.enabled}</div>
          <div className="text-blue-700">Enabled</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
          <div className="font-medium text-green-800">{stats.total}</div>
          <div className="text-green-700">Total</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded p-2 text-center">
          <div className="font-medium text-purple-800 truncate">{stats.primary}</div>
          <div className="text-purple-700">Primary</div>
        </div>
      </div>

      {/* Explorer List */}
      <div className="space-y-2">
        {Object.entries(configs).map(([id, config], index) => (
          <div
            key={id}
            className={`border rounded p-3 ${
              config.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <button
                    onClick={() => moveExplorerUp(id)}
                    disabled={index === 0 || !isEditing}
                    className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    title="Move up"
                  >
                    ▲
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{config.name}</span>
                    {index === 0 && config.enabled && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{config.description}</div>
                  <div className="text-xs text-gray-500 font-mono">{config.baseUrl}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    onClick={() => toggleExplorer(id)}
                    className={`text-sm px-3 py-1 rounded ${
                      config.enabled
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {config.enabled ? 'Disable' : 'Enable'}
                  </button>
                )}

                <div className={`w-3 h-3 rounded-full ${
                  config.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Explorer */}
      {isEditing && (
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium text-gray-800">Add Custom Explorer</h4>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <input
              type="text"
              placeholder="ID (e.g., custom-explorer)"
              value={newExplorer.id}
              onChange={(e) => setNewExplorer({ ...newExplorer, id: e.target.value })}
              className="border rounded px-2 py-1"
            />
            <input
              type="text"
              placeholder="Name (e.g., Custom Explorer)"
              value={newExplorer.name}
              onChange={(e) => setNewExplorer({ ...newExplorer, name: e.target.value })}
              className="border rounded px-2 py-1"
            />
            <input
              type="text"
              placeholder="Base URL (e.g., https://example.com)"
              value={newExplorer.baseUrl}
              onChange={(e) => setNewExplorer({ ...newExplorer, baseUrl: e.target.value })}
              className="border rounded px-2 py-1 col-span-2"
            />
            <input
              type="text"
              placeholder="Transaction path (e.g., /tx/)"
              value={newExplorer.txPath}
              onChange={(e) => setNewExplorer({ ...newExplorer, txPath: e.target.value })}
              className="border rounded px-2 py-1"
            />
            <input
              type="text"
              placeholder="Block path (e.g., /block/)"
              value={newExplorer.blockPath}
              onChange={(e) => setNewExplorer({ ...newExplorer, blockPath: e.target.value })}
              className="border rounded px-2 py-1"
            />
            <input
              type="text"
              placeholder="Description"
              value={newExplorer.description}
              onChange={(e) => setNewExplorer({ ...newExplorer, description: e.target.value })}
              className="border rounded px-2 py-1 col-span-2"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={addCustomExplorer}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Add Explorer
            </button>
            <button
              onClick={resetToDefaults}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Reset Defaults
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>• Primary explorer is used for main links, others appear as alternatives</p>
        <p>• Use the arrows to reorder explorers to change priority</p>
        <p>• Custom explorers can be added for specialized blockchain explorers</p>
      </div>
    </div>
  );
}
