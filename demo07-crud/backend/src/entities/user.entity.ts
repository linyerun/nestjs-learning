import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255 })
  @Index('user_name_idx')
  name: string;

  @Column('varchar', { length: 4096 })
  desc: string;
}
