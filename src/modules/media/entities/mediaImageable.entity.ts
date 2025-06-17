import { Column, Index, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Media } from './media.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
@Index(['imageableId', 'imageableType'])
export class MediaImageable extends BaseEntity {
  @Column({ type: 'uuid' })
  imageableId: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  imageableType: string;

  @Column({ type: 'varchar', length: 100 })
  zone: string;

  @Column({ type: 'integer', default: 0 })
  order?: number;

  @ManyToOne(() => Media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  media: Media;

  @Column()
  mediaId: string;
}
