const { Router } = require('express');
const UserTable = require('../user/table.js');
const CatalogTable = require('../catalog/table.js');
const Session = require('../account/session');
const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');

const router = new Router();

/**
* @swagger
* /user/contestants:
*   post:
*     tags:
*     - user
*     summary: Get list of contestants
*     security:
*     - CookieAuth: []
*     operationId: userlist
*     consumes:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           limit:
*             type: integer
*           offset:
*             type: integer
*     responses:
*       200:
*         description: Ok
*/

router.post('/contestants', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            UserTable.contestants({databasename: database, limit: req.body.limit, offset: req.body.offset})
                .then(contestants => {
                    res.json({ contestants });
            })
        })
        .catch(error => next(error));
});

/**
* @swagger
* /user/contestants/info:
*   post:
*     tags:
*     - user
*     summary: Get contestant by id
*     security:
*     - CookieAuth: []
*     operationId: user
*     produces:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           id:
*             type: integer
*     responses:
*       200:
*         description: Ok
*/

router.post('/contestants/info', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            UserTable.contestant({databasename: database, id: req.body.id})
                // .then(({name, secondname}) => {
                //    res.json({ info: {name, secondname} });
                .then(contestant => {
                   res.json({contestant});
            })
        })
        .catch(error => next(error));
});

/**
* @swagger
* /user/trainings:
*   post:
*     tags:
*     - user
*     summary: Get list of trainings
*     security:
*     - CookieAuth: []
*     operationId: traininglist
*     consumes:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           limit:
*             type: integer
*           offset:
*             type: integer
*     responses:
*       200:
*         description: Ok
*/

router.post('/trainings', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            UserTable.trainings({databasename: database, limit: req.body.limit, offset: req.body.offset, })
                .then(trainings => {
                    res.json({ trainings });
            })
        })
        .catch(error => next(error));
});

/**
* @swagger
* /user/trainingsmonth:
*   post:
*     tags:
*     - user
*     summary: Get list of trainings in month
*     security:
*     - CookieAuth: []
*     operationId: traininglistmonth
*     consumes:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           month:
*             type: integer
*           year:
*             type: integer
*     responses:
*       200:
*         description: Ok
*/

router.post('/trainingsmonth', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(({ account }) => {
            UserTable.userTrainingsInMonth({databasename: database, account_id: account.id, month: req.body.month, year: req.body.year })
                .then(trainings => {
                    res.json({ trainings });
            })
        })
        .catch(error => next(error));
});

/**
* @swagger
* /user/training/info:
*   post:
*     tags:
*     - user
*     summary: Get info about training
*     security:
*     - CookieAuth: []
*     operationId: traininginfo
*     consumes:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           id:
*             type: integer
*     responses:
*       200:
*         description: Ok
*/

router.post('/training/info', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            UserTable.trainingInfo({databasename: database, id: req.body.id})
                .then((training) => {
                    res.json({ training });
            })
        })
        .catch(error => next(error));
});

/**
* @swagger
* /user/badge/count:
*   get:
*     tags:
*     - user
*     summary: Get amount of badges present in database
*     security:
*     - CookieAuth: []
*     operationId: badgecount
*     consumes:
*     - application/json
*     responses:
*       200:
*         description: Ok
*/

router.get('/badge/count', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            UserTable.badgeCount({databasename: database})
                .then(data => {
                    res.json({ data });
            })
        })
        .catch(error => next(error));
});

/**
* @swagger
* /user/badge/info:
*   post:
*     tags:
*     - user
*     summary: Get badge info
*     security:
*     - CookieAuth: []
*     operationId: badgeinfo
*     consumes:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           badge_id:
*             type: integer
*     responses:
*       200:
*         description: Ok
*/

router.post('/badge/info', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(({ account }) => {
            UserTable.badgeInfo({databasename: database, badge_id: req.body.badge_id, account_id: account.id })
                .then(badge => {
                    res.json({ badge });
            })
        })
        .catch(error => next(error));
});

/**
* @swagger
* /user/badge/result:
*   post:
*     tags:
*     - user
*     summary: Get badge progress info by id 
*     security:
*     - CookieAuth: []
*     operationId: badgeresult
*     consumes:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           badge_id:
*             type: integer
*     responses:
*       200:
*         description: Ok
*/

router.post('/badge/result', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(({ account }) => {
            UserTable.badgeResult({databasename: database, param_badge_id: req.body.badge_id, param_account_id: account.id })
                .then(badge => {
                    res.json({ badge });
            })
        })
        .catch(error => next(error));
});

/**
* @swagger
* /user/chartbestcontestant:
*   get:
*     tags:
*     - user
*     summary: Get chart data
*     security:
*     - CookieAuth: []
*     operationId: chartbestcontestant
*     consumes:
*     - application/json
*     responses:
*       200:
*         description: Ok
*/

router.get('/chartbestcontestant', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            UserTable.chartBestContestant({databasename: database})
                .then(data => {
                    res.json({ data });
            })
        })
        .catch(error => next(error));
});

module.exports = router;