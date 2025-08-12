'use client';

import { useState, useEffect } from 'react';
import { monitoring, HealthMetrics } from '../lib/monitoring';
import BackupManager from './BackupManager';
import ExplorerConfig from './ExplorerConfig';

interface AlertItem {
  timestamp: number;
  active: boolean;
  message: string;
  [key: string]: any;
}

type DashboardTab = 'status' | 'backup' | 'explorer';

export default function MonitoringDashboard() {
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'degraded' | 'critical'>('healthy');
  const [alerts, setAlerts] = useState<Record<string, AlertItem>>({});
  const [metrics, setMetrics] = useState<HealthMetrics[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('status');

  useEffect(() => {
    const updateStatus = () => {
      setHealthStatus(monitoring.getHealthStatus());
      setAlerts(monitoring.getStoredAlerts());
      setMetrics(monitoring.getRecentMetrics(5));
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    healthy: 'bg-green-100 text-green-800 border-green-200',
    degraded: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIcon = {
    healthy: '✅',
    degraded: '⚠️',
    critical: '🚨'
  };

  const activeAlerts = Object.entries(alerts).filter(([_, alert]) => alert.active);
  const latestMetrics = metrics[metrics.length - 1];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Compact Status Indicator */}
      <div
        className={`border rounded-lg p-3 cursor-pointer shadow-lg transition-all duration-200 ${statusColors[healthStatus]}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{statusIcon[healthStatus]}</span>
          <span className="font-medium">
            System {healthStatus}
          </span>
          {activeAlerts.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {activeAlerts.length}
            </span>
          )}
          <span className="text-sm opacity-75">
            {isExpanded ? '▼' : '▲'}
          </span>
        </div>
      </div>

      {/* Expanded Dashboard */}
      {isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 w-96 bg-white border rounded-lg shadow-xl p-4">
          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab('status')}
              className={`px-3 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'status'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              System Status
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-3 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'backup'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Backup
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'explorer'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Explorers
            </button>
          </div>

          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* System Status */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">System Status</h3>
                <div className={`p-3 rounded border ${statusColors[healthStatus]}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {statusIcon[healthStatus]} {healthStatus.toUpperCase()}
                    </span>
                    <span className="text-sm opacity-75">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Alerts */}
              {activeAlerts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Active Alerts</h3>
                  <div className="space-y-2">
                    {activeAlerts.map(([alertType, alert]) => (
                      <div key={alertType} className="bg-red-50 border border-red-200 rounded p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-red-800">
                            {alertType.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-red-600">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Metrics */}
              {latestMetrics && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Latest Metrics</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <div className="font-medium text-blue-800">Actions</div>
                      <div className="text-blue-700">
                        Pending: {latestMetrics.actions.pending}
                      </div>
                      <div className="text-blue-700">
                        Total: {latestMetrics.actions.total}
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <div className="font-medium text-green-800">Receipts</div>
                      <div className="text-green-700">
                        Total: {latestMetrics.receipts.total}
                      </div>
                      <div className="text-green-700">
                        Upgrades: {latestMetrics.receipts.upgradesPending}
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded p-2">
                      <div className="font-medium text-purple-800">Performance</div>
                      <div className="text-purple-700">
                        Response: {latestMetrics.system.apiResponseTime}ms
                      </div>
                      <div className="text-purple-700">
                        Error Rate: {(latestMetrics.system.errorRate * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded p-2">
                      <div className="font-medium text-orange-800">Receipt Health</div>
                      <div className="text-orange-700">
                        Avg Confirm: {Math.round(latestMetrics.receipts.averageConfirmationTime)}s
                      </div>
                      <div className="text-orange-700">
                        Drift: {latestMetrics.receipts.driftDetected ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const report = monitoring.generateHealthReport();
                      console.log('Health Report:', report);
                      navigator.clipboard?.writeText(JSON.stringify(report, null, 2));
                    }}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border"
                  >
                    Export Report
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('istampit_alerts');
                      setAlerts({});
                    }}
                    className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded border text-red-700"
                  >
                    Clear Alerts
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <BackupManager />
          )}

          {activeTab === 'explorer' && (
            <ExplorerConfig />
          )}
        </div>
      )}
    </div>
  );
}
