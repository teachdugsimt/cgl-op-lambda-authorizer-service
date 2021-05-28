import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ResourceAction {
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number

  @Column({ name: 'role_id' })
  roleId: number

  @Column({ name: 'resource_id' })
  resourceId: number

  @Column()
  action: string

  @Column()
  url: string

  // @CreateDateColumn()
  // created_at: string

  // @UpdateDateColumn()
  // updated_at: string
}
