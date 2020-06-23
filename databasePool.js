const { Pool } = require('pg');
const {catalogPool} = require('./secrets/databaseConfiguration');

const pool = new Pool(catalogPool);

module.exports = pool;