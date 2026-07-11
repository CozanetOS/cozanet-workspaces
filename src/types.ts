export type WorkspaceType = 
  | 'browser'
  | 'code'
  | 'terminal'
  | 'notes'
  | 'files'
  | 'database'
  | 'api'
  | 'cx7'
  | 'email'
  | 'dashboard'
  | 'logs';

export type WorkspaceStatus = 'inactive' | 'loading' | 'active' | 'background' | 'error';

export interface Workspace {
  id: string;
  type: WorkspaceType;
  title: string;
  status: WorkspaceStatus;
  config: WorkspaceConfig;
  sessionId: string;
  createdAt: number;
  lastActiveAt: number;
  metadata: Record<string, any>;
}

export interface WorkspaceConfig {
  url?: string; // for browser
  filePath?: string; // for code/files
  command?: string; // for terminal
  sceneId?: string; // for cx7
  layout?: 'split' | 'tabs' | 'floating' | 'fullscreen';
  position?: { x: number; y: number; width: number; height: number };
}

export interface WorkspaceSession {
  id: string;
  userId: string;
  workspaces: string[]; // workspace IDs
  layout: LayoutConfig;
  createdAt: number;
  updatedAt: number;
}

export interface LayoutConfig {
  primary: string; // workspace ID
  secondary?: string[];
  arrangement: 'single' | 'split-h' | 'split-v' | 'grid' | 'focus';
}

export interface WorkspaceEvent {
  type: 'opened' | 'closed' | 'focused' | 'updated' | 'error';
  workspaceId: string;
  payload?: any;
  timestamp: number;
}
