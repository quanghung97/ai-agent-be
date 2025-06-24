import { Column, Index, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Media } from './media.entity';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('media_imageables')
@Index(['imageableId', 'imageableType'])
export class MediaImageable extends BaseEntity {
  @Column({ name: 'imageable_id', type: 'uuid' })
  imageableId: string;

  @Column({ name: 'imageable_type', type: 'varchar', length: 255 })
  @Index()
  imageableType: string;

  @Column({ name: 'zone', type: 'varchar', length: 100 })
  zone: string;

  @Column({ name: 'order', type: 'integer', default: 0 })
  order?: number;

  @ManyToOne(() => Media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @Column({ name: 'media_id' })
  mediaId: string;
}
