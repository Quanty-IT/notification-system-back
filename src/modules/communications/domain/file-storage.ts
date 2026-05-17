export type UploadFileInput = {
  fileName: string;
  mimeType: string;
  content: Buffer;
};

export type UploadFileOutput = {
  storageProvider: 'r2';
  storageKey: string;
};

export type DownloadFileOutput = {
  content: Buffer;
};

export interface FileStorage {
  upload(input: UploadFileInput): Promise<UploadFileOutput>;
  download(storageKey: string): Promise<DownloadFileOutput>;
  delete(storageKey: string): Promise<void>;
}
