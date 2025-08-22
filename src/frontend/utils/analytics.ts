// Analytics tracking utility
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    
    // Set up event listeners for data-event attributes
    this.setupEventListeners();
    this.isInitialized = true;
    
    console.log('Analytics initialized');
  }

  private setupEventListeners() {
    // Listen for clicks on elements with data-event attributes
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const eventName = target.getAttribute('data-event');
      
      if (eventName) {
        this.track(eventName, {
          element: target.tagName.toLowerCase(),
          text: target.textContent?.trim(),
          href: (target as HTMLAnchorElement).href,
          className: target.className
        });
      }
    });

    // Listen for form submissions
    document.addEventListener('submit', (e) => {
      const target = e.target as HTMLFormElement;
      const eventName = target.getAttribute('data-event');
      
      if (eventName) {
        this.track(eventName, {
          formId: target.id,
          formAction: target.action
        });
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    document.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track at 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(scrollDepth)) {
          this.track('scroll_depth', { depth: scrollDepth });
        }
      }
    });

    // Track time on page
    let startTime = Date.now();
    setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      if ([30, 60, 120, 300].includes(timeOnPage)) {
        this.track('time_on_page', { seconds: timeOnPage });
      }
    }, 1000);
  }

  track(event: string, properties: Record<string, any> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };

    this.events.push(analyticsEvent);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsEvent);
    }

    // Send to analytics service (replace with your preferred service)
    this.sendToAnalytics(analyticsEvent);
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // Example: Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, event.properties);
    }

    // Example: Send to custom endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // }).catch(console.error);
  }

  // Get all tracked events (useful for debugging)
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear events (useful for testing)
  clearEvents() {
    this.events = [];
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  analytics.init();
}

export default analytics;
