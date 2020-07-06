const cPool = require('../databasePool');
const { connectTo } = require('../secrets/databaseConfiguration');
const cryptoRandomString = require('crypto-random-string');

class ConfigureDB {
    // static initiate() {
    //     ; (async () => {
    //         const catalogPool = await cPool.connect()
    //         try {
    //             await catalogPool.query('BEGIN')
    //             await catalogPool.query(`CREATE TABLE school(
    //                 id SERIAL PRIMARY KEY,
    //                 "fullName" VARCHAR(255),
    //                 "shortName" VARCHAR(10),
    //                 "databaseName" CHARACTER(10)
    //                 );`);
    //             await catalogPool.query('COMMIT')
    //         } catch (e) {
    //             await catalogPool.query('ROLLBACK')
    //             throw e
    //         } finally {
    //             catalogPool.release()
    //         }
    //     })().catch(e => console.error(e.stack))
    // }
    static addSchoolDatabase({ fullName, shortName }) {
        const randomDatabaseName = cryptoRandomString({ length: 10, characters: 'abcdefghijklmnopqrstuvwxyz' });
        ; (async () => {
            const catalogPool = await cPool.connect()
            try {
                const addSchoolToCatalogSchool = 'INSERT INTO school("fullName", "shortName", "databaseName") VALUES($1,$2,$3)'
                await catalogPool.query(addSchoolToCatalogSchool, [fullName, shortName, randomDatabaseName])
                const addDatabase = `CREATE DATABASE ${randomDatabaseName};`
                await catalogPool.query(addDatabase)
            } catch (e) {
                throw e
            } finally {
                console.info(`DATABASE ${randomDatabaseName} - created`);
                catalogPool.release()
            }
            const pool = await connectTo(randomDatabaseName);
            const schoolPool = await pool.connect()
            try {
                await schoolPool.query('BEGIN')
                await schoolPool.query(`CREATE TABLE account(
                    id SERIAL PRIMARY KEY,
                    "usernameHash" CHARACTER(64),
                    "passwordHash" CHARACTER(64),
                    "sessionId" CHARACTER(36))`);
                await schoolPool.query(`CREATE TABLE "traininglist" (
                    "trainingid" SERIAL,
                    "contestantid" int,
                    "poolid" int,
                    "training_date" date,
                    "title" text,
                    "description" varchar(255),
                        PRIMARY KEY (trainingid)
                    );`);
                await schoolPool.query(`CREATE TABLE "contestant" (
                    "contestantid" SERIAL, 
                    "levelid" int,
                    "coachid" int,
                    "genderid" int,
                    "name" text,
                    "secondname" text,
                    "age" int,
                    "date_of_birth" date,
                    "created_date" date,
                    "country_code" varchar(6),
                    "best_time" varchar(10),
                    "bronze_medal" int,
                    "silver_medal" int,
                    "gold_medal" int,
                        PRIMARY KEY (contestantid)
                    );`);
                await schoolPool.query(`CREATE TABLE "coach" (
                    "coachid" SERIAL,
                    "genderid" int,
                    "name" text,
                    "secondname" text,
                    "description" varchar(255),
                    "age" int,
                        PRIMARY KEY (coachid)
                    );`);
                await schoolPool.query(`CREATE TABLE "level" (
                    "levelid" SERIAL,
                    "title" text,
                    "description" varchar(255),
                        PRIMARY KEY (levelid)
                    );
                    INSERT INTO public.level(
                        levelid, title, description)
                        VALUES (1, 'niemowle', '');
                    INSERT INTO public.level(
                        levelid, title, description)
                        VALUES (2, 'średnio-początkujący', '');
                    INSERT INTO public.level(
                        levelid, title, description)
                        VALUES (3, 'początkujący', '');
                    INSERT INTO public.level(
                        levelid, title, description)
                        VALUES (4, 'średnio-zaawansowany', '');
                    INSERT INTO public.level(
                        levelid, title, description)
                        VALUES (5, 'zaawansowany', '');
                    INSERT INTO public.level(
                        levelid, title, description)
                        VALUES (6, 'mistrz', '');
                    INSERT INTO public.level(
                        levelid, title, description)
                        VALUES (7, 'wielki mistrz', '');
                    `);
                await schoolPool.query(`CREATE TABLE "payment" (
                    "paymentid" SERIAL,
                    "contestantid" int,
                    "paydate" date,
                    "amount" float,
                        PRIMARY KEY (paymentid)
                    );`);
                await schoolPool.query(`CREATE TABLE "gender" (
                    "genderid" SERIAL,
                    "gender_name" text,
                        PRIMARY KEY (genderid)
                    );
                    INSERT INTO gender(
	                genderid, gender_name)
	                VALUES (1, 'mężczyzna');
                    INSERT INTO gender(
	                genderid, gender_name)
	                VALUES (2, 'kobieta');
                    `);
                await schoolPool.query(`CREATE TABLE "training" (
                    "id_c" int,
                    "id_t" int,
                        PRIMARY KEY (id_c,id_t)
                    );`);
                await schoolPool.query(`CREATE TABLE "pool" (
                    "poolid" SERIAL,
                    "title" text,
                    "description" varchar(255),
                    "width" int,
                    "length" int,
                    "depth" int,
                        PRIMARY KEY (poolid)
                    );`);
                await schoolPool.query(`
                ALTER TABLE "payment" ADD FOREIGN KEY ("contestantid") REFERENCES "contestant" ("contestantid");
                ALTER TABLE "contestant" ADD FOREIGN KEY ("levelid") REFERENCES "level" ("levelid");
                ALTER TABLE "contestant" ADD FOREIGN KEY ("genderid") REFERENCES "gender" ("genderid");
                ALTER TABLE "contestant" ADD FOREIGN KEY ("coachid") REFERENCES "coach" ("coachid");
                ALTER TABLE "traininglist" ADD FOREIGN KEY ("poolid") REFERENCES "pool" ("poolid");
                ALTER TABLE "coach" ADD FOREIGN KEY ("genderid") REFERENCES "gender" ("genderid");
                ALTER TABLE "training" ADD FOREIGN KEY ("id_t") REFERENCES "traininglist" ("trainingid");
                ALTER TABLE "training" ADD FOREIGN KEY ("id_c") REFERENCES "contestant" ("contestantid");`);
                await schoolPool.query('COMMIT')
            } catch (e) {
                await schoolPool.query('ROLLBACK')
                throw e
            } finally {
                console.info(`DATABASE ${randomDatabaseName} - added structure`);
                schoolPool.release()
            }
        })().catch(e => console.error(e.stack))
    }
}

ConfigureDB.addSchoolDatabase({ fullName: 'Szkoła Podstawowa nr 64 w Szczecinie', shortName: 'SP64' });

module.exports = ConfigureDB;