const { Pool } = require('pg');

const catalogPool = ({
    user: 'swimmer',
    host: '158.101.174.64',
    database: 'catalog',
    password: 'jjU;jEQFQ>$p?{Aohs,>[L*wT',
    port: 5432
});

const connectTo = databasename => {
    return new Pool({
        user: 'swimmer',
        host: '158.101.174.64',
        database: databasename,
        password: 'jjU;jEQFQ>$p?{Aohs,>[L*wT',
        port: 5432
    });
}

module.exports = { catalogPool, connectTo };