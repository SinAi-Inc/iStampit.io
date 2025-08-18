'use client';

import { useState, useEffect } from 'react';
import { BackupSystem } from '../lib/backup';

export default function BackupManager() {
  const [backupStatus, setBackupStatus] = useState<{
    hasEmergencyBackup: boolean;
    lastBackupAge: number | null;
    recommendations: string[];
  }>({ hasEmergencyBackup: false, lastBackupAge: null, recommendations: [] });

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    updateBackupStatus();
  }, []);

  const updateBackupStatus = () => {
    setBackupStatus(BackupSystem.getBackupStatus());
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      await BackupSystem.createEmergencyBackup();
      updateBackupStatus();
      alert('Emergency backup created successfully');
    } catch (error) {
      console.error('Backup creation failed:', error);
      alert('Failed to create backup');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      await BackupSystem.exportBackup();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export backup');
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const success = await BackupSystem.importBackup(file);
      if (success) {
        updateBackupStatus();
        alert('Backup imported successfully');
        // Reload page to apply restored data
        window.location.reload();
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import backup');
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleEmergencyRestore = () => {
    const confirmed = confirm(
      'This will restore data from the emergency backup. Current data will be lost. Continue?'
    );

    if (confirmed) {
      const success = BackupSystem.restoreEmergencyBackup();
      if (success) {
        alert('Emergency backup restored successfully');
        window.location.reload();
      } else {
        alert('Failed to restore emergency backup');
      }
    }
  };

  const formatAge = (ageMs: number | null): string => {
    if (!ageMs) return 'Unknown';

    const hours = Math.floor(ageMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    return 'Less than 1 hour ago';
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Backup Management</h3>

      {/* Status Overview */}
      <div className="grid grid-cols-1 gap-3">
        <div className={`p-3 rounded border ${
          backupStatus.hasEmergencyBackup
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {backupStatus.hasEmergencyBackup ? '✅' : '❌'} Emergency Backup
            </span>
            <span className="text-sm opacity-75">
              {backupStatus.hasEmergencyBackup
                ? formatAge(backupStatus.lastBackupAge)
                : 'Not available'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {backupStatus.recommendations.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <div className="font-medium text-yellow-800 mb-1">Recommendations:</div>
          <ul className="text-sm text-yellow-700 space-y-1">
            {backupStatus.recommendations.map((rec, index) => (
              <li key={index}>• {rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Backup Actions */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded text-sm font-medium"
          >
            {isCreatingBackup ? 'Creating...' : 'Create Emergency Backup'}
          </button>

          <button
            onClick={handleExportBackup}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium"
          >
            Export Backup
          </button>
        </div>

        <div className="flex gap-2">
          <label className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium cursor-pointer text-center">
            {isImporting ? 'Importing...' : 'Import Backup'}
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              disabled={isImporting}
              className="hidden"
            />
          </label>

          {backupStatus.hasEmergencyBackup && (
            <button
              onClick={handleEmergencyRestore}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium"
            >
              Emergency Restore
            </button>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
        <p>• Emergency backups are stored locally and created automatically</p>
        <p>• Export backups to download a file for external storage</p>
        <p>• Import backups to restore from previously exported files</p>
        <p>• Emergency restore uses the most recent local backup</p>
      </div>
    </div>
  );
}
