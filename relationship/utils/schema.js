/* 
 * Thsi module exports the OpenAPI/Swagger schema as an object.
 * Used for validation and "api doc" serving.
 */
const swaggerJSDoc = require("swagger-jsdoc");

const { MY_SERVICE, uri } = require("../common");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: `${MY_SERVICE} Service API`,
    description: "for Social!",
    version: "0.1.0",
    contact: {
      name: "Bruce",
      email: "bjmckenz@gmail.com",
    },
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
  apis: ["../*.js", "../*/*.js", "../*/routes/*.js", "../*/utils/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports.swaggerSpec = swaggerSpec;
