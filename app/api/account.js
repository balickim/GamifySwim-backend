const { Router } = require('express');
const AccountTable = require('../account/table.js');
const CatalogTable = require('../catalog/table.js');
const Session = require('../account/session');
const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');

const router = new Router();

/**
* @swagger
* /account/signup:
*   post:
*     tags:
*     - account
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
*           shortname:
*             type: string
*     responses:
*       200:
*         description: Ok
*/

router.post('/signup', (req, res, next) => {
    const { username, password, shortname } = req.body;
    const usernameHash = hash(username);
    const passwordHash = hash(password);

    CatalogTable.getDatabase({ shortname })
        .then((databasename) => {
            AccountTable.getAccount({ databasename, usernameHash })
                .then(({ account }) => {
                    if (!account) {
                        return AccountTable.storeAccount({ databasename, usernameHash, passwordHash })
                    } else {
                        const error = new Error('Ten login jest już zajęty!');

                        error.statusCode = 409;

                        throw error;
                    }
                })
                .then(() => {
                    return setSession({ databasename, username, res });


                })
                .then(({ message }) => { res.json({ message }) })
                .catch(error => next(error));
        })
});

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
    const { username, password, shortname } = req.body;

    CatalogTable.getDatabase({ shortname })
        .then((databasename) => {
            AccountTable.getAccount({ databasename, usernameHash: hash(username) })
                .then(({ account }) => {
                    if (account && account.passwordHash === hash(password)) {
                        const { sessionId } = account;

                        return setSession({ databasename, username, res, sessionId });
                    } else {
                        const error = new Error('Incorrect username or password');

                        error.statusCode = 409;

                        throw error;
                    }
                })
                .then(({ message }) => res.json({ message }))
                .catch(error => next(error))
        })
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
    const { username, database } = Session.parse(req.cookies.sessionString);

    AccountTable.updateSessionId({
        databasename: database,
        sessionId: null,
        usernameHash: hash(username)
    }).then(() => {
        res.clearCookie('sessionString');

        res.json({ message: 'Succesful logout' });
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
        .then(({ authenticated }) => res.json({ authenticated }))
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
        .then(({ account, username }) => {
            res.json({ info: { balance: account.balance, username } });
        })
        .catch(error => next(error))
});

module.exports = router;