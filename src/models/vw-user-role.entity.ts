import {
  Entity,
  Column,
  PrimaryColumn
} from 'typeorm';

@Entity({ name: 'vw_user_role' })
export class ViewUserRole {
  @PrimaryColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'role_id' })
  roleId: number

  @Column({ name: 'role_name' })
  roleName: string

}
