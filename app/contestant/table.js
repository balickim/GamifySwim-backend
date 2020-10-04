const { connectTo } = require('../../secrets/databaseConfiguration');

class ContestantTable {
    static contestants({ databasename, limit, offset }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT * FROM contestant LIMIT $1 OFFSET $2',
                [limit, offset],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
}

module.exports = ContestantTable;