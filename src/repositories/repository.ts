import { ConnectionFactory } from './connectionFactory';

export class Repository {

  /**
   * call a query with params to the database.
   * @param query the query to be executed.
   * @param params the params to be passed with the query.
   */
  call(query: string, params?: any[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // get connection
      const connection = await ConnectionFactory.getConnection().catch((err) => {
        reject(err);
      })

      if (connection) {
        // define callback
        const callback = (error, result, fields) => {
          ConnectionFactory.releaseConnection(connection);
          if (error) {
            reject(error);
          }
          resolve(result);
        }

        // call query
        if (!params) {
          connection.query(query, callback);
        } else {
          connection.query(query, params, callback);
        }
      }
    });
  }

  /**
   * handle error and return undefined.
   */
  handler(err): undefined {
    console.log(err);
    return undefined;
  }

}
