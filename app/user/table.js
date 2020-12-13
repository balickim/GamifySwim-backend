const { connectTo } = require('../../secrets/databaseConfiguration');

class UserTable {
    static users({ databasename, limit, offset }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT * FROM account WHERE deleted = false LIMIT $1 OFFSET $2',
                [limit, offset],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
    static contestants({ databasename, limit, offset }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `SELECT u.* FROM account as u
                WHERE u.role_id = 2
                AND deleted = false
                LIMIT $1 OFFSET $2`,
                [limit, offset],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
    static contestant({ databasename, id }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `SELECT u.* FROM account as u
                WHERE u.role_id = 2 AND u.id = $1 AND u.deleted = false`,
                [id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows[0]);
                }
            );
        });
    }
    static user({ databasename, id }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT * FROM account WHERE id = $1 AND deleted = false',
                [id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows[0]);
                }
            );
        });
    }

    static trainings({ databasename, limit, offset }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT * FROM training WHERE deleted = false LIMIT $1 OFFSET $2',
                [limit, offset],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }

    static userTrainingsInMonth({ databasename, account_id, month, year }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `select u.account_id,t.id,t.trainingdatestart,t.trainingdatestop,t.title,t.description,p.title as pooltitle from training t
                inner join user_accounttrainingplan_training_usertrainingresults u on t.id = u.training_id
                inner join pool p on t.pool_id = p.id
                where EXTRACT(YEAR FROM t.trainingdatestart) = $1 
                and EXTRACT(month FROM t.trainingdatestart) = $2
                and u.account_id = $3
                AND t.deleted = false`,
                [year, month, account_id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }

    static trainingInfo({ databasename, id }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'select t.* from training t where t.id = $1 AND t.deleted = false',
                [id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows[0]);
                }
            );
        });
    }
}

module.exports = UserTable;