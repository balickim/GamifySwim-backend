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
                'SELECT * from vtraining WHERE deleted = false ',
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

    static storeAccountTrainingPlan({ databasename, title, description, createdbyaccont_id, deleted }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `INSERT INTO account_trainingplan(      "title", 
                                                        "description", 
                                                        "createdbyaccont_id", 
                                                        "deleted") 
                VALUES($1,$2,$3,$4)`,
                [title, description, createdbyaccont_id, deleted],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ message: 'Pomyślnie dodano plan treningowy!'});
                }
            );
        });
    }

    static storeTrainingPlanEntry({ databasename, id, swimmingstyle_id, repetitions, breakseconds, length, order }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `INSERT INTO trainingplanentry(         "id",
                                                        "swimmingstyle_id", 
                                                        "repetitions", 
                                                        "breakseconds", 
                                                        "length", 
                                                        "order") 
                VALUES($1,$2,$3,$4,$5,$6)`,
                [id, swimmingstyle_id, repetitions, breakseconds, length, order],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ message: 'Pomyślnie dodano wpis do planu!'});
                }
            );
        });
    }

    static getAllTrainingPlans({ databasename }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'SELECT * from account_trainingplan WHERE deleted = false',
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }

    static assignContestantWithTrainingPlanToTraining({ databasename, account_id, account_trainingplan_id, training_id }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `INSERT INTO user_accounttrainingplan_training_usertrainingresults(         
                    "account_id",
                    "account_trainingplan_id", 
                    "training_id") 
                VALUES($1,$2,$3)`,
                [account_id, account_trainingplan_id, training_id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ message: 'Pomyślnie dodano zawodnika(-ów) do treningu!'});
                }
            );
        });
    }

    static deleteAssignedContestantsToTraining({ databasename, training_id }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'delete from user_accounttrainingplan_training_usertrainingresults where training_id = $1',
                [training_id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ message: 'Pomyślnie usunięto przypisanych zawodników' });
                }
            );
        });
    }

    static getContestantsWithTrainingPlans({ databasename, training_id }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `select a.id, a."name", a.surname, l.title as levelofadvancement, (case when uatu.training_id = $1 then true else false end) as assigned, uatu.account_trainingplan_id from account a
                    join user_accounttrainingplan_training_usertrainingresults uatu on a.id = uatu.account_id
                    left join levelofadvancement l on a.levelofadvancement_id = l.id 
                    where a.role_id = 2
                    and a.deleted is false
                    and uatu.training_id = $1
                    GROUP BY a.id, l.id, uatu.training_id, uatu.account_trainingplan_id
                union
                select a.id, a."name", a.surname, l.title as levelofadvancement, null as assigned, null as account_trainingplan_id from account a
                    left join levelofadvancement l on a.levelofadvancement_id = l.id 
                    where a.role_id = 2
                    and a.deleted is false
                    and a.id not in (
                    select a.id from account a
                        join user_accounttrainingplan_training_usertrainingresults uatu on a.id = uatu.account_id
                        where a.role_id = 2
                        and a.deleted is false
                        and uatu.training_id = $1
                        GROUP BY a.id, uatu.training_id, uatu.account_trainingplan_id
                    )
                    GROUP BY a.id, l.id`,
                [training_id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }

    static getTrainingPlanEntries({ databasename, id }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `SELECT s.title as swimmingstyletitle, repetitions, breakseconds, length from trainingplanentry t
                left join swimmingstyle s on t.swimmingstyle_id = s.id
                WHERE t.id = $1
                order by t.order asc`,
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