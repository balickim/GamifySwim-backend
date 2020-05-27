const catalogPool = require('../../databasePool');

class CatalogTable {
    static getDatabase({ shortname }) {
        return new Promise((resolve, reject) => {
            catalogPool.query(
                'SELECT "databaseName" FROM school WHERE "shortName" = $1',
                [shortname],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows[0].databaseName);
                }
            );
        });
    }
}

module.exports = CatalogTable;