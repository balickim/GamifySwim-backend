const { connectTo } = require('../../secrets/databaseConfiguration');

class AccountTable {
    static storeAccount({ databasename, usernameHash, passwordHash }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'INSERT INTO account("usernameHash", "passwordHash") VALUES($1,$2)',
                [usernameHash, passwordHash],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static getAccount({ databasename, usernameHash }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `SELECT id, "passwordHash", "sessionId" FROM account 
                WHERE "usernameHash" = $1`,
                [usernameHash],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ account: response.rows[0] });
                }
            )
        });
    }

    static updateSessionId({ databasename, sessionId, usernameHash }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'UPDATE account SET "sessionId" = $1 WHERE "usernameHash" = $2',
                [sessionId, usernameHash],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static trainings({ databasename, limit, offset }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT * FROM traininglist LIMIT $1 OFFSET $2',
                [limit, offset],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
}

module.exports = AccountTable;