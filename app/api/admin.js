const { Router } = require('express');
const AccountTable = require('../account/table.js');
const CatalogTable = require('../catalog/table.js');
const Session = require('../account/session');
const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');

const router = new Router();

/**
* @swagger
* /admin/signup:
*   post:
*     tags:
*     - admin
*     summary: Register new user
*     operationId: signup
*     consumes:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           username:
*             type: string
*           password:
*             type: string
*           name:
*             type: string
*           secondname:
*             type: string
*           surname:
*             type: string
*     responses:
*       200:
*         description: Ok
*/

router.post('/signup', (req, res, next) => {
    const { username, password, name, secondname, surname } = req.body;
    const usernameHash = hash(username);
    const passwordHash = hash(password);

    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            AccountTable.getAccount({ databasename: database, usernameHash })
                .then(({ account }) => {
                    if (!account) {
                        return AccountTable.storeUser({ databasename: database, name, secondname, surname });
                    } else {
                        const error = new Error('Ten login jest już zajęty!');

                        error.statusCode = 409;

                        throw error;
                    }
                })
                .then(({ id }) => {
                    return AccountTable.storeAccount({ databasename: database, usernameHash, passwordHash, userId: id });
                })
                .then(({ message }) => { res.json({ message }) })
                .catch(error => next(error));
        })
        .catch(error => next(error));
});

module.exports = router;