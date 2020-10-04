const { Router } = require('express');
const ContestantTable = require('../contestant/table.js');
const CatalogTable = require('../catalog/table.js');
const Session = require('../account/session');
const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');

const router = new Router();

/**
* @swagger
* /contestant/contestants:
*   post:
*     tags:
*     - contestant
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

router.post('/contestants', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            ContestantTable.contestants({databasename: database, limit: req.body.limit, offset: req.body.offset, })
                .then(contestants => {
                    res.json({ contestants });
            })
        })
        .catch(error => next(error));
});

module.exports = router;