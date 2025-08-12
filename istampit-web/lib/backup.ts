/**
 * Backup and data resilience system for iStampit.io
 * Handles local data backup, export capabilities, and recovery procedures
 */

export interface BackupManifest {
  version: string;
  timestamp: number;
  dataTypes: string[];
  size: number;
  checksum: string;
}

export interface BackupData {
  analytics: any;
  userState: any;
  receipts: any;
  alerts: any;
  metadata: BackupManifest;
}

export class BackupSystem {
  private static readonly BACKUP_VERSION = '1.0.0';
  private static readonly MAX_BACKUP_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  /**
   * Create a complete backup of all local data
   */
  static async createBackup(): Promise<BackupData> {
    if (typeof window === 'undefined') {
      // Return empty backup during SSR
      return {
        analytics: {},
        userState: {},
        receipts: {},
        alerts: {},
        metadata: {
          version: this.BACKUP_VERSION,
          timestamp: Date.now(),
          dataTypes: [],
          size: 0,
          checksum: ''
        }
      };
    }
    
    const timestamp = Date.now();
    
    // Collect all local data
    const analytics = this.getLocalStorageData('istampit_analytics') || {};
    const userState = this.getLocalStorageData('istampit_user_state') || {};
    const receipts = this.getLocalStorageData('istampit_receipts') || {};
    const alerts = this.getLocalStorageData('istampit_alerts') || {};    const data = {
      analytics,
      userState,
      receipts,
      alerts
    };

    // Calculate size and checksum
    const dataString = JSON.stringify(data);
    const size = new Blob([dataString]).size;
    const checksum = await this.calculateChecksum(dataString);

    const manifest: BackupManifest = {
      version: this.BACKUP_VERSION,
      timestamp,
      dataTypes: Object.keys(data).filter(key => Object.keys(data[key as keyof typeof data]).length > 0),
      size,
      checksum
    };

    return {
      ...data,
      metadata: manifest
    };
  }

