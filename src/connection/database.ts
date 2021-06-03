import { Connection, ConnectionManager, createConnection, getConnectionManager } from 'typeorm'

/**
 * Database manager class
 */
export class Database {
  private connectionManager: ConnectionManager

  constructor() {
    this.connectionManager = getConnectionManager()
  }

  public async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = `default`

    let connection: Connection

    if (this.connectionManager.has(CONNECTION_NAME)) {
      console.log(`Database.getConnection()-using existing connection ...`)
      connection = this.connectionManager.get(CONNECTION_NAME)

      if (!connection.isConnected) {
        connection = await connection.connect()
      }
    } else {
      console.log(`Database.getConnection()-creating connection ...`)
      connection = await createConnection()
    }

    return connection
  }
}
