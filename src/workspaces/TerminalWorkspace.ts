import pino from 'pino';

const logger = pino({ name: 'TerminalWorkspace' });

export class TerminalWorkspace {
  readonly id: string;
  readonly type = 'terminal';
  title = 'Terminal Workspace';
  cwd = '/app';
  history: string[] = [];

  constructor(id: string) {
    this.id = id;
    this.title = 'Terminal: bash';
    logger.info({ id }, 'TerminalWorkspace initialized and connected to terminal:shell');
  }

  async run(command: string): Promise<string> {
    logger.info({ id: this.id, action: 'run', command, shell: 'terminal:shell' }, 'Executing shell command');
    this.history.push(command);

    // Simulate standard output responses depending on command
    if (command.startsWith('cd ')) {
      const target = command.substring(3).trim();
      this.cwd = target.startsWith('/') ? target : `${this.cwd}/${target}`;
      return ``;
    }

    if (command === 'pwd') {
      return this.cwd;
    }

    if (command === 'ls') {
      return 'package.json  src/  tsconfig.json  dist/  node_modules/';
    }

    if (command === 'whoami') {
      return 'ceo-ai-agent';
    }

    return `[terminal:shell] Executed: ${command}\nExit Code: 0\n`;
  }
}
