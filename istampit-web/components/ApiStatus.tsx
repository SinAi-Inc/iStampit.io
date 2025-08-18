/**
 * API Status Indicator Component
 * Shows current API configuration and health status
 */
"use client";
import React, { useState, useEffect } from 'react';
import { healthz, getApiBase, isExternalApi } from '../lib/apiClient';

interface ApiStatusProps {
  className?: string;
  showDetails?: boolean;
}

interface ApiHealth {
  ok?: boolean;
  cli_available?: boolean;
  cli_version?: string;
  redis?: string;
  memoryLimiter?: string;
}

export default function ApiStatus({ className = '', showDetails = true }: ApiStatusProps) {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const apiBase = getApiBase();
  const isExternal = isExternalApi();

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await healthz();
      setHealth(result);
      setLastChecked(new Date());
    } catch (err: any) {
      setError(err.message || 'Health check failed');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (loading) return '⏳';
    if (error) return '�';
    if (health?.ok && health?.cli_available) return '🟢';
    if (health?.ok) return '🟡';
    return '�';
  };

  const getStatusText = () => {
    if (loading) return 'Checking...';
    if (error) return 'Warning';
    if (health?.ok && health?.cli_available) return 'Operational';
    if (health?.ok) return 'Limited';
    return 'Warning';
  };

  const getApiTypeText = () => {
    if (isExternal) {
      return `External API: ${apiBase}`;
    }
    return 'Local API';
  };

  if (!showDetails) {
    return (
      <div className={`inline-flex items-center gap-1 text-sm ${className}`}>
        <span>{getStatusIcon()}</span>
        <span className="text-gray-600 dark:text-gray-300">API {getStatusText()}</span>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            API Status: {getStatusText()}
          </span>
        </div>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <div>
          <strong>Endpoint:</strong> {getApiTypeText()}
        </div>

        {health && (
          <>
            {health.cli_version && (
              <div>
                <strong>CLI:</strong> {health.cli_version}
              </div>
            )}
            {health.redis && (
              <div>
                <strong>Redis:</strong> {health.redis}
              </div>
            )}
          </>
        )}

        {error && (
          <div className="text-red-600 text-xs mt-1">
            Error: {error}
          </div>
        )}

        {lastChecked && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
      </div>

      {isExternal && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <strong>External API Mode:</strong> Using production stamping service at {apiBase}
        </div>
      )}
    </div>
  );
}
