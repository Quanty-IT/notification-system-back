export type UploadFileInput = {
  fileName: string;
  mimeType: string;
  content: Buffer;
};

export type UploadFileOutput = {
  storageProvider: 's3' | 'r2';
  storageKey: string;
};

export interface FileStorage {
  upload(input: UploadFileInput): Promise<UploadFileOutput>;
  delete(storageKey: string): Promise<void>;
}
