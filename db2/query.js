const { db2Factory } = require('./DB2Factory');

module.exports = function query(queryString, parameters) {
  return new Promise((resolve, reject) => {
    db2Factory()
        .then(connection => Promise.all([
          connection,
          connection.query(queryString, parameters),
        ]))
        .then((values) => {
          const [connection, rows] = values;
          return Promise.all([connection.close(), rows]);
        })
        .then((values) => {
          const [, rows] = values;
          resolve(rows);
        })
        .catch(error => reject(error));
  });
};
