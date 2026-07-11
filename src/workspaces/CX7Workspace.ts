import pino from 'pino';

const logger = pino({ name: 'CX7Workspace' });

export class CX7Workspace {
  readonly id: string;
  readonly type = 'cx7';
  title = 'CX7 Workspace';
  sceneId: string;

  constructor(id: string, initialSceneId = 'lobby') {
    this.id = id;
    this.sceneId = initialSceneId;
    this.title = `CX7: Scene [${initialSceneId}]`;
    logger.info({ id, initialSceneId }, 'CX7Workspace initialized. Communicating with WorldEngine...');
    this.activateScene(initialSceneId);
  }

  activateScene(sceneId: string): void {
    this.sceneId = sceneId;
    this.title = `CX7: Scene [${sceneId}]`;
    // Communicate with CX7 WorldEngine scene / Voice workspaces
    logger.info({ 
      engine: 'cx7:world-engine', 
      id: this.id, 
      action: 'activateScene', 
      sceneId 
    }, 'Activated CX7 Engine Scene');
  }
}
