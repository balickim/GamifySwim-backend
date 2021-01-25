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

    static badgeCount({ databasename }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                'select count(distinct badgeid) from achievement',
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows[0]);
                }
            );
        });
    }

    static badgeInfo({ databasename, badge_id, account_id }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `with res as (
                    select a.*,case when ua.claimed is null then false else true end as claimed 
                    from achievement a
                    left join user_achievement ua on a.id = ua.achievement_id
                    where a.badgeid = $1
                    and ua.account_id = $2
                union
                    select a.*,case when ua.claimed is null then false else true end as claimed 
                    from achievement a
                    left join user_achievement ua on a.id = ua.achievement_id
                    where a.badgeid = $1
                    and a.id not in (select a.id
                                        from achievement a
                                        left join user_achievement ua on a.id = ua.achievement_id
                                        where a.badgeid = $1
                                        and ua.account_id = $2)
                                )
                select * from res
                order by res.condition asc;`,
                [badge_id, account_id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }

    static badgeResult({ databasename, param_badge_id, param_account_id }) {
        const schoolPool = connectTo(databasename);
        switch (param_badge_id) {
        case 0:
            return new Promise((resolve, reject) => {
                schoolPool.query(
                    `select sum(t.length) as result,
                        'total swam distance of account' as description
                        from trainingplanentry t
                        left join user_accounttrainingplan_training_usertrainingresults uatu on t.id = uatu.account_trainingplan_id
                        where uatu.fulfilled = true
                        and uatu.present = true
                        and uatu.account_id = $1`,
                    [param_account_id],
                    (error, response) => {
                        if (error) return reject(error);

                        resolve(response.rows[0]);
                    }
                );
            });
        case 1:
            return new Promise((resolve, reject) => {
                schoolPool.query(
                    `select count(uatu.present) as result,
                    'total trainings when account was present in' as description
                    from user_accounttrainingplan_training_usertrainingresults uatu
                    where uatu.present = true
                    and uatu.account_id = $1`,
                    [param_account_id],
                    (error, response) => {
                        if (error) return reject(error);

                        resolve(response.rows[0]);
                    }
                );
            });
        case 2:
            return new Promise((resolve, reject) => {
                schoolPool.query(
                    `select count(uatu.fulfilled) as result,
                    'total fulfilled training plans of account' as description
                    from user_accounttrainingplan_training_usertrainingresults uatu
                    where uatu.fulfilled = true
                    and uatu.account_id = $1`,
                    [param_account_id],
                    (error, response) => {
                        if (error) return reject(error);

                        resolve(response.rows[0]);
                    }
                );
            });
        case 3:
            return new Promise((resolve, reject) => {
                schoolPool.query(
                    `select count(distinct t.swimmingstyle_id) as result,
                    'max distinct swimming styles in one training' as description
                    from trainingplanentry t
                    left join user_accounttrainingplan_training_usertrainingresults uatu on t.id = uatu.account_trainingplan_id
                    where uatu.fulfilled = true
                    and uatu.present = true
                    and uatu.account_id = $1
                    group by uatu.training_id
                    order by result desc`,
                    [param_account_id],
                    (error, response) => {
                        if (error) return reject(error);

                        resolve(response.rows[0]);
                    }
                );
            });
        case 4:
            return new Promise((resolve, reject) => {
                schoolPool.query(
                    `with t as (
                        SELECT distinct(s.sessiondatestart::date) as created_at
                        FROM sessionhistory s 
                        WHERE s.account_id = $1
                    )
                    select count(*) as result,
                        'number of consecutive login days up until now' as description
                        from t
                        where t.created_at > (
                        select d.d
                        from generate_series('2020-01-01'::date, CURRENT_DATE, '1 day') d(d)
                        left outer join t on t.created_at = d.d::date
                        where t.created_at is null
                        order by d.d desc
                        limit 1
                    )`,
                    [param_account_id],
                    (error, response) => {
                        if (error) return reject(error);

                        resolve(response.rows[0]);
                    }
                );
            });
        case 5:
            return new Promise((resolve, reject) => {
                schoolPool.query(
                    `with t as (
                        select uatu.account_id,uatu.training_id, sum(t.repetitions * t.length) as result
                        from user_accounttrainingplan_training_usertrainingresults uatu
                        left join trainingplanentry t on uatu.account_trainingplan_id = t.id
                        group by uatu.training_id,uatu.account_id 
                    )
                    select max(t.result) as result,
                    'record meters done swimming' as description
                    from t
                    where t.account_id = $1`,
                    [param_account_id],
                    (error, response) => {
                        if (error) return reject(error);

                        resolve(response.rows[0]);
                    }
                );
            });
        case 6:
            return new Promise((resolve, reject) => {
                schoolPool.query(
                    `select case when count(case when uatu.present = true then 1 end) = count(uatu.present) then true else false end as result,
                    'was account present on every training this time' as description
                    from user_accounttrainingplan_training_usertrainingresults uatu
                    where uatu.account_id = $1`,
                    [param_account_id],
                    (error, response) => {
                        if (error) return reject(error);

                        resolve(response.rows[0]);
                    }
                );
            });
        case 7:
            return new Promise((resolve, reject) => {
                schoolPool.query(
                    `select case when sum(t.length) is null then CAST(0 AS integer) else sum(t.length) end as result,
                    'swam distance of account this week' as description
                    from trainingplanentry t
                    left join user_accounttrainingplan_training_usertrainingresults uatu on t.id = uatu.account_trainingplan_id
                    left join training t2 on uatu.training_id = t2.id
                    where uatu.fulfilled = true
                    and uatu.present = true
                    and t2.trainingdatestart > (select date_trunc('week', current_date) - interval '1 day') 
                    and uatu.account_id = $1`,
                    [param_account_id],
                    (error, response) => {
                        if (error) return reject(error);

                        resolve(response.rows[0]);
                    }
                );
            });
        case 8:
            return new Promise((resolve, reject) => {
                schoolPool.query(
                    `select case when sum(t.length) is null then CAST(0 AS integer) else sum(t.length) end as result,
                    'swam distance of account this month' as description
                    from trainingplanentry t
                    left join user_accounttrainingplan_training_usertrainingresults uatu on t.id = uatu.account_trainingplan_id
                    left join training t2 on uatu.training_id = t2.id
                    where uatu.fulfilled = true
                    and uatu.present = true
                    and t2.trainingdatestart > (select date_trunc('month', current_date) - interval '1 day') 
                    and uatu.account_id = $1`,
                    [param_account_id],
                    (error, response) => {
                        if (error) return reject(error);

                        resolve(response.rows[0]);
                    }
                );
            });
        }
    }

    static chartBestContestant({ databasename }) {
        const schoolPool = connectTo(databasename);
        return new Promise((resolve, reject) => {
            schoolPool.query(
                `with t as (
                    select concat(a."name", ' ', a.surname) as fullname, uatu.training_id, sum(t.repetitions * t.length) as result
                    from user_accounttrainingplan_training_usertrainingresults uatu
                    left join trainingplanentry t on uatu.account_trainingplan_id = t.id
                    left join account a on uatu.account_id = a.id 
                    group by uatu.training_id,a."name", a.surname
                )
                select case when sum(t.result) is null then CAST(0 AS integer) else sum(t.result) end,
                t.fullname
                from t
                group by t.fullname
                order by sum desc`,
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
}

module.exports = UserTable;