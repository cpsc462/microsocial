const express = require("express");
const bodyParser = require("body-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
var { expressjwt: jwt } = require("express-jwt");
var stream = require("stream");

const { uri, Services, MY_SERVICE } = require("./common");

// >>>>>>>>> set up api docs route
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: `${MY_SERVICE} Service API`,
    description: "for Social!",
    version: "0.1.0",
  },
  contact: {
    name: "Bruce",
    email: "bjmckenz@gmail.com",
  },
  servers: [
    {
      url: `http://localhost:${Services[MY_SERVICE].port}`,
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["../*.js", "../*/*.js", "../*/routes/*.js", "./routes/user.js"],
  servers: [
    {
      url: uri(),
      description: "Development server",
    },
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerUIOptions = {
  customSiteTitle: "API Doc",
  explorer: true,
  swaggerOptions: {
    layout: "StandaloneLayout",
    displayOperationId: true,
    docExpansion: "none",
  },
};
// <<<<<<<<<< all the options for /docs. registered below.

// so that server restarts when any file changes
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// App server and all the middleware...
const app = express();
app.set("title", `Microsocial ${MY_SERVICE} API`);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(connectLiveReload());
app.use(helmet());
//no login for now
/*app.use(
  jwt({
    secret: "my-secret-garden",
    algorithms: ["HS256"],
  }).unless({ path: ["/", /^\/docs/, "/users", "^/user/", /^\/auth/, "/api-doc" ] })
);*/
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(StatusCodes.UNAUTHORIZED).send("Authorization Error");
  } else {
    next(err);
  }
});
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
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUIOptions)
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     description: Get all users including their recovery email addresses.
 *     ...
 */
app.use("/", require(`./routes/${path.basename(file, ".js")}`).router);
// ...

// if it's got JSON, don't allow invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ status: 400, message: err.message }); // Bad request
  }
  next();
});

// include all routes from the routes/ dir: all js files.
fs.readdir("./routes", (err, files) => {
  files.forEach((file) => {
    if (file.match(/[.]js$/)) {
      console.log("including routes from:", file);
      app.use("/", require(`./routes/${path.basename(file, ".js")}`).router);
    }
  });
});

/**
 * @swagger
 * /api-doc:
 *   get:
 *     summary: API Spec
 *     description: Downloads the OAS 3.0 JSON spec for this API. Downloads as "api-doc.json"
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
app.get("/api-doc", function (req, res) {
  const filename = "api-doc.json";
  var fileContents = Buffer.from(JSON.stringify(swaggerSpec), "base64");

  var readStream = new stream.PassThrough();
  readStream.end(fileContents);

  res.set("Content-disposition", `attachment; filename=${filename}`);
  res.set("Content-Type", "application/octet-stream");

  readStream.pipe(res);
});

// der main loop
server = app.listen(Services[MY_SERVICE].port, () => {
  console.log(
    `${MY_SERVICE} service listening on port ${Services[MY_SERVICE].port}...`
  );
});

module.exports = app;
