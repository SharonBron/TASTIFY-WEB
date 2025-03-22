import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tastify API',
      version: '1.0.0',
      description: 'API for Tastify app – restaurant reviews'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local dev server'
      }
    ]
  },
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
