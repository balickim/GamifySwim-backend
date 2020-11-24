const { connectTo } = require('../../secrets/databaseConfiguration');

class AdminTable {
    static storeAccount({ databasename, usernameHash, passwordHash, userId, name, secondname, surname }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'INSERT INTO account("usernamehash", "passwordhash", "role_id", "name", "secondname", "surname") VALUES($1,$2,$3,$4,$5,$6)',
                [usernameHash, passwordHash, 2, name, secondname, surname],
                (error, response) => {
                    if (error) return reject(error);

                    resolve('');
                }
            );
        });
    }
}

module.exports = AdminTable;