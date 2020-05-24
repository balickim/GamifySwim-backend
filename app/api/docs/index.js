const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
let express = require("express");

let app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs.default));