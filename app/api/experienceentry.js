const { Router } = require('express');
const ExperienceTable = require('../experienceentry/table.js');
const CatalogTable = require('../catalog/table.js');
const Session = require('../account/session');
// const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');

const router = new Router();

/**
* @swagger
* /experience/experienceentry:
*   post:
*     tags:
*     - experience
*     summary: add new experienceentry entry
*     security:
*     - CookieAuth: []
*     operationId: experienceentry
*     consumes:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           title:
*             type: string
*           amount:
*             type: integer
*     responses:
*       200:
*         description: Ok
*/

router.post('/experienceentry', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);
    console.log('%cexperienceentry.js line:40 req.body', 'color: #007acc;', req.body);
    authenticatedAccount({ sessionString: sessionString })
        .then(({ account }) => {
            ExperienceTable.storeExperienceEntry({databasename: database, account_id: account.id, title: req.body.title, amount: req.body.amount})
                .then(() => {
                    res.json({message: 'experienceentry entry added'});
            })
        })
        .catch(error => next(error));
});

/**
* @swagger
* /experience/info:
*   get:
*     tags:
*     - experience
*     summary: add new experienceentry entry
*     security:
*     - CookieAuth: []
*     operationId: experienceinfo
*     consumes:
*     - application/json
*     responses:
*       200:
*         description: Ok
*/

router.get('/info', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(({ account }) => {
            ExperienceTable.getExperienceOfAccount({databasename: database, account_id: account.id})
                .then(exp => {
                    res.json({ exp });
            })
        })
        .catch(error => next(error));
});

module.exports = router;