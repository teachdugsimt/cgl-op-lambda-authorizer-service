import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const connectionString: PostgresConnectionOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  name: 'user_management',
  username: 'postgres',
  password: '@t;ll4RT10032538',
  database: 'postgres',
  port: 5432,
  synchronize: false,
  logging: true,
  entities: ['src/models/*.entity.ts'],
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsRun: true,
  cli: {
    migrationsDir: "src/migration",
    entitiesDir: "src/models"
  }
}

export default connectionString;
