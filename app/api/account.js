const { Router } = require('express');
const AccountTable = require('../account/table.js');
const Session = require('../account/session');
const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');

const router = new Router();

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    const usernameHash = hash(username);
    const passwordHash = hash(password);

    AccountTable.getAccount({ usernameHash })
        .then(({ account }) => {
            if (!account) {
                return AccountTable.storeAccount({ usernameHash, passwordHash })
            } else {
                const error = new Error('Ten login jest już zajęty!');

                error.statusCode = 409;

                throw error;
            }
        })
        .then(() => {
            return setSession({ username, res });


        })
        .then(({ message }) => { res.json({ message }) })
        .catch(error => next(error));
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    AccountTable.getAccount({ usernameHash: hash(username) })
        .then(({ account }) => {
            if (account && account.passwordHash === hash(password)) {
                const { sessionId } = account;

                return setSession({ username, res, sessionId })
            } else {
                const error = new Error('Incorrect username or password');

                error.statusCode = 409;

                throw error;
            }
        })
        .then(({ message }) => res.json({ message }))
        .catch(error => next(error));
});

router.get('/logout', (req, res, next) => {
    const { username } = Session.parse(req.cookies.sessionString);

    AccountTable.updateSessionId({
        sessionId: null,
        usernameHash: hash(username)
    }).then(() => {
        res.clearCookie('sessionString');

        res.json({ message: 'Succesful logout' });
    })
        .catch(error => next(error));
});

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
*     operationId: getAccountInfo
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