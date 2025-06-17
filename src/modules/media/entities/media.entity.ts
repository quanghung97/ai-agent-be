import { Column, Index, Entity, OneToMany } from 'typeorm';
import { MediaImageable } from './mediaImageable.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Media extends BaseEntity {
  @Column({ type: 'number', default: false })
  isFolder: number;

  @Column({ type: 'varchar', length: 100 })
  fileName: string;

  @Column({ type: 'varchar', length: 255 })
  filePath: string;

  @Column({ type: 'varchar', length: 255 })
  fileUrl: string;

  @Column({ type: 'varchar', length: 20 })
  extension: string;

  @Column({ type: 'varchar', length: 20 })
  mimeType: string;

  @Column({ type: 'integer' })
  fileSize: number;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  folderId?: string;

  @OneToMany(() => MediaImageable, mediaImageable => mediaImageable.media)
  mediaImagebles: MediaImageable[];
}
