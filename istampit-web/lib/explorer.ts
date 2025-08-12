/**
 * Explorer links configuration and management system
 * Provides configurable Bitcoin explorer links with fallback options
 */

export interface ExplorerConfig {
  name: string;
  baseUrl: string;
  txPath: string;
  addressPath: string;
  blockPath: string;
  description: string;
  enabled: boolean;
}

export const EXPLORER_CONFIGS: Record<string, ExplorerConfig> = {
  mempool: {
    name: 'Mempool.space',
    baseUrl: 'https://mempool.space',
    txPath: '/tx/',
    addressPath: '/address/',
    blockPath: '/block/',
    description: 'Popular Bitcoin explorer with detailed fee and mempool data',
    enabled: true
  },
  blockstream: {
    name: 'Blockstream',
    baseUrl: 'https://blockstream.info',
    txPath: '/tx/',
    addressPath: '/address/',
    blockPath: '/block/',
    description: 'Reliable Bitcoin explorer by Blockstream',
    enabled: true
  },
  blockchaininfo: {
    name: 'Blockchain.info',
    baseUrl: 'https://www.blockchain.com/btc',
    txPath: '/tx/',
    addressPath: '/address/',
    blockPath: '/block/',
    description: 'Classic Bitcoin explorer',
    enabled: false
  },
  btccom: {
    name: 'BTC.com',
    baseUrl: 'https://btc.com',
    txPath: '/',
    addressPath: '/',
    blockPath: '/block/',
    description: 'Mining pool explorer with detailed stats',
    enabled: false
  }
};

export class ExplorerManager {
  private static readonly STORAGE_KEY = 'istampit_explorer_config';

  /**
   * Get current explorer configuration from localStorage
   */
  static getConfig(): Record<string, ExplorerConfig> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure new explorers are included
        return { ...EXPLORER_CONFIGS, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load explorer config:', error);
    }
    return EXPLORER_CONFIGS;
  }

  /**
   * Save explorer configuration to localStorage
   */
  static saveConfig(config: Record<string, ExplorerConfig>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save explorer config:', error);
    }
  }

  /**
   * Get primary (first enabled) explorer
   */
  static getPrimaryExplorer(): ExplorerConfig {
    const configs = this.getConfig();
    const enabled = Object.values(configs).filter(config => config.enabled);
    return enabled[0] || EXPLORER_CONFIGS.mempool;
  }

  /**
   * Get all enabled explorers
   */
  static getEnabledExplorers(): ExplorerConfig[] {
    const configs = this.getConfig();
    return Object.values(configs).filter(config => config.enabled);
  }

  /**
   * Generate transaction URL for primary explorer
   */
  static getTxUrl(txid: string): string {
    const explorer = this.getPrimaryExplorer();
    return `${explorer.baseUrl}${explorer.txPath}${txid}`;
  }

  /**
   * Generate transaction URLs for all enabled explorers
   */
  static getAllTxUrls(txid: string): Array<{ name: string; url: string }> {
    return this.getEnabledExplorers().map(explorer => ({
      name: explorer.name,
      url: `${explorer.baseUrl}${explorer.txPath}${txid}`
    }));
  }

  /**
   * Generate address URL for primary explorer
   */
  static getAddressUrl(address: string): string {
    const explorer = this.getPrimaryExplorer();
    return `${explorer.baseUrl}${explorer.addressPath}${address}`;
  }

  /**
   * Generate block URL for primary explorer
   */
  static getBlockUrl(blockHash: string): string {
    const explorer = this.getPrimaryExplorer();
    return `${explorer.baseUrl}${explorer.blockPath}${blockHash}`;
  }

  /**
   * Enable an explorer
   */
  static enableExplorer(explorerId: string): void {
    const configs = this.getConfig();
    if (configs[explorerId]) {
      configs[explorerId].enabled = true;
      this.saveConfig(configs);
    }
  }

  /**
   * Disable an explorer
   */
  static disableExplorer(explorerId: string): void {
    const configs = this.getConfig();
    if (configs[explorerId]) {
      configs[explorerId].enabled = false;
      this.saveConfig(configs);
    }
  }

  /**
   * Reorder explorers (for priority)
   */
  static reorderExplorers(orderedIds: string[]): void {
    const configs = this.getConfig();
    const reordered: Record<string, ExplorerConfig> = {};

    // Add in specified order
    orderedIds.forEach(id => {
      if (configs[id]) {
        reordered[id] = configs[id];
      }
    });

    // Add any remaining explorers
    Object.keys(configs).forEach(id => {
      if (!reordered[id]) {
        reordered[id] = configs[id];
      }
    });

    this.saveConfig(reordered);
  }

  /**
   * Reset to default configuration
   */
  static resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Add custom explorer
   */
  static addCustomExplorer(id: string, config: Omit<ExplorerConfig, 'enabled'>): void {
    const configs = this.getConfig();
    configs[id] = { ...config, enabled: true };
    this.saveConfig(configs);
  }

  /**
   * Remove custom explorer
   */
  static removeExplorer(explorerId: string): void {
    // Only allow removal of custom explorers (not built-in ones)
    if (!EXPLORER_CONFIGS[explorerId]) {
      const configs = this.getConfig();
      delete configs[explorerId];
      this.saveConfig(configs);
    }
  }

  /**
   * Validate explorer URL format
   */
  static validateExplorerUrl(baseUrl: string, txPath: string, testTxid: string = '000'): Promise<boolean> {
    return new Promise((resolve) => {
      const testUrl = `${baseUrl}${txPath}${testTxid}`;

      // Create a temporary image to test if URL responds
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve(false);
      }, 5000);

      img.onload = img.onerror = () => {
        clearTimeout(timeout);
        resolve(true); // Even 404 is a valid response
      };

      img.src = testUrl;
    });
  }

  /**
   * Get explorer configuration for UI display
   */
  static getExplorerStats(): {
    total: number;
    enabled: number;
    primary: string;
    available: Array<{ id: string; name: string; enabled: boolean }>;
  } {
    const configs = this.getConfig();
    const total = Object.keys(configs).length;
    const enabled = Object.values(configs).filter(c => c.enabled).length;
    const primary = this.getPrimaryExplorer().name;

    const available = Object.entries(configs).map(([id, config]) => ({
      id,
      name: config.name,
      enabled: config.enabled
    }));

    return { total, enabled, primary, available };
  }
}

/**
 * React hook for explorer configuration
 */
export const useExplorerConfig = () => {
  const [config, setConfig] = useState<Record<string, ExplorerConfig>>({});

  useEffect(() => {
    setConfig(ExplorerManager.getConfig());
  }, []);

  const updateConfig = (newConfig: Record<string, ExplorerConfig>) => {
    ExplorerManager.saveConfig(newConfig);
    setConfig(newConfig);
  };

  const toggleExplorer = (explorerId: string) => {
    const current = ExplorerManager.getConfig();
    current[explorerId].enabled = !current[explorerId].enabled;
    updateConfig(current);
  };

  return {
    config,
    updateConfig,
    toggleExplorer,
    getPrimaryExplorer: ExplorerManager.getPrimaryExplorer,
    getTxUrl: ExplorerManager.getTxUrl,
    getAllTxUrls: ExplorerManager.getAllTxUrls,
    getStats: ExplorerManager.getExplorerStats
  };
};

// React imports need to be at top level for hooks
import { useState, useEffect } from 'react';