  /**
   * Export backup data as downloadable file
   */
  static async exportBackup(): Promise<void> {
    try {
      const backupData = await this.createBackup();
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `istampit-backup-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Backup exported successfully');
    } catch (error) {
      console.error('Failed to export backup:', error);
      throw new Error('Backup export failed');
    }
  }

  /**
   * Import and restore backup data
   */
  static async importBackup(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);

      // Validate backup integrity
      if (!await this.validateBackup(backupData)) {
        throw new Error('Backup validation failed');
      }

      // Confirm with user before restoring
      const confirmed = confirm(
        `This will restore data from ${new Date(backupData.metadata.timestamp).toLocaleString()}. ` +
        'Current data will be backed up first. Continue?'
      );

      if (!confirmed) {
        return false;
      }

      // Create backup of current data first
      await this.createEmergencyBackup();

      // Restore data
      Object.entries(backupData).forEach(([key, value]) => {
        if (key !== 'metadata' && value && typeof value === 'object') {
          const storageKey = `istampit_${key}`;
          localStorage.setItem(storageKey, JSON.stringify(value));
        }
      });

      console.log('Backup restored successfully');
      return true;
    } catch (error) {
      console.error('Failed to import backup:', error);
      throw new Error('Backup import failed');
    }
  }

  /**
   * Validate backup data integrity
   */
  static async validateBackup(backupData: BackupData): Promise<boolean> {
    try {
      // Check required fields
      if (!backupData.metadata || !backupData.metadata.version || !backupData.metadata.checksum) {
        console.error('Invalid backup: missing metadata');
        return false;
      }

      // Check version compatibility
      if (backupData.metadata.version !== this.BACKUP_VERSION) {
        console.warn('Backup version mismatch:', backupData.metadata.version);
        // For now, continue - in production, implement migration logic
      }

      // Verify checksum
      const dataWithoutMetadata = {
        analytics: backupData.analytics,
        userState: backupData.userState,
        receipts: backupData.receipts,
        alerts: backupData.alerts
      };
      const dataString = JSON.stringify(dataWithoutMetadata);
      const calculatedChecksum = await this.calculateChecksum(dataString);

      if (calculatedChecksum !== backupData.metadata.checksum) {
        console.error('Backup checksum mismatch');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Backup validation error:', error);
      return false;
    }
  }

  /**
   * Create emergency backup in localStorage
   */
  static async createEmergencyBackup(): Promise<void> {
    try {
      const backupData = await this.createBackup();
      localStorage.setItem('istampit_emergency_backup', JSON.stringify(backupData));
      console.log('Emergency backup created');
    } catch (error) {
      console.error('Failed to create emergency backup:', error);
    }
  }

  /**
   * Restore from emergency backup
   */
  static restoreEmergencyBackup(): boolean {
    try {
      const backupString = localStorage.getItem('istampit_emergency_backup');
      if (!backupString) {
        console.error('No emergency backup found');
        return false;
      }

      const backupData: BackupData = JSON.parse(backupString);

      Object.entries(backupData).forEach(([key, value]) => {
        if (key !== 'metadata' && value && typeof value === 'object') {
          const storageKey = `istampit_${key}`;
          localStorage.setItem(storageKey, JSON.stringify(value));
        }
      });

      console.log('Emergency backup restored');
      return true;
    } catch (error) {
      console.error('Failed to restore emergency backup:', error);
      return false;
    }
  }

  /**
   * Clean up old backup data
   */
  static cleanupOldBackups(): void {
    try {
      const keys = Object.keys(localStorage);
      const backupKeys = keys.filter(key => key.startsWith('istampit_backup_'));
      const now = Date.now();

      backupKeys.forEach(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.metadata && data.metadata.timestamp) {
            const age = now - data.metadata.timestamp;
            if (age > this.MAX_BACKUP_AGE) {
              localStorage.removeItem(key);
              console.log('Removed old backup:', key);
            }
          }
        } catch (error) {
          // Remove corrupted backup data
          localStorage.removeItem(key);
          console.log('Removed corrupted backup:', key);
        }
      });
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  /**
   * Get data from localStorage safely
   */
  private static getLocalStorageData(key: string): any {
    if (typeof window === 'undefined') return {}; // Skip during SSR
    
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Calculate SHA-256 checksum for data integrity
   */
  private static async calculateChecksum(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Checksum calculation failed:', error);
      // Fallback to simple hash
      return btoa(data).slice(0, 32);
    }
  }

  /**
   * Get backup status and recommendations
   */
  static getBackupStatus(): {
    hasEmergencyBackup: boolean;
    lastBackupAge: number | null;
    recommendations: string[];
  } {
    if (typeof window === 'undefined') {
      return {
        hasEmergencyBackup: false,
        lastBackupAge: null,
        recommendations: ['Cannot access backup status during server-side rendering']
      };
    }
    
    const hasEmergencyBackup = !!localStorage.getItem('istampit_emergency_backup');

    let lastBackupAge = null;
    try {
      const emergencyBackup = localStorage.getItem('istampit_emergency_backup');
      if (emergencyBackup) {
        const data = JSON.parse(emergencyBackup);
        lastBackupAge = Date.now() - (data.metadata?.timestamp || 0);
      }
    } catch (error) {
      console.error('Error reading backup status:', error);
    }

    const recommendations = [];
    if (!hasEmergencyBackup) {
      recommendations.push('Create an emergency backup');
    }
    if (lastBackupAge && lastBackupAge > 24 * 60 * 60 * 1000) {
      recommendations.push('Backup is over 24 hours old');
    }

    return {
      hasEmergencyBackup,
      lastBackupAge,
      recommendations
    };
  }
}

// Auto-cleanup old backups on load
if (typeof window !== 'undefined') {
  BackupSystem.cleanupOldBackups();
}
