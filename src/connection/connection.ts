import 'reflect-metadata';
import { Connection } from 'typeorm';
import { Role, Resource, ResourceAction, UserRole, Users, VwUserRole, VwUserRoleResource } from '../models';
import * as fs from 'fs';
import { Database } from "./database";

interface ConnectionResponse {
  role: any
  resource: any
  resourceAction: any
  userRole: any
  users: any
  vwUserRole: any
  vwUserRoleResource: any
  // mainConnection: Connection
}

const connection = async (): Promise<ConnectionResponse | undefined> => {
  try {
    const database = new Database();
    const connection: Connection = await database.getConnection()
    console.log('database connected');
    const directory = 'src/migration';
    fs.rmdir(directory, (err) => {
      if (err) { console.log('err :>> ', err); }
    })

    return {
      role: connection.getRepository(Role),
      resource: connection.getRepository(Resource),
      resourceAction: connection.getRepository(ResourceAction),
      userRole: connection.getRepository(UserRole),
      users: connection.getRepository(Users),
      vwUserRole: connection.getRepository(VwUserRole),
      vwUserRoleResource: connection.getRepository(VwUserRoleResource),
      // mainConnection: connection,
    }
  } catch (error) {
    console.log(error);
    console.log('make sure you have set .env variables - see .env.sample');
  }
}

export default connection
