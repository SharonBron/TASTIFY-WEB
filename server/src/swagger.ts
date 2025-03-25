import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tastify API',
      version: '1.0.0',
      description: 'API for Tastify app – restaurant reviews',
    },
    servers: [
      {
        url: 'http://10.10.246.110',
        description: 'Local dev server',
      },
      {
        url: 'https://node110.cs.colman.ac.il',
        description: 'Prod server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;