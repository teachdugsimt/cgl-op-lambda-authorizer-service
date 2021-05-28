import {
  Entity,
  Column,
  PrimaryColumn
} from 'typeorm';

@Entity({ name: 'vw_resource_action' })
export class ViewResourceAction {
  @PrimaryColumn()
  id: number

  @Column()
  role: string

  @Column({ name: 'resource_name' })
  resourceName: string

  @Column()
  action: string

  @Column()
  resource: string

}
