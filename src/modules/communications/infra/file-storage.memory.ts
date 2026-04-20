import { randomUUID } from 'node:crypto';
import { FileStorage, UploadFileInput, UploadFileOutput } from '../domain/file-storage';

export class InMemoryFileStorage implements FileStorage {
  async upload(_input: UploadFileInput): Promise<UploadFileOutput> {
    return {
      storageProvider: 's3',
      storageKey: `communications/${randomUUID()}`,
    };
  }

  async delete(_storageKey: string): Promise<void> {
    return;
  }
}
