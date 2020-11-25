const fs = require('fs');
const cPool = require('../databasePool');
const { connectTo } = require('../secrets/databaseConfiguration');
const cryptoRandomString = require('crypto-random-string');
const { hash } = require('../app/account/helper.js');
const nodemailer = require('nodemailer');

let structureSql = fs.readFileSync('./sql/structure.sql').toString();

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
        let transporter = nodemailer.createTransport({
            host: 'mail.forgitec.eu',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'gamifyswim@forgitec.eu',
                pass: 'hLDAEiiP7kJPEWX#'
            }
        });

        transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
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
                                INSERT INTO account(role_id, usernamehash, passwordhash) 
                                VALUES($1, $2, $3)`,
                                [1, usernameHash, passwordHash]
                            );
                        await schoolPool.query('COMMIT')
                    } catch (e) {
                        await schoolPool.query('ROLLBACK')
                        throw e
                    } finally {
                        let mailOptions = {
                                from: 'gamifyswim@forgitec.eu',
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
    });
    }
}

ConfigureDB.addSchoolDatabase({ fullName: 'Szkoła Podstawowa nr 7 w Szczecinie', shortName: 'SP7', adminEmail: 'stiekerosiem@gmail.com' });

module.exports = ConfigureDB;