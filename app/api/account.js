const { Router } = require('express');
const AccountTable = require('../account/table.js');
const CatalogTable = require('../catalog/table.js');
const Session = require('../account/session');
const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');

const router = new Router();

/**
* @swagger
* /account/login:
*   post:
*     tags:
*     - account
*     summary: Login user
*     operationId: login
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
*           shortname:
*             type: string
*     responses:
*       200:
*         description: Ok
*/

router.post('/login', (req, res, next) => {
    const { username, password, shortname, deviceinfo } = req.body;

    CatalogTable.getDatabase({ shortname })
        .then((databasename) => {
            AccountTable.getAccount({ databasename, usernameHash: hash(username) })
                .then(({ account }) => {
                    if (account && account.passwordhash === hash(password)) {
                        const { sessionid, role_id, id } = account;

                        return setSession({ databasename, username, res, sessionid, role_id, account_id: id, deviceinfo });
                    } else {
                        const error = new Error('Nieprawidłowy login lub hasło');

                        error.statusCode = 409;

                        throw error;
                    }
                })
                .then(({ message, roleId }) => res.json({ message, roleId }))
                .catch(error => next(error))
        })
        .catch(error => next(error))
});

/**
* @swagger
* /account/logout:
*   get:
*     tags:
*     - account
*     summary: Logout user
*     operationId: logout
*     responses:
*       200:
*         description: Ok
*/

router.get('/logout', (req, res, next) => {
    const { username, database, id } = Session.parse(req.cookies.sessionString);

    AccountTable.updateSessionId({
        databasename: database,
        sessionId: null,
        usernameHash: hash(username)
    }).then(() => {
        res.clearCookie('sessionString');

        res.json({ message: 'Succesful logout' });
    }).then(() => {
        AccountTable.updateSessionLogoutTimestamp({ databasename: database, sessionId: id })
    })
        .catch(error => next(error));
});

/**
* @swagger
* /account/authenticated:
*   get:
*     tags:
*     - account
*     summary: Check if user is authenticated
*     security:
*     - CookieAuth: []
*     operationId: authenticated
*     responses:
*       200:
*         description: Ok
*/

router.get('/authenticated', (req, res, next) => {
    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ authenticated, roleId }) => res.json({ authenticated, roleId }))
        .catch(error => next(error));
});

/**
* @swagger
* /account/info:
*   get:
*     tags:
*     - account
*     summary: Get account info of user
*     security:
*     - CookieAuth: []
*     operationId: accountInfo
*     responses:
*       200:
*         description: Ok
*/

router.get('/info', (req, res, next) => {
    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ account, username, roleId }) => {
            res.json({ info: { id: account.id, username, roleId } });
        })
        .catch(error => next(error))
});

module.exports = router;