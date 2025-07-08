import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  time: string;

  @Column()
  description: string;

  @Column({ default: '' })
  file_path: string;

  @Column({type:'timestamp'})
  CreatedAt: Date;

  @Column({type:'timestamp'})
  UpdatedAt: Date;
}
