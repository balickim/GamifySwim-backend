const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const accountRouter = require('./api/account');
const userRouter = require('./api/user');
const experienceentryRouter = require('./api/experienceentry');
const adminRouter = require('./api/admin');
const trainerRouter = require('./api/trainer');
const swaggerUi = require('swagger-ui-express');
const specs = require('./api/docs/specs');

const app = express();

app.use(cors({ origin: true, credentials: true }));
// app.use(cors({ origin: 'http://localhost:1234', credentials: true }));
// app.use(cors({ origin: 'http://192.168.1.28:1234', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/account', accountRouter);
app.use('/user', userRouter);
app.use('/experience', experienceentryRouter);
app.use('/admin', adminRouter);
app.use('/trainer', trainerRouter);

app.use((err, req, res, next) => {
    const statusCode = err.StatusCode || 500;

    res.status(statusCode).json({
        type: 'error', message: err.message
    })
});

module.exports = app;