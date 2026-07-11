import pino from 'pino';

const logger = pino({ name: 'DashboardWorkspace' });

export class DashboardWorkspace {
  readonly id: string;
  readonly type = 'dashboard';
  title = 'System Dashboard';

  constructor(id: string) {
    this.id = id;
    logger.info({ id }, 'DashboardWorkspace initialized');
  }

  getOverviewStats(): Record<string, any> {
    return {
      status: 'healthy',
      cpuUsage: '12%',
      memoryAvailable: '14.2 GB',
      connectedEngines: ['browser:engine', 'terminal:shell', 'cx7:world-engine'],
      activeTasks: 1
    };
  }
}
