import Dexie, { type Table } from 'dexie';

export interface BookRecord {
  id: string;
  title: string;
  author: string;
  format: 'epub' | 'pdf' | 'cbz' | 'cbr';
  coverBlob: Blob | null;
  fileBlob: Blob;
  fileSize: number;
  addedAt: Date;
  lastReadAt: Date | null;
  progress: number;
  currentPage: number;
  totalPages: number;
  collections: string[];
  metadata: Record<string, any>;
}

export interface AnnotationRecord {
  id: string;
  bookId: string;
  type: 'highlight' | 'note' | 'bookmark';
  page: number;
  position: string;
  content: string;
  color: string;
  createdAt: Date;
}

export interface SettingsRecord {
  id: string; // usually 'global'
  theme: 'dark' | 'light' | 'sepia';
  fontSize: number;
  fontFamily: string;
  lineSpacing: number;
  margins: number;
  readingDirection: 'ltr' | 'rtl';
  comicMode: 'single' | 'double' | 'continuous';
}

export interface ReadingSessionRecord {
  id: string;
  bookId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  pagesRead: number;
}

export interface CollectionRecord {
  id: string;
  name: string;
  description: string;
  bookIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class LuminaDatabase extends Dexie {
  books!: Table<BookRecord>;
  annotations!: Table<AnnotationRecord>;
  settings!: Table<SettingsRecord>;
  reading_sessions!: Table<ReadingSessionRecord>;
  collections!: Table<CollectionRecord>;

  constructor() {
    super('LuminaReaderDB');
    this.version(1).stores({
      books: 'id, title, author, format, addedAt, lastReadAt, *collections',
      annotations: 'id, bookId, type, page',
      settings: 'id'
    });

    this.version(2).stores({
      reading_sessions: 'id, bookId, startTime',
      collections: 'id, name'
    });
  }
}

export const db = new LuminaDatabase();
