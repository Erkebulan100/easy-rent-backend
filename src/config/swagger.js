const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Easy-Rent API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Easy-Rent backend',
      contact: {
        name: 'API Support',
        url: 'https://github.com/Erkebulan100/easy-rent-backend'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'http://easy-rent-backend-c-env-1.eba-eyrfvvup.eu-north-1.elasticbeanstalk.com'
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app) => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger docs available at /api-docs');
};

module.exports = swaggerDocs;