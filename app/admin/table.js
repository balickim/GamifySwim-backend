const { connectTo } = require('../../secrets/databaseConfiguration');

class AdminTable {
    static storeAccount({ databasename, roleId, usernameHash, passwordHash, name, secondname, surname, birthdate, gender, createdByAccountId, deleted }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `INSERT INTO account(   "usernamehash", 
                                        "passwordhash", 
                                        "role_id", 
                                        "name", 
                                        "secondname", 
                                        "surname", 
                                        "birthdate", 
                                        "gender_id", 
                                        "createdbyaccont_id", 
                                        "deleted") 
                VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                [usernameHash, passwordHash, roleId, name, secondname, surname, birthdate, gender, createdByAccountId, deleted],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ message: 'Pomyślnie dodano konto!'});
                }
            );
        });
    }

    static getAllAccounts({ databasename }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `SELECT * from vaccount`,
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
}

module.exports = AdminTable;