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
*     operationId: contestantlist
*     consumes:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           user_id:
*             type: integer
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

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            ExperienceTable.storeExperienceEntry({databasename: database, user_id: req.body.user_id, title: req.body.title, amount: req.body.amount})
                .then(() => {
                    res.json({message: 'experienceentry entry added'});
            })
        })
        .catch(error => next(error));
});

module.exports = router;