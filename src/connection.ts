import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Role, Resource, ResourceAction, ViewResourceAction, ViewUserRole, UserExample } from './models';
import * as fs from 'fs';
import connectionString from './ormconfig'
// const fs = require('fs').promises;

interface ConnectionResponse {
  role: any
  resource: any
  resourceAction: any
  viewResourceAction: any
  viewUserRole: any
  userExample: any
}

const connection = async (): Promise<ConnectionResponse | undefined> => {
  try {
    const connection = await createConnection(connectionString);
    console.log('database connected');
    const directory = 'src/migration';
    // fs.rmdir(directory, { recursive: true })
    //   .then(() => console.log('directory removed!'))
    //   .catch((err: any) => { if (err) throw (err) });
    fs.rmdir(directory, (err) => {
      if (err) { console.log('err :>> ', err); }
    })

    return {
      role: connection.getRepository(Role),
      resource: connection.getRepository(Resource),
      resourceAction: connection.getRepository(ResourceAction),
      viewResourceAction: connection.getRepository(ViewResourceAction),
      viewUserRole: connection.getRepository(ViewUserRole),
      userExample: connection.getRepository(UserExample)
    }
  } catch (error) {
    console.log(error);
    console.log('make sure you have set .env variables - see .env.sample');
  }
}

export default connection
