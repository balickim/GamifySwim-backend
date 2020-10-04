// const { Router } = require('express');
// const TrainingTable = require('../training/table.js');
// const Session = require('../account/session');
// const { authenticatedAccount } = require('./helper');

// const router = new Router();

// /**
// * @swagger
// * /training/list:
// *   post:
// *     tags:
// *     - training
// *     summary: Get list of trainings
// *     security:
// *     - CookieAuth: []
// *     operationId: traininglist
// *     consumes:
// *     - application/json
// *     parameters:
// *     - name: user
// *       in: body
// *       schema:
// *         type: object
// *         properties:
// *           limit:
// *             type: integer
// *           offset:
// *             type: integer
// *     responses:
// *       200:
// *         description: Ok
// */

// router.post('/list', (req, res, next) => {
//     const sessionString = req.cookies.sessionString;
//     const { database } = Session.parse(sessionString);
    
//     authenticatedAccount({ sessionString: sessionString })
//         .then(() => {
//             TrainingTable.training({databasename: database, limit: req.body.limit, offset: req.body.offset})
//                 .then(({ training }) => { res.json( { training } );
//                 })
//         })
//         .catch(error => next(error));
// });

// module.exports = router;