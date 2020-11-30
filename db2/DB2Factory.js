const Pool = require('ibm_db').Pool;
const DB2Configuration = require('./DB2Configuration').DB2Configuration;
const DB2Connection = require('./DB2Connection').DB2Connection;

// eslint-disable-next-line import/no-mutable-exports
let pool = new Pool();
const db2Configuration = new DB2Configuration();
pool.init(db2Configuration.poolInitialSize, db2Configuration.cn());
pool.setMaxPoolSize(db2Configuration.poolMaxSize);
console.log('IBM DB2 database connection pool init.');

function rebuildPool() {
  return new Promise((resolve, reject) => {
    pool.close(() => {
      pool = new Pool();
      if (pool === null) {
        console.log('Failed to rebuiil DB2 connection pool');
        reject(new Error('Connection pool could not be rebuilt'));
      }
      pool.init(db2Configuration.poolInitialSize, db2Configuration.cn());
      pool.setMaxPoolSize(db2Configuration.poolMaxSize);
      console.log('DB" connection pool was rebuilt');
      resolve();
    });
  });
}

function openNewConnection(resolve, reject) {
  pool.open(db2Configuration.cn(), (error, connection) => {
    if (error) {
      console.log(`Failed to fetch a database connection from new pool.${error}`);
      reject(error);
    }
    if (connection) {
      console.log('Database connection has been fetched from new pool.');
      resolve(new DB2Connection(connection));
    }
    console.log('New Database connection could not be created.');
    reject();
  });
}

function testConnection(connection) {
  return new Promise((resolve, reject) => {
    connection.query('values 1', null, (error, result) => {
      if (error) {
        error.message = `testConnection failed: ${error.message}`;
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function db2Factory() {
  return new Promise((resolve, reject) => {
    pool.open(db2Configuration.cn(), (error, connection) => {
      if (error) {
        console.log(`Failed to fetch a DB2 database connection from the pool: ${error}`);
        reject(error);
      } else {
        if (connection) {
          testConnection(connection).then(() => {
            console.log('DB2 database connection has been successfully created.');
            resolve(new DB2Connection(connection));
          })
              .catch(testError => reject(testError));
        }
        if (connection === null) {
          rebuildPool()
              .then(() => openNewConnection(resolve, reject))
              .catch((poolError) => {
                console.log(`Could not rebuild the DB2 connection pool. Pool: ${poolError}`);
                reject(poolError);
              });
        }
      }
    });
  });
}
module.exports = { pool, db2Factory };
