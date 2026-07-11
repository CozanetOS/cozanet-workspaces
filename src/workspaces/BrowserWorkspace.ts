import pino from 'pino';

const logger = pino({ name: 'BrowserWorkspace' });

export interface Tab {
  id: string;
  title: string;
  url: string;
  active: boolean;
}

export class BrowserWorkspace {
  readonly id: string;
  readonly type = 'browser';
  title = 'Browser Workspace';
  url: string;
  tabs: Tab[] = [];

  constructor(id: string, initialUrl = 'https://google.com') {
    this.id = id;
    this.url = initialUrl;
    this.newTab(initialUrl);
    logger.info({ id, initialUrl }, 'BrowserWorkspace created');
  }

  async navigate(url: string): Promise<void> {
    this.url = url;
    const activeTab = this.tabs.find(t => t.active);
    if (activeTab) {
      activeTab.url = url;
      activeTab.title = `Tab: ${new URL(url).hostname || url}`;
    }
    this.title = `Browser: ${url}`;
    
    // Communicates with cozanet-browser engine via engine ID 'browser:engine'
    logger.info({ engine: 'browser:engine', id: this.id, action: 'navigate', url }, 'Syncing navigation to browser engine');
  }

  newTab(url = 'https://google.com'): Tab {
    // Set other tabs to inactive
    this.tabs.forEach(t => t.active = false);

    const tabId = `tab:${Math.random().toString(36).substr(2, 9)}`;
    const newTabObj: Tab = {
      id: tabId,
      url,
      title: `Tab: ${url}`,
      active: true
    };
    this.tabs.push(newTabObj);
    this.url = url;
    this.title = `Browser: ${url}`;
    
    logger.info({ engine: 'browser:engine', id: this.id, action: 'newTab', tabId, url }, 'Created new browser tab');
    return newTabObj;
  }

  closeTab(id: string): void {
    const index = this.tabs.findIndex(t => t.id === id);
    if (index === -1) return;

    const wasActive = this.tabs[index].active;
    this.tabs.splice(index, 1);

    if (wasActive && this.tabs.length > 0) {
      // Make the last tab active
      const nextActive = this.tabs[this.tabs.length - 1];
      nextActive.active = true;
      this.url = nextActive.url;
      this.title = `Browser: ${this.url}`;
    } else if (this.tabs.length === 0) {
      this.newTab('about:blank');
    }

    logger.info({ engine: 'browser:engine', id: this.id, action: 'closeTab', tabId: id }, 'Closed browser tab');
  }
}
