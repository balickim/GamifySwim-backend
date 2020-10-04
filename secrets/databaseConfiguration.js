const { Pool } = require('pg');

const catalogPool = ({
    user: 'swimmer',
    host: 'localhost',
    database: 'catalog',
    password: 'swimmer',
    port: 5433
});

const connectTo = databasename => {
    return new Pool({
        user: 'swimmer',
        host: 'localhost',
        database: databasename,
        password: 'swimmer',
        port: 5433
    });
}

module.exports = { catalogPool, connectTo };