const fs = require('fs');
const cPool = require('../databasePool');
const { connectTo } = require('../secrets/databaseConfiguration');
const cryptoRandomString = require('crypto-random-string');
const { hash } = require('../app/account/helper.js');
const nodemailer = require('nodemailer');

let structureSql = fs.readFileSync('./sql/structure.sql').toString();

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'mbalicki.btc@gmail.com',
        pass: 'tYmCZasowe333%$#@!^^^5555555'
    }
});

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
    static addSchoolDatabase({ fullName, shortName, adminEmail }) {
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
                await schoolPool.query(structureSql);
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
                let mailOptions = {
                        from: 'mbalicki.btc@gmail.com',
                        to: adminEmail,
                        subject: 'GamifySwim - potwierdzenie utworzenia szkoły ' + fullName,
                        text: `
                                Login i hasło administratora:
                                L: admin
                                P: ${randomDefaultAdminPassword}
                        `
                    };
                console.info(`DATABASE ${randomDatabaseName} - added structure`);
                console.info(`Admin account password - ${randomDefaultAdminPassword}`);

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.error(error);
                    } else {
                        console.info('Email sent: ' + info.response);
                    }
                });
                schoolPool.release()
            }
        })().catch(e => console.error(e.stack))
    }
}

ConfigureDB.addSchoolDatabase({ fullName: 'Szkoła Podstawowa nr 20 w Szczecinie', shortName: 'SP20', adminEmail: 'stiekerosiem@gmail.com' });

module.exports = ConfigureDB;