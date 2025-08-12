// Privacy-first analytics for iStampit
// Only tracks events, no PII or hashes

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number>;
  timestamp: string;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadStoredEvents();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private loadStoredEvents() {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    try {
      const stored = localStorage.getItem('istampit_analytics');
      if (stored) {
        this.events = JSON.parse(stored);
        // Keep only last 100 events to prevent storage bloat
        this.events = this.events.slice(-100);
      }
    } catch (e) {
      console.warn('Failed to load analytics events:', e);
    }
  }

  private saveEvents() {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    try {
      localStorage.setItem('istampit_analytics', JSON.stringify(this.events));
    } catch (e) {
      console.warn('Failed to save analytics events:', e);
    }
  }

  track(event: string, properties?: Record<string, string | number>) {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'unknown', // Just browser name
        referrer: document.referrer ? new URL(document.referrer).hostname : 'direct',
      },
      timestamp: new Date().toISOString(),
    };

    this.events.push(analyticsEvent);
    this.saveEvents();

    // In production, you might send this to an analytics endpoint
    console.log('📊 Analytics:', analyticsEvent);
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getEventCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.events.forEach(event => {
      counts[event.event] = (counts[event.event] || 0) + 1;
    });
    return counts;
  }

  clearEvents() {
    this.events = [];
    localStorage.removeItem('istampit_analytics');
  }
}

// Global analytics instance
const analytics = new Analytics();

// Convenience functions
export const trackVerifyStarted = () => {
  analytics.track('verify_started');
};

export const trackVerifyResult = (status: 'confirmed' | 'pending' | 'invalid') => {
  analytics.track('verify_result', { status });
};

export const trackVerifyError = (reason: 'mismatch' | 'corrupt' | 'network' | 'other') => {
  analytics.track('verify_error', { reason });
};

export const trackLedgerView = () => {
  analytics.track('ledger_view');
};

export const trackLedgerFilter = (status: string) => {
  analytics.track('ledger_filter', { status });
};

export const trackWidgetLoad = (mode: 'inline' | 'modal') => {
  analytics.track('widget_load', { mode });
};

export const trackWidgetInteraction = (action: 'open' | 'close' | 'verify') => {
  analytics.track('widget_interaction', { action });
};

export { analytics };
export default analytics;
