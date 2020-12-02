const { connectTo } = require('../../secrets/databaseConfiguration');

class TrainerTables {
    static storeTraining({ databasename, pool_id, coach_user_id, trainingdatestart, trainingdatestop, title, description, createdbyaccont_id, deleted }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `INSERT INTO training(  "pool_id", 
                                        "coach_user_id", 
                                        "trainingdatestart", 
                                        "trainingdatestop", 
                                        "title", 
                                        "description", 
                                        "createdbyaccont_id", 
                                        "deleted") 
                VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
                [pool_id, coach_user_id, trainingdatestart, trainingdatestop, title, description, createdbyaccont_id, deleted],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ message: 'Pomyślnie utworzono trening!'});
                }
            );
        });
    }

    static getTrainings({ databasename }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT * from training WHERE deleted = false ',
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }

    static getTrainers({ databasename }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `SELECT id, name, surname from account
                WHERE deleted = false 
                AND role_id = 3`,
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }

    static storePool({ databasename, title, description, width, length, depth, createdbyaccont_id, deleted }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `INSERT INTO pool(      "title", 
                                        "description", 
                                        "width", 
                                        "length", 
                                        "depth", 
                                        "createdbyaccont_id", 
                                        "deleted") 
                VALUES($1,$2,$3,$4,$5,$6,$7)`,
                [title, description, width, length, depth, createdbyaccont_id, deleted],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ message: 'Pomyślnie dodano basen!'});
                }
            );
        });
    }

    static getPoolTitles({ databasename }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT id, title from pool WHERE deleted = false',
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }

    static storeSwimmingStyle({ databasename, title, description, deleted }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `INSERT INTO swimmingstyle(    "title", 
                                                "description", 
                                                "deleted") 
                VALUES($1,$2,$3)`,
                [title, description, deleted],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ message: 'Pomyślnie dodano styl!'});
                }
            );
        });
    }

    static getSwimmingStyles({ databasename }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT id, title from swimmingstyle WHERE deleted = false',
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }

    static storeUserTrainingPlan({ databasename, id, swimmingstyle_id, title, description, repetitions, breakseconds, length, createdbyaccont_id, deleted }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `INSERT INTO usertrainingplan(  "id",
                                                "swimmingstyle_id", 
                                                "title", 
                                                "description", 
                                                "repetitions", 
                                                "breakseconds",
                                                "length",
                                                "fulfilled", 
                                                "createdbyaccont_id", 
                                                "deleted") 
                VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                [id, swimmingstyle_id, title, description, repetitions, breakseconds, length, false, createdbyaccont_id, deleted],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ message: 'Pomyślnie dodano plan treningowy!'});
                }
            );
        });
    }

    static getUserTrainingPlans({ databasename, id }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT * from usertrainingplan WHERE deleted = false AND id = $1',
                [id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
}

module.exports = TrainerTables;