const { Pool } = require('pg');

const catalogPool = ({
    user: 'swimmer',
    host: '130.61.89.76',
    database: 'catalog',
    password: 'jjU;jEQFQ>$p?{Aohs,>[L*wT',
    port: 5432
});

const connectTo = databasename => {
    return new Pool({
        user: 'swimmer',
        host: '130.61.89.76',
        database: databasename,
        password: 'jjU;jEQFQ>$p?{Aohs,>[L*wT',
        port: 5432
    });
}

module.exports = { catalogPool, connectTo };