const cPool = require('../databasePool');
const { connectTo } = require('../secrets/databaseConfiguration');
const cryptoRandomString = require('crypto-random-string');
const { hash } = require('../app/account/helper.js');

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
        const randomDefaultAdminPassword = cryptoRandomString({ length: 20, characters: 'abcdefghijklmnopqrstuvwxyz' });

        const usernameHash = hash('admin');
        const passwordHash = hash(randomDefaultAdminPassword);
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
                await schoolPool.query(`CREATE TABLE "account" (
                        "id" SERIAL PRIMARY KEY,
                        "role_id" int,
                        "user_id" int,
                        "usernamehash" CHARACTER(64),
                        "passwordhash" CHARACTER(64),
                        "sessionid" CHARACTER(36),
                        "createddate" timestamp not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );`);
                await schoolPool.query(`CREATE TABLE "sessionhistory" (
                        "id" SERIAL PRIMARY KEY,
                        "account_id" int,
                        "sessiondatestart" timestamp,
                        "sessiondatestop" timestamp,
                        "deviceinfo" text
                    );`);
                await schoolPool.query(`CREATE TABLE "role" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50)
                    );
                    INSERT INTO public.role(
                        title)
                        VALUES ('admin');
                    INSERT INTO public.role(
                        title)
                        VALUES ('zawodnik');
                    INSERT INTO public.role(
                        title)
                        VALUES ('trener');
                    `);
                await schoolPool.query(`CREATE TABLE "experienceentry" (
                        "id" SERIAL PRIMARY KEY,
                        "user_id" int not null,
                        "title" varchar(50),
                        "amount" int,
                        "createddate" timestamp not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int
                    );`);
                await schoolPool.query(`CREATE TABLE "levelofadvancement" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50),
                        "description" text
                    );
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('niemowle', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('średnio-początkujący', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('początkujący', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('średnio-zaawansowany', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('zaawansowany', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('mistrz', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('wielki mistrz', '');
                    `);
                await schoolPool.query(`CREATE TABLE "gender" (
                        "id" SERIAL PRIMARY KEY,
                        "gendername" text
                    );
                    INSERT INTO gender(gendername)
	                    VALUES ('mężczyzna');
                    INSERT INTO gender(gendername)
	                    VALUES ('kobieta');
                    `);
                await schoolPool.query(`CREATE TABLE "user_achievement" (
                        "id" SERIAL PRIMARY KEY,
                        "achievement_id" int,
                        "user_id" int not null,
                        "awardeddate" timestamp
                    );`);
                await schoolPool.query(`CREATE TABLE "condition" (
                        "id" SERIAL PRIMARY KEY,
                        "achievement_id" int,
                        "condition" text,
                        "fulfilled" boolean
                    );`);
                await schoolPool.query(`CREATE TABLE "achievement" (
                        "id" SERIAL PRIMARY KEY,
                        "name" varchar(50),
                        "imagepath" varchar(50)
                    );`);
                await schoolPool.query(`CREATE TABLE "training" (
                        "id" SERIAL PRIMARY KEY,
                        "pool_id" int,
                        "coach_user_id" int,
                        "trainingdatestart" timestamp,
                        "trainingdatestop" timestamp,
                        "title" varchar(50),
                        "description" text,
                        "held" boolean,
                        "createddate" timestamp not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );`);
                await schoolPool.query(`CREATE TABLE "usertrainingresults" (
                        "id" int,
                        "swimmingstyle_id" int,
                        "title" varchar(50),
                        "description" text,
                        "actualrepetitions" int2,
                        "actuallength" int2,
                        "caloriesburnt" int2,
                        "totaltimemiliseconds" bigint
                    );`);
                await schoolPool.query(`CREATE TABLE "user" (
                        "id" SERIAL PRIMARY KEY,
                        "levelofadvancement_id" int,
                        "gender_id" int,
                        "name" varchar(30),
                        "secondname" varchar(30),
                        "surname" varchar(30),
                        "birthdate" date,
                        "avatarimagepath" varchar(50)
                    );`);
                await schoolPool.query(`CREATE TABLE "user_usertrainingplan_training_usertrainingresults" (
                        "user_id" int not null,
                        "usertrainingplan_id" int,
                        "training_id" int,
                        "usertrainingresults_id" int
                    );`);
                await schoolPool.query(`CREATE TABLE "usertrainingplan" (
                        "id" int,
                        "swimmingstyle_id" int,
                        "title" varchar(50),
                        "description" text,
                        "repetitions" int2,
                        "breakseconds" int2,
                        "length" int2,
                        "fulfilled" boolean,
                        "createddate" timestamp not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );`);
                await schoolPool.query(`CREATE TABLE "swimmingstyle" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50),
                        "description" text
                    );`);
                await schoolPool.query(`CREATE TABLE "pool" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50),
                        "description" text,
                        "width" int2,
                        "length" int2,
                        "depth" int2,
                        "createddate" timestamp not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );`);
                await schoolPool.query(`
                        CREATE UNIQUE INDEX ON "account" ("user_id");
                        CREATE UNIQUE INDEX ON "usertrainingresults" ("id");
                        CREATE UNIQUE INDEX ON "usertrainingplan" ("id");
                        ALTER TABLE "account" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");
                        ALTER TABLE "experienceentry" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
                        ALTER TABLE "condition" ADD FOREIGN KEY ("achievement_id") REFERENCES "achievement" ("id");
                        ALTER TABLE "user_achievement" ADD FOREIGN KEY ("achievement_id") REFERENCES "achievement" ("id");
                        ALTER TABLE "user_achievement" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
                        ALTER TABLE "user" ADD FOREIGN KEY ("levelofadvancement_id") REFERENCES "levelofadvancement" ("id");
                        ALTER TABLE "user" ADD FOREIGN KEY ("gender_id") REFERENCES "gender" ("id");
                        ALTER TABLE "training" ADD FOREIGN KEY ("pool_id") REFERENCES "pool" ("id");
                        ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("training_id") REFERENCES "training" ("id");
                        ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
                        ALTER TABLE "usertrainingplan" ADD FOREIGN KEY ("swimmingstyle_id") REFERENCES "swimmingstyle" ("id");
                        ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("usertrainingplan_id") REFERENCES "usertrainingplan" ("id");
                        ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("usertrainingresults_id") REFERENCES "usertrainingresults" ("id");
                        ALTER TABLE "usertrainingresults" ADD FOREIGN KEY ("swimmingstyle_id") REFERENCES "swimmingstyle" ("id");
                        ALTER TABLE "training" ADD FOREIGN KEY ("coach_user_id") REFERENCES "user" ("id");
                        ALTER TABLE "sessionhistory" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");
                        ALTER TABLE "training" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
                        ALTER TABLE "pool" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
                        ALTER TABLE "usertrainingplan" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
                        ALTER TABLE "experienceentry" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
                        ALTER TABLE "account" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
                `);
                await schoolPool.query(`
                        INSERT INTO account(role_id, user_id, usernamehash, passwordhash) 
                        VALUES($3, $4, $1, $2)`,
                        [usernameHash, passwordHash, 1, 1]
                    );
                await schoolPool.query(`
                        INSERT INTO public.user(name) 
                        VALUES('admin');
                    `);
                await schoolPool.query(`CREATE VIEW vexperience AS 
                        SELECT user_id,
                        sum(amount) as totalamount,
                        floor(floor(25 + sqrt(625 + 100 * sum(amount))) / 50) as level,  
                        ((floor(25 + sqrt(625 + 100 * sum(amount))) / 50) - (floor(floor(25 + sqrt(625 + 100 * sum(amount))) / 50))) * 10 as barpercent
                        FROM experienceentry e
                        group by user_id
                    `);
                await schoolPool.query('COMMIT')
            } catch (e) {
                await schoolPool.query('ROLLBACK')
                throw e
            } finally {
                console.info(`DATABASE ${randomDatabaseName} - added structure`);
                console.info(`Admin account password - ${randomDefaultAdminPassword}`);
                schoolPool.release()
            }
        })().catch(e => console.error(e.stack))
    }
}

ConfigureDB.addSchoolDatabase({ fullName: 'Szkoła Podstawowa nr 13 w Szczecinie', shortName: 'SP13' });

module.exports = ConfigureDB;