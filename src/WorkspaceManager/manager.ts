import EventEmitter from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { 
  Workspace, 
  WorkspaceType, 
  WorkspaceStatus, 
  WorkspaceConfig, 
  WorkspaceSession, 
  LayoutConfig, 
  WorkspaceEvent 
} from '../types.js';

import { BrowserWorkspace } from '../workspaces/BrowserWorkspace.js';
import { CodeWorkspace } from '../workspaces/CodeWorkspace.js';
import { TerminalWorkspace } from '../workspaces/TerminalWorkspace.js';
import { NotesWorkspace } from '../workspaces/NotesWorkspace.js';
import { CX7Workspace } from '../workspaces/CX7Workspace.js';
import { DashboardWorkspace } from '../workspaces/DashboardWorkspace.js';

const logger = pino({
  name: 'WorkspaceManager',
  level: 'info'
});

export class WorkspaceManager extends EventEmitter {
  static readonly ENGINE_ID = 'workspaces:manager';
  private workspaces = new Map<string, Workspace>();
  private sessions = new Map<string, WorkspaceSession>();

  // Tracks specialized classes mapping workspace ID -> instance
  private instances = new Map<string, any>();

  constructor() {
    super();
    logger.info('WorkspaceManager initialized');
  }

  // CEO AI calls this to open a workspace for a task
  async openWorkspace(type: WorkspaceType, config: WorkspaceConfig = {}, sessionId?: string): Promise<Workspace> {
    const wsId = `${type}:${uuidv4()}`;
    const actualSessionId = sessionId || `session:${uuidv4()}`;

    logger.info({ type, wsId, sessionId: actualSessionId }, 'Opening workspace');

    // Instantiate specialized workspace wrapper/logic classes where applicable
    let instance: any = null;
    let title = `${type.charAt(0).toUpperCase() + type.slice(1)} Workspace`;

    switch (type) {
      case 'browser':
        instance = new BrowserWorkspace(wsId, config.url || 'https://google.com');
        title = instance.title;
        break;
      case 'code':
        instance = new CodeWorkspace(wsId, config.filePath || 'src/index.ts');
        title = instance.title;
        break;
      case 'terminal':
        instance = new TerminalWorkspace(wsId);
        title = instance.title;
        break;
      case 'notes':
        instance = new NotesWorkspace(wsId);
        title = instance.title;
        break;
      case 'cx7':
        instance = new CX7Workspace(wsId, config.sceneId || 'lobby');
        title = instance.title;
        break;
      case 'dashboard':
        instance = new DashboardWorkspace(wsId);
        title = instance.title;
        break;
      default:
        // Other types use default fallback
        break;
    }

    if (instance) {
      this.instances.set(wsId, instance);
    }

    const newWorkspace: Workspace = {
      id: wsId,
      type,
      title,
      status: 'active',
      config,
      sessionId: actualSessionId,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      metadata: {}
    };

    this.workspaces.set(wsId, newWorkspace);

    // If there is an existing session, register this workspace ID with it
    const session = this.sessions.get(actualSessionId);
    if (session) {
      session.workspaces.push(wsId);
      session.updatedAt = Date.now();
    }

    const event: WorkspaceEvent = {
      type: 'opened',
      workspaceId: wsId,
      payload: { workspace: newWorkspace },
      timestamp: Date.now()
    };
    this.emit('workspace:opened', event);

    return newWorkspace;
  }
  
  async closeWorkspace(workspaceId: string): Promise<void> {
    logger.info({ workspaceId }, 'Closing workspace');
    const ws = this.workspaces.get(workspaceId);
    if (!ws) {
      throw new Error(`Workspace ${workspaceId} not found`);
    }

    ws.status = 'inactive';
    this.workspaces.delete(workspaceId);
    this.instances.delete(workspaceId);

    // Remove from sessions mapping
    const session = this.sessions.get(ws.sessionId);
    if (session) {
      session.workspaces = session.workspaces.filter(id => id !== workspaceId);
      session.updatedAt = Date.now();
    }

    const event: WorkspaceEvent = {
      type: 'closed',
      workspaceId,
      timestamp: Date.now()
    };
    this.emit('workspace:closed', event);
  }
  
