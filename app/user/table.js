const { connectTo } = require('../../secrets/databaseConfiguration');

class UserTable {
    static users({ databasename, limit, offset }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT * FROM user LIMIT $1 OFFSET $2',
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
                `SELECT u.* FROM public.user as u
                INNER JOIN account as a on a.user_id = u.id
                WHERE a.role_id = 2
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
                `SELECT u.* FROM public.user as u
                INNER JOIN account as a on a.user_id = u.id
                WHERE a.role_id = 2 AND u.id = $1`,
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
                'SELECT * FROM public.user WHERE id = $1',
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
                'SELECT * FROM training LIMIT $1 OFFSET $2',
                [limit, offset],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }

    static userTrainingsInMonth({ databasename, user_id, month, year }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `select u.user_id, t.trainingdatestart,t.trainingdatestop,t.title,t.description,p.title as pooltitle from training t
                inner join user_usertrainingplan_training_usertrainingresults u on t.id = u.training_id
                inner join pool p on t.pool_id = p.id
                where EXTRACT(YEAR FROM t.trainingdatestart) = $1 
                and EXTRACT(month FROM t.trainingdatestart) = $2
                and u.user_id = $3`,
                [year, month, user_id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
}

module.exports = UserTable;