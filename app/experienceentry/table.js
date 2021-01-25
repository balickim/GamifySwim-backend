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

    static getExperienceOfAccount({ databasename, account_id }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'select totalamount, level, floor(barpercent * 10) as barpercent from vexperience where account_id = $1',
                [account_id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
}

module.exports = ExperienceTable;