const { connectTo } = require('../../secrets/databaseConfiguration');

class AccountTable {
    static getAccount({ databasename, usernameHash }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `SELECT id, role_id, "passwordhash", "sessionid" FROM account 
                WHERE "usernamehash" = $1 AND deleted = false`,
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
                'UPDATE account SET "sessionid" = $1 WHERE "usernamehash" = $2',
                [sessionId, usernameHash],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }
}

module.exports = AccountTable;