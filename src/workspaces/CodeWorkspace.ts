import pino from 'pino';

const logger = pino({ name: 'CodeWorkspace' });

export class CodeWorkspace {
  readonly id: string;
  readonly type = 'code';
  title = 'Code Workspace';
  filePath: string;
  language: string;
  content = '';

  constructor(id: string, initialFilePath = 'src/index.ts') {
    this.id = id;
    this.filePath = initialFilePath;
    this.language = this.detectLanguage(initialFilePath);
    this.title = `Code: ${initialFilePath}`;
    logger.info({ id, filePath: initialFilePath }, 'CodeWorkspace initialized');
  }

  async openFile(path: string): Promise<void> {
    this.filePath = path;
    this.language = this.detectLanguage(path);
    this.title = `Code: ${path}`;
    
    // Simulate loading file content
    this.content = `// Content of file: ${path}\n// Loaded automatically by Code Workspace\nexport const placeholder = true;\n`;
    logger.info({ id: this.id, action: 'openFile', path, language: this.language }, 'Opened file in editor');
  }

  async saveFile(): Promise<void> {
    logger.info({ id: this.id, action: 'saveFile', path: this.filePath, contentLength: this.content.length }, 'Saved file to workspace storage');
  }

  getContent(): string {
    return this.content;
  }

  setContent(newContent: string): void {
    this.content = newContent;
  }

  private detectLanguage(path: string): string {
    const ext = path.split('.').pop() || '';
    const map: Record<string, string> = {
      ts: 'typescript',
      js: 'javascript',
      json: 'json',
      md: 'markdown',
      py: 'python',
      sh: 'bash',
      html: 'html',
      css: 'css'
    };
    return map[ext] || 'plaintext';
  }
}
