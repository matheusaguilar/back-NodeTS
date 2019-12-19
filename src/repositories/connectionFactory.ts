import * as mysql from 'mysql';

// Prod
// const configHost = {
//   connectionLimit : 10,
//   host: 'ofestero.mysql.uhserver.com',
//   user: 'aguilar',
//   password: 'm@270195',
//   database: 'ofestero'
// }

// Dev
const configHost = {
  connectionLimit : 10,
  host: 'remotemysql.com',
  user: 'LD3zDzwkC4',
  password: 'mnWuRqnITu',
  database: 'LD3zDzwkC4'
}

export class ConnectionFactory {

  static pool: mysql.Pool = null;

  private constructor() {
  }

  /**
   * create a pool instance.
   */
  static createPool() {
    if (!this.pool) {
      this.pool = mysql.createPool(configHost);
    }
  }

  /**
   * get a connection from pool.
   */
  static getConnection(): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      if (!this.pool) {
        ConnectionFactory.createPool();
      }
      if (this.pool) {
        this.pool.getConnection((err, connection) => {
          if (err) {
            console.log('Error on getting pool connection');
            reject();
          }
          resolve(connection);
        });
      } else {
        console.log('Error on getting pool from database');
        reject();
      }
    });
  }

  /**
   * Release a pool connection.
   * @param connection
   */
  static releaseConnection(connection: mysql.PoolConnection) {
    if (connection) {
      connection.release();
    }
  }

}
