class DB2Connection {
  constructor(connection) {
    this.Database = connection;
  }
  beginTransaction() {
    return new Promise((resolve, reject) => {
      this.Database.beginTransaction((error) => {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.Database.close((error) => {
        if (error) {
          reject(error);
        } else {
          console.log('IBM DB2 database connection has been successfully closed.');
          resolve(this);
        }
      });
    });
  }
  commitTransaction() {
    return new Promise((resolve, reject) => {
      this.Database.commitTransaction((error) => {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }
  static execute(statement, parameters) {
    return new Promise((resolve, reject) => {
      statement.execute(parameters, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
  static fetch(result, fetchMode = 4) {
    return new Promise((resolve, reject) => {
      result.fetch({ fetchMode }, (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    });
  }
  prepare(query) {
    return new Promise((resolve, reject) => {
      this.Database.prepare(query, (error, statement) => {
        if (error) {
          reject(error);
        } else {
          resolve(statement);
        }
      });
    });
  }
  query(query, parameters) {
    return new Promise((resolve, reject) => {
      console.log(`Executing query ${query} binding parameters ${JSON.stringify(parameters)}`);
      this.Database.query(query, parameters, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
  rollbackTransaction() {
    return new Promise((resolve, reject) => {
      this.Database.rollbackTransaction((error) => {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }
}

module.exports = {
  DB2Connection,
};
