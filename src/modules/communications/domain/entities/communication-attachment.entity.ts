export type StorageProvider = 'r2';

export type CommunicationAttachmentProps = {
  id: string;
  communicationId: string;
  originalFileName: string;
  storageProvider: StorageProvider;
  storageKey: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAt: Date;
};

export class CommunicationAttachmentEntity {
  private constructor(readonly props: CommunicationAttachmentProps) {}

  public static create(
    communicationId: string,
    originalFileName: string,
    storageProvider: StorageProvider,
    storageKey: string,
    mimeType: string,
    fileSizeBytes: number,
  ) {
    return new CommunicationAttachmentEntity({
      id: crypto.randomUUID(),
      communicationId,
      originalFileName,
      storageProvider,
      storageKey,
      mimeType,
      fileSizeBytes,
      createdAt: new Date(),
    });
  }

  public static fromPersistence(props: CommunicationAttachmentProps) {
    return new CommunicationAttachmentEntity(props);
  }

  get id() {
    return this.props.id;
  }

  get communicationId() {
    return this.props.communicationId;
  }

  get originalFileName() {
    return this.props.originalFileName;
  }

  get storageProvider() {
    return this.props.storageProvider;
  }

  get storageKey() {
    return this.props.storageKey;
  }

  get mimeType() {
    return this.props.mimeType;
  }

  get fileSizeBytes() {
    return this.props.fileSizeBytes;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
