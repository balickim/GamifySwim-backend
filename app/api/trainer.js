const { Router } = require('express');
const TrainersTable = require('../trainer/table.js');
const CatalogTable = require('../catalog/table.js');
const Session = require('../account/session');
// const { hash } = require('../account/helper');
const { authenticatedAccount } = require('./helper');

const router = new Router();

/**
* @swagger
* /trainer/training:
*   post:
*     tags:
*     - trainer
*     summary: Add new training
*     security:
*     - CookieAuth: []
*     operationId: addtraining
*     consumes:
*     - application/json
*     parameters:
*     - name: user
*       in: body
*       schema:
*         type: object
*         properties:
*           pool_id:
*             type: integer
*           coach_user_id:
*             type: integer
*           trainingdatestart:
*             type: string
*           trainingdatestop:
*             type: string
*           title:
*             type: string
*           description:
*             type: string
*           deleted:
*             type: boolean
*     responses:
*       200:
*         description: Ok
*/

router.post('/training', (req, res, next) => {
    const { pool_id, coach_user_id, trainingdatestart, trainingdatestop, title, description, deleted } = req.body;

    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(({ account }) => {
            TrainersTable.storeTraining({ 
                    databasename: database, 
                    pool_id, 
                    coach_user_id, 
                    trainingdatestart, 
                    trainingdatestop, 
                    title, 
                    description, 
                    createdbyaccont_id: account.id, 
                    deleted })
                .then(({ message }) => res.json({ message }))
                .catch(error => next(error));
        })
});

/**
* @swagger
* /trainer/trainings:
*   get:
*     tags:
*     - trainer
*     summary: get trainings
*     security:
*     - CookieAuth: []
*     operationId: gettrainings
*     responses:
*       200:
*         description: Ok
*/

router.get('/trainings', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            TrainersTable.getTrainings({databasename: database})
                .then((trainings) => res.json({ trainings }))
                .catch(error => next(error));
        })
});

/**
* @swagger
* /trainer/trainers:
*   get:
*     tags:
*     - trainer
*     summary: get trainers
*     security:
*     - CookieAuth: []
*     operationId: gettrainer
*     responses:
*       200:
*         description: Ok
*/

router.get('/trainers', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            TrainersTable.getTrainers({databasename: database})
                .then((trainers) => res.json({ trainers }))
                .catch(error => next(error));
        })
});

/**
* @swagger
* /trainer/pool:
*   post:
*     tags:
*     - trainer
*     summary: Add new pool
*     security:
*     - CookieAuth: []
*     operationId: addpool
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
*           description:
*             type: string
*           width:
*             type: integer
*           length:
*             type: integer
*           depth:
*             type: integer
*           deleted:
*             type: boolean
*     responses:
*       200:
*         description: Ok
*/

router.post('/pool', (req, res, next) => {
    const { title, description, width, length, depth, deleted } = req.body;

    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(({ account }) => {
            TrainersTable.storePool({ 
                    databasename: database, 
                    title, 
                    description, 
                    width, 
                    length, 
                    depth, 
                    createdbyaccont_id: account.id, 
                    deleted })
                .then(({ message }) => res.json({ message }))
                .catch(error => next(error));
        })
});

/**
* @swagger
* /trainer/pool:
*   get:
*     tags:
*     - trainer
*     summary: get pools
*     security:
*     - CookieAuth: []
*     operationId: getpools
*     responses:
*       200:
*         description: Ok
*/

router.get('/pool', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            TrainersTable.getPoolTitles({databasename: database})
                .then((pools) => res.json({ pools }))
                .catch(error => next(error));
        })
});

/**
* @swagger
* /trainer/swimmingstyle:
*   post:
*     tags:
*     - trainer
*     summary: Add new swimmingstyle
*     security:
*     - CookieAuth: []
*     operationId: addswimmingstyle
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
*           description:
*             type: string
*           deleted:
*             type: boolean
*     responses:
*       200:
*         description: Ok
*/

router.post('/swimmingstyle', (req, res, next) => {
    const { title, description, deleted } = req.body;

    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            TrainersTable.storeSwimmingStyle({ 
                    databasename: database, 
                    title, 
                    description,
                    deleted })
                .then(({ message }) => res.json({ message }))
                .catch(error => next(error));
        })
});

/**
* @swagger
* /trainer/swimmingstyle:
*   get:
*     tags:
*     - trainer
*     summary: get swimmingstyles
*     security:
*     - CookieAuth: []
*     operationId: getswimmingstyles
*     responses:
*       200:
*         description: Ok
*/

router.get('/swimmingstyle', (req, res, next) => {
    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            TrainersTable.getSwimmingStyles({databasename: database})
                .then((swimmingstyles) => res.json({ swimmingstyles }))
                .catch(error => next(error));
        })
});

/**
* @swagger
* /trainer/usertrainingplan:
*   post:
*     tags:
*     - trainer
*     summary: Add new user training plan
*     security:
*     - CookieAuth: []
*     operationId: addusertrainingplan
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
*           swimmingstyle_id:
*             type: integer
*           title:
*             type: string
*           description:
*             type: string
*           repetitions:
*             type: integer
*           breakseconds:
*             type: integer
*           length:
*             type: integer
*           deleted:
*             type: boolean
*     responses:
*       200:
*         description: Ok
*/

router.post('/usertrainingplan', (req, res, next) => {
    const { id, swimmingstyle_id, title, description, repetitions, breakseconds, length, deleted } = req.body;

    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(({ account }) => {
            TrainersTable.storeUserTrainingPlan({ 
                    databasename: database,
                    id, 
                    swimmingstyle_id, 
                    title,
                    description,
                    repetitions,
                    breakseconds,
                    length,
                    createdbyaccont_id: account.id,
                    deleted })
                .then(({ message }) => res.json({ message }))
                .catch(error => next(error));
        })
});

/**
* @swagger
* /trainer/usertrainingplans:
*   post:
*     tags:
*     - trainer
*     summary: get user training plans
*     security:
*     - CookieAuth: []
*     operationId: getusertrainingplans
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

router.post('/usertrainingplans', (req, res, next) => {
    const { id } = req.body;

    const sessionString = req.cookies.sessionString;
    const { database } = Session.parse(sessionString);

    authenticatedAccount({ sessionString: sessionString })
        .then(() => {
            TrainersTable.getUserTrainingPlans({databasename: database, id})
                .then((usertrainingplans) => res.json({ usertrainingplans }))
                .catch(error => next(error));
        })
});

module.exports = router;