  async focusWorkspace(workspaceId: string): Promise<void> {
    logger.info({ workspaceId }, 'Focusing workspace');
    const ws = this.workspaces.get(workspaceId);
    if (!ws) {
      throw new Error(`Workspace ${workspaceId} not found`);
    }

    ws.lastActiveAt = Date.now();
    ws.status = 'active';

    // Put others in background if they are part of the same session
    for (const [id, otherWs] of this.workspaces.entries()) {
      if (id !== workspaceId && otherWs.sessionId === ws.sessionId && otherWs.status === 'active') {
        otherWs.status = 'background';
      }
    }

    const event: WorkspaceEvent = {
      type: 'focused',
      workspaceId,
      timestamp: Date.now()
    };
    this.emit('workspace:focused', event);
  }
  
  async updateWorkspace(workspaceId: string, updates: Partial<WorkspaceConfig>): Promise<void> {
    logger.info({ workspaceId, updates }, 'Updating workspace config');
    const ws = this.workspaces.get(workspaceId);
    if (!ws) {
      throw new Error(`Workspace ${workspaceId} not found`);
    }

    ws.config = { ...ws.config, ...updates };
    ws.lastActiveAt = Date.now();

    // Sync state update to specialized instances
    const instance = this.instances.get(workspaceId);
    if (instance) {
      if (updates.url && typeof instance.navigate === 'function') {
        await instance.navigate(updates.url);
      }
      if (updates.filePath && typeof instance.openFile === 'function') {
        await instance.openFile(updates.filePath);
      }
      if (updates.sceneId && instance instanceof CX7Workspace) {
        // Can call custom setter or method
      }
    }

    const event: WorkspaceEvent = {
      type: 'updated',
      workspaceId,
      payload: { updates },
      timestamp: Date.now()
    };
    this.emit('workspace:updated', event);
  }
  
  // CEO AI decision: given a task type, which workspaces should open?
  getWorkspacesForTask(taskType: string): WorkspaceType[] {
    const mapping: Record<string, WorkspaceType[]> = {
      research: ['browser', 'notes'],
      coding: ['code', 'terminal'],
      learning: ['cx7', 'notes'],
      debugging: ['logs', 'terminal', 'code'],
      planning: ['notes', 'dashboard'],
      data: ['database', 'dashboard'],
      email: ['email'],
      files: ['files'],
    };
    return mapping[taskType] ?? ['dashboard'];
  }
  
  async openForTask(taskType: string, sessionId: string): Promise<Workspace[]> {
    logger.info({ taskType, sessionId }, 'Opening workspaces for task context');
    const types = this.getWorkspacesForTask(taskType);
    const opened: Workspace[] = [];

    for (const type of types) {
      const ws = await this.openWorkspace(type, {}, sessionId);
      opened.push(ws);
    }

    return opened;
  }
  
  getWorkspace(id: string): Workspace | null {
    return this.workspaces.get(id) || null;
  }

  getWorkspaceInstance<T = any>(id: string): T | null {
    return (this.instances.get(id) as T) || null;
  }
  
  listWorkspaces(sessionId?: string): Workspace[] {
    const all = Array.from(this.workspaces.values());
    if (sessionId) {
      return all.filter(ws => ws.sessionId === sessionId);
    }
    return all;
  }
  
  getActiveWorkspaces(): Workspace[] {
    return Array.from(this.workspaces.values()).filter(ws => ws.status === 'active');
  }
  
  // Session management
  createSession(userId: string): WorkspaceSession {
    const id = `session:${uuidv4()}`;
    logger.info({ userId, sessionId: id }, 'Creating session');
    const newSession: WorkspaceSession = {
      id,
      userId,
      workspaces: [],
      layout: {
        primary: '',
        arrangement: 'single'
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.sessions.set(id, newSession);
    return newSession;
  }
  
  getSession(id: string): WorkspaceSession | null {
    return this.sessions.get(id) || null;
  }
  
  // Layout management
  setLayout(sessionId: string, layout: LayoutConfig): void {
    logger.info({ sessionId, layout }, 'Setting session layout');
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    session.layout = layout;
    session.updatedAt = Date.now();
    this.emit('layout:updated', { sessionId, layout, timestamp: Date.now() });
  }
  
  getLayout(sessionId: string): LayoutConfig | null {
    const session = this.sessions.get(sessionId);
    return session ? session.layout : null;
  }
}
