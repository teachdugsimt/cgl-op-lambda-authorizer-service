import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'user_example' })
export class UserExample {
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number

  @Column()
  name: string

  @CreateDateColumn()
  created_at: string

  @UpdateDateColumn()
  updated_at: string
}
