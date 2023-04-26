import swaggerJSDoc from 'swagger-jsdoc'
import { uri } from '../utils/uri.js';

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: `Content Service API`,
      description: "for Social!",
      version: "0.1.0",
    },
    contact: {
      name: "Vu",
      email: "vudiep411@gmail.com",
    },
    servers: [
      {
        url: uri(),
      },
    ],
  };
  
  const swaggerOptions = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ["../*.js", "../*/*.js", "../*/routes/*.js"],
    servers: [
      {
        url: uri(),
        description: "Development server",
      },
    ],
  };

export const swaggerUIOptions = {
    customSiteTitle: "API Doc",
    explorer: true,
    swaggerOptions: {
      layout: "StandaloneLayout",
      displayOperationId: true,
      docExpansion: "none",
    },
  };

export const swaggerSpec = swaggerJSDoc(swaggerOptions)