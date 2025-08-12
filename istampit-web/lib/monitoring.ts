/**
 * Production monitoring and alerting system for iStampit.io
 * Handles action alerts, receipt drift monitoring, and operational health
 */

export interface HealthMetrics {
  timestamp: number;
  actions: {
    total: number;
    pending: number;
    confirmed: number;
    failed: number;
  };
  receipts: {
    total: number;
    upgradesPending: number;
    driftDetected: boolean;
    averageConfirmationTime: number;
  };
  system: {
    apiResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

export interface AlertThresholds {
  maxPendingActions: number;
  maxResponseTime: number;
  maxErrorRate: number;
  maxUpgradeDrift: number; // hours
}

export class ProductionMonitoring {
  private alerts: Set<string> = new Set();
  private metrics: HealthMetrics[] = [];
  private thresholds: AlertThresholds;

  constructor(thresholds: AlertThresholds = {
    maxPendingActions: 100,
    maxResponseTime: 5000, // 5 seconds
    maxErrorRate: 0.05, // 5%
    maxUpgradeDrift: 24 // 24 hours
  }) {
    this.thresholds = thresholds;
  }

  /**
   * Record operational metrics for monitoring
   */
  recordMetrics(metrics: HealthMetrics): void {
    this.metrics.push(metrics);

    // Keep only last 1000 entries to prevent memory growth
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    this.checkAlertConditions(metrics);
  }

  /**
   * Check for alert conditions and trigger notifications
   */
  private checkAlertConditions(metrics: HealthMetrics): void {
    const activeAlerts = new Set<string>();

    // Action queue alerts
    if (metrics.actions.pending > this.thresholds.maxPendingActions) {
      activeAlerts.add('high_pending_actions');
      this.triggerAlert('high_pending_actions', {
        count: metrics.actions.pending,
        threshold: this.thresholds.maxPendingActions,
        message: `High number of pending actions: ${metrics.actions.pending}`
      });
    }

    // Performance alerts
    if (metrics.system.apiResponseTime > this.thresholds.maxResponseTime) {
      activeAlerts.add('slow_api_response');
      this.triggerAlert('slow_api_response', {
        responseTime: metrics.system.apiResponseTime,
        threshold: this.thresholds.maxResponseTime,
        message: `Slow API response time: ${metrics.system.apiResponseTime}ms`
      });
    }

    // Error rate alerts
    if (metrics.system.errorRate > this.thresholds.maxErrorRate) {
      activeAlerts.add('high_error_rate');
      this.triggerAlert('high_error_rate', {
        errorRate: metrics.system.errorRate,
        threshold: this.thresholds.maxErrorRate,
        message: `High error rate: ${(metrics.system.errorRate * 100).toFixed(2)}%`
      });
    }

    // Receipt upgrade drift alerts
    if (metrics.receipts.driftDetected) {
      activeAlerts.add('receipt_upgrade_drift');
      this.triggerAlert('receipt_upgrade_drift', {
        pendingUpgrades: metrics.receipts.upgradesPending,
        message: `Receipt upgrade drift detected: ${metrics.receipts.upgradesPending} pending upgrades`
      });
    }

    // Clear resolved alerts
    for (const alert of this.alerts) {
      if (!activeAlerts.has(alert)) {
        this.clearAlert(alert);
      }
    }

    this.alerts = activeAlerts;
  }

  /**
   * Trigger an alert (can be extended for external notifications)
   */
  private triggerAlert(alertType: string, context: any): void {
    console.warn(`[ALERT] ${alertType}:`, context);

    // Store alert for dashboard/UI display
    this.storeAlert(alertType, context);

    // For production: integrate with monitoring services
    // - Send to logging service (e.g., Winston, Pino)
    // - Send webhooks to Slack/Discord
    // - Send emails for critical alerts
    // - Integration with services like DataDog, New Relic, etc.
  }

  /**
   * Clear a resolved alert
   */
  private clearAlert(alertType: string): void {
    console.info(`[RESOLVED] Alert cleared: ${alertType}`);
    this.removeStoredAlert(alertType);
  }

  /**
   * Store alert for dashboard display
   */
  private storeAlert(alertType: string, context: any): void {
    if (typeof window === 'undefined') return; // Skip during SSR

    try {
      const alerts = this.getStoredAlerts();
      alerts[alertType] = {
        ...context,
        timestamp: Date.now(),
        active: true
      };
      localStorage.setItem('istampit_alerts', JSON.stringify(alerts));
    } catch (error) {
      console.error('Failed to store alert:', error);
    }
  }

  /**
   * Remove stored alert
   */
  private removeStoredAlert(alertType: string): void {
    if (typeof window === 'undefined') return; // Skip during SSR

    try {
      const alerts = this.getStoredAlerts();
      delete alerts[alertType];
      localStorage.setItem('istampit_alerts', JSON.stringify(alerts));
    } catch (error) {
      console.error('Failed to remove alert:', error);
    }
  }

  /**
   * Get all stored alerts
   */
  getStoredAlerts(): Record<string, any> {
    if (typeof window === 'undefined') return {}; // Skip during SSR

    try {
      const alerts = localStorage.getItem('istampit_alerts');
      return alerts ? JSON.parse(alerts) : {};
    } catch {
      return {};
    }
  }

  /**
   * Get current system health status
   */
  getHealthStatus(): 'healthy' | 'degraded' | 'critical' {
    if (this.alerts.size === 0) return 'healthy';

    const criticalAlerts = ['high_error_rate', 'receipt_upgrade_drift'];
    const hasCritical = Array.from(this.alerts).some(alert => criticalAlerts.includes(alert));

    return hasCritical ? 'critical' : 'degraded';
  }

  /**
   * Get recent metrics for dashboard
   */
  getRecentMetrics(count: number = 10): HealthMetrics[] {
    return this.metrics.slice(-count);
  }

  /**
   * Generate health report
   */
  generateHealthReport(): {
    status: string;
    activeAlerts: string[];
    metrics: HealthMetrics | null;
    summary: string;
  } {
    const latestMetrics = this.metrics[this.metrics.length - 1] || null;
    const status = this.getHealthStatus();
    const activeAlerts = Array.from(this.alerts);

    let summary = '';
    if (status === 'healthy') {
      summary = 'All systems operational';
    } else if (status === 'degraded') {
      summary = `${activeAlerts.length} active alert(s)`;
    } else {
      summary = `Critical issues detected: ${activeAlerts.join(', ')}`;
    }

    return {
      status,
      activeAlerts,
      metrics: latestMetrics,
      summary
    };
  }
}

// Global monitoring instance
export const monitoring = new ProductionMonitoring();

/**
 * Utility functions for common monitoring tasks
 */
export const trackActionMetrics = (actions: HealthMetrics['actions']) => {
  const metrics: HealthMetrics = {
    timestamp: Date.now(),
    actions,
    receipts: {
      total: 0,
      upgradesPending: 0,
      driftDetected: false,
      averageConfirmationTime: 0
    },
    system: {
      apiResponseTime: 0,
      errorRate: 0,
      uptime: Date.now()
    }
  };

  monitoring.recordMetrics(metrics);
};

export const trackReceiptMetrics = (receipts: HealthMetrics['receipts']) => {
  const metrics: HealthMetrics = {
    timestamp: Date.now(),
    actions: {
      total: 0,
      pending: 0,
      confirmed: 0,
      failed: 0
    },
    receipts,
    system: {
      apiResponseTime: 0,
      errorRate: 0,
      uptime: Date.now()
    }
  };

  monitoring.recordMetrics(metrics);
};

export const trackSystemMetrics = (system: HealthMetrics['system']) => {
  const metrics: HealthMetrics = {
    timestamp: Date.now(),
    actions: {
      total: 0,
      pending: 0,
      confirmed: 0,
      failed: 0
    },
    receipts: {
      total: 0,
      upgradesPending: 0,
      driftDetected: false,
      averageConfirmationTime: 0
    },
    system
  };

  monitoring.recordMetrics(metrics);
};

/**
 * Monitor API response times
 */
export const withResponseTimeTracking = async <T>(
  operation: () => Promise<T>,
  operationName: string = 'api_call'
): Promise<T> => {
  const startTime = Date.now();

  try {
    const result = await operation();
    const responseTime = Date.now() - startTime;

    trackSystemMetrics({
      apiResponseTime: responseTime,
      errorRate: 0,
      uptime: Date.now()
    });

    return result;
  } catch (error) {
    const responseTime = Date.now() - startTime;

    trackSystemMetrics({
      apiResponseTime: responseTime,
      errorRate: 1, // Error occurred
      uptime: Date.now()
    });

    throw error;
  }
};
