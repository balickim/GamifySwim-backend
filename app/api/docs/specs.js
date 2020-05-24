const swaggerJsdoc = require('swagger-jsdoc');
const options = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            description: 'API documentation for GamifySwim',
            swagger: '2.0',
            title: 'GamifySwim',
            version: '0.2.0',
            contact: {
                "email": "michal.balicki@onet.pl"
            },
        },
        securityDefinitions: {
            CookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'sessionString'
            }
        }
    },
    apis: ['app/api/*.js'],
};
const specs = swaggerJsdoc(options);
module.exports = specs;