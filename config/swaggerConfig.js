const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CineSphere API',
      version: '1.0.0',
      description: 'API documentation for CineSphere backend'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }], 
    servers: [{ url: 'backendabdo-hsc0bzfab5cygbdy.canadacentral-01.azurewebsites.net' }],
    servers: [
      {
        url: 'backendabdo-hsc0bzfab5cygbdy.canadacentral-01.azurewebsites.net',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
