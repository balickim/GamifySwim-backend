const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const accountRouter = require('./api/account');
const trainingRouter = require('./api/training');
const swaggerUi = require('swagger-ui-express');
const specs = require('./api/docs/specs');

const app = express();

app.use(cors({ origin: 'http://192.168.1.28:1234', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/account', accountRouter);
app.use('/training', trainingRouter);

app.use((err, req, res, next) => {
    const statusCode = err.StatusCode || 500;

    res.status(statusCode).json({
        type: 'error', message: err.message
    })
});

module.exports = app;