const { connectTo } = require('../../secrets/databaseConfiguration');

class AccountTable {
    static storeAccount({ databasename, usernameHash, passwordHash, userId }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'INSERT INTO account("usernamehash", "passwordhash", "role_id", "user_id") VALUES($1,$2,$3,$4)',
                [usernameHash, passwordHash, 2, userId],
                (error, response) => {
                    if (error) return reject(error);

                    resolve('');
                }
            );
        });
    }

    static storeUser({ databasename, name, secondname, surname }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'INSERT INTO public.user("name", "secondname", "surname") VALUES($1,$2,$3) RETURNING id',
                [name, secondname, surname],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ id: response.rows[0].id });
                }
            );
        });
    }

    static getAccount({ databasename, usernameHash }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `SELECT id, role_id, "passwordhash", "sessionid" FROM account 
                WHERE "usernamehash" = $1`,
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

    static trainings({ databasename, limit, offset }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT * FROM training LIMIT $1 OFFSET $2',
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