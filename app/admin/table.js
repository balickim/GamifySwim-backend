const { connectTo } = require('../../secrets/databaseConfiguration');

class AdminTable {
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
}

module.exports = AdminTable;