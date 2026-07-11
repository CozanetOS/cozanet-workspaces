import pino from 'pino';
import { Workspace, WorkspaceType, LayoutConfig } from '../types.js';

const logger = pino({ name: 'LayoutEngine' });

export class LayoutEngine {
  constructor() {
    logger.info('LayoutEngine initialized');
  }

  arrange(
    workspaces: Workspace[], 
    strategy: 'single' | 'split-h' | 'split-v' | 'grid' | 'focus'
  ): LayoutConfig {
    if (workspaces.length === 0) {
      return {
        primary: '',
        arrangement: 'single',
        secondary: []
      };
    }

    const primary = workspaces[0].id;
    const secondary = workspaces.slice(1).map(ws => ws.id);

    const config: LayoutConfig = {
      primary,
      secondary,
      arrangement: strategy
    };

    logger.info({ strategy, workspacesCount: workspaces.length }, 'Rearranged workspace views');
    return config;
  }

  getOptimalLayout(workspaceTypes: WorkspaceType[]): LayoutConfig {
    if (workspaceTypes.length === 0) {
      return { primary: '', arrangement: 'single' };
    }

    // Default primary and secondary IDs based on position
    const primary = `temp:${workspaceTypes[0]}`;
    const secondary = workspaceTypes.slice(1).map(type => `temp:${type}`);

    let arrangement: LayoutConfig['arrangement'] = 'single';

    if (workspaceTypes.length === 2) {
      arrangement = 'split-h'; // Default side-by-side split
    } else if (workspaceTypes.length > 2) {
      arrangement = 'grid'; // Grid layout for 3+ screens
    }

    // Specialize layout optimization based on workspaces present
    if (workspaceTypes.includes('code') && workspaceTypes.includes('terminal')) {
      arrangement = 'split-v'; // Code on top, terminal on bottom
    }

    return {
      primary,
      secondary,
      arrangement
    };
  }

  setFocus(id: string, layout: LayoutConfig): LayoutConfig {
    logger.info({ id }, 'Refocusing layout on workspace');
    const newSecondary = (layout.secondary || []).filter(item => item !== id);
    if (layout.primary && layout.primary !== id) {
      newSecondary.push(layout.primary);
    }

    return {
      primary: id,
      secondary: newSecondary,
      arrangement: 'focus'
    };
  }
}
