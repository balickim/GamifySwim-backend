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

    static addSessionInfo({ databasename, sessionId, account_id, deviceinfo }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'INSERT INTO sessionhistory (sessionid, account_id, deviceinfo) VALUES($1, $2, $3);',
                [sessionId, account_id, deviceinfo],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

     static updateSessionLogoutTimestamp({ databasename, sessionId }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'UPDATE sessionhistory SET "sessiondatestop" = CURRENT_TIMESTAMP WHERE "sessionid" = $1',
                [sessionId],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }
}

module.exports = AccountTable;