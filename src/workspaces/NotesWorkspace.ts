import pino from 'pino';

const logger = pino({ name: 'NotesWorkspace' });

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export class NotesWorkspace {
  readonly id: string;
  readonly type = 'notes';
  title = 'Notes Workspace';
  notes: Note[] = [];

  constructor(id: string) {
    this.id = id;
    this.title = 'Notes & Brainstorming';
    logger.info({ id }, 'NotesWorkspace initialized');
    this.createNote('Initial Brainstorm', '# Task Workspace Ideation\nReady to organize context and plans!');
  }

  createNote(title: string, content: string): Note {
    const noteId = `note:${Math.random().toString(36).substr(2, 9)}`;
    const newNote: Note = {
      id: noteId,
      title,
      content,
      updatedAt: Date.now()
    };
    this.notes.push(newNote);
    logger.info({ id: this.id, action: 'createNote', noteId, title }, 'Created a new note');
    return newNote;
  }

  updateNote(id: string, content: string): void {
    const note = this.notes.find(n => n.id === id);
    if (!note) {
      throw new Error(`Note ${id} not found`);
    }
    note.content = content;
    note.updatedAt = Date.now();
    logger.info({ id: this.id, action: 'updateNote', noteId: id }, 'Updated note contents');
  }

  listNotes(): Note[] {
    return [...this.notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }
}
