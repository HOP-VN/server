require('dotenv').config();
module.exports.server = {
  port: 9900,
  hostname: 'http://localhost:9900',
  host_cdn: '',
};

let mysql = {
  host: process.env.mysql_host,
  user: process.env.mysql_user,
  port: process.env.mysql_port,
  password: process.env.mysql_password,
  timezone: '+7:00',
  decimalNumbers: true,
  connectionLimit: 200,
  multipleStatements: true,
  database: process.env.mysql_database,
};

module.exports.mysql = mysql;
module.exports.redis = {
  port: 6379,
  password: process.env.redis_password,
  host: process.env.redis_host,
  options: {},
  maxConnections: 200,
  handleRedisError: true,
};
module.exports.sequelize = {
  database: mysql.database,
  username: mysql.user,
  password: mysql.password,
  options: {
    host: mysql.host,
    port: mysql.port,
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
    operatorsAliases: false,
    timezone: mysql.timezone,
    pool: {
      max: 200,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
module.exports.logger4js = {
  appenders: { out: { type: 'stdout' } },
  categories: { default: { appenders: ['out'], level: 'info' } },
  disableClustering: true,
};

logger4js = {
  "appenders": {
    "out": { "type": "stdout" },
    "debug": { "type": "dateFile", "filename": "logs/debug/debug_file", "pattern": "-yyyy-MM-dd.log", "alwaysIncludePattern": true, "keepFileExt": true },
    "debug-filter": { "type": "logLevelFilter", "appender": "debug", "level": "debug", "maxLevel": "debug" },
    "result": { "type": "dateFile", "filename": "logs/result/result_file", "pattern": "-yyyy-MM-dd.log", "alwaysIncludePattern": true, "keepFileExt": true },
    "result-filter": { "type": "logLevelFilter", "appender": "result", "level": "info", "maxLevel": "info" },
    "error": { "type": "dateFile", "filename": "logs/error/error_file", "pattern": "-yyyy-MM-dd.log", "alwaysIncludePattern": true, "keepFileExt": true },
    "error-filter": { "type": "logLevelFilter", "appender": "error", "level": "error", "maxLevel": "error" },
    "default": { "type": "dateFile", "filename": "logs/default/default_file", "pattern": "-yyyy-MM-dd.log", "alwaysIncludePattern": true, "keepFileExt": true },
    "warn": { "type": "dateFile", "filename": "logs/warn/warn_file", "pattern": "-yyyy-MM-dd.log", "alwaysIncludePattern": true, "keepFileExt": true },
    "warn-filter": { "type": "logLevelFilter", "appender": "warn", "level": "warn", "maxLevel": "warn" }
  },
  "categories": {
    "default": { "appenders": ["out", "default", "debug-filter", "result-filter", "debug-filter", "error-filter", "warn-filter"], "level": "trace" },
    "debug": { "appenders": ["debug", "debug-filter"], "level": "debug" },
    "result": { "appenders": ["result-filter", "debug-filter", "error-filter", "warn-filter"], "level": "debug" },
    "error": { "appenders": ["error", "error-filter"], "level": "error" },
    "warn": { "appenders": ["warn", "warn-filter"], "level": "warn" }
  }
};
module.exports.privateKey = 'admin';
module.exports.logger4js = logger4js;