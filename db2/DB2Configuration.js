class DB2Configuration {
  constructor() {
    this.database = String(process.env.DATABASE_NAME);
    this.host = String(process.env.DATABASE_IP);
    this.password = String(process.env.DATABASE_PASS);
    this.port = Number(process.env.DATABASE_PORT);
    this.username = String(process.env.DATABASE_USER);
  }
  cn() {
    return `DATABASE=${this.database};` +
        `UID=${this.username};` +
        `PWD=${this.password};` +
        `HOSTNAME=${this.host};` +
        `PORT=${this.port};` +
        'PROTOCOL=TCPIP;ConnectTimeout=5;Driver={DB2};QueryTimeout=3600;CHARSET=UTF8;'
  }
}

module.exports = {
  DB2Configuration,
};
