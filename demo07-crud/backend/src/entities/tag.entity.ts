import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '@/entities/user.entity.js';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn()
  user: Relation<User>;
}
