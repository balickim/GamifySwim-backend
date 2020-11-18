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

module.exports = router;