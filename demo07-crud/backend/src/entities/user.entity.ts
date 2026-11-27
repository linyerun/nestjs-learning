import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '@/entities/tag.entity.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255 })
  @Index('user_name_idx')
  name: string;

  @Column('varchar', { length: 4096 })
  desc: string;

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];
}
