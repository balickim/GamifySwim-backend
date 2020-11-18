const { connectTo } = require('../../secrets/databaseConfiguration');

class ExperienceTable {
    static storeExperienceEntry({ databasename, user_id, title, amount }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'INSERT INTO experienceentry("user_id", "title", "amount") VALUES($1,$2,$3)',
                [user_id, title, amount],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }
}

module.exports = ExperienceTable;