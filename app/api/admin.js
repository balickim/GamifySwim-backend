const { Router } = require('express');
const AccountTable = require('../account/table.js');
const AdminTable = require('../admin/table.js');
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
*           roleId:
*             type: integer
*           birthdate:
*             type: string
*           gender:
*             type: integer
*           deleted:
*             type: boolean
*     responses:
*       200:
*         description: Ok
*/

router.post('/signup', (req, res, next) => {
    const { username, password, name, secondname, surname, roleId, birthdate, gender, deleted } = req.body;
    const usernameHash = hash(username);
    const passwordHash = hash(password);

    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(({ account }) => {
            let createdByAccountId = account.id;
            AccountTable.getAccount({ databasename: database, usernameHash })
                .then(({ account }) => {
                    if (!account) {
                        return AdminTable.storeAccount({ databasename: database, roleId, usernameHash, passwordHash, name, secondname, surname, birthdate, gender, createdByAccountId, deleted });
                    } else {
                        const error = new Error('Ten login jest już zajęty!');

                        error.statusCode = 409;

                        throw error;
                    }
                })
                .then(({ message }) => res.json({ message }))
                .catch(error => next(error));
        })
});

module.exports = router;