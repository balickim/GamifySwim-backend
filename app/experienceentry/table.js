const { connectTo } = require('../../secrets/databaseConfiguration');

class ExperienceTable {
    static storeExperienceEntry({ databasename, account_id, title, amount }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'INSERT INTO experienceentry("account_id", "title", "amount") VALUES($1,$2,$3)',
                [account_id, title, amount],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }
}

module.exports = ExperienceTable;