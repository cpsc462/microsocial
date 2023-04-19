var express = require("express");
const stream = require("stream");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");
const {
  openapiSchemaToJsonSchema: toJsonSchema,
} = require("@openapi-contrib/openapi-schema-to-json-schema");

const { swaggerSpec } = require('../utils/schema');

var router = express.Router();
var app;

module.exports.appSetCallback = function (theApp) {
  app = theApp;
  app_setup();
};
module.exports.router = router;

function app_setup() {
  /**
   * @swagger
   * /docs:
   *   get:
   *     summary: API Catalog as browseable site
   *     description: Swagger's browser. Lets you try out all the APIs. Does not pass authentication token though!
   *     operationId: apiCatalog
   *     tags: [Schema]
   *     responses:
   *       200:
   *         description: Active page of the catalog.
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  const swaggerUIOptions = {
    customSiteTitle: "API Doc",
    explorer: true,
    swaggerOptions: {
      layout: "StandaloneLayout",
      displayOperationId: true,
      docExpansion: "none"
    },
  };
  
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUIOptions)
  );
}

/**
 * @swagger
 * /schema/openapi/json:
 *   get:
 *     summary: API Spec
 *     description: Downloads the OAS 3.0 JSON spec for this API. Downloads as "swagger.json"
 *     operationId: apiDoc
 *     tags: [Schema]
 *     responses:
 *       200:
 *         description: File Download of API. File is named api-doc.json.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.get("/schema/openapi/json", function (req, res) {
  const filename = "swagger.json";
  var fileContents = Buffer.from(JSON.stringify(swaggerSpec), "base64");

  var readStream = new stream.PassThrough();
  readStream.end(fileContents);

  res.set("Content-disposition", `attachment; filename=${filename}`);
  res.set("Content-Type", "application/octet-stream");

  readStream.pipe(res);
});

router.get("/schema/openapi/yaml", function (req, res) {
  const filename = "swagger.yaml";
  var fileContents = Buffer.from(yaml.dump(swaggerSpec), "utf-8");

  var readStream = new stream.PassThrough();
  readStream.end(fileContents);

  res.set("Content-disposition", `attachment; filename=${filename}`);
  res.set("Content-Type", "application/octet-stream");

  readStream.pipe(res);
});

router.get("/schema/json-schema", function (req, res) {
  const filename = "json-schema.json";
  const schema = toJsonSchema(swaggerSpec);
  console.log({ schema });
  var fileContents = Buffer.from(JSON.stringify(schema), "utf-8");

  var readStream = new stream.PassThrough();
  readStream.end(fileContents);

  res.set("Content-disposition", `attachment; filename=${filename}`);
  res.set("Content-Type", "application/octet-stream");

  readStream.pipe(res);
});
