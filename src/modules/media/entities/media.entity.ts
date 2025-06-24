import { Column, Index, Entity, OneToMany } from 'typeorm';
import { MediaImageable } from './mediaImageable.entity';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('medias')
export class Media extends BaseEntity {
  @Column({ name: 'is_folder', default: false })
  isFolder: boolean;

  @Column({ name: 'file_name', type: 'varchar', length: 100 })
  fileName: string;

  @Column({ name: 'file_path', type: 'varchar', length: 255 })
  filePath: string;

  @Column({ name: 'file_url', type: 'varchar', length: 255 })
  fileUrl: string;

  @Column({ name: 'extension', type: 'varchar', length: 20 })
  extension: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 20 })
  mimeType: string;

  @Column({ name: 'file_size', type: 'integer' })
  fileSize: number;

  @Column({ name: 'folder_id', type: 'uuid', nullable: true })
  @Index()
  folderId?: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @OneToMany(() => MediaImageable, mediaImageable => mediaImageable.media)
  mediaImagebles: MediaImageable[];
}